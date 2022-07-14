import React from 'react';
import { useState } from 'react';
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
import cx from 'classnames';
import Typography from 'components/UI/Typography';
import WithdrawModal from './WithdrawModal';

const DepositsTable = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState<boolean>(false);

  return (
    <Box className="-mb-4">
      <TableContainer
        className={cx(styles['optionsTable'], 'bg-cod-gray', 'rounded-xl')}
      >
        <Table className="rounded-xl">
          <TableHead className="bg-umbra rounded-xl mb-0">
            <TableRow className="bg-umbra">
              <TableCell className="bg-cod-gray border-0 pb-0">
                <Typography variant="h6" className="text-gray-400">
                  Amount
                  <ArrowDownwardIcon className="w-4 pb-2 ml-2" />
                </Typography>
              </TableCell>
              <TableCell className="bg-cod-gray border-0 pb-0">
                <Typography variant="h6" className="text-gray-400">
                  Premiums
                </Typography>
              </TableCell>
              <TableCell className="bg-cod-gray border-0 pb-0">
                <Typography variant="h6" className="text-gray-400 flex">
                  Epoch
                  <HelpOutlineIcon className="w-5 h-5 ml-1" />
                </Typography>
              </TableCell>
              <TableCell className="bg-cod-gray border-0 pb-0">
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
            <TableRow key="a" className="mt-2">
              <TableCell className="pt-2">
                <Box className={''}>
                  <Box className={`rounded-md flex px-2 py-2 bg-umbra w-fit`}>
                    <Typography variant="h6" className="pr-7 pt-[2px]">
                      101.2
                    </Typography>
                    <Box className={`rounded-sm w-fit bg-neutral-700`}>
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
              <TableCell className="pt-2">
                <Typography variant="h6" className="text-[#6DFFB9]">
                  $231.22
                </Typography>
              </TableCell>
              <TableCell className="pt-2">
                <Typography variant="h6" className="">
                  1
                </Typography>
              </TableCell>
              <TableCell className="pt-2 flex justify-end">
                <Button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className={
                    'cursor-pointer bg-primary hover:bg-primary hover:opacity-90 text-white'
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
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepositsTable;
