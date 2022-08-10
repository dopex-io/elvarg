import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from 'components/UI/Typography';
import displayAddress from 'utils/general/displayAddress';
import { WalletContext } from 'contexts/Wallet';
import DepositsTable from './DepositsTable';

const isShowPreviousEpochVisible = false;

const Deposits = () => {
  const { accountAddress, ensName } = useContext(WalletContext);

  return (
    <Box className="text-gray-400 w-full rounded-lg">
      <Box className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <Box className="flex ml-3">
          <Box className="rounded-md bg-neutral-700 flex mb-2 mt-1">
            <Typography variant="h6" className="ml-auto p-1">
              {displayAddress(accountAddress, ensName)}
            </Typography>
          </Box>
          {isShowPreviousEpochVisible ? (
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
          ) : null}
        </Box>
      </Box>
      <Box className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <DepositsTable />
      </Box>
    </Box>
  );
};

export default Deposits;