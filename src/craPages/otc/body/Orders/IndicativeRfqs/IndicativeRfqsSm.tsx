import { useState, useCallback } from 'react';
import delay from 'lodash/delay';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { format } from 'date-fns';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import grey from '@mui/material/colors/grey';

import Typography from 'components/UI/Typography';
import CustomMenu from '../../../components/CustomMenu';

import formatAmount from 'utils/general/formatAmount';
import getAssetFromOptionSymbol from 'utils/general/getAssetFromOptionSymbol';
import smartTrim from 'utils/general/smartTrim';

const ROWS_PER_PAGE = 4;

interface IndicativeRfqSmProps {
  filteredOrders: any[];
  page: number;
  handleChangePage: (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleFilterFulfilled: () => void;
}

const IndicativeRfqsSm = (props: IndicativeRfqSmProps) => {
  const { filteredOrders, page, handleChangePage, handleFilterFulfilled } =
    props;

  const [copyState, setCopyState] = useState('Copy Address');

  const handleCopy = useCallback((address: string) => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(address);
  }, []);

  return (
    <Box className="grid grid-flow-cols-1 space-y-4 mx-auto">
      {filteredOrders
        .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
        ?.map((row, index) => {
          const symbol = getAssetFromOptionSymbol(row.data.base);
          return (
            <Box
              className="flex flex-col col-span-1 p-2 bg-cod-gray rounded-xl border border-mineshaft space-y-2 px-4 py-4"
              key={index}
            >
              <Box className="flex justify-between">
                <Box className="flex space-x-2 w-2/3">
                  <img
                    src={`/assets/${symbol.toUpperCase()}.svg`}
                    alt={symbol.toUpperCase()}
                    className="w-[2em] h-[2em]"
                  />
                  <Typography variant="h6" className="text-white my-auto">
                    {row.data.base}
                  </Typography>
                </Box>
                <Box className="flex">
                  <Typography
                    variant="h6"
                    className={`font-bold text-${
                      row.data.isBuy ? 'primary' : 'down-bad'
                    } self-center ${
                      row.data.isBuy ? 'bg-primary' : 'bg-down-bad'
                    } bg-opacity-50 px-2 py-1 rounded-md border border-${
                      row.data.isBuy ? 'primary' : 'down-bad'
                    }`}
                  >
                    {row.data.isBuy ? 'BUY' : 'SELL'}
                  </Typography>
                  <CustomMenu data={row} actions={['View RFQ', 'Close RFQ']} />
                </Box>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Position Size
                </Typography>
                <Typography variant="h6" className="text-white">
                  {Number(row.data.amount)} {row.data.base}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Status
                </Typography>
                <Typography variant="h6" className="text-white">
                  {row.data.isFulfilled ? 'Closed' : 'Open'}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Bid
                </Typography>
                <Typography variant="h6" className="text-white">
                  {row.data.isBuy ? formatAmount(row.data.price, 3, true) : '-'}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Ask
                </Typography>
                <Typography variant="h6" className="text-white">
                  {!row.data.isBuy
                    ? formatAmount(row.data.price, 3, true)
                    : '-'}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Expiry
                </Typography>
                <Typography variant="h6" className="text-white">
                  {format(
                    new Date(
                      Number(row.data.timestamp.seconds + 604800) * 1000
                    ),
                    'H:mm d LLL'
                  )}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Dealer
                </Typography>
                <Box className="flex flex-col text-right">
                  <Box className="flex flex-row">
                    <Tooltip
                      className="h-4 text-stieglitz"
                      title={copyState}
                      arrow={true}
                    >
                      <IconButton
                        onClick={() => handleCopy(row.data.dealerAddress)}
                        className="p-0"
                      >
                        <ContentCopyIcon className="fill-current text-stieglitz p-1" />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="h6" className="text-white">
                      {smartTrim(row.data.dealerAddress, 12)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" className="text-stieglitz">
                    {row.data.dealer}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      {filteredOrders.length > ROWS_PER_PAGE ? (
        <Box className="flex mx-auto bg-cod-gray rounded-2xl border border-mineshaft">
          <TablePagination
            component="div"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={filteredOrders?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            ActionsComponent={TablePaginationActions}
            className="text-white"
          />
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
      ) : null}
    </Box>
  );
};

export default IndicativeRfqsSm;
