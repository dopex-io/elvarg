import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  TableHead,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableCell,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';
import { HeaderCell, StyleTable } from 'components/common/LpCommon/Table';
import { TablePaginationActions, Typography } from 'components/UI';

import { ROWS_PER_PAGE } from 'constants/index';

import UserPositionsTable from './UserPositionsTable';

const StyleCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-bottom: 1px solid #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleLeftCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-left: 1px solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleRightCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-right: 1px solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const UserLpPositions = () => {
  const sendTx = useSendTx();
  const {
    getOlpContract,
    olpData,
    signer,
    olpUserData,
    updateOlp,
    updateOlpEpochData,
    updateOlpUserData,
    setSelectedIsPut,
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

  const handleIsPut = useCallback(
    async (isPut: boolean) => {
      if (!setSelectedIsPut) return;
      setSelectedIsPut(isPut);
      await updateOlp();
      await updateOlpEpochData();
      await updateOlpUserData();
    },
    [setSelectedIsPut, updateOlp, updateOlpEpochData, updateOlpUserData]
  );

  return (
    <Box className="balances-table text-white pb-4">
      <Typography variant="h5" className="ml-1">
        User LP Positions
      </Typography>
      <Box className="bg-cod-gray p-1 mt-2 border-radius rounded-lg">
        <Box
          className={`flex flex-row h-[34px] w-[135px] justify-between bg-mineshaft rounded-md mt-1 mb-3`}
        >
          <Box
            className={`ml-1 my-1 h-6.5 text-center cursor-pointer group rounded hover:bg-umbra hover:opacity-80 ${
              !olpData?.isPut ? 'bg-umbra' : ''
            }`}
          >
            <Button
              disabled={!olpData?.hasCall}
              onClick={() => handleIsPut(false)}
            >
              <Box className="flex flex-row">
                <Typography variant="h6" className="-mt-1.5">
                  Call
                </Typography>
              </Box>
            </Button>
          </Box>
          <Box
            className={`mr-2 my-1 h-6.5 text-center cursor-pointer group rounded hover:bg-umbra hover:opacity-80 ${
              olpData?.isPut ? 'bg-umbra' : ''
            }`}
          >
            <Button
              disabled={!olpData?.hasPut}
              onClick={() => handleIsPut(true)}
            >
              <Box className="flex flex-row">
                <Typography variant="h6" className="-mt-1.5">
                  Put
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>

        <StyleTable>
          <Table>
            <TableHead className="bg-cod-gray">
              <TableRow>
                <StyleLeftCell align="left" className="flex flex-row">
                  <ArrowDownwardIcon
                    sx={{
                      width: '1.25rem',
                      marginTop: '0.125rem',
                      marginLeft: '-8px',
                      color: '#8E8E8E',
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="stieglitz"
                    className="mt-1.5"
                  >
                    Strike
                  </Typography>
                </StyleLeftCell>
                <StyleCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Liquidity
                  </Typography>
                </StyleCell>
                <StyleCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Utilization
                  </Typography>
                </StyleCell>
                <StyleCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Discount
                  </Typography>
                </StyleCell>
                <StyleCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Tokens Purchased
                  </Typography>
                </StyleCell>
                <StyleRightCell align="right">
                  <Typography variant="caption" color="stieglitz">
                    Action
                  </Typography>
                </StyleRightCell>
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
                      lpPosition={p}
                      actions={() => handleKill(idx)}
                      underlyingSymbol={olpData?.underlyingSymbol!}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </StyleTable>
      </Box>
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
