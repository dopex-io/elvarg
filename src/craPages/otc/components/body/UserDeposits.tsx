import { useState, useCallback, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

import Typography from 'components/UI/Typography';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
import CustomButton from 'components/UI/CustomButton';
import Withdraw from '../dialogs/Withdraw';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const ROWS_PER_PAGE = 4;

const TableHeader = ({
  children,
  align = 'left',
  textColor = 'text-stieglitz',
}) => {
  return (
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

const UserDeposits = () => {
  const { userDepositsData } = useContext(OtcContext);

  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [userDeposits, setUserDeposits] = useState([]);
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
    setUserDeposits(userDepositsData);
  }, [userDepositsData]);

  return (
    <Box>
      {userDepositsData.length === 0 ? (
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
      ) : (
        <TableContainer className="rounded-t-lg overflow-x-hidden border-umbra border border-b-0 max-h-80">
          <Table aria-label="rfq-table">
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
                <TableHeader align="right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody component="tbody">
              {userDeposits.length > 0 &&
                userDeposits
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
                          {row.base.symbol}
                        </TableBodyCell>
                        <TableBodyCell
                          align="center"
                          textColor="text-green-400"
                        >
                          {getUserReadableAmount(row.amount, 18).toString()}
                        </TableBodyCell>
                        <TableBodyCell align="right" textColor="text-white">
                          {row.quote.symbol}
                        </TableBodyCell>
                        <TableBodyCell align="right" textColor="text-down-bad">
                          {getUserReadableAmount(row.price, 18).toString()}{' '}
                        </TableBodyCell>
                        <TableBodyCell align="right">
                          {smartTrim(row.dealer, 10)}
                        </TableBodyCell>
                        <TableBodyCell align="right">
                          <CustomButton
                            size="small"
                            color="umbra"
                            className="hover:bg-mineshaft"
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
      )}
      {userDeposits.length > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={userDeposits?.length}
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

export default UserDeposits;
