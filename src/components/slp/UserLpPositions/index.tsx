import { useState, useCallback } from 'react';
import {
  Table,
  Box,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
} from '@mui/material';
import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';
import { ROWS_PER_PAGE } from 'constants/index';
import { TablePaginationActions } from 'components/UI';
import UserWritePositionsTable from './UserWritePositionsTable';
import { StyleTable, getHeaderCell } from 'components/common/LpCommon/Table';

const UserLpPositions = () => {
  const sendTx = useSendTx();
  const {
    signer,
    getSlpContract,
    updateSlpEpochData,
    slpUserProvideLpData,
    updateSlpUserProvideLpData,
  } = useBoundStore();

  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const slpContract = getSlpContract();

  const handleKill = useCallback(
    async (selectedIndex: number) => {
      if (!slpUserProvideLpData?.positions || !slpContract || !signer) return;

      const selectedPosition = slpUserProvideLpData?.positions[selectedIndex];

      if (!selectedPosition) {
        throw new Error('Invalid position');
      }

      try {
        await sendTx(
          slpContract
            .connect(signer)
            .killLpPosition(selectedPosition.strike, selectedPosition.lpId)
        );
        await updateSlpEpochData!();
        await updateSlpUserProvideLpData!();
      } catch (err) {
        console.log(err);
      }
    },
    [
      sendTx,
      signer,
      slpContract,
      slpUserProvideLpData,
      updateSlpEpochData,
      updateSlpUserProvideLpData,
    ]
  );

  return (
    <Box className="balances-table text-white pb-4">
      <StyleTable>
        <Table>
          <TableHead className="bg-umbra">
            <TableRow className="bg-umbra">
              {getHeaderCell('Strike Price')}
              {getHeaderCell('Liquidity Provided')}
              {getHeaderCell('Liquidity Used')}
              {getHeaderCell('Markup')}
              {getHeaderCell('Tokens Purchased')}
              {getHeaderCell('Actions')}
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {slpUserProvideLpData!
              .positions!.slice(
                page * ROWS_PER_PAGE,
                page * ROWS_PER_PAGE + ROWS_PER_PAGE
              )
              .map((p, idx) => {
                return (
                  <UserWritePositionsTable
                    key={idx}
                    idx={idx}
                    strike={p.strike}
                    liquidity={p.liquidity}
                    liquidityUsed={p.liquidityUsed}
                    markup={p.markup}
                    purchased={p.purchased}
                    actions={() => handleKill(idx)}
                  />
                );
              })}
          </TableBody>
        </Table>
      </StyleTable>
      {slpUserProvideLpData!.positions!.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          id="stats"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={slpUserProvideLpData!.positions!.length}
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

export default UserLpPositions;
