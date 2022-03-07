import { useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import format from 'date-fns/format';
import TableFooter from '@material-ui/core/TableFooter';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import { collection, getDocs } from 'firebase/firestore';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import CustomButton from 'components/UI/CustomButton';
import CloseRfqDialog from '../dialogs/CloseRfqDialog'; // Move to chatroom
import Bid from '../dialogs/Bid';
import CustomMenu from '../CustomMenu';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
import { db } from 'utils/firebase/initialize';

const ROWS_PER_PAGE = 5;

const TableHeader = ({
  children,
  align = 'left',
  textColor = 'text-stieglitz',
  fill = 'bg-cod-gray',
}) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className={`${fill} border-umbra py-1`}
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

const IndicativeRfqTable = () => {
  const { orders, validateUser } = useContext(OtcContext);

  const navigate = useNavigate();

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      return (
        order.data.timestamp.seconds * 1000 >
        new Date().getTime() - 604800 * 1000
      ); // Less than a week old
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
              <TableHeader align="center">Qty</TableHeader>
              <TableHeader align="center">Total Bid/Ask</TableHeader>
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
                      {row.data.isBuy ? 'Buy' : 'Sell'}
                    </TableBodyCell>
                    <TableBodyCell align="left">
                      {row.data.isFulfilled ? 'Fulfilled' : 'Pending'}
                    </TableBodyCell>
                    <TableBodyCell align="left" textColor="white">
                      {format(
                        new Date(Number(row.data.timestamp.seconds) * 1000),
                        'd LLL yy'
                      )}
                    </TableBodyCell>
                    <TableBodyCell align="left">{row.data.base}</TableBodyCell>
                    <TableBodyCell align="center" textColor="text-green-400">
                      {row.data.amount}
                    </TableBodyCell>
                    <TableBodyCell
                      align="center"
                      textColor="text-down-bad"
                      fill="bg-umbra"
                    >
                      {row.data.price}
                    </TableBodyCell>
                    <TableBodyCell align="right" fill="bg-umbra">
                      {row.data.quote}
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      <Box className="flex-col">
                        <Typography variant="h6">
                          {smartTrim(row.data.dealer, 10)}
                        </Typography>
                        <Typography variant="h6" className="text-stieglitz">
                          {smartTrim(row.data.dealerAddress, 10)}
                        </Typography>
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      <Box className="flex">
                        <CustomButton
                          size="small"
                          key="transfer-options"
                          color="umbra"
                          onClick={() => {
                            navigateToChat(row.data);
                          }}
                          className="text-white rounded hover:bg-mineshaft"
                          disabled={row.data.isFulfilled}
                        >
                          Chat
                        </CustomButton>
                        <CustomMenu data={row} actionText={'Bid'} />
                      </Box>
                      <Bid
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
