import { useState, useCallback, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from 'components/UI/TablePaginationActions';

import CustomButton from 'components/UI/CustomButton';
import Withdraw from 'components/Otc/Dialogs/Withdraw';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const ROWS_PER_PAGE = 4;

const TableHeader = ({ children, align = 'left', textColor = 'stieglitz' }) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className="bg-cod-gray border-1 border-umbra py-1"
    >
      <Typography variant="body2" className={`text-${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const TableBodyCell = ({
  children,
  align = 'left',
  textColor = 'stieglitz',
  fill = 'bg-cod-gray',
}) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="td"
      className={`${fill} border-0 py-2`}
    >
      <Typography variant="body2" className={`text-${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const UserOrders = () => {
  const { userDepositsData, loaded } = useContext(OtcContext);

  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [userOrders, setUserOrders] = useState([]);
  const [dialogState, setDialogState] = useState({
    open: false,
    data: {},
    handleClose: () => {},
  });

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false, data: {} }));
  }, []);

  useEffect(() => {
    setUserOrders(userDepositsData);
  }, [loaded, userDepositsData, userOrders]);

  return (
    <Box className="space-y-4">
      <Typography variant="body1" className="font-bold">
        Your Orders
      </Typography>
      {!loaded ? (
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
      ) : userOrders.length > 0 ? (
        <TableContainer
          className={`rounded${
            userOrders.length > ROWS_PER_PAGE ? '-t-' : '-'
          }lg border-umbra border border-b-0 max-h-80`}
        >
          <Table aria-label="rfq-table">
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
                <TableHeader align="center">Total Price</TableHeader>
                <TableHeader align="right">Counter Party</TableHeader>
                <TableHeader align="right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody component="tbody">
              {userOrders
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                ?.map((row, i) => {
                  return (
                    <TableRow key={i}>
                      <TableBodyCell align="left" textColor="white">
                        {row.isBuy ? 'Buy' : 'Sell'}
                      </TableBodyCell>
                      <TableBodyCell align="left">
                        {row.isBuy ? row.base.symbol : row.quote.symbol}
                      </TableBodyCell>
                      <TableBodyCell align="center">
                        {getUserReadableAmount(row.amount, 18).toString()}
                      </TableBodyCell>
                      <TableBodyCell
                        align="center"
                        textColor="down-bad"
                        fill="bg-umbra"
                      >
                        <Box className="bg-cod-gray p-1 px-2 rounded-md text-center">
                          {row.isBuy
                            ? formatAmount(
                                Number(getUserReadableAmount(row.price, 18)) /
                                  Number(getUserReadableAmount(row.amount, 18)),
                                5
                              )
                            : '-'}
                        </Box>
                      </TableBodyCell>
                      <TableBodyCell
                        align="center"
                        textColor="emerald-500"
                        fill="bg-umbra"
                      >
                        <Box className="bg-cod-gray p-1 px-2 rounded-md text-center">
                          {!row.isBuy
                            ? formatAmount(
                                Number(getUserReadableAmount(row.price, 18)) /
                                  Number(getUserReadableAmount(row.amount, 18)),
                                5
                              )
                            : '-'}
                        </Box>
                      </TableBodyCell>
                      <TableBodyCell align="right">
                        {row.isBuy ? row.quote.symbol : row.base.symbol}
                      </TableBodyCell>
                      <TableBodyCell align="right">
                        {getUserReadableAmount(row.price, 18)}{' '}
                        {row.isBuy ? row.quote.symbol : row.base.symbol}
                      </TableBodyCell>
                      <TableBodyCell align="right">
                        {smartTrim(row.counterParty, 10)}
                      </TableBodyCell>
                      <TableBodyCell align="right">
                        <CustomButton
                          size="small"
                          color="red-500"
                          className="hover:bg-red-600"
                          onClick={() => {
                            setIndex(i);
                            setDialogState({
                              open: true,
                              data: userDepositsData[index],
                              handleClose,
                            });
                          }}
                        >
                          Withdraw
                        </CustomButton>
                        <Withdraw
                          open={dialogState.open}
                          handleClose={handleClose}
                          data={userDepositsData[index]}
                        />
                      </TableBodyCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box className="flex mx-auto justify-around py-8 bg-cod-gray rounded-xl border border-umbra">
          <Typography variant="body1" className="text-stieglitz">
            No Orders Placed
          </Typography>
        </Box>
      )}
      {userOrders.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={userOrders?.length}
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

export default UserOrders;
