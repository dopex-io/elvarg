import { FC } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { useBoundStore } from 'store';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

interface StatsProps {}

const Stats: FC<StatsProps> = ({}) => {
  const { tokenPrices, zdteData, staticZdteData } = useBoundStore();

  const tokenSymbol = staticZdteData?.baseTokenSymbol.toUpperCase();
  const quoteTokenSymbol = staticZdteData?.quoteTokenSymbol.toUpperCase();

  const tokenPrice =
    tokenPrices.find(
      (token) => token.name.toLowerCase() === tokenSymbol?.toLowerCase()
    )?.price || 0;

  if (
    zdteData === undefined ||
    tokenSymbol === undefined ||
    quoteTokenSymbol === undefined
  ) {
    return (
      <Box className="absolute left-[49%] top-[49%]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box className="flex items-center text-sm">
        <span className="lg:ml-2 bg-primary rounded-lg p-2 font-bold h-[fit-content]">
          BETA
        </span>
        <Box sx={{ p: 1 }} className="flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${tokenSymbol.toLowerCase()}.svg`}
            alt={tokenSymbol}
          />
          <img
            className="w-9 h-9 z-0"
            src={`/images/tokens/${quoteTokenSymbol.toLowerCase()}.svg`}
            alt={quoteTokenSymbol}
          />
        </Box>
        <Box className="ml-2 flex flex-col">
          <span className="h5 capitalize">zero day to expiry options</span>
          <span className="text-gray-500">{`${tokenSymbol}/${quoteTokenSymbol}`}</span>
        </Box>
        <span className="md:ml-4 text-xl ml-auto">
          ${formatAmount(tokenPrice, 2)}
        </span>
      </Box>
      <div className="grid grid-rows-4 grid-flow-col border border-neutral-800 md:grid-rows-2 rounded-xl text-sm">
        <div className="border border-neutral-800 md:rounded-tr-none rounded-t-xl p-2 flex justify-between">
          <span className="text-stieglitz">
            {`Available Call Liquidity (${tokenSymbol})`}
          </span>
          <span>
            {formatAmount(
              getUserReadableAmount(
                zdteData?.baseLpAssetBalance,
                DECIMALS_TOKEN
              ),
              2
            )}{' '}
            {tokenSymbol}
          </span>
        </div>
        <div className="border border-neutral-800 md:rounded-bl-xl rounded-none p-2 flex justify-between">
          <span className="text-stieglitz">
            {`Total Call Liquidity (${tokenSymbol})`}
          </span>
          <span>
            {formatAmount(
              getUserReadableAmount(
                zdteData?.baseLpTokenLiquidty,
                DECIMALS_TOKEN
              ),
              2
            )}{' '}
            {tokenSymbol}
          </span>
        </div>
        <div className="border border-neutral-800 md:rounded-tr-xl rounded-none p-2 flex justify-between">
          <span className="text-stieglitz">
            {`Available Put Liquidity (${quoteTokenSymbol})`}
          </span>
          <span>
            $
            {formatAmount(
              getUserReadableAmount(
                zdteData?.quoteLpAssetBalance,
                DECIMALS_USD
              ),
              2
            )}
          </span>
        </div>
        <div className="border border-neutral-800 md:rounded-bl-none rounded-b-xl p-2 flex justify-between">
          <span className="text-stieglitz">{`Total Put Liquidity (${quoteTokenSymbol})`}</span>
          <span>
            $
            {formatAmount(
              getUserReadableAmount(
                zdteData?.quoteLpTokenLiquidty,
                DECIMALS_USD
              ),
              2
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default Stats;
