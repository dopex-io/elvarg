import { useState, useEffect } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import cx from 'classnames';
import Paper from '@material-ui/core/Paper';
import format from 'date-fns/format';
import { getFirestore, collection, getDocs } from '@firebase/firestore';

import Typography from 'components/UI/Typography';

import { db } from 'utils/firebase/initialize';

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
      className="bg-cod-gray border-0"
    >
      <Typography variant="h6" className={`${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  useEffect(() => {
    const trades = async () => {
      const trades = await (
        await getDocs(collection(db, 'trades'))
      ).docs.flatMap((docs) => docs.data());

      setTrades(trades);

      return;
    };
    trades();
  }, []);
  return (
    <TableContainer
      className={cx(styles.rfqTable, 'rounded-lg overflow-x-hidden')}
    >
      <Table
        aria-label="trade history table"
        component={Paper}
        className="bg-umbra"
      >
        <TableHead className="bg-umbra">
          <TableRow className="bg-umbra">
            <TableHeader align="left" textColor="white">
              RFQ
            </TableHeader>
            <TableHeader align="left" textColor="white">
              Time
            </TableHeader>
            <TableHeader align="left">Option</TableHeader>
            <TableHeader align="center">Dealer</TableHeader>
            <TableHeader align="right">Amount</TableHeader>
            <TableHeader align="right">Bid</TableHeader>
            <TableHeader align="right">Ask</TableHeader>
            <TableHeader align="right">Counter-party</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((row, index) => (
            <TableRow key={index}>
              <TableBodyCell align="left" textColor="white">
                {row.isBuy ? 'Buy' : 'Sell'}
              </TableBodyCell>
              <TableBodyCell align="left" textColor="white">
                {format(new Date(), 'd LLL yy')}
              </TableBodyCell>
              <TableBodyCell align="left">{row.base}</TableBodyCell>
              <TableBodyCell align="center">{row.dealer}</TableBodyCell>
              <TableBodyCell align="right">{row.amount}</TableBodyCell>
              <TableBodyCell align="right" textColor="text-down-bad">
                {row.bid}
              </TableBodyCell>
              <TableBodyCell align="right" textColor="text-green-400">
                {row.ask}
              </TableBodyCell>
              <TableBodyCell align="right">{row.counterParty}</TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TradeHistory;
