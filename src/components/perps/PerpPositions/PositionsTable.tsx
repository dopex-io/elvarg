import { useCallback } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import useSendTx from 'hooks/useSendTx';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import { TableHeader } from 'components/straddles/Deposits/DepositsTable';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { useBoundStore } from 'store';

const PositionsTable = () => {
  const sendTx = useSendTx();

  const { signer, optionPerpUserData, optionPerpData, optionPerpEpochData, updateOptionPerp, updateOptionPerpEpochData, updateOptionPerpUserData } =
    useBoundStore();

  const handleClose = useCallback(
    async () => {
      await updateOptionPerp();
      await updateOptionPerpEpochData();
      await updateOptionPerpUserData();
    },
    [optionPerpUserData, optionPerpData, signer, optionPerpEpochData, sendTx, updateOptionPerp, updateOptionPerpEpochData, updateOptionPerpUserData]
  );

  return (
    <Box>
      <TableContainer className="rounded-xl">
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow>
              <TableHeader label="Positions" showArrowIcon />
              <TableHeader label="Average Open Price" />
              <TableHeader label="PnL" />
              <TableHeader label="Margin" />
              <TableHeader label="Funding" />
              <TableHeader label="Action" variant="text-end" />
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {optionPerpUserData?.perpPositions?.map((position, i) => (
              <TableRow key={i}>
                <TableCell className="pt-2 border-0">
                  <Box>
                    <Box
                      className={`rounded-md flex items-center px-2 py-2 w-fit`}
                    >
                      <Typography variant="h6" className="pr-7 pt-[2px]">
                        {formatAmount(
                          getUserReadableAmount(
                            position.positions,
                            8
                          ),
                          8
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                  <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.averageOpenPrice, 8).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.pnl, 6).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.margin, 6).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.funding, 6).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="flex justify-end border-0">
                  <CustomButton
                    className="cursor-pointer text-white"
                    color={'primary'
                    }
                    onClick={() => handleClose()}
                  >
                    Close
                  </CustomButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="flex">
        {optionPerpUserData?.perpPositions?.length === 0 ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default PositionsTable;
