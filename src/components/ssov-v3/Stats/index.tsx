import { useContext, useState, useMemo, useCallback } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/material/Skeleton';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';

import { SsovV3Context } from 'contexts/SsovV3';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import styles from './styles.module.scss';

interface StatsTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  totalDeposits: number;
  totalPurchased: number;
  totalPremiums: number;
  underlyingSymbol: string;
  collateralSymbol: string;
  isPut: boolean;
}

const StatsTableData = (props: StatsTableDataProps & { price: number }) => {
  const {
    strikePrice,
    totalDeposits,
    totalPurchased,
    totalPremiums,
    price,
    underlyingSymbol,
    collateralSymbol,
    isPut,
  } = props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img
              src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
              alt={underlyingSymbol}
            />
          </Box>
          <Typography variant="h5" className="text-white">
            {underlyingSymbol}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">${formatAmount(strikePrice, 5)}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(totalDeposits, 5)} {collateralSymbol}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(isPut ? totalDeposits : totalDeposits * price, 2)}
        </Box>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{formatAmount(totalPurchased, 5)}</Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {formatAmount(
            totalDeposits > 0
              ? 100 *
                  (totalPurchased /
                    (isPut ? totalDeposits / strikePrice : totalDeposits))
              : 0,
            5
          )}
          {'%'}
        </Box>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(totalPremiums, 5)} {collateralSymbol}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(isPut ? totalPremiums : totalPremiums * price, 2)}
        </Box>
      </TableCell>
    </TableRow>
  );
};

const ROWS_PER_PAGE = 5;

const Stats = (props: { className?: string }) => {
  const { className } = props;

  const { ssovData, selectedEpoch, ssovEpochData } = useContext(SsovV3Context);

  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const price = useMemo(
    () => getUserReadableAmount(ssovData?.tokenPrice ?? 0, 8),
    [ssovData]
  );

  const stats: any[] = useMemo(
    () =>
      ssovEpochData?.epochStrikes.map((strike, strikeIndex) => {
        const strikePrice = getUserReadableAmount(strike, 8);
        const totalDeposits = getUserReadableAmount(
          ssovEpochData?.totalEpochStrikeDeposits[strikeIndex] ?? 0,
          18
        );
        const totalPurchased = getUserReadableAmount(
          ssovEpochData?.totalEpochOptionsPurchased[strikeIndex] ?? 0,
          18
        );

        const totalPremiums = getUserReadableAmount(
          ssovEpochData?.totalEpochPremium[strikeIndex] ?? 0,
          18
        );

        return {
          strikeIndex,
          strikePrice,
          totalDeposits,
          totalPurchased,
          totalPremiums,
        };
      }) ?? [],
    [ssovEpochData]
  );

  return Number(selectedEpoch) > 0 ? (
    <Box className={cx('bg-cod-gray w-full p-4 rounded-xl', className)}>
      <Box className="flex flex-row justify-between mb-1">
        <Typography variant="h5" className="text-stieglitz">
          Stats
        </Typography>
        <Typography variant="h6" className="text-stieglitz">
          Epoch {selectedEpoch}
        </Typography>
      </Box>
      <Box className="balances-table text-white pb-4">
        <TableContainer className={cx(styles['optionsTable'], 'bg-cod-gray')}>
          {isEmpty(ssovEpochData?.epochStrikes) ? (
            <Box className="border-4 border-umbra rounded-lg mt-2 p-3">
              {range(3).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="text"
                  animation="wave"
                  height={60}
                  className="bg-umbra"
                />
              ))}
            </Box>
          ) : (
            <Table>
              <TableHead className="bg-umbra">
                <TableRow className="bg-umbra">
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6">Option</Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Strike Price
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Total Deposits
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Total Purchased
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Total Premiums
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={cx('rounded-lg')}>
                {stats
                  .slice(
                    page * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE + ROWS_PER_PAGE
                  )
                  ?.map(
                    ({
                      strikeIndex,
                      strikePrice,
                      totalDeposits,
                      totalPurchased,
                      totalPremiums,
                    }) => {
                      return (
                        <StatsTableData
                          key={strikeIndex}
                          strikeIndex={strikeIndex}
                          strikePrice={strikePrice}
                          totalDeposits={totalDeposits}
                          totalPurchased={totalPurchased}
                          totalPremiums={totalPremiums}
                          price={price}
                          underlyingSymbol={ssovData?.underlyingSymbol || ''}
                          collateralSymbol={ssovData?.collateralSymbol || ''}
                          isPut={ssovData?.isPut || false}
                        />
                      );
                    }
                  )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {ssovEpochData?.epochStrikes?.length ?? 0 > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={ssovEpochData?.epochStrikes?.length ?? 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            className="text-stieglitz border-0 flex flex-grow justify-center"
            ActionsComponent={TablePaginationActions}
          />
        ) : null}
      </Box>
    </Box>
  ) : null;
};

export default Stats;
