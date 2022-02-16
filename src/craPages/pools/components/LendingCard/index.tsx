import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import { PoolsContext } from 'contexts/Pools';
import { AssetsContext } from 'contexts/Assets';

import Typography from 'components/UI/Typography';
import Accordion from 'components/UI/Accordion';
import WalletButton from 'components/WalletButton';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import calculateApy from 'utils/contracts/calculateApy';

function LendingCard({ className }: { className?: string }) {
  const navigate = useNavigate();

  const { usdtDecimals } = useContext(AssetsContext);
  const {
    totalMarginPoolDeposits,
    userMarginPoolDeposits,
    marginPoolSupplyRate,
  } = useContext(PoolsContext);

  const finalMarginPoolSupplyRate = calculateApy(marginPoolSupplyRate);
  const finalTotalMarginPoolDeposits = getUserReadableAmount(
    totalMarginPoolDeposits,
    usdtDecimals
  );
  const finalUserMarginPoolDeposits = getUserReadableAmount(
    userMarginPoolDeposits,
    usdtDecimals
  );

  return (
    <Box
      className={cx('flex flex-col bg-cod-gray p-4 rounded-xl w-84', className)}
    >
      <Box className="flex flex-row mb-4 justify-between">
        <Box className="flex flex-row">
          <img className="w-10 h-10 mt-1" src="/assets/usdt.svg" alt="USDT" />
          <Box className="mx-2 h-8 flex flex-col">
            <Typography variant="h5" className="text-white">
              USDT Lending Pool
            </Typography>
            <Typography variant="h6" className="w-32 text-stieglitz">
              Tether
            </Typography>
          </Box>
        </Box>
        <WalletButton
          size="medium"
          className="rounded-md h-10 float-right mt-1"
          onClick={() => {
            navigate('/pools/margin');
          }}
        >
          {finalUserMarginPoolDeposits > 0 ? 'Manage' : 'Deposit'}
        </WalletButton>
      </Box>
      <Accordion
        summary="Margin Pool"
        details="The USDT lending pool lends USDT and collects interest from users who buy options on margin."
        footer={
          <Link
            target="_blank"
            href="https://docs.dopex.io/architecture-overview#margin"
          >
            Learn More
          </Link>
        }
      />
      <Box className="mb-4 mt-2 flex flex-row w-full justify-between space-x-2">
        <Box className="flex flex-col rounded-xl p-4 w-1/3 bg-umbra h-full justify-end">
          <TrendingUpIcon className="text-stieglitz w-7 h-7 mb-3" />
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz"
          >
            APY
          </Typography>
          <Typography variant="h4">
            {finalMarginPoolSupplyRate}
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
              {finalUserMarginPoolDeposits > 0 ? (
                <Box>
                  <span className="text-wave-blue">
                    {`${formatAmount(finalUserMarginPoolDeposits)} / `}
                  </span>
                  {formatAmount(finalTotalMarginPoolDeposits)}
                </Box>
              ) : (
                formatAmount(finalTotalMarginPoolDeposits)
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
    </Box>
  );
}

export default LendingCard;
