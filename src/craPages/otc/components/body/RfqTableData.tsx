import { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core//Paper';
import cx from 'classnames';
import format from 'date-fns/format';
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
} from 'firebase/firestore';

import Typography from 'components/UI/Typography';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
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
      className="bg-cod-gray"
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

const RfqTableData = () => {
  const [orderData, setOrderData] = useState<DocumentData>([]);
  useEffect(() => {
    (async () => {
      const querySnapshot = (
        await getDocs(collection(db, 'orders'))
      ).docs.flatMap((doc) => doc.data());

      setOrderData(querySnapshot);
    })();
    return;
  }, []);

  return (
    <TableContainer
      className={cx(styles.rfqTable, 'rounded-lg overflow-x-hidden')}
    >
      <Table
        // sx={{ minWidth: 750 }}
        aria-label="Rfq table"
        // component="table"
        className="bg-umbra"
      >
        <TableHead className="bg-umbra">
          <TableRow className="bg-umbra">
            <TableHeader align="left" textColor="white">
              RFQ
            </TableHeader>
            <TableHeader align="left">Status</TableHeader>
            <TableHeader align="left" textColor="white">
              Time
            </TableHeader>
            <TableHeader align="left">Option</TableHeader>
            <TableHeader align="center">Dealer</TableHeader>
            <TableHeader align="right">Amount</TableHeader>
            <TableHeader align="right">Bid</TableHeader>
            {/* <TableHeader align="right">Ask</TableHeader> */}
            {/* <TableHeader align="right">Counter-party</TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody component="div">
          {orderData.map((row, index) => (
            <TableRow
              key={index}
              //   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
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
                {smartTrim(row.baseAddress, 10)}
              </TableBodyCell>
              <TableBodyCell align="center">
                {smartTrim(row.dealer, 10)}
              </TableBodyCell>
              <TableBodyCell align="right">
                {row.isBuy ? row.baseAmount : row.quoteAmount}
              </TableBodyCell>
              {row.isBuy ? (
                <>
                  <TableBodyCell align="right" textColor="text-down-bad">
                    {row.quoteAmount}
                  </TableBodyCell>
                  {/* <TableBodyCell align="right" textColor="text-green-500">
                    {'-'}
                  </TableBodyCell> */}
                </>
              ) : (
                <>
                  {/* <TableBodyCell align="right" textColor="text-down-bad">
                    {'-'}
                  </TableBodyCell> */}
                  <TableBodyCell align="right" textColor="text-green-500">
                    {row.baseAmount}
                  </TableBodyCell>
                </>
              )}
              {/* <TableBodyCell align="right">
                {row.isFulfilled ? row.counterPartyAddress : ''}
              </TableBodyCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RfqTableData;
