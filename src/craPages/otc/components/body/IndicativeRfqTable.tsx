import { useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import format from 'date-fns/format';
import TableFooter from '@material-ui/core/TableFooter';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import { collection, getDocs } from 'firebase/firestore';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import CustomButton from 'components/UI/CustomButton';
import CloseRfqDialog from '../dialogs/CloseRfqDialog';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
import { db } from 'utils/firebase/initialize';

const ROWS_PER_PAGE = 5;

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

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    handleClose: () => {},
    data: {},
  });
  const [page, setPage] = useState(0);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const filteredOrders = useMemo(() => {
    return orders?.filter((order) => {
      return order.timestamp.seconds * 1000 > new Date().getTime() - 604800000; // Less than a week old
    });
  }, [orders]);

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  const navigateToChat = useCallback(
    async (data: any) => {
      await validateUser();

      const docRef = (await getDocs(collection(db, 'chatrooms'))).docs.flatMap(
        (doc) => doc
      );

      const orderDoc = docRef.find((rfq: any) => {
        return rfq.get('timestamp')?.seconds === data.timestamp.seconds;
      }, data.timestamp.seconds);

      if (orderDoc) navigate(`/otc/chat/${orderDoc.id}`);
      else console.log('Something went wrong');
    },
    [navigate, validateUser]
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  return (
    <Box>
      <TableContainer className="rounded-t-lg overflow-x-hidden border-umbra border border-b-0 max-h-80">
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
              <TableHeader align="center">Ask Price</TableHeader>
              <TableHeader align="right">Quote</TableHeader>
              <TableHeader align="right">Dealer</TableHeader>
              <TableHeader align="right">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 &&
              filteredOrders
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                ?.map((row, i) => (
                  <TableRow key={i}>
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
                    <TableBodyCell align="left">{row.base}</TableBodyCell>
                    <TableBodyCell align="center" textColor="text-green-400">
                      {row.amount}
                    </TableBodyCell>
                    <TableBodyCell align="center" textColor="text-down-bad">
                      {row.price}
                    </TableBodyCell>
                    <TableBodyCell align="right">{row.quote}</TableBodyCell>
                    <TableBodyCell align="right">
                      <Box className="flex-col">
                        <Typography variant="h6">
                          {smartTrim(row.dealer, 10)}
                        </Typography>
                        <Typography variant="h6" className="text-stieglitz">
                          {smartTrim(row.dealerAddress, 10)}
                        </Typography>
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      <CustomButton
                        size="small"
                        key="transfer-options"
                        color="umbra"
                        onClick={() => {
                          navigateToChat(row);
                        }}
                        className="text-white rounded px-3 py-1 hover:bg-mineshaft"
                        disabled={row.isFulfilled}
                      >
                        Enter Chat
                      </CustomButton>
                      <IconButton
                        size="small"
                        onClick={handleClickMenu}
                        className="text-white rounded px-0 ml-1 py-1 bg-umbra hover:bg-mineshaft"
                        // disabled={row.isFulfilled}
                        disableRipple
                      >
                        <MoreVertIcon className="fill-current text-white p-0 m-0" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        classes={{ paper: 'bg-umbra text-white' }}
                      >
                        {/* <MenuItem
                          className="px-2 py-1"
                          onClick={() =>
                            setDialogState((prevState) => ({
                              ...prevState,
                              open: true,
                            }))
                          }
                          disabled
                        >
                          Close
                        </MenuItem> */}
                        <MenuItem
                          className="px-2 py-1"
                          onClick={() => {}} //todo: place bids and display highest bid in table?
                          disabled
                        >
                          Bid
                        </MenuItem>
                      </Menu>
                      {/* <CustomButton
                    color="umbra"
                    size="small"
                    key="bid"
                    onClick={() =>
                      setDialogState((prevState) => ({
                        ...prevState,
                        open: true,
                      }))
                    }
                    className="text-white rounded px-3 py-1"
                    disabled={row.isFulfilled}
                  >
                    Bid
                  </CustomButton> */}
                      <CloseRfqDialog
                        open={dialogState.open}
                        handleClose={handleClose}
                        data={row}
                      />
                    </TableBodyCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {filteredOrders.length === 0 && (
          <TableFooter className="flex justify-center bg-cod-gray w-full text-center py-2">
            <Typography variant="h6" className="text-stieglitz my-2 w-full">
              No trade deals available
            </Typography>
          </TableFooter>
        )}
      </TableContainer>
      {filteredOrders.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={filteredOrders?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={ROWS_PER_PAGE}
          className="text-stieglitz border  border-t-0 border-umbra flex justify-center bg-cod-gray rounded-b-lg"
          ActionsComponent={TablePaginationActions}
        />
      ) : null}
    </Box>
  );
};

export default IndicativeRfqTable;
