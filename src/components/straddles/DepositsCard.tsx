import React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import DepositsTable from './DepositsTable';
import Typography from 'components/UI/Typography';

const DepositsCard = () => {
  return (
    <Box className="text-gray-400 w-full rounded-lg">
      <Box className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <Box className="flex ml-3">
          <Box className="rounded-md bg-neutral-700 flex mb-2 mt-1">
            <img
              className="w-6 h-6 m-1"
              src="images/misc/avatar.svg"
              alt={'profile_pic'}
            />
            <Typography variant="h6" className="ml-auto mr-2 pt-1">
              James.eth
            </Typography>
          </Box>
          <Box className="flex ml-3">
            <Checkbox defaultChecked size="small" className="-mt-1 -mx-1" />
            <Box className="flex pt-2">
              <Typography variant="h6" className="text-gray-400 mr-1">
                Show Previous Epochs
              </Typography>
              <Typography variant="h6" className="text-white mx-1">
                (0)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <DepositsTable />
      </Box>
    </Box>
  );
};

export default DepositsCard;
