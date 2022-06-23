import { useContext, useEffect, useState } from 'react';
import { utils as ethersUtils } from 'ethers';
import axios from 'axios';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Stat from './Stat';
import SupplyChart from './SupplyChart';

import { VeDPXContext } from 'contexts/VeDPX';

import formatAmount from 'utils/general/formatAmount';

import { DOPEX_API_BASE_URL } from 'constants/index';

const Overview = () => {
  const { data } = useContext(VeDPXContext);

  const [dpxCirculatingSupply, setDpxCirculatingSupply] = useState(0);

  useEffect(() => {
    async function update() {
      const payload = await axios.get(`${DOPEX_API_BASE_URL}/v1/dpx/supply`);
      setDpxCirculatingSupply(payload.data.circulatingSupply);
    }
    update();
  }, []);

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
        <Box className="grid grid-cols-3">
          <Stat
            name="veDPX Supply"
            value={formatAmount(
              ethersUtils.formatEther(data.vedpxTotalSupply),
              2,
              true
            )}
          />
          <Stat
            name="Total Locked DPX"
            value={formatAmount(
              ethersUtils.formatEther(data.dpxLocked),
              2,
              true
            )}
          />
          <Stat
            name="Avg. Lock Time"
            value={`~${(
              4 *
              (Number(ethersUtils.formatEther(data.vedpxTotalSupply)) /
                Number(ethersUtils.formatEther(data.dpxLocked)))
            ).toFixed(2)} years`}
          />
          <Stat
            name="% Supply Locked"
            value={`${(
              (Number(ethersUtils.formatEther(data.dpxLocked)) /
                dpxCirculatingSupply) *
              100
            ).toFixed(2)}%`}
          />
          <Stat
            name="DPX Circ. Supply"
            value={`${formatAmount(dpxCirculatingSupply, 2, true)} DPX`}
          />
        </Box>
        <Box className="w-full h-40 p-3">
          <SupplyChart />
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
