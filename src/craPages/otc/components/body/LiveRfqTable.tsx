import { useState, useCallback, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import CustomButton from 'components/UI/CustomButton';

import Typography from 'components/UI/Typography';
import InfoPopover from 'components/UI/InfoPopover';
import Settle from '../dialogs/Settle';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

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

const LiveRfqTable = () => {
  const { openTradesData } = useContext(OtcContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  useEffect(() => {
    setOpenTrades(openTradesData);
  }, [openTradesData]);

  return (
    <TableContainer className="rounded-lg overflow-x-hidden border border-umbra max-h-80">
      <Table aria-label="rfq-table" className="bg-umbra">
        <TableHead>
          <TableRow>
            <TableHeader align="left" textColor="white">
              RFQ
            </TableHeader>
            <TableHeader align="left">Base</TableHeader>
            <TableHeader align="center">Amount</TableHeader>
            <TableHeader align="right">Quote</TableHeader>
            <TableHeader align="right">Ask</TableHeader>
            <TableHeader align="right">Dealer</TableHeader>
            <TableHeader align="right">
              <Box className="flex justify-end space-x-2">
                <Typography variant="h6" className="my-auto text-stieglitz">
                  Action
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
                {row.isBuy ? 'Buy' : 'Sell'}
              </TableBodyCell>
              <TableBodyCell align="left">
                {smartTrim(row.dealerBase.symbol, 18)}
              </TableBodyCell>
              <TableBodyCell align="center" textColor="text-green-400">
                {getUserReadableAmount(row.dealerReceiveAmount, 18).toString()}
              </TableBodyCell>
              <TableBodyCell align="right">
                {smartTrim(row.dealerQuote.symbol, 18)}
              </TableBodyCell>
              <TableBodyCell align="right" textColor="text-down-bad">
                {getUserReadableAmount(row.dealerSendAmount, 18).toString()}
              </TableBodyCell>
              <TableBodyCell align="right">
                {smartTrim(row.dealer, 8)}
              </TableBodyCell>
              <TableBodyCell align="right">
                <Box className="flex justify-end">
                  <CustomButton
                    size="medium"
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
  );
};

export default LiveRfqTable;
