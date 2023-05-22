import { useCallback, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBoundStore } from 'store';

import { TablePaginationActions } from 'components/UI';
import {
  StyleLeftTableCell,
  StyleRightTableCell,
  StyleTableCellHeader,
} from 'components/common/LpCommon/Table';
import Loading from 'components/zdte/Loading';
import { OpenPositionsRow } from 'components/zdte/Positions/OpenPositions/OpenPositionsRow';

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

const ROWS_PER_PAGE = 5;

export const OpenPositions = () => {
  const { zdteData, staticZdteData, userZdteOpenPositions, isLoading } =
    useBoundStore();

  const [page, setPage] = useState<number>(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  if (isLoading || !zdteData || !staticZdteData) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col flex-grow w-full whitespace-nowrap">
      <StyleHeaderTable>
        <Table>
          <TableHead>
            <TableRow>
              <StyleLeftTableCell align="left" className="rounded-tl-xl">
                <span className="text-sm text-stieglitz my-auto min-w-width">
                  Strike
                </span>
              </StyleLeftTableCell>
              <StyleTableCellHeader>Breakeven</StyleTableCellHeader>
              <StyleTableCellHeader>Entry Price</StyleTableCellHeader>
              <StyleTableCellHeader>Amount</StyleTableCellHeader>
              <StyleTableCellHeader>Profit & Loss</StyleTableCellHeader>
              <StyleTableCellHeader>Time to Expiry</StyleTableCellHeader>
              <StyleRightTableCell align="right" className="rounded-tr-xl">
                <span className="text-sm text-stieglitz">Share</span>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {userZdteOpenPositions && userZdteOpenPositions?.length > 0 ? (
              userZdteOpenPositions
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                ?.map((position, index) => (
                  <OpenPositionsRow
                    key={index}
                    position={position}
                    idx={index}
                    staticZdteData={staticZdteData}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" className="border-none">
                  <div className="py-3">
                    <span className="text-white">
                      Your open positions will appear here
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyleHeaderTable>
      {userZdteOpenPositions &&
      userZdteOpenPositions?.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          id="stats"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={userZdteOpenPositions?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={ROWS_PER_PAGE}
          className="text-stieglitz border-0 flex flex-grow justify-center"
          ActionsComponent={TablePaginationActions}
        />
      ) : null}
    </div>
  );
};

export default OpenPositions;
