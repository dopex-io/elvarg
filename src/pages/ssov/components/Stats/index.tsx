import { useContext, useState, useMemo } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import Skeleton from '@material-ui/lab/Skeleton';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import dpxIcon from 'assets/tokens/dpx.svg';

import styles from './styles.module.scss';

interface StatsTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  totalDeposits: number;
  totalPurchased: number;
  totalPremiums: number;
}

const StatsTableData = (props: StatsTableDataProps & { dpxPrice: number }) => {
  const {
    strikePrice,
    totalDeposits,
    totalPurchased,
    totalPremiums,
    dpxPrice,
  } = props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img src={dpxIcon} alt="DPX" />
          </Box>
          <Typography variant="h5" className="text-white">
            DPX
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">${formatAmount(strikePrice, 5)}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(totalDeposits, 5)}
          {' DPX'}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(totalDeposits * dpxPrice, 5)}
        </Box>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(totalPremiums, 5)}
          {' DPX'}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(totalPremiums * dpxPrice, 5)}
        </Box>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{formatAmount(totalPurchased, 5)}</Typography>
      </TableCell>
    </TableRow>
  );
};

const Stats = (props: { className?: string }) => {
  const { className } = props;
  const {
    selectedEpoch,
    selectedEpochSsovData: {
      epochStrikes,
      totalEpochPremium,
      totalEpochStrikeDeposits,
      totalEpochCallsPurchased,
    },
    dpxTokenPrice,
  } = useContext(SsovContext);

  const ROWS_PER_PAGE = 5;
  const [page, setPage] = useState(0);
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const dpxPrice = getUserReadableAmount(dpxTokenPrice ?? 0, 8);

  const stats: StatsTableDataProps[] = useMemo(
    () =>
      epochStrikes.map((strike, strikeIndex) => {
        const strikePrice = getUserReadableAmount(strike, 8);
        const totalDeposits = getUserReadableAmount(
          totalEpochStrikeDeposits[strikeIndex] ?? 0,
          18
        );
        const totalPurchased = getUserReadableAmount(
          totalEpochCallsPurchased[strikeIndex] ?? 0,
          18
        );
        const totalPremiums = getUserReadableAmount(
          totalEpochPremium[strikeIndex] ?? 0,
          18
        );
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
      totalEpochCallsPurchased,
      totalEpochPremium,
    ]
  );

  return selectedEpoch > 0 ? (
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
        <TableContainer
          className={cx(styles.optionsTable, 'overflow-x-hidden bg-cod-gray')}
        >
          {isEmpty(epochStrikes) ? (
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
                      Total Premiums
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
                          dpxPrice={dpxPrice}
                        />
                      );
                    }
                  )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {epochStrikes.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={epochStrikes.length}
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
