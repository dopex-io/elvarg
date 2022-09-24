import { useCallback } from 'react';
import {
  Table,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from '@mui/material';
import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';

import UserPositionsTable from './UserPositionsTable';
import { getHeaderCell } from '../common/Table';

const UserLpPositions = () => {
  const sendTx = useSendTx();
  const {
    signer,
    getOlpContract,
    olpData,
    olpUserData,
    selectedEpoch,
    updateOlpUserData,
  } = useBoundStore();

  const olpContract = getOlpContract();

  const handleKill = useCallback(
    async (selectedIndex: number) => {
      if (!olpData || !olpUserData || !olpContract || !signer) return;

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
        await updateOlpUserData!();
      } catch (err) {
        console.log(err);
      }
    },
    [sendTx, signer, olpContract, olpData, olpUserData, updateOlpUserData]
  );

  return (
    <Box className="balances-table text-white pb-4">
      <TableContainer className="rounded-xl">
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
            {olpUserData!.userPositions.map((p, idx) => {
              return !p.killed && p.epoch.toNumber() === selectedEpoch ? (
                <UserPositionsTable
                  key={idx}
                  option={olpData!.tokenName}
                  strikePrice={p.strike}
                  liquidityProvided={p.liquidity}
                  liquidityUsed={p.liquidityUsed}
                  discount={p.discount}
                  purchased={p.purchased}
                  actions={() => handleKill(idx)}
                />
              ) : null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserLpPositions;
