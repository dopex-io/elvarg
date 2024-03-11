import React from 'react';
import { mantle } from 'viem/chains';

import { useNetwork } from 'wagmi';

const MantleIntegration = () => {
  const { chain } = useNetwork();
  if (chain && chain.id === mantle.id) return null;
  return (
    <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
      <span className="flex w-full justify-between">
        <h6 className="flex items-center justify-center space-x-1 text-xs">
          <img src="/images/tokens/dpx.svg" alt="dpx" className="h-[18px]" />
          <span>NEW: CLAMM on Mantle Mainnet</span>
        </h6>
      </span>
      <p className="text-stieglitz text-xs">
        We have deployed CLAMM on Mantle Mainnet for the markets: WMNT/USDT,
        WETH/USDC and WETH/USDT.
        <a
          className="text-wave-blue font-medium underline"
          href="https://blog.dopex.io/articles/clamm-upgrade-realising-strykes-vision"
          target="_blank"
        >
          Read more
        </a>
      </p>
    </div>
  );
};

export default MantleIntegration;
