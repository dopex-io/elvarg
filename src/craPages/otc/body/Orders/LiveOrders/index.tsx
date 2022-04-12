import { useState, useCallback, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import CustomButton from 'components/UI/CustomButton';

import Typography from 'components/UI/Typography';
import InfoPopover from 'components/UI/InfoPopover';
import Settle from '../../../components/Dialogs/Settle';

import { OtcContext } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';

import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { ERC20__factory } from '@dopex-io/sdk';

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

const LiveOrders = () => {
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
        <TableContainer className="rounded-lg overflow-x-auto border border-umbra max-h-80">
          <Table aria-label="rfq-table" className="bg-umbra">
            <TableHead>
              <TableRow>
                <TableHeader align="left" textColor="white">
                  RFQ
                </TableHeader>
                <TableHeader align="left">Option</TableHeader>
                <TableHeader align="center">Quantity</TableHeader>
                <TableHeader align="center">Bid</TableHeader>
                <TableHeader align="center">Ask</TableHeader>
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
              {openTrades.map((row, i) => {
                return (
                  <TableRow key={i}>
                    <TableBodyCell align="left" textColor="white">
                      {row?.isBuy ? 'Buy' : 'Sell'}
                    </TableBodyCell>
                    <TableBodyCell align="left">
                      {row.isBuy
                        ? smartTrim(row.dealerBase?.symbol, 24)
                        : smartTrim(row.dealerQuote?.symbol, 24)}
                    </TableBodyCell>
                    <TableBodyCell align="center">
                      {row.isBuy
                        ? getUserReadableAmount(
                            row.dealerReceiveAmount,
                            6
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
                      <Box className="bg-cod-gray p-1 px-2 rounded-md text-center">
                        {row.isBuy
                          ? formatAmount(
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
                            )
                          : '-'}
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell
                      align="center"
                      textColor="text-emerald-500"
                      fill="bg-umbra"
                    >
                      <Box className="bg-cod-gray p-1 px-2 rounded-md text-center">
                        {!row.isBuy
                          ? formatAmount(
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
                            )
                          : '-'}
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      {row.isBuy
                        ? row.dealerQuote?.symbol
                        : row.dealerBase?.symbol}
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      {getUserReadableAmount(
                        !row.isBuy
                          ? row.dealerReceiveAmount
                          : row.dealerSendAmount,
                        row.isBuy ? 18 : 6
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box className="flex mx-auto justify-around py-8 bg-cod-gray rounded-xl border border-umbra">
          <Typography variant="h5" className="text-stieglitz">
            You Have No Open Orders
          </Typography>
        </Box>
      )}
    </Box>
  ) : (
    <Box className="bg-cod-gray px-2 pt-2 rounded-lg">
      {[0, 1, 2, 4, 5].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          component={Box}
          animation="wave"
          className="rounded-md bg-umbra mb-2 py-4"
        />
      ))}
    </Box>
  );
};

export default LiveOrders;
