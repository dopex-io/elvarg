import { useState, useCallback, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';
import CustomButton from 'components/UI/CustomButton';

import Typography from 'components/UI/Typography';
import InfoPopover from 'components/UI/InfoPopover';
import Settle from '../dialogs/Settle';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const TableHeader = ({
  children,
  align = 'left',
  textColor = 'text-stieglitz',
}) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className="bg-cod-gray border-umbra py-1"
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
  fill = 'bg-cod-gray',
}) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="td"
      className={`${fill} border-0 py-2`}
    >
      <Typography variant="h6" className={`${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const LiveRfqTable = () => {
  const { openTradesData, loaded } = useContext(OtcContext);

  const [index, setIndex] = useState(0);
  const [openTrades, setOpenTrades] = useState([]);

  const [dialogState, setDialogState] = useState({
    open: false,
    data: {},
    handleClose: () => {},
  });

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false, data: {} }));
  }, []);

  useEffect(() => {
    setOpenTrades(openTradesData);
  }, [openTradesData]);

  return loaded ? (
    <Box>
      {openTrades.length > 0 ? (
        <TableContainer className="rounded-lg overflow-x-hidden border border-umbra max-h-80">
          <Table aria-label="rfq-table" className="bg-umbra">
            <TableHead>
              <TableRow>
                <TableHeader align="left" textColor="white">
                  RFQ
                </TableHeader>
                <TableHeader align="left">Option</TableHeader>
                <TableHeader align="center">Amount</TableHeader>
                <TableHeader align="center">Bid/Ask</TableHeader>
                <TableHeader align="right">Quote</TableHeader>
                <TableHeader align="right">Total Price</TableHeader>
                <TableHeader align="right">Dealer</TableHeader>
                <TableHeader align="right">
                  <Box className="flex justify-end space-x-2">
                    <Typography variant="h6" className="my-auto text-stieglitz">
                      Trade
                    </Typography>
                    <InfoPopover
                      id="action"
                      infoText="Initiate a P2P trade with selected dealer"
                    />
                  </Box>
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody component="div">
              {openTrades.map((row, i) => (
                <TableRow key={i}>
                  <TableBodyCell align="left" textColor="white">
                    {row?.isBuy ? 'Buy' : 'Sell'}
                  </TableBodyCell>
                  <TableBodyCell align="left">
                    {row.isBuy
                      ? smartTrim(row.dealerBase?.symbol, 24)
                      : smartTrim(row.dealerQuote?.symbol, 24)}
                  </TableBodyCell>
                  <TableBodyCell align="center" textColor="text-green-400">
                    {row.isBuy
                      ? getUserReadableAmount(
                          row.dealerReceiveAmount,
                          18
                        ).toString()
                      : getUserReadableAmount(
                          row.dealerSendAmount,
                          18
                        ).toString()}
                  </TableBodyCell>
                  <TableBodyCell
                    align="center"
                    textColor="text-down-bad"
                    fill="bg-umbra"
                  >
                    {formatAmount(
                      getUserReadableAmount(
                        !row.isBuy
                          ? row.dealerReceiveAmount
                          : row.dealerSendAmount,
                        18
                      ) /
                        getUserReadableAmount(
                          row.isBuy
                            ? row.dealerReceiveAmount
                            : row.dealerSendAmount,
                          18
                        ),
                      5
                    )}{' '}
                    {row.isBuy
                      ? row.dealerQuote?.symbol
                      : row.dealerBase?.symbol}
                  </TableBodyCell>
                  <TableBodyCell align="right" fill="bg-umbra">
                    {row.isBuy
                      ? row.dealerQuote?.symbol
                      : row.dealerBase?.symbol}
                  </TableBodyCell>
                  <TableBodyCell align="right" fill="bg-umbra">
                    {getUserReadableAmount(
                      !row.isBuy
                        ? row.dealerReceiveAmount
                        : row.dealerSendAmount,
                      18
                    ).toString()}{' '}
                    {row.isBuy
                      ? row.dealerQuote?.symbol
                      : row.dealerBase?.symbol}
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    {smartTrim(row.dealer, 10)}
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    <Box className="flex justify-end">
                      <CustomButton
                        size="small"
                        key="open-trade"
                        onClick={() => {
                          setIndex(i);
                          setDialogState({
                            open: true,
                            data: openTradesData[index],
                            handleClose,
                          });
                        }}
                        className="text-white rounded px-2 py-0"
                      >
                        Trade
                      </CustomButton>
                      <Settle
                        open={dialogState.open}
                        handleClose={handleClose}
                        data={openTradesData[index]}
                      />
                    </Box>
                  </TableBodyCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box className="flex mx-auto justify-around py-8 bg-cod-gray rounded-xl border border-umbra">
          <Typography variant="h5" className="text-stieglitz">
            No Live Trades Available
          </Typography>
        </Box>
      )}
    </Box>
  ) : (
    <Box className="bg-cod-gray px-2 pt-2 rounded-lg">
      {[0, 1, 2, 4, 5].map((i) => (
        <Skeleton
          key={i}
          variant="rect"
          component={Box}
          animation="wave"
          className="rounded-md bg-umbra mb-2 py-4"
        />
      ))}
    </Box>
  );
};

export default LiveRfqTable;
