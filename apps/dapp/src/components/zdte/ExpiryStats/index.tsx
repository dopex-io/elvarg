import { useCallback, useState } from 'react';

import { BigNumber } from 'ethers';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBoundStore } from 'store';

import { TablePaginationActions } from 'components/UI';
import {
  StyleCell,
  StyleLeftCell,
  StyleLeftTableCell,
  StyleRightCell,
  StyleRightTableCell,
  StyleTableCellHeader,
} from 'components/common/LpCommon/Table';
import Loading from 'components/zdte/Loading';

import { getReadableTime, getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_STRIKE } from 'constants/index';

const ROWS_PER_PAGE: number = 10;

const StyleHeaderTable = styled(TableContainer)`
  table {
    border-collapse: separate !important;
    border-spacing: 0;
    border-radius: 0.5rem;
  }
  tr:last-of-type td:first-of-type {
    border-radius: 0 0 0 10px;
  }
  tr:last-of-type td:last-of-type {
    border-radius: 0 0 10px 0;
  }
`;

export const ExpiryStats = () => {
  const { expireStats } = useBoundStore();
  const [page, setPage] = useState<number>(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  if (!expireStats) return <Loading />;

  return (
    <Box className="flex flex-col flex-grow w-full whitespace-nowrap">
      <StyleHeaderTable>
        <Table>
          <TableHead>
            <TableRow>
              <StyleLeftTableCell
                align="left"
                className="flex space-x-1 rounded-tl-xl"
              >
                <ArrowDownwardIcon className="fill-current text-stieglitz w-4 my-auto" />
                <span className="text-sm text-stieglitz my-auto min-w-width">
                  Any Purchase?
                </span>
              </StyleLeftTableCell>
              <StyleTableCellHeader>Expiry</StyleTableCellHeader>
              <StyleTableCellHeader>Settlement Price</StyleTableCellHeader>
              <StyleRightTableCell align="right" className="rounded-tr-xl">
                <span className="text-sm text-stieglitz">Start ID</span>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          {expireStats
            ? expireStats
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                .map((stats, idx) => (
                  <TableBody className="rounded-lg " key={idx}>
                    <TableRow key={idx} className="mb-2 rounded-lg">
                      <StyleLeftCell align="left">
                        <span className="text-white">
                          {stats.begin ? 'Yes' : 'No'}
                        </span>
                      </StyleLeftCell>
                      <StyleCell align="left">
                        <span className="text-white">
                          {getReadableTime(stats.expiry)}
                        </span>
                      </StyleCell>
                      <StyleCell align="left">
                        <span className="text-white">
                          {stats.settlementPrice.gt(BigNumber.from(0))
                            ? `$${formatAmount(
                                getUserReadableAmount(
                                  stats.settlementPrice,
                                  DECIMALS_STRIKE
                                ),
                                2
                              )}`
                            : 'N/A'}
                        </span>
                      </StyleCell>
                      <StyleRightCell align="right">
                        <span className="text-white">{stats.startId}</span>
                      </StyleRightCell>
                    </TableRow>
                  </TableBody>
                ))
            : null}
        </Table>
      </StyleHeaderTable>
      {expireStats.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          id="stats"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={expireStats?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={ROWS_PER_PAGE}
          className="text-stieglitz border-0 flex flex-grow justify-center"
          ActionsComponent={TablePaginationActions}
        />
      ) : null}
    </Box>
  );
};

export default ExpiryStats;
