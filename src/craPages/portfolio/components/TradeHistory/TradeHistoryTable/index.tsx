import format from 'date-fns/format';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import LaunchIcon from '@material-ui/icons/Launch';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { OptionPoolBrokerTransaction } from 'types';

interface TradeHistoryTableProps {
  finalTransactions: OptionPoolBrokerTransaction[];
  page: number;
  rowsPerPage: number;
}

const TableHeaderCell = ({ children, align = 'left' }) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className="text-stieglitz border-0"
    >
      {children}
    </TableCell>
  );
};

const TableBodyCell = ({ children, align = 'left' }) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="td"
      className="text-white border-0"
    >
      {children}
    </TableCell>
  );
};

const TradeHistoryTable = (props: TradeHistoryTableProps) => {
  const { finalTransactions, page, rowsPerPage } = props;

  return (
    <>
      {finalTransactions ? (
        finalTransactions.length !== 0 ? (
          <TableContainer className="overflow-x-hidden bg-cod-gray rounded-lg px-3 py-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Tx Type</TableHeaderCell>
                  <TableHeaderCell>Option Type</TableHeaderCell>
                  <TableHeaderCell>Strike</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Timestamp</TableHeaderCell>
                  <TableHeaderCell>Transaction</TableHeaderCell>
                  <TableHeaderCell align="right">Block</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody className="bg-cod-gray">
                {finalTransactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((txn) => {
                    return (
                      <TableRow key={txn.transaction.id}>
                        <TableBodyCell>{txn.__typename}</TableBodyCell>
                        <TableBodyCell>
                          {txn.isPut ? 'PUT' : 'CALL'}
                        </TableBodyCell>

                        <TableBodyCell>
                          {txn.__typename === 'OptionSwap'
                            ? formatAmount(
                                getUserReadableAmount(
                                  txn.newStrike,
                                  8
                                ).toString(),
                                3
                              )
                            : formatAmount(
                                getUserReadableAmount(txn.strike, 8).toString(),
                                3
                              )}
                        </TableBodyCell>
                        <TableBodyCell>
                          {txn.__typename === 'OptionSwap'
                            ? formatAmount(
                                getUserReadableAmount(
                                  txn.newAmount,
                                  18
                                ).toString(),
                                3
                              )
                            : formatAmount(
                                getUserReadableAmount(
                                  txn.amount,
                                  18
                                ).toString(),
                                3
                              )}
                        </TableBodyCell>
                        <TableBodyCell>
                          {format(
                            Number(txn.transaction.timestamp) * 1000,
                            ' H:mm EEE d LLLL'
                          )}
                        </TableBodyCell>
                        <TableBodyCell>
                          <a
                            href={`https://rtestnet.arbiscan.io/tx/${txn.transaction.id}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-white flex space-x-2 items-center"
                          >
                            <Typography variant="h6">
                              {smartTrim(txn.transaction.id, 10)}
                            </Typography>
                            <LaunchIcon className="h-4 w-4 text-white" />
                          </a>
                        </TableBodyCell>
                        <TableBodyCell align="right">
                          <a
                            href={`https://testnet.arbiscan.io/block/${txn.transaction.blockNumber}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-white flex space-x-2 items-center justify-end"
                          >
                            <Typography variant="h6">
                              {txn.transaction.blockNumber}
                            </Typography>
                            <LaunchIcon className="h-4 w-4 text-white" />
                          </a>
                        </TableBodyCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null
      ) : null}
    </>
  );
};

export default TradeHistoryTable;
