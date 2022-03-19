import { useCallback, useContext } from 'react';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import cx from 'classnames';
import Countdown from 'react-countdown';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';

import { SsovContext } from 'contexts/Ssov';
import { AssetsContext } from 'contexts/Assets';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';

import useSendTx from 'hooks/useSendTx';

import styles from './styles.module.scss';

const Withdraw = ({ activeVaultContextSide }) => {
  const ssovContext = useContext(SsovContext);
  const {
    updateSsovEpochData,
    updateSsovUserData,
    ssovEpochData,
    ssovData,
    ssovUserData,
    ssovSigner,
    selectedEpoch,
    selectedSsov,
  } = ssovContext[activeVaultContextSide];

  const { tokenName } = ssovData;
  const { ssovContractWithSigner } = ssovSigner;
  const {
    epochTimes,
    epochStrikes,
    totalEpochStrikeDeposits,
    totalEpochDeposits,
  } = ssovEpochData;
  const { userEpochStrikeDeposits, userEpochDeposits } = ssovUserData;

  const { updateAssetBalances } = useContext(AssetsContext);

  const sendTx = useSendTx();

  const epochEndTime = epochTimes[1]
    ? format(new Date(epochTimes[1] * 1000), 'MM/dd')
    : 'N/A';

  const strikes = epochStrikes.map((strike) =>
    getUserReadableAmount(strike, 8).toString()
  );

  const totalEpochStrikeDepositsAmounts = totalEpochStrikeDeposits.map(
    (deposit) =>
      tokenName === 'BNB'
        ? getUserReadableAmount(deposit, 8)
        : getUserReadableAmount(deposit, 18)
  );

  const totalEpochDepositsAmount = getUserReadableAmount(
    totalEpochDeposits,
    18
  );

  const userEpochStrikeDepositsAmounts = userEpochStrikeDeposits.map(
    (deposit) =>
      tokenName === 'BNB'
        ? getUserReadableAmount(deposit, 8)
        : getUserReadableAmount(deposit, 18)
  );

  const userEpochDepositsAmount =
    tokenName === 'BNB'
      ? getUserReadableAmount(userEpochDeposits, 8)
      : getUserReadableAmount(userEpochDeposits, 18);

  const tokenSymbol = SSOV_MAP[ssovData.tokenName].tokenSymbol;

  // Handle Withdraw
  const handleWithdraw = useCallback(
    async (index) => {
      try {
        await sendTx(ssovContractWithSigner.withdraw(selectedEpoch, index));
        updateSsovEpochData();
        updateSsovUserData();
      } catch (err) {
        console.log(err);
      }
      updateAssetBalances();
    },
    [
      ssovContractWithSigner,
      selectedEpoch,
      updateSsovEpochData,
      updateSsovUserData,
      updateAssetBalances,
      sendTx,
    ]
  );

  return (
    <Box>
      <Box className="bg-umbra flex flex-col p-4 rounded-xl justify-between mb-2">
        <Box className="flex flex-row justify-between w-full items-center mb-2">
          <Typography variant="h6" className="text-stieglitz">
            My Deposits
          </Typography>
          <Typography variant="h6">
            <span className="text-wave-blue">
              {formatAmount(userEpochDepositsAmount, 5)}
            </span>{' '}
            / {formatAmount(totalEpochDepositsAmount, 5)}{' '}
            {activeVaultContextSide === 'PUT' ? '2CRV' : tokenSymbol}
          </Typography>
        </Box>
        <Box>
          {strikes.map((strike, index) =>
            userEpochStrikeDeposits[index].gt(0) ? (
              <Box className="flex flex-row mt-3" key={index}>
                <Box
                  className={cx(
                    'bg-cod-gray h-12 rounded-md mr-2',
                    styles.allocationWidth
                  )}
                >
                  <Box
                    key={strike}
                    className="bg-cod-gray flex flex-col py-1 rounded-xl text-center mb-4"
                  >
                    <Typography variant="h6">
                      <span className="text-wave-blue">
                        {formatAmount(userEpochStrikeDepositsAmounts[index], 5)}
                      </span>{' '}
                      /{' '}
                      {formatAmount(totalEpochStrikeDepositsAmounts[index], 5)}
                    </Typography>
                    <Typography variant="h6" className="text-stieglitz">
                      {tokenSymbol} ${strike}
                    </Typography>
                  </Box>
                </Box>
                <CustomButton
                  size="large"
                  onClick={(e) => handleWithdraw(index)}
                >
                  Withdraw
                </CustomButton>
              </Box>
            ) : (
              <Box
                className="bg-cod-gray flex flex-col py-1 rounded-xl text-center mt-3"
                key={index}
              >
                <Typography variant="h6">
                  {formatAmount(totalEpochStrikeDepositsAmounts[index], 5)}{' '}
                  {activeVaultContextSide === 'PUT' ? '2CRV' : tokenSymbol}
                </Typography>
                <Typography variant="h6" className="text-stieglitz">
                  {tokenSymbol} ${strike}
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Box>
      <Box className="flex flex-row border-umbra rounded-xl border p-4 mb-2">
        <Box className="flex flex-col">
          <Typography variant="h6" className="mb-4 text-left">
            Epoch {selectedEpoch}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            className="mb-1 text-stieglitz text-left"
          >
            Withdrawals can only be processed for past epochs. Expiry for the
            selected epoch is {epochEndTime}.
            <br />
            <br />
            <Countdown
              date={new Date(epochTimes[1] * 1000)}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  return (
                    <span className="text-wave-blue">
                      This epoch has expired.
                    </span>
                  );
                } else {
                  return (
                    <span className="text-wave-blue">
                      Epoch end in: {days}d {hours}h {minutes}m {seconds}s
                    </span>
                  );
                }
              }}
            />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Withdraw;
