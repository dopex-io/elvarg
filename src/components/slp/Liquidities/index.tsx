import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { BigNumber } from 'ethers';
import LiquiditiesChart from './LiquiditiesChart';
import { Typography } from 'components/UI';
import { useBoundStore } from 'store';

const nullLiquidityInterface = {
  write: BigNumber.from(0),
  purchase: BigNumber.from(0),
};

const Liquidities = () => {
  const { slpEpochData } = useBoundStore();

  const strikesLiqs = useMemo(() => {
    const sortedIndices = slpEpochData!.strikes
      .map((strike, idx) => ({ strike, idx }))
      .sort((a, b) => b.strike.toNumber() - a.strike.toNumber())
      .map((strikeLiq) => strikeLiq.idx);
    return sortedIndices.map((idx) => {
      return {
        strike: slpEpochData!.strikes[idx] || BigNumber.from(0),
        liquidity: slpEpochData!.liquidity[idx] || nullLiquidityInterface,
      };
    });
  }, [slpEpochData]);

  return (
    <Box>
      <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
        <Typography variant="h6" className="-ml-1 text-center">
          Total Liquidity Provided
        </Typography>
      </Box>
      <Box className="px-12">{LiquiditiesChart(strikesLiqs)}</Box>
    </Box>
  );
};

export default Liquidities;
