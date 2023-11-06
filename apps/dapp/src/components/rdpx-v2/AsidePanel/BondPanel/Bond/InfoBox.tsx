import { useEffect } from 'react';
import { formatUnits, zeroAddress } from 'viem';

import { useAccount } from 'wagmi';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import Typography2 from 'components/UI/Typography2';

import { DECIMALS_USD } from 'constants/index';

const InfoBox = () => {
  const { address: user } = useAccount();

  const { updateRdpxV2CoreState, rdpxV2CoreState } = useRdpxV2CoreData({
    user: user ?? zeroAddress,
  });

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState]);

  return (
    <div className="flex flex-col border border-carbon rounded-xl p-3 space-y-2">
      <div className="flex divide-carbon justify-between">
        <Typography2 variant="caption" color="stieglitz">
          Discount Factor
        </Typography2>
        <Typography2 variant="caption">
          {formatUnits(rdpxV2CoreState.bondDiscountFactor, DECIMALS_USD)}
        </Typography2>
      </div>
      <div className="flex divide-carbon justify-between">
        <Typography2 variant="caption" color="stieglitz">
          Cap
        </Typography2>
        <Typography2 variant="caption" color="white" className="space-x-1">
          -<span className="text-stieglitz">/</span>-
          <span className="text-stieglitz">rtETH</span>
        </Typography2>
      </div>
    </div>
  );
};

export default InfoBox;
