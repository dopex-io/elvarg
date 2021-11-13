import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

import { PoolsContext } from 'contexts/Pools';
import { AssetsContext } from 'contexts/Assets';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

function VolumeCard({ className }: { className?: string }) {
  const history = useHistory();
  const {
    userVolumePoolDeposits,
    totalVolumePoolDeposits,
    selectedEpoch,
    currentEpoch,
    volumePoolDiscount,
  } = useContext(PoolsContext);
  const { usdtDecimals } = useContext(AssetsContext);

  const finalTotalVolumePoolDeposits = getUserReadableAmount(
    totalVolumePoolDeposits,
    usdtDecimals
  );

  const finalUserVolumePoolDeposits = getUserReadableAmount(
    userVolumePoolDeposits,
    usdtDecimals
  );

  return (
    <Box
      className={cx('flex flex-col bg-cod-gray p-4 rounded-xl w-84', className)}
    >
      <Box className="flex flex-row mb-4 justify-between">
        <Box className="flex flex-row">
          <img
            className="w-10 h-10 mt-1"
            src={'/assets/usdt.svg'}
            alt={'USDT'}
          />
          <Box className="mx-2 h-8 flex flex-col">
            <Typography variant="h5" className="text-white">
              USDT
            </Typography>
            <Typography variant="h6" className="w-32 text-stieglitz">
              Tether
            </Typography>
          </Box>
        </Box>
        {selectedEpoch <= currentEpoch && finalUserVolumePoolDeposits === 0 ? (
          <Tooltip
            title="Please deposit in the next epoch"
            aria-label="add"
            placement="top"
          >
            <WalletButton
              size="medium"
              disabled
              className="rounded-md h-10 float-right mt-1"
            >
              Deposit
            </WalletButton>
          </Tooltip>
        ) : (
          <WalletButton
            size="medium"
            className="rounded-md h-10 float-right mt-1"
            onClick={() => {
              history.push('/pools/volume');
            }}
          >
            {finalUserVolumePoolDeposits > 0 ? 'Manage' : 'Deposit'}
          </WalletButton>
        )}
      </Box>
      <Box className="mb-4 flex flex-row w-full justify-between space-x-2">
        <Box className="flex flex-col rounded-xl p-4 w-1/3 bg-umbra h-full justify-end">
          <TrendingDownIcon className="text-stieglitz w-7 h-7 mb-3" />
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz"
          >
            Discount
          </Typography>
          <Typography variant="h4">
            {volumePoolDiscount}
            <span className="text-stieglitz">%</span>
          </Typography>
        </Box>
        <Box className="flex flex-col border-cod-gray rounded-xl border p-4 w-full bg-umbra">
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz mb-4"
          >
            My Deposits
          </Typography>
          <Box className="border-cod-gray rounded-full border p-2 w-full text-center flex flex-col bg-cod-gray">
            <Typography variant="caption" component="div">
              {finalUserVolumePoolDeposits > 0 ? (
                <Box>
                  <span className="text-wave-blue">
                    {`${formatAmount(finalUserVolumePoolDeposits)} /`}
                  </span>
                  {formatAmount(finalTotalVolumePoolDeposits)}
                </Box>
              ) : (
                formatAmount(finalTotalVolumePoolDeposits)
              )}
            </Typography>
            <Typography
              variant="caption"
              component="div"
              className="text-stieglitz"
            >
              USDT
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="caption" component="div" className="text-stieglitz">
        Epoch {selectedEpoch}
      </Typography>
    </Box>
  );
}

export default VolumeCard;
