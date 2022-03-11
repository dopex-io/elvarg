import {
  useContext,
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import cx from 'classnames';

import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/material/Skeleton';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import {
  SsovData,
  SsovEpochData,
  SsovUserData,
  SsovContext,
} from 'contexts/Ssov';

import { SSOV_MAP } from 'constants/index';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import ArrowUpIcon from 'components/Icons/ArrowUpIcon';
import FlagIcon from 'components/Icons/FlagIcon';

import { BnbConversionContext } from 'contexts/BnbConversion';

import styles from './styles.module.scss';

interface StatsTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  totalDeposits: number;
  totalPurchased: number;
  totalPremiums: number;
  imgSrc: string;
  tokenSymbol: string;
}

const YEAR_SECONDS = 31536000;

const StatsTableData = (
  props: StatsTableDataProps & { price: number; epochTime: number }
) => {
  const {
    strikePrice,
    totalDeposits,
    totalPurchased,
    totalPremiums,
    price,
    epochTime,
    imgSrc,
    tokenSymbol,
  } = props;

  const { convertToBNB } = useContext(BnbConversionContext);

  const tokenName = tokenSymbol === 'BNB' ? 'vBNB' : tokenSymbol;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img src={imgSrc} alt="DPX" />
          </Box>
          <Typography variant="h5" className="text-white">
            {tokenSymbol}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">${formatAmount(strikePrice, 5)}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(totalDeposits, 5)} {tokenName}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(
            tokenSymbol === 'BNB'
              ? (convertToBNB(ethers.utils.parseEther(totalDeposits.toString()))
                  .div(oneEBigNumber(6))
                  .toNumber() /
                  1e4) *
                  price
              : totalDeposits * price,
            2
          )}
        </Box>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{formatAmount(totalPurchased, 5)}</Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {formatAmount(
            totalDeposits > 0 ? 100 * (totalPurchased / totalDeposits) : 0,
            5
          )}
          {'%'}
        </Box>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(totalPremiums, 5)} {tokenName}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(
            tokenSymbol === 'BNB'
              ? (convertToBNB(ethers.utils.parseEther(totalPremiums.toString()))
                  .div(oneEBigNumber(6))
                  .toNumber() /
                  1e4) *
                  price
              : totalPremiums * price,
            2
          )}
        </Box>
      </TableCell>
      <TableCell align="right" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(
            epochTime > 0 && totalDeposits > 0
              ? 100 *
                  (YEAR_SECONDS / epochTime) *
                  (totalPremiums / totalDeposits)
              : 0,
            2
          )}
          {'%'}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const ROWS_PER_PAGE = 5;

const STRIKE_INDEX_TO_COLOR = {
  0: '#F80196',
  1: '#FF617D',
  2: '#F09242',
  3: '#FFE600',
  4: '#6DFFB9',
};

const Stats = ({
  activeType,
  setActiveType,
}: {
  activeType: string;
  setActiveType: Dispatch<SetStateAction<string>>;
}) => {
  const { convertToBNB } = useContext(BnbConversionContext);
  const ssovContext = useContext(SsovContext);
  const { tokenPrice, tokenName } = ssovContext[activeType].ssovData;

  const {
    epochTimes,
    epochStrikes,
    totalEpochPremium,
    totalEpochStrikeDeposits,
    totalEpochOptionsPurchased,
  } = ssovContext[activeType].ssovEpochData;

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
            ? convertToBNB(totalEpochOptionsPurchased[strikeIndex]) ?? 0
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
      convertToBNB,
    ]
  );

  return ssovContext[activeType].selectedEpoch > 0 ? (
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
            <Box className="h-[9.5em] flex">
              <Typography
                variant="h5"
                className="text-stieglitz ml-auto mr-auto mt-auto mb-auto text-sm opacity-90"
              >
                Not available
              </Typography>
            </Box>
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
              <Box className="flex" key={strikeIndex}>
                <Box
                  className={`rounded-md flex mb-4 p-2 pt-1 pb-1 bg-cod-gray`}
                >
                  <FlagIcon
                    className={'mt-[6px] mr-1.5'}
                    fill={STRIKE_INDEX_TO_COLOR[strikeIndex]}
                  />
                  <Typography
                    variant={'h6'}
                    className={'text-sm text-stieglitz'}
                  >
                    ${getUserReadableAmount(strike, 8)}
                  </Typography>
                </Box>
                <Typography
                  variant={'h6'}
                  className={
                    'text-sm text-stieglitz mt-1 ml-auto mr-2 opacity-60'
                  }
                >
                  $44,374.96
                </Typography>
                <Typography
                  variant={'h6'}
                  className={'text-sm text-white mt-1 mr-0'}
                >
                  13.2 ETH
                </Typography>
              </Box>
            ))}
          </Box>
          <Box className={'w-full flex'}>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none border-r-none border-[0.1px] border-gray-600 w-full'
              }
            >
              <Box className="flex mb-1">
                <Typography variant="h5" className="text-stieglitz">
                  APR
                </Typography>
                <ArrowUpIcon className="mr-1 ml-auto mt-2 rotate-240 opacity-50" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Stats;
