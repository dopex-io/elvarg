import { useCallback } from 'react';
import { useRouter } from 'next/router';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useBoundStore } from 'store';

const TopBar = () => {
  const { selectedPoolName } = useBoundStore();

  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center">
        <div className="hidden md:flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/weth.svg`}
            alt={'weth'}
          />
          <img
            className="w-9 h-9 z-0"
            src={`/images/tokens/usdc.svg`}
            alt={'usdc'}
          />
        </div>
        <div className="flex flex-col ml-4">
          <span className="text-sm">Inu20</span>
          <span className="text-sm text-stieglitz">WETH/USDC</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
