import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import Checkbox from '@mui/material/Checkbox';
import grey from '@mui/material/colors/grey';
import { DocumentData } from 'firebase/firestore';

import Typography from 'components/UI/Typography';
import RfqCard from 'components/Otc/RfqCard';

import getAssetFromOptionSymbol from 'utils/general/getAssetFromOptionSymbol';

const ROWS_PER_PAGE = 4;

interface IndicativeRfqSmProps {
  filteredOrders: DocumentData[];
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

  return (
    <Box className="grid grid-flow-cols-1 space-y-4 mx-auto">
      {filteredOrders
        .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
        ?.map((row, index) => {
          const symbol = getAssetFromOptionSymbol(row.data.base);
          return (
            <RfqCard id={row.id} symbol={symbol} data={row.data} key={index} />
          );
        })}
      {filteredOrders.length > ROWS_PER_PAGE ? (
        <Box className="flex w-full bg-cod-gray rounded-2xl border border-mineshaft">
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
