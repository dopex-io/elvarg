import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';

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

const IndicativeRfqTable = () => {
  const { orders, validateUser } = useContext(OtcContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const navigateToChat = useCallback(
    async (row) => {
      await validateUser();
      // broken link
      navigate(`/otc/chat/${row.username + '-' + row.option}`);
    },
    [navigate, validateUser]
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  return (
    <TableContainer className="rounded-lg overflow-x-hidden border-umbra border max-h-80">
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
            <TableHeader align="right">Actions</TableHeader>
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
                {smartTrim(row.username, 10)}
              </TableBodyCell>
              <TableBodyCell align="center" textColor="text-down-bad">
                {'-'}
              </TableBodyCell>
              <TableBodyCell align="right" textColor="text-green-400">
                {row.price}
              </TableBodyCell>
              <TableBodyCell align="right">
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClickMenu}
                  className="long-menu rounded-md bg-cod-gray py-1 px-0 hover:bg-opacity-80 hover:bg-mineshaft"
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
                    key="transfer-options"
                    onClick={() => navigateToChat(row)}
                    className="text-white rounded px-3 py-1"
                    disabled={row.isFulfilled}
                  >
                    Chat
                  </MenuItem>
                  <MenuItem
                    key="place-bid"
                    onClick={() => {}}
                    className="text-white rounded px-3 py-1"
                  >
                    Bid
                  </MenuItem>
                </Menu>
              </TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IndicativeRfqTable;
