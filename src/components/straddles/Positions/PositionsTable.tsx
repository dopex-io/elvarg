import { useCallback } from 'react';
import { BigNumber } from 'ethers';
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

  const { signer, straddlesUserData, straddlesData, updateStraddlesUserData } =
    useBoundStore();

  const handleExercise = useCallback(
    async (selectedPositionNftIndex: number) => {
      if (!straddlesData?.isEpochExpired || !straddlesData?.straddlesContract)
        return;

      if (straddlesData && straddlesUserData && signer) {
        await sendTx(
          straddlesData?.straddlesContract.connect(signer),
          'settle',
          [
            straddlesUserData?.straddlePositions![selectedPositionNftIndex!]![
              'id'
            ],
          ]
        );
        await updateStraddlesUserData!();
      }
    },
    [straddlesData, straddlesUserData, signer, updateStraddlesUserData, sendTx]
  );

  return (
    <Box>
      <TableContainer className="rounded-xl">
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow>
              <TableHeader label="Amount" showArrowIcon />
              <TableHeader label="AP Strike" />
              <TableHeader label="PnL" />
              <TableHeader label="Epoch" />
              <TableHeader label="Action" variant="text-end" />
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {straddlesUserData?.straddlePositions?.map((position, i) => (
              <TableRow key={i}>
                <TableCell className="pt-2 border-0">
                  <Box>
                    <Box
                      className={`rounded-md flex items-center px-2 py-2 w-fit`}
                    >
                      <Typography variant="h6" className="pr-7 pt-[2px]">
                        {formatAmount(
                          getUserReadableAmount(
                            position.amount.div(BigNumber.from(2)),
                            18
                          ),
                          8
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" className="text-[#6DFFB9]">
                    ${getUserReadableAmount(position.apStrike, 8).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.pnl, 18).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6">
                    {Number(position.epoch!)}
                  </Typography>
                </TableCell>
                <TableCell className="flex justify-end border-0">
                  <CustomButton
                    className="cursor-pointer text-white"
                    color={
                      straddlesData?.isEpochExpired ? 'mineshaft' : 'primary'
                    }
                    disabled={
                      !straddlesData?.isEpochExpired ||
                      straddlesUserData?.straddlePositions![i]!.pnl.lte(0)
                    }
                    onClick={() => handleExercise(i)}
                  >
                    Exercise
                  </CustomButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="flex">
        {straddlesUserData?.straddlePositions?.length === 0 ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        )}
      </Box>
    </Box>
  );
};

export default PositionsTable;
