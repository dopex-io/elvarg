import { useContext } from 'react';
import Box from '@mui/material/Box';
import { utils as ethersUtils } from 'ethers';

import Typography from 'components/UI/Typography';

import { VeDPXContext } from 'contexts/VeDPX';

import formatAmount from 'utils/general/formatAmount';
import Stat from './Stat';
import SupplyChart from './SupplyChart';

const Overview = () => {
  const { data } = useContext(VeDPXContext);

  return (
    <Box>
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="mb-1">
          veDPX Overview
        </Typography>
        <Typography variant="h6" component="p" color="stieglitz">
          veDPX is escrowed (locked) DPX which can be used to earn yield,
          protocol fees and vote in the protocol.
        </Typography>
      </Box>
      <Box className="bg-cod-gray max-w-md rounded-xl mb-6">
        <Box className="grid grid-cols-2">
          <Stat
            name="veDPX Supply"
            value={formatAmount(
              ethersUtils.formatEther(data.vedpxTotalSupply),
              3
            )}
          />
          <Stat
            name="Total Locked DPX"
            value={formatAmount(ethersUtils.formatEther(data.dpxLocked), 3)}
          />
        </Box>
        <Box className="relative top-24 left-40">Coming Soon</Box>
        <Box className="w-full h-40 p-3 blur-sm">
          <SupplyChart />
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
