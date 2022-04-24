import { useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import grey from '@mui/material/colors/grey';
import { collection, getDocs } from 'firebase/firestore';
import format from 'date-fns/format';
import delay from 'lodash/delay';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import CustomButton from 'components/UI/CustomButton';
import CustomMenu from 'craPages/otc/components/CustomMenu';
import IndicativeRfqsSm from 'craPages/otc/body/Orders/IndicativeRfqs/IndicativeRfqsSm';

import { OtcContext } from 'contexts/Otc';

import smartTrim from 'utils/general/smartTrim';
import { db } from 'utils/firebase/initialize';
import formatAmount from 'utils/general/formatAmount';
import getAssetFromOptionSymbol from 'utils/general/getAssetFromOptionSymbol';

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

interface IndicativeRfqsProps {
  smViewport: boolean;
  filterFulfilled: boolean;
  handleFilterFulfilled: () => void;
}

const IndicativeRfqs = (props: IndicativeRfqsProps) => {
  const { smViewport, filterFulfilled, handleFilterFulfilled } = props;
  const { orders, validateUser } = useContext(OtcContext);

  const navigate = useNavigate();

  const [copyState, setCopyState] = useState('Copy Address');
  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleCopy = useCallback((address: string) => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(address);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      return (
        order.data.timestamp.seconds * 1000 >
          new Date().getTime() - 604800 * 1000 &&
        (filterFulfilled ? !order.data.isFulfilled : true)
      ); // Less than a week old
    });
  }, [orders, filterFulfilled]);

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

  return !smViewport ? (
    <Box>
      <TableContainer className="rounded-t-lg border-umbra border border-b-0 max-h-80 overflow-auto p-0">
        <Table aria-label="rfq-table" className="bg-umbra">
          <TableHead>
            <TableRow>
              <TableHeader>Asset</TableHeader>
              <TableHeader align="left">Status</TableHeader>
              <TableHeader align="left" textColor="white">
                Open
              </TableHeader>
              <TableHeader align="left">Option</TableHeader>
              <TableHeader align="center">Size</TableHeader>
              <TableHeader align="center">Bid</TableHeader>
              <TableHeader align="center">Ask</TableHeader>
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
                    <TableBodyCell align="left">
                      <img
                        src={`/assets/${getAssetFromOptionSymbol(
                          row.data.base
                        ).toLowerCase()}.svg`}
                        alt={getAssetFromOptionSymbol(row.data.base)}
                        className="w-[2em] h-[2em]"
                      />
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
                    <TableBodyCell align="center">
                      {formatAmount(row.data.amount, 3, true)}
                    </TableBodyCell>
                    <TableBodyCell
                      align="center"
                      textColor="text-down-bad"
                      fill="bg-umbra"
                    >
                      <Box className="bg-cod-gray p-1 px-2 rounded-md text-center">
                        {row.data.isBuy
                          ? formatAmount(row.data.price, 3, true)
                          : '-'}
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell
                      align="center"
                      textColor="text-emerald-500"
                      fill="bg-umbra"
                    >
                      <Box className="bg-cod-gray p-1 px-2 rounded-md text-center">
                        {row.data.isBuy
                          ? '-'
                          : formatAmount(row.data.price, 3, true)}
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      {row.data.quote}
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      <Box className="flex-col">
                        <Typography variant="h6">
                          {smartTrim(row.data.dealer, 10)}
                        </Typography>
                        <Tooltip
                          className="h-4 text-stieglitz"
                          title={copyState}
                          arrow={true}
                        >
                          <Box className="flex justify-end">
                            <Typography
                              variant="h6"
                              className="text-stieglitz"
                              role="button"
                              onClick={() => handleCopy(row.data.dealerAddress)}
                            >
                              {smartTrim(row.data.dealerAddress, 8)}
                            </Typography>
                          </Box>
                        </Tooltip>
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
                        <CustomMenu
                          id={row.id}
                          data={row.data}
                          actions={['View RFQ', 'Close RFQ']}
                        />
                      </Box>
                    </TableBodyCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {filteredOrders.length === 0 && (
          <TableFooter
            component="div"
            className="flex justify-center bg-cod-gray w-full text-center py-2"
          >
            <Typography variant="h6" className="text-stieglitz my-2 w-full">
              No trade deals available
            </Typography>
          </TableFooter>
        )}
      </TableContainer>
      <Box className="text-stieglitz border border-t-0 border-umbra grid grid-cols-3 bg-cod-gray rounded-b-lg">
        <Box className="col-span-1" />
        <Box className="col-span-1">
          {filteredOrders.length > ROWS_PER_PAGE ? (
            <Box className="flex justify-around">
              <TablePagination
                component="div"
                rowsPerPageOptions={[ROWS_PER_PAGE]}
                count={filteredOrders?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={ROWS_PER_PAGE}
                ActionsComponent={TablePaginationActions}
                className="text-white self-end overflow-x-hidden"
              />
            </Box>
          ) : null}
        </Box>
        <Box className="col-span-1">
          <Box className="flex justify-end h-full mr-1">
            <Typography variant="h5" className="my-auto">
              Show Fulfilled
            </Typography>
            <Checkbox
              onClick={handleFilterFulfilled}
              sx={{
                color: grey[50],
              }}
              size="small"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <IndicativeRfqsSm
      filteredOrders={filteredOrders}
      page={page}
      handleChangePage={handleChangePage}
      handleFilterFulfilled={handleFilterFulfilled}
    />
  );
};

export default IndicativeRfqs;
