/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource /
/** @jsxImportSource @emotion/react/ */
import { useCallback, useContext } from 'react';
import cx from 'classnames';
import { css } from '@emotion/react';

import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import useSendTx from 'hooks/useSendTx';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { StraddlesContext } from 'contexts/Straddles';
import { WalletContext } from 'contexts/Wallet';

const PositionsTable = () => {
  const sendTx = useSendTx();
  const { signer } = useContext(WalletContext);
  const { straddlesUserData, straddlesData, updateStraddlesUserData } =
    useContext(StraddlesContext);

  const handleExercise = useCallback(
    async (selectedPositionNftIndex: number) => {
      if (!straddlesData?.isEpochExpired) return;

      await sendTx(
        straddlesData?.straddlesContract
          .connect(signer)
          .settle(
            straddlesUserData?.straddlePositions![selectedPositionNftIndex!]![
              'id'
            ]
          )
      );
      await updateStraddlesUserData!();
    },
    [straddlesData, straddlesUserData, signer, updateStraddlesUserData, sendTx]
  );

  return (
    <Box>
      {/* @ts-ignore TODO: FIX */}
      <TableContainer
        className="rounded-xl"
        css={css`
          .optionsTable td {
            border: none !important;
          }

          .optionsTable table {
            border-collapse: separate !important;
            border-spacing: 0 0.5em !important;
          }

          .optionsTable td {
            border: solid 1px #000;
            border-style: solid none;
            padding: 10px 16px;
          }

          .optionsTable td:first-child {
            border-left-style: solid;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }

          .optionsTable td:last-child {
            border-right-style: solid;
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;
          }
        `}
      >
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow>
              <TableCell className="border-0 pb-0">
                <Typography variant="h6" className="text-gray-400">
                  Amount
                  <ArrowDownwardIcon className="w-4 pb-2 ml-2" />
                </Typography>
              </TableCell>
              <TableCell className="border-0 pb-0">
                <Typography variant="h6" className="text-gray-400">
                  AP Strike
                </Typography>
              </TableCell>
              <TableCell className=" border-0 pb-0">
                <Typography variant="h6" className="text-gray-400 flex">
                  Epoch
                </Typography>
              </TableCell>
              <TableCell className=" border-0 pb-0">
                <Typography
                  variant="h6"
                  className="text-gray-400 flex justify-end"
                >
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={cx('rounded-lg')}>
            {straddlesUserData?.straddlePositions?.map((position, i) => (
              <TableRow key={i} className="">
                <TableCell className="pt-2">
                  <Box>
                    <Box
                      className={`rounded-md flex items-center px-2 py-2 w-fit`}
                    >
                      <Typography variant="h6" className="pr-7 pt-[2px]">
                        {formatAmount(
                          getUserReadableAmount(position.amount, 18),
                          6
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="pt-1">
                  <Typography variant="h6" className="text-[#6DFFB9]">
                    ${getUserReadableAmount(position.apStrike, 8)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1">
                  <Typography variant="h6" className="">
                    {Number(position.epoch!)}
                  </Typography>
                </TableCell>
                <TableCell className="flex justify-end">
                  <CustomButton
                    className={'cursor-pointer text-white'}
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
        {straddlesUserData?.straddlePositions!.length === 0 ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default PositionsTable;
