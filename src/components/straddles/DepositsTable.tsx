import React from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import styles from 'components/ir/Positions/styles.module.scss';
import cx from 'classnames';
import Typography from 'components/UI/Typography';

const DepositsTable = () => {
  return (
    <Box className="balances-table text-white">
      <TableContainer className={cx(styles['optionsTable'], 'bg-cod-gray')}>
        <Table>
          <TableHead className="bg-umbra">
            <TableRow className="bg-umbra">
              <TableCell
                align="left"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6">Amount</Typography>
              </TableCell>
              <TableCell
                align="left"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Premiums
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Epoch
                </Typography>
              </TableCell>

              <TableCell
                align="left"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Type
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6" className="text-stieglitz ml-auto">
                  Transfer
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={cx('rounded-lg')}>
            <TableRow key="a" className="text-white mb-2 rounded-lg mt-2">
              <TableCell align="left" className="mx-0 pt-2">
                <Box className={'pt-2'}>
                  <Box
                    className={`rounded-md flex mb-4 p-3 pt-2 pb-2 bg-umbra w-fit`}
                  >
                    <Typography variant="h6">asd</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="left" className="pt-2">
                <Typography variant="h6">asd2</Typography>
              </TableCell>

              <TableCell align="left" className="pt-2">
                <Typography variant="h6" className="text-[#6DFFB9]">
                  asd3
                </Typography>
              </TableCell>

              <TableCell align="left" className="px-6 pt-2">
                <Typography variant="h6" className="text-[#6DFFB9]">
                  asd4
                </Typography>
              </TableCell>

              <TableCell
                align="left"
                className="px-6 pt-2 w-[15rem]"
              ></TableCell>
              <TableCell align="right" className="px-0 pt-2">
                <Button
                  onClick={() => true}
                  className={
                    'cursor-pointer bg-primary hover:bg-primary hover:opacity-90 text-white'
                  }
                >
                  Withdraw
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepositsTable;
