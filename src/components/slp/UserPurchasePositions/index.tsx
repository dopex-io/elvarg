import { useCallback, useState } from 'react';
import {
  Table,
  Box,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
} from '@mui/material';
import { ROWS_PER_PAGE } from 'constants/index';
import { TablePaginationActions } from 'components/UI';
import { BigNumber } from 'ethers';
import PurchasePositionsTable from './PurchasePositionsTable';
import { getHeaderCell, StyleTable } from 'components/common/LpCommon/Table';
import { useBoundStore } from 'store';

const UserPurchasePositions = () => {
  const {
    slpUserPurchaseData,
    slpEpochData,
    selectedEpoch,
    setSelectedPurchaseIdx,
  } = useBoundStore();

  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const [isFillModalOpen, setIsFillModalOpen] = useState<boolean>(false);
  const handleSettle = (originalIdxBeforeSort: number) => {
    if (!setSelectedPurchaseIdx) {
      return;
    }
    setSelectedPurchaseIdx(originalIdxBeforeSort);
    setIsFillModalOpen(true);
  };

  const closeFillModal = () => {
    setIsFillModalOpen(false);
  };

  return (
    <Box className="balances-table text-white pb-4">
      <StyleTable>
        <Table>
          <TableHead className="bg-umbra">
            <TableRow className="bg-umbra">
              {getHeaderCell('Strike Price')}
              {getHeaderCell('Options Bought')}
              {getHeaderCell('PnL')}
              {getHeaderCell('Actions')}
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {slpUserPurchaseData!.positions.map((p, idx) => {
              return p.epoch.toNumber() === selectedEpoch ? (
                <PurchasePositionsTable
                  key={idx}
                  purchasePositionIdx={idx}
                  isEpochExpired={slpEpochData?.isEpochExpired!}
                  receiptId={p.receiptId}
                  strike={p.strike}
                  amount={p.amount}
                  pnl={p.pnl || BigNumber.from(0)}
                  isFillModalOpen={isFillModalOpen}
                  canSettle={p.canSettle}
                  handleSettle={() => handleSettle(idx)}
                  closeFillModal={closeFillModal}
                />
              ) : null;
            })}
          </TableBody>
        </Table>
      </StyleTable>
      {slpUserPurchaseData!.positions.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          id="stats"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={slpUserPurchaseData!.positions.length}
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

export default UserPurchasePositions;
