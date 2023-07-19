import { useEffect, useState } from 'react';
import { utils as ethersUtils } from 'ethers';

import axios from 'axios';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';

import { DOPEX_API_BASE_URL } from 'constants/env';

import Stat from './Stat';
import SupplyChart from './SupplyChart';

const Overview = () => {
  const { vedpxData: data } = useBoundStore();

  const [dpxCirculatingSupply, setDpxCirculatingSupply] = useState(0);

  useEffect(() => {
    async function update() {
      const payload = await axios.get(`${DOPEX_API_BASE_URL}/v1/dpx/supply`);
      setDpxCirculatingSupply(payload.data.circulatingSupply);
    }
    update();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xl text-white mb-1">veDPX Overview</p>
        <p className="text-sm stieglitz">
          veDPX is escrowed (locked) DPX which can be used to earn yield,
          protocol fees and vote in the protocol.
        </p>
      </div>
      <div className="bg-cod-gray max-w-md rounded-xl mb-6">
        <div className="grid grid-cols-3">
          <Stat
            name="veDPX Supply"
            value={formatAmount(
              ethersUtils.formatEther(data.vedpxTotalSupply),
              2,
              true,
            )}
          />
          <Stat
            name="Total Locked DPX"
            value={formatAmount(
              ethersUtils.formatEther(data.dpxLocked),
              2,
              true,
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
        </div>
        <div className="w-full h-40 p-3">
          <SupplyChart />
        </div>
      </div>
    </div>
  );
};

export default Overview;
