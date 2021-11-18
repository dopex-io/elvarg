import { useCallback, useContext, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import Dpx from 'assets/tokens/Dpx';
import Rdpx from 'assets/tokens/Rdpx';

import { STAT_NAMES } from 'constants/index';
import { format } from 'date-fns';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { SsovContext } from 'contexts/Ssov';
import { SSOVDelegator__factory } from '@dopex-io/sdk';
import { WalletContext } from 'contexts/Wallet';
import sendTx from 'utils/contracts/sendTx';

const Withdraw = ({
  open,
  handleClose,
  strikeIndex,
  token,
  exercisableAmount,
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
      amount: formatAmount(exercisableAmount, 5),
    };
  }, [epochStrikes, epochTimes, exercisableAmount, strikeIndex, tokenPrice]);

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
        exercisableAmount
      )
    );
    setDelegated(false);
  }, [
    contractAddresses,
    epochStrikes,
    exercisableAmount,
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
            {token == 'DPX' ? <Dpx /> : <Rdpx />}
            <span className="my-auto px-2 text-white">{'DPX'}</span>
            {token}
            <span className="text-xs text-white bg-mineshaft rounded-md my-auto ml-2 p-2">
              {'CALL'}
            </span>
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
        <Box className="flex">
          <CustomButton
            size="large"
            disabled={
              blockTime > (Number(stats.expiry) - 3600) * 1000 ||
              !stats.amount ||
              Number(stats.amount) === 0
            }
            onClick={handleWithdraw}
            className="w-full p-5 bottom-0 rounded-md ml-0.5"
          >
            Disable
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Withdraw;
