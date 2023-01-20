import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import PositionsTable from './PositionsTable';

import { useBoundStore } from 'store';

import displayAddress from 'utils/general/displayAddress';


const Positions = () => {
  const { accountAddress, ensName } = useBoundStore();

  return (
    <Box className="text-gray-400 w-full rounded-lg">
      <Box className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <Box className="flex ml-3">
          <Box className="rounded-md bg-neutral-700 flex mb-2 mt-1">
            <Typography variant="h6" className="ml-auto p-1">
              {displayAddress(accountAddress, ensName)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <PositionsTable />
      </Box>
    </Box>
  );
};

export default Positions;
