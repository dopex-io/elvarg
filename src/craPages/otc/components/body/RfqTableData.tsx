import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import cx from 'classnames';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';

import styles from './styles.module.scss';
import CustomButton from 'components/UI/CustomButton';

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

const RfqTableData = ({ setOpenChat }) => {
  const { orders, validateUser, user } = useContext(OtcContext);
  const navigate = useNavigate();

  return (
    <TableContainer
      className={cx(
        styles.rfqTable,
        'rounded-lg overflow-x-hidden border-umbra border-2 h-3/4'
      )}
    >
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
            <TableHeader align="right">Amount</TableHeader>
            <TableHeader align="center">Dealer</TableHeader>
            <TableHeader align="right">Bid</TableHeader>
            <TableHeader align="right">Ask</TableHeader>
            <TableHeader align="right">Chat</TableHeader>
            <TableHeader align="right">Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody component="div">
          {orders.map((row, index) => (
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
                {smartTrim(row.option, 20)}
              </TableBodyCell>
              <TableBodyCell align="right">{row.amount}</TableBodyCell>
              <TableBodyCell align="center">
                {smartTrim(row.dealer, 10)}
              </TableBodyCell>
              <TableBodyCell align="center" textColor="text-down-bad">
                {'-'}
              </TableBodyCell>
              <TableBodyCell align="right" textColor="text-green-500">
                {'-'}
              </TableBodyCell>
              <TableBodyCell align="right">
                <IconButton
                  className="p-0 hover:opacity-50 transition ease-in-out"
                  onClick={async () => {
                    await validateUser();
                    navigate(`/otc/chat/${row.uid}`);
                  }}
                >
                  <ChatBubbleIcon className="fill-current text-white p-1" />
                </IconButton>
              </TableBodyCell>
              <TableBodyCell align="right">
                <CustomButton
                  size="small"
                  disabled={row.isFulfilled}
                  color="umbra"
                  variant="outlined"
                >
                  <Typography variant="h6">
                    {row.isFulfilled ? 'Closed' : 'Bid'}
                  </Typography>
                </CustomButton>
              </TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RfqTableData;
