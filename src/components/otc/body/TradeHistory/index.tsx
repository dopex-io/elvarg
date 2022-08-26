import { useMemo, useContext } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import format from 'date-fns/format';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { OtcContext } from 'contexts/Otc';
import { useBoundStore } from 'store';

import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const TableHeader = ({
  // @ts-ignore TODO: FIX
  children,
  align = 'left',
  textColor = 'text-stieglitz',
}) => {
  return (
    // @ts-ignore TODO: FIX
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
  // @ts-ignore TODO: FIX
  children,
  align = 'left',
  textColor = 'text-stieglitz',
}) => {
  return (
    // @ts-ignore TODO: FIX
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

// @ts-ignore TODO: FIX
const TradeHistory = (props) => {
  const { smViewport } = props;
  const { tradeHistoryData } = useContext(OtcContext);
  const { accountAddress } = useBoundStore();

  // @ts-ignore TODO: FIX
  const sanitizedData = useMemo(() => {
    // @ts-ignore TODO: FIX
    return tradeHistoryData.map((entry) => {
      const quote = '-';
      const base = '-';
      return {
        quote,
        base,
        sendAmount: getUserReadableAmount(entry.sendAmount),
        receiveAmount: getUserReadableAmount(entry.receiveAmount),
        dealer: smartTrim(entry.dealer, 10),
        counterParty: smartTrim(entry.counterParty, 10),
        timestamp: entry.timestamp,
        isUser:
          accountAddress === entry.dealer ||
          accountAddress === entry.counterParty,
      };
    });
  }, [tradeHistoryData, accountAddress]);

  return !smViewport ? (
    <Box className="space-y-4">
      <Typography variant="h6" className="font-bold">
        Trade History
      </Typography>
      <TableContainer className="rounded-lg border border-umbra overflow-x-auto">
        <Table aria-label="trade history table" className="bg-umbra">
          <TableHead className="bg-umbra">
            <TableRow className="bg-umbra">
              <TableHeader align="left">Dealer</TableHeader>
              <TableHeader align="left">Quote</TableHeader>
              <TableHeader align="left">Sent</TableHeader>
              <TableHeader align="center">Time</TableHeader>
              <TableHeader align="right">Received</TableHeader>
              <TableHeader align="right">Base</TableHeader>
              <TableHeader align="right">Counter-party</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {tradeHistoryData &&
              sanitizedData?.map((row, index) => (
                <TableRow key={index}>
                  <TableBodyCell align="left">{row.dealer}</TableBodyCell>
                  <TableBodyCell align="left">{row.quote}</TableBodyCell>
                  <TableBodyCell align="left">{row.sendAmount}</TableBodyCell>
                  <TableBodyCell align="center">
                    {format(row.timestamp * 1000, 'K:mmaa d LLL yy')}
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    {row.receiveAmount}
                  </TableBodyCell>
                  <TableBodyCell align="right">{row.base}</TableBodyCell>
                  <TableBodyCell align="right">
                    {row.counterParty}
                  </TableBodyCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  ) : null;
};

export default TradeHistory;
