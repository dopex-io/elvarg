import { useState } from 'react';

import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';

import displayAddress from 'utils/general/displayAddress';

import { useBoundStore } from 'store';

import PositionsTable from './PositionsTable';

const Positions = () => {
  const { accountAddress, ensName } = useBoundStore();
  const [activeTab, setActiveTab] = useState<string>('Open');

  return (
    <Box className="text-gray-400 w-full rounded-lg">
      <Box className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <Box className="flex ml-3">
          <Box className="rounded-md bg-neutral-700 flex mb-2 mt-3 h-auto">
            <Typography variant="h6" className="ml-auto p-1">
              {displayAddress(accountAddress, ensName)}
            </Typography>
          </Box>
          <ButtonGroup className="flex w-32 justify-between bg-cod-gray border border-umbra rounded-lg mb-3 ml-auto mr-4 mt-1">
            {['Open', 'Closed'].map((label, index) => (
              <Button
                key={index}
                className={`border-0 hover:border-0 w-full m-1 p-1 transition ease-in-out duration-500 ${
                  activeTab === label
                    ? 'text-white bg-carbon hover:bg-carbon'
                    : 'text-stieglitz bg-transparent hover:bg-transparent'
                } hover:text-white`}
                disableRipple
                onClick={() => setActiveTab(label)}
              >
                <Typography variant="h6">{label}</Typography>
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>
      <Box className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <PositionsTable tab={activeTab} />
      </Box>
    </Box>
  );
};

export default Positions;
