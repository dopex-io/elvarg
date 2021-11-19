import { useCallback, useMemo, useContext, useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { SSOVDelegator__factory, ERC20__factory } from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';
import { format } from 'date-fns';

import CustomButton from 'components/UI/CustomButton';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import MaxApprove from 'components/MaxApprove';
import Dpx from 'assets/tokens/Dpx';
import Rdpx from 'assets/tokens/Rdpx';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';

import { MAX_VALUE, SSOV_DELEGATE_INFO, STAT_NAMES } from 'constants/index';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import sendTx from 'utils/contracts/sendTx';

const Delegate = ({
  open,
  handleClose,
  strikeIndex,
  token,
  exercisableAmount,
  setDelegated,
}) => {
  const { signer, blockTime, contractAddresses } = useContext(WalletContext);

  const context = useContext(SsovContext);

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
      price: '$' + getUserReadableAmount(tokenPrice, 8).toString(),
      pnl:
        '$' +
        formatAmount(
          (getUserReadableAmount(tokenPrice, 8) -
            getUserReadableAmount(epochStrikes[strikeIndex], 8)) *
            getUserReadableAmount(exercisableAmount, 18),
          5
        ),
      expiry: format(
        new Date(epochTimes[1] * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
      amount: formatAmount(exercisableAmount, 18),
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

    if (allowance.lte(BigNumber.from(exercisableAmount))) {
      // Max Approve delegator
      await sendTx(
        ERC20__factory.connect(
          epochStrikeTokens[strikeIndex].address,
          signer
        ).approve(delegatorAddress, MAX_VALUE)
      ).catch((e) => {
        setApproved(false);
        console.log(e);
      });
    }
  }, [
    contractAddresses,
    epochStrikeTokens,
    exercisableAmount,
    signer,
    strikeIndex,
    token,
  ]);

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
        ).approve(delegatorAddress, exercisableAmount)
      );

    const delegator = SSOVDelegator__factory.connect(delegatorAddress, signer);

    // Delegate tokens for auto-exercise
    await sendTx(
      delegator.delegate(
        selectedEpoch,
        epochStrikes[strikeIndex],
        BigNumber.from(exercisableAmount),
        await signer.getAddress()
      )
    ).catch((e) => {
      setDelegated(false);
      console.log(e);
    });
  }, [
    approved,
    contractAddresses,
    epochStrikeTokens,
    epochStrikes,
    exercisableAmount,
    selectedEpoch,
    setDelegated,
    signer,
    strikeIndex,
    token,
  ]);

  useEffect(() => {
    const updateDelegatedState = async () => {
      const delegatorAddress =
        token === 'DPX'
          ? contractAddresses.SSOV.DPX.SSOVDelegator
          : contractAddresses.SSOV.RDPX.SSOVDelegator;
      const delegator = SSOVDelegator__factory.connect(
        delegatorAddress,
        signer
      );

      const userStrike = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [await signer.getAddress(), epochStrikes[strikeIndex]]
      );

      const delegatedAmount = await delegator
        .connect(signer)
        .balances(userStrike, selectedEpoch);

      if (delegatedAmount.toNumber() != 0) {
        setDelegated(true);
      }
    };
    updateDelegatedState();
  }, [
    approved,
    contractAddresses,
    epochStrikes,
    selectedEpoch,
    setDelegated,
    signer,
    strikeIndex,
    token,
  ]);

  useEffect(() => {
    const updateMaxApprovedState = async () => {
      const delegatorAddress =
        token === 'DPX'
          ? contractAddresses.SSOV.DPX.SSOVDelegator
          : contractAddresses.SSOV.RDPX.SSOVDelegator;

      const allowance = await ERC20__factory.connect(
        epochStrikeTokens[strikeIndex].address,
        signer
      ).allowance(await signer.getAddress(), delegatorAddress);

      if (allowance.lt(MAX_VALUE)) {
        setApproved(false);
      } else {
        setApproved(true);
      }
    };
    updateMaxApprovedState();
  }, [contractAddresses, epochStrikeTokens, signer, strikeIndex, token]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col">
        <Typography variant="h5" className="mb-3">
          Auto Exercise
        </Typography>
        <Box className="flex flex-col bg-umbra rounded-lg p-4">
          <Box className="flex mb-4">
            {token == 'DPX' ? <Dpx /> : <Rdpx />}
            <Typography variant="h5" className="my-auto px-2 text-white">
              {token}
            </Typography>
            <Typography
              variant="h5"
              className="text-xs text-white bg-mineshaft rounded-md my-auto ml-2 p-2"
            >
              {'CALL'}
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
        <Typography
          variant="caption"
          className="p-3 my-3 border border-mineshaft rounded-lg text-stieglitz"
        >
          {SSOV_DELEGATE_INFO}
        </Typography>
        {!approved ? (
          <MaxApprove value={approved} setValue={handleApprove} />
        ) : null}
        <CustomButton
          size="large"
          disabled={
            blockTime > (Number(stats.expiry) - 3600) * 1000 || !stats.amount
          }
          onClick={handleDelegate}
          className=" p-5 bottom-0 rounded-md mr-0.5"
        >
          Delegate
        </CustomButton>
        <Typography variant="h5" className="text-stieglitz self-end mt-3">
          Epoch {selectedEpoch}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default Delegate;
