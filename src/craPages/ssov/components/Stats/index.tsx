import { useContext, useState, useMemo, useCallback } from 'react';
import { BigNumber, ethers } from 'ethers';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import TableHead from '@material-ui/core/TableHead';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import Skeleton from '@material-ui/lab/Skeleton';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import { SsovData, SsovEpochData, SsovUserData } from 'contexts/Ssov';

import useBnbSsovConversion from 'hooks/useBnbSsovConversion';

import { SSOV_MAP } from 'constants/index';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import ArrowUpIcon from 'components/Icons/ArrowUpIcon';
import FlagIcon from 'components/Icons/FlagIcon';

import styles from './styles.module.scss';

const YEAR_SECONDS = 31536000;

const ROWS_PER_PAGE = 5;

const STRIKE_INDEX_TO_COLOR = {
  0: '#F80196',
  1: '#FF617D',
  2: '#F09242',
  3: '#FFE600',
  4: '#6DFFB9',
};

const Stats = ({
  ssovData,
  selectedEpoch,
  ssovEpochData,
  type,
}: {
  ssovData: SsovData;
  selectedEpoch: number;
  ssovEpochData: SsovEpochData;
  type: string;
}) => {
  const { convertToVBNB } = useBnbSsovConversion();

  const { tokenPrice, tokenName } = ssovData;
  const {
    epochTimes,
    epochStrikes,
    totalEpochPremium,
    totalEpochStrikeDeposits,
    totalEpochOptionsPurchased,
  } = ssovEpochData;

  const epochTime =
    epochTimes && epochTimes[0] && epochTimes[1]
      ? (epochTimes[1] as BigNumber).sub(epochTimes[0] as BigNumber).toNumber()
      : 0;

  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const price = useMemo(
    () => getUserReadableAmount(tokenPrice ?? 0, 8),
    [tokenPrice]
  );

  const deposits: any[] = useMemo(
    () =>
      epochStrikes.map((strike, strikeIndex) => {
        const strikePrice = getUserReadableAmount(strike, 8);
        const totalDeposits =
          tokenName === 'BNB'
            ? getUserReadableAmount(
                totalEpochStrikeDeposits[strikeIndex] ?? 0,
                8
              )
            : getUserReadableAmount(
                totalEpochStrikeDeposits[strikeIndex] ?? 0,
                18
              );
        const totalPurchased =
          tokenName === 'BNB'
            ? convertToVBNB(totalEpochOptionsPurchased[strikeIndex]) ?? 0
            : getUserReadableAmount(
                totalEpochOptionsPurchased[strikeIndex] ?? 0,
                18
              );

        const totalPremiums =
          tokenName === 'BNB'
            ? getUserReadableAmount(totalEpochPremium[strikeIndex] ?? 0, 8)
            : getUserReadableAmount(totalEpochPremium[strikeIndex] ?? 0, 18);

        return {
          strikeIndex,
          strikePrice,
          totalDeposits,
          totalPurchased,
          totalPremiums,
        };
      }),
    [
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      tokenName,
      convertToVBNB,
    ]
  );

  return selectedEpoch > 0 ? (
    <Box>
      <Typography variant="h4" className="text-white mb-7">
        Stats
      </Typography>
      <Box className="flex">
        <Box className="w-1/2 pr-2.5">
          <Box
            className={
              'p-3 pl-4 pr-4 rounded-xl rounded-br-none rounded-bl-none border-[0.1px] border-b-0 border-gray-600 w-full'
            }
          >
            <Typography variant="h5" className="text-stieglitz">
              Purchased
            </Typography>
            <Box className="h-[11.15rem]"></Box>
          </Box>
          <Box className={'w-full flex'}>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none border-r-none rounded-br-none border-[0.1px] border-gray-600 w-1/2'
              }
            >
              <Typography variant="h4" className="text-white mb-1">
                4,314 {tokenName}
              </Typography>
              <Typography variant="h5" className="text-stieglitz">
                Total
              </Typography>
            </Box>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none rounded-bl-none border-[0.1px] border-gray-600 w-1/2'
              }
            >
              <Typography variant="h4" className="text-white mb-1">
                63,1%
              </Typography>
              <Typography variant="h5" className="text-stieglitz">
                Utilization
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="w-1/2 pl-2.5">
          <Box
            className={
              'p-3 pl-4 pr-4 pb-0 rounded-xl rounded-br-none rounded-bl-none border-[0.1px] border-b-0 border-gray-600 w-full'
            }
          >
            <Box className="flex mb-4">
              <Typography variant="h5" className="text-stieglitz">
                Premiums Collected
              </Typography>
              <ArrowUpIcon className="mr-1 ml-auto mt-1.5 rotate-180" />
            </Box>
            {epochStrikes.map((strike, strikeIndex) => (
              <Box className="flex">
                <Box
                  className={`rounded-md flex mb-4 p-2 pt-1 pb-1 bg-cod-gray`}
                >
                  <FlagIcon
                    className={'mt-[5px] mr-1.5'}
                    fill={STRIKE_INDEX_TO_COLOR[strikeIndex]}
                  />
                  <Typography
                    variant={'h6'}
                    className={'text-[12px] text-stieglitz'}
                  >
                    ${getUserReadableAmount(strike, 8)}
                  </Typography>
                </Box>
                <Typography
                  variant={'h6'}
                  className={
                    'text-[13px] text-stieglitz mt-1 ml-auto mr-2 opacity-60'
                  }
                >
                  $44,374.96
                </Typography>
                <Typography
                  variant={'h6'}
                  className={'text-[13px] text-white mt-1 mr-0'}
                >
                  13.2 ETH
                </Typography>
              </Box>
            ))}
          </Box>
          <Box className={'w-full flex'}>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none border-r-none rounded-br-none border-[0.1px] border-gray-600 w-1/2'
              }
            >
              <Typography variant="h4" className="text-white mb-1">
                4,314 {tokenName}
              </Typography>
              <Typography variant="h5" className="text-stieglitz">
                Total
              </Typography>
            </Box>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none rounded-bl-none border-[0.1px] border-gray-600 w-1/2'
              }
            >
              <Typography variant="h4" className="text-white mb-1">
                63,1%
              </Typography>
              <Typography variant="h5" className="text-stieglitz">
                Utilization
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Stats;
