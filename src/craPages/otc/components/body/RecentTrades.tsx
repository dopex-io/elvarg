import { useState } from 'react';
import Box from '@material-ui/core/Box';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import cx from 'classnames';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';

import smartTrim from 'utils/general/smartTrim';

import styles from './styles.module.scss';

const TableHeader = ({
  children,
  align = 'left',
  textColor = 'text-stieglitz',
}) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className="bg-cod-gray border-1 border-umbra py-1"
    >
      <Typography variant="h6" className={`${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const TableBodyCell = ({
  children,
  align = 'left',
  textColor = 'text-stieglitz',
}) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="td"
      className="bg-cod-gray border-0 py-2"
    >
      <Typography variant="h6" className={`${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const RecentTrades = () => {
  return (
    <TableContainer className="rounded-lg overflow-x-hidden border-umbra border-2 max-h-3/5">
      <Table aria-label="rfq-table" className="bg-umbra">
        <TableHead>
          <TableRow>
            <TableHeader align="left" textColor="white">
              RFQ
            </TableHeader>
            <TableHeader align="left">Status</TableHeader>
            <TableHeader align="left" textColor="white">
              Time
            </TableHeader>
            <TableHeader align="left">Option</TableHeader>
            <TableHeader align="center">Amount</TableHeader>
            <TableHeader align="right">Dealer</TableHeader>
            <TableHeader align="center">Counterparty</TableHeader>
            <TableHeader align="right">Bid</TableHeader>
            <TableHeader align="right">Ask</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody component="div">
          {[
            {
              isBuy: true,
              isFulfilled: true,
              timestamp: { seconds: 1640124000 },
              option: 'ETH-CALL400000000000-EPOCH1',
              amount: '21',
              username: 'halle.berry',
              price: '1200USDT',
            },
          ].map((row, index) => {
            return (
              <TableRow key={index}>
                <TableBodyCell align="left" textColor="white">
                  {row.isBuy ? 'Buy' : 'Sell'}
                </TableBodyCell>
                <TableBodyCell align="left">
                  {row.isFulfilled ? 'Fulfilled' : 'Pending'}
                </TableBodyCell>
                <TableBodyCell align="left" textColor="white">
                  {format(
                    new Date(Number(row.timestamp.seconds) * 1000),
                    'd LLL yy'
                  )}
                </TableBodyCell>
                <TableBodyCell align="left">
                  {smartTrim(row.option, 18)}
                </TableBodyCell>
                <TableBodyCell align="center">{row.amount}</TableBodyCell>
                <TableBodyCell align="right">{row.username}</TableBodyCell>
                <TableBodyCell align="center">{'adrien.brody'}</TableBodyCell>
                <TableBodyCell align="center" textColor="text-down-bad">
                  {'1201USDT'}
                </TableBodyCell>
                <TableBodyCell align="right" textColor="text-green-400">
                  {row.price}
                </TableBodyCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentTrades;
