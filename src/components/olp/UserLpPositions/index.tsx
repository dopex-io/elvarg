import React, { useCallback, useState } from 'react';
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
import UserPositionsTable from './UserPositionsTable';
import { getHeaderCell, StyleTable } from 'components/common/LpCommon/Table';
import { TablePaginationActions } from 'components/UI';

const UserLpPositions = () => {
  const sendTx = useSendTx();
  const {
    signer,
    getOlpContract,
    olpData,
    olpUserData,
    updateOlpUserData,
    updateOlpEpochData,
    selectedPoolName,
  } = useBoundStore();

  const olpContract = getOlpContract();
  const [page, setPage] = useState<number>(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleKill = useCallback(
    async (selectedIndex: number) => {
      if (
        !olpData ||
        !olpUserData?.userPositions ||
        !olpContract ||
        !signer ||
        selectedIndex === undefined
      )
        return;

      const selectedPosition = olpUserData?.userPositions[selectedIndex];

      if (!selectedPosition) {
        throw new Error('Invalid position');
      }

      const selectedStrikeToken = await olpContract.getSsovOptionToken(
        olpData.ssov,
        selectedPosition.epoch,
        selectedPosition.strike
      );

      try {
        await sendTx(
          olpContract
            .connect(signer)
            .killLpPosition(selectedStrikeToken, selectedPosition.lpId)
        );
        await updateOlpEpochData!();
        await updateOlpUserData!();
      } catch (err) {
        console.log(err);
      }
    },
    [
      sendTx,
      signer,
      olpContract,
      olpData,
      olpUserData,
      updateOlpEpochData,
      updateOlpUserData,
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
              {getHeaderCell('Discount')}
              {getHeaderCell('Tokens Purchased')}
              {getHeaderCell('Actions')}
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {olpUserData
              ?.userPositions!.slice(
                page * ROWS_PER_PAGE,
                page * ROWS_PER_PAGE + ROWS_PER_PAGE
              )
              .map((p, idx) => {
                return (
                  <UserPositionsTable
                    key={idx}
                    option={olpData!.tokenName}
                    strikePrice={p.strike}
                    usdLiquidityProvided={p.usdLiquidity}
                    usdLiquidityUsed={p.usdLiquidityUsed}
                    underlyingLiquidityProvided={p.underlyingLiquidity}
                    underlyingLiquidityUsed={p.underlyingLiquidityUsed}
                    discount={p.discount}
                    purchased={p.purchased}
                    actions={() => handleKill(idx)}
                    selectedPoolName={selectedPoolName!}
                  />
                );
              })}
          </TableBody>
        </Table>
      </StyleTable>
      {olpUserData!.userPositions!.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          id="stats"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={olpUserData!.userPositions!.length}
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
