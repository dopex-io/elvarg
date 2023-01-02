// import { useMemo, useCallback } from 'react';
// import { BigNumber } from 'ethers';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';

// import CustomButton from 'components/UI/Button';

// import { useBoundStore } from 'store';

const ClientRenderedCollatRatioChart = dynamic(() => import('./PriceChart'), {
  ssr: false,
});

const ClientRenderedPriceChart = dynamic(
  () => import('./CollateralRatioChart'),
  {
    ssr: false,
  }
);

const Charts = () => {
  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-1/2 sm:w-full">
        <ClientRenderedPriceChart data={[]} width={255} height={167.5} />
      </Box>
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-1/2 sm:w-full">
        <ClientRenderedCollatRatioChart data={[]} width={900} height={180} />
      </Box>
    </Box>
  );
};

export default Charts;
