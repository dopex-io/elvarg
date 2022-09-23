import { useCallback, useContext } from 'react';
import {
  Table,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@mui/material';
import useSendTx from 'hooks/useSendTx';
import { OlpContext } from 'contexts/Rolp';
import { WalletContext } from 'contexts/Wallet';
import { Typography } from 'components/UI';
import UserPositionsTable from './UserPositionsTable';

// Displays current user's LpPosition info
// Handles kill position functionality
// Changes based on selected epoch and strike
const UserLpPositions = () => {
  const sendTx = useSendTx();
  const { signer } = useContext(WalletContext);
  const {
    olpContract,
    olpData,
    olpUserData,
    selectedEpoch,
    updateOlpUserData,
  } = useContext(OlpContext);

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
              <TableCell
                align="center"
                className="text-stieglitz bg-cod-gray border-0 pb-3"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Strike Price
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                className="text-stieglitz bg-cod-gray border-0 pb-3"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Option Tokens Provided
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                className="text-stieglitz bg-cod-gray border-0 pb-3"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Option Tokens Sold
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                className="text-stieglitz bg-cod-gray border-0 pb-3"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Markup
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                className="text-stieglitz bg-cod-gray border-0 pb-3"
              >
                <Typography variant="h6" className="text-stieglitz">
                  USD Received
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                className="text-stieglitz bg-cod-gray border-0 pb-3"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {olpUserData!.userPositions.map((p, idx) => {
              return !p.killed && p.epoch.toNumber() === selectedEpoch ? (
                <UserPositionsTable
                  key={idx}
                  option={olpData!.tokenName}
                  strikePrice={p.strike}
                  numTokensProvided={p.numTokensProvided}
                  numTokensSold={p.numTokensSold}
                  markup={p.markup}
                  usdReceived={p.usdReceived}
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
