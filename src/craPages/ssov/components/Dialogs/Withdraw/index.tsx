import { useCallback, useContext, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import { SSOVDelegator__factory } from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';
import format from 'date-fns/format';

import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import Dpx from 'assets/tokens/Dpx';
import Rdpx from 'assets/tokens/Rdpx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import sendTx from 'utils/contracts/sendTx';

import { STAT_NAMES } from 'constants/index';

const Withdraw = ({
  open,
  handleClose,
  strikeIndex,
  token,
  delegatedAmount,
  setDelegated,
}) => {
  const context = useContext(SsovContext);

  const { signer, blockTime, contractAddresses } = useContext(WalletContext);

  const {
    selectedEpoch,
    ssovData: { epochTimes, epochStrikes },
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
      amount: formatAmount(getUserReadableAmount(delegatedAmount, 18), 5),
    };
  }, [epochStrikes, epochTimes, delegatedAmount, strikeIndex, tokenPrice]);

  const handleWithdraw = useCallback(async () => {
    const delegatorAddress =
      token === 'DPX'
        ? contractAddresses.SSOV.DPX.SSOVDelegator
        : contractAddresses.SSOV.RDPX.SSOVDelegator;

    const delegator = SSOVDelegator__factory.connect(delegatorAddress, signer);

    await sendTx(
      delegator.withdraw(
        selectedEpoch,
        epochStrikes[strikeIndex],
        delegatedAmount
      )
    );

    // Check user balance after withdrawal
    const userStrike = ethers.utils.solidityKeccak256(
      ['address', 'uint256'],
      [await signer.getAddress(), epochStrikes[strikeIndex]]
    );

    const userBalance = await delegator
      .connect(signer)
      .balances(userStrike, selectedEpoch);

    if (userBalance.eq(BigNumber.from(0))) {
      // Update delegated state
      setDelegated(false);
    }
  }, [
    contractAddresses,
    epochStrikes,
    delegatedAmount,
    selectedEpoch,
    setDelegated,
    signer,
    strikeIndex,
    token,
  ]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col">
        <Typography variant="h5" className="mb-3">
          Disable Auto Exercise
        </Typography>
        <Box className="flex flex-col bg-umbra rounded-lg p-4">
          <Box className="flex mb-4">
            <Box className="my-auto">{token == 'DPX' ? <Dpx /> : <Rdpx />}</Box>
            <Typography variant="h5" className="my-auto px-2 text-white">
              {token}
            </Typography>
            <Typography
              variant="h6"
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
                      variant="h6"
                      component="div"
                      className="text-stieglitz"
                    >
                      {STAT_NAMES.exercise[key]}
                    </Typography>
                    <Typography variant="h6" component="div">
                      {stats[key]}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Box className="flex">
          <CustomButton
            size="large"
            disabled={
              blockTime > (Number(stats.expiry) - 3600) * 1000 ||
              !stats.amount ||
              Number(stats.amount) === 0
            }
            onClick={handleWithdraw}
            className="w-full p-5 bottom-0 rounded-md ml-0.5 mt-2"
          >
            Disable
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Withdraw;
