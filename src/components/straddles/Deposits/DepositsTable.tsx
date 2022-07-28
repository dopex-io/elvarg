import React, { useContext } from 'react';
import { useState } from 'react';
import cx from 'classnames';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import styles from 'components/ir/Positions/styles.module.scss';
import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { StraddlesContext } from 'contexts/Straddles';

import WithdrawModal from '../Dialogs/Withdraw';

const DepositsTable = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState<boolean>(false);
  const { straddlesUserData, selectedEpoch } = useContext(StraddlesContext);

  return (
    <Box>
      <TableContainer
        className={cx(styles['optionsTable'], '-my-2', 'rounded-xl')}
      >
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow className="">
              <TableCell className="border-0 pb-0">
                <Typography variant="h6" className="text-gray-400">
                  Amount
                  <ArrowDownwardIcon className="w-4 pb-2 ml-2" />
                </Typography>
              </TableCell>
              <TableCell className="border-0 pb-0">
                <Typography variant="h6" className="text-gray-400">
                  Premiums
                </Typography>
              </TableCell>
              <TableCell className=" border-0 pb-0">
                <Typography variant="h6" className="text-gray-400 flex">
                  Epoch
                  <HelpOutlineIcon className="w-5 h-5 ml-1" />
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
            {straddlesUserData?.writePositions?.map((position, i) => (
              <TableRow key={i} className="">
                <TableCell className="pt-2">
                  <Box className={''}>
                    <Box
                      className={`rounded-md flex items-center px-2 py-2 w-fit`}
                    >
                      <Typography variant="h6" className="pr-7 pt-[2px]">
                        {formatAmount(
                          getUserReadableAmount(position.usdDeposit, 6),
                          2
                        )}
                      </Typography>
                      <Box
                        className={`rounded-sm w-fit bg-neutral-700 flex items-center`}
                      >
                        <Typography
                          variant="h6"
                          className="px-1 py-[2px] text-gray-400"
                        >
                          USDC
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="pt-1">
                  <Typography variant="h6" className="text-[#6DFFB9]">
                    $0
                  </Typography>
                </TableCell>
                <TableCell className="pt-1">
                  <Typography variant="h6" className="">
                    {Number(selectedEpoch!)}
                  </Typography>
                </TableCell>
                <TableCell className="flex justify-end">
                  <Button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className={
                      'cursor-pointer bg-primary hover:bg-primary text-white'
                    }
                  >
                    Withdraw
                  </Button>
                  {isWithdrawModalOpen && (
                    <WithdrawModal
                      open={isWithdrawModalOpen}
                      handleClose={
                        (() => {
                          setIsWithdrawModalOpen(false);
                        }) as any
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="flex">
        {straddlesUserData?.writePositions!.length === 0 ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default DepositsTable;
