import { useState, useCallback, useContext } from 'react';
import Box from '@material-ui/core/Box';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';
import InfoPopover from 'components/UI/InfoPopover';
import Trade from '../dialogs/Trade';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    handleClose: () => {},
  });
  const { selectedEscrowData } = useContext(OtcContext);

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  const handleTrade = useCallback(() => {
    setDialogState({
      open: true,
      handleClose: handleClose,
    });
    handleCloseMenu();
  }, [handleClose, handleCloseMenu]);

  return (
    <TableContainer className="rounded-lg overflow-x-hidden border border-umbra max-h-80">
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
            <TableHeader align="right">Ask</TableHeader>
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
          {[
            {
              isBuy: true,
              isFulfilled: false,
              timestamp: { seconds: 12321 },
              option: 'ETH-CALL400000000000-EPOCH1',
              amount: '21',
              address: '0x1f21Ee9021AAc21b2bdD',
              username: 'halle.berry',
              price: '1200USDT',
            },
          ].map((row, index) => (
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
              <TableBodyCell align="right">
                {smartTrim(row.username, 10)}
              </TableBodyCell>
              <TableBodyCell align="right" textColor="text-green-400">
                {row.price}
              </TableBodyCell>
              <TableBodyCell align="right">
                <Box className="flex justify-end">
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClickMenu}
                    className="long-menu rounded-md bg-cod-gray py-1 px-0 hover:bg-opacity-80 hover:bg-mineshaft flex"
                  >
                    <MoreVertIcon className="fill-current text-white" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    classes={{ paper: 'bg-mineshaft' }}
                    keepMounted
                  >
                    <MenuItem
                      key="open-trade"
                      onClick={handleTrade}
                      className="text-white rounded p-0 mx-4"
                      disabled={row.isFulfilled}
                    >
                      Trade
                    </MenuItem>
                  </Menu>
                  <Trade
                    open={dialogState.open}
                    handleClose={handleClose}
                    price={row.price}
                    amount={row.amount}
                    optionSymbol={row.option}
                    username={row.username}
                    address={row.address}
                    isBuy={row.isBuy}
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
