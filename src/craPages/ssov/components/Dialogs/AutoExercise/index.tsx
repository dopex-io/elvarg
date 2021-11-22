import { useCallback, useMemo, useContext, useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { SSOVDelegator__factory, ERC20__factory } from '@dopex-io/sdk';
import { format } from 'date-fns';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';

import CustomButton from 'components/UI/CustomButton';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import Dpx from 'assets/tokens/Dpx';
import Rdpx from 'assets/tokens/Rdpx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import sendTx from 'utils/contracts/sendTx';

import { MAX_VALUE, STAT_NAMES } from 'constants/index';

const AutoExercise = ({
  open,
  handleClose,
  strikeIndex,
  token,
  exercisableAmount,
}) => {
  const { signer, blockTime, contractAddresses } = useContext(WalletContext);

  const context = useContext(SsovContext);

  const [fees, setFees] = useState(['', '']);
  const [approved, setApproved] = useState(false);

  const {
    selectedEpoch,
    ssovData: { epochTimes, epochStrikes },
    userSsovData: { epochStrikeTokens },
    tokenPrice,
  } = context[token.toLocaleLowerCase()];

  const stats = useMemo(() => {
    return {
      strike:
        '$' + getUserReadableAmount(epochStrikes[strikeIndex], 8).toString(),
      price: '$' + formatAmount(getUserReadableAmount(tokenPrice, 8), 5),
      expiry: format(
        new Date(epochTimes[1] * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
      amount: formatAmount(getUserReadableAmount(exercisableAmount, 18), 5),
    };
  }, [tokenPrice, strikeIndex, epochStrikes, epochTimes, exercisableAmount]);

  const handleApprove = useCallback(async () => {
    const delegatorAddress =
      token === 'DPX'
        ? contractAddresses.SSOV.DPX.SSOVDelegator
        : contractAddresses.SSOV.RDPX.SSOVDelegator;

    const allowance = await ERC20__factory.connect(
      epochStrikeTokens[strikeIndex].address,
      signer
    ).allowance(await signer.getAddress(), delegatorAddress);

    if (allowance.lte(exercisableAmount)) {
      // Max Approve delegator
      await sendTx(
        ERC20__factory.connect(
          epochStrikeTokens[strikeIndex].address,
          signer
        ).approve(delegatorAddress, MAX_VALUE)
      );
      setApproved(true);
    }
  }, [
    contractAddresses,
    epochStrikeTokens,
    exercisableAmount,
    signer,
    strikeIndex,
    token,
  ]);

  useEffect(() => {
    (async function () {
      const delegatorAddress =
        token === 'DPX'
          ? contractAddresses.SSOV.DPX.SSOVDelegator
          : contractAddresses.SSOV.RDPX.SSOVDelegator;

      const delegator = SSOVDelegator__factory.connect(
        delegatorAddress,
        signer
      );

      const [exerciseFee, exerciseFeeCap] = await Promise.all([
        delegator.exerciseFee(),
        delegator.exerciseFeeCap(),
      ]);

      setFees([
        getUserReadableAmount(exerciseFee, 1e8).toString(),
        getUserReadableAmount(exerciseFeeCap, 18).toString(),
      ]);
    })();
  }, [contractAddresses, signer, token]);

  const handleDelegate = useCallback(async () => {
    const delegatorAddress =
      token === 'DPX'
        ? contractAddresses.SSOV.DPX.SSOVDelegator
        : contractAddresses.SSOV.RDPX.SSOVDelegator;

    if (!approved)
      await sendTx(
        ERC20__factory.connect(
          epochStrikeTokens[strikeIndex].address,
          signer
        ).approve(delegatorAddress, MAX_VALUE)
      );

    const delegator = SSOVDelegator__factory.connect(delegatorAddress, signer);

    // Delegate tokens for auto-exercise
    await sendTx(
      delegator.delegate(
        selectedEpoch,
        epochStrikes[strikeIndex],
        exercisableAmount,
        await signer.getAddress()
      )
    );
  }, [
    approved,
    contractAddresses,
    epochStrikeTokens,
    epochStrikes,
    exercisableAmount,
    selectedEpoch,
    signer,
    strikeIndex,
    token,
  ]);

  useEffect(() => {
    const updateApprovedState = async () => {
      const delegatorAddress =
        token === 'DPX'
          ? contractAddresses.SSOV.DPX.SSOVDelegator
          : contractAddresses.SSOV.RDPX.SSOVDelegator;

      const allowance = await ERC20__factory.connect(
        epochStrikeTokens[strikeIndex].address,
        signer
      ).allowance(await signer.getAddress(), delegatorAddress);

      setApproved(allowance.gt(exercisableAmount));
    };
    updateApprovedState();
  }, [
    approved,
    contractAddresses,
    epochStrikeTokens,
    exercisableAmount,
    signer,
    strikeIndex,
    token,
  ]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col">
        <Typography variant="h5" className="mb-3">
          Auto Exercise
        </Typography>
        <Box className="flex flex-col bg-umbra rounded-lg p-4">
          <Box className="flex mb-4">
            <Box className="my-auto">{token == 'DPX' ? <Dpx /> : <Rdpx />}</Box>
            <Typography variant="h5" className="my-auto px-2 text-white">
              {token}
            </Typography>
            <Typography
              variant="h5"
              className="text-xs text-white bg-mineshaft rounded-md my-auto p-2"
            >
              CALL
            </Typography>
          </Box>
          <Box className="p-2 rounded-lg flex flex-col text-white">
            <Box className="flex flex-col space-y-4">
              {Object.keys(stats).map((key) => {
                return (
                  <Box key={key} className="flex justify-between">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      {STAT_NAMES.exercise[key]}
                    </Typography>
                    <Typography variant="caption" component="div">
                      {stats[key]}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Box className="flex flex-col p-3 my-3 space-y-2 border border-mineshaft rounded-lg">
          <Typography variant="caption" className="text-stieglitz">
            {`Auto exercising will charge ${fees[0]}% of the total P&L as fee. There is also a fee cap of ${fees[1]} ${token} for large positions.`}
          </Typography>
        </Box>
        {approved ? (
          <CustomButton
            size="large"
            disabled={
              blockTime > (Number(stats.expiry) - 3600) * 1000 || !stats.amount
            }
            onClick={handleDelegate}
            className=" p-5 bottom-0 rounded-md"
          >
            Auto Exercise
          </CustomButton>
        ) : (
          <CustomButton
            size="large"
            disabled={
              blockTime > (Number(stats.expiry) - 3600) * 1000 || !stats.amount
            }
            onClick={handleApprove}
            className=" p-5 bottom-0 rounded-md"
          >
            Approve
          </CustomButton>
        )}
        <Typography variant="h5" className="text-stieglitz self-end mt-3">
          Epoch {selectedEpoch}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default AutoExercise;
