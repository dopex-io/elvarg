import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import {
  StyleLeftTableCell,
  StyleRightTableCell,
  StyleTable,
  StyleTableCell,
} from 'components/common/LpCommon/Table';
import UserPositionsTable from 'components/olp/UserLpPositions/UserPositionsTable';
import Typography from 'components/UI/Typography';

const UserLpPositions = () => {
  const sendTx = useSendTx();
  const {
    getOlpContract,
    olpData,
    signer,
    olpUserData,
    updateOlpEpochData,
    updateOlpUserData,
  } = useBoundStore();

  const olpContract = getOlpContract();

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
        selectedPosition.strike,
      );

      try {
        await sendTx(olpContract.connect(signer), 'killLpPosition', [
          selectedStrikeToken,
          selectedPosition.lpId,
        ]);
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
    ],
  );

  return (
    <Box className="balances-table text-white space-y-2">
      <Typography variant="h5" className="ml-1">
        User LP Positions
      </Typography>
      <StyleTable className="bg-cod-gray rounded-t-lg rounded-md">
        <Table>
          <TableHead className="bg-cod-gray">
            <TableRow>
              <StyleLeftTableCell align="left" className="flex flex-row">
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
              </StyleLeftTableCell>
              <StyleTableCell align="center">
                <Typography variant="caption" color="stieglitz">
                  Liquidity
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="center">
                <Typography variant="caption" color="stieglitz">
                  Utilization
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="center">
                <Typography variant="caption" color="stieglitz">
                  Discount
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="center">
                <Typography variant="caption" color="stieglitz">
                  Tokens Purchased
                </Typography>
              </StyleTableCell>
              <StyleRightTableCell align="right">
                <Typography variant="caption" color="stieglitz">
                  Action
                </Typography>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {olpUserData?.userPositions?.map((p, idx) => {
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
  );
};

export default UserLpPositions;
