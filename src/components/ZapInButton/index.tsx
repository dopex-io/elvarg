import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import Typography from '../UI/Typography';

import ZapIcon from '../Icons/ZapIcon';
import PlusIcon from '../Icons/PlusIcon';
import ArrowUpIcon from '../Icons/ArrowUpIcon';
import RedTriangleIcon from '../Icons/RedTriangleIcon';
import YellowTriangleIcon from '../Icons/YellowTriangleIcon';

const SLIPPAGE_STATUS_CLASSES = {
  high: 'text-yellow-500',
  extreme: 'text-red-500',
  inactive: 'text-green-500',
};

export interface Props {
  openZapIn: () => void;
  isZapActive: boolean;
  quote: object;
  isFetchingPath: boolean;
  path: object;
  fromTokenSymbol: string;
  toTokenSymbol: string;
  selectedTokenPrice: number;
  isZapInAvailable: boolean;
  chainId: number;
  background?: string;
}

const ZapInButton = ({
  openZapIn,
  isZapActive,
  quote,
  isFetchingPath,
  path,
  fromTokenSymbol,
  toTokenSymbol,
  selectedTokenPrice,
  isZapInAvailable,
  background = 'bg-neutral-700',
}: Props) => {
  const pathPrice: number = useMemo(() => {
    if (!path['toTokenAmount']) return 0;
    return (
      getUserReadableAmount(
        path['toTokenAmount'],
        path['toToken']['decimals']
      ) /
      getUserReadableAmount(
        path['fromTokenAmount'],
        path['fromToken']['decimals']
      )
    );
  }, [path]);

  const quotePrice: number = useMemo(() => {
    if (!quote['toTokenAmount']) return 0;
    return (
      getUserReadableAmount(
        quote['toTokenAmount'],
        quote['toToken']['decimals']
      ) /
      getUserReadableAmount(
        quote['fromTokenAmount'],
        quote['fromToken']['decimals']
      )
    );
  }, [quote]);

  const slippage: number = useMemo(() => {
    return (pathPrice / quotePrice - 1) * 100;
  }, [pathPrice, quotePrice]);

  const slippageStatus: string = useMemo(() => {
    if (slippage <= -100) return 'inactive';
    else if (Math.abs(slippage) > 3) return 'high';
    else if (Math.abs(slippage) > 20) return 'extreme';
    return 'inactive';
  }, [slippage]);

  return isZapInAvailable ? (
    path['error'] ? (
      <Box
        className={`rounded-md flex mb-4 p-3 border border-neutral-800 w-full ${background}`}
      >
        <RedTriangleIcon className="ml-6 mt-0.5 mr-2.5" />

        <Typography variant="h6" className="text-white">
          Zap in Currently Disabled
        </Typography>
      </Box>
    ) : isFetchingPath ? (
      <Box
        className={`rounded-md flex mb-4 p-3 border border-neutral-800 w-full text-white ${background}`}
      >
        <CircularProgress color="inherit" size="17px" className="mr-3 mt-0.5" />
        <Typography variant="h6">Fetching best route...</Typography>
      </Box>
    ) : (
      <Tooltip
        className="text-stieglitz"
        title={
          !quote['toToken'] ? (
            ''
          ) : !slippage ? (
            <span>
              You will swap{' '}
              {quote['fromToken'] ? quote['fromToken']['symbol'] : '-'} to{' '}
              {quote['toToken'] ? quote['toToken']['symbol'] : '-'}{' '}
            </span>
          ) : slippageStatus === 'inactive' ? (
            <span>
              Slippage is acceptable{' '}
              <span className={SLIPPAGE_STATUS_CLASSES[slippageStatus]}>
                ({formatAmount(slippage, 2)}%)
              </span>
            </span>
          ) : (
            <span>
              Attention! Slippage is {slippageStatus}{' '}
              <span className={SLIPPAGE_STATUS_CLASSES[slippageStatus]}>
                ({formatAmount(slippage, 2)}%)
              </span>
            </span>
          )
        }
        placement={'top'}
      >
        <Box
          className={`rounded-md flex mb-4 p-3 border border-neutral-800 w-full cursor-pointer ${background} hover:opacity-90`}
          onClick={openZapIn}
        >
          {slippageStatus === 'inactive' || !isZapActive ? (
            <ZapIcon className="mt-1 mr-2.5" id="2" />
          ) : null}
          {slippageStatus === 'high' && isZapActive ? (
            <YellowTriangleIcon className="mt-0.5 mr-2.5" />
          ) : null}
          {slippageStatus === 'extreme' && isZapActive ? (
            <RedTriangleIcon className="mt-0.5 mr-2.5" />
          ) : null}
          <Typography variant="h6" className="text-white">
            {isZapActive ? (
              path['toTokenAmount'] ? (
                <span>
                  1 {fromTokenSymbol} ={' '}
                  {path['toTokenAmount'] && formatAmount(pathPrice, 4)}{' '}
                  {toTokenSymbol}{' '}
                  <span className="opacity-70">
                    (~${formatAmount(selectedTokenPrice, 0)})
                  </span>
                </span>
              ) : (
                <span>
                  1 {fromTokenSymbol} ={' '}
                  {quote['toTokenAmount'] &&
                    formatAmount(
                      getUserReadableAmount(
                        quote['toTokenAmount'],
                        quote['toToken']['decimals']
                      ),
                      8
                    )}{' '}
                  {toTokenSymbol}{' '}
                  <span className="opacity-70">
                    (~${formatAmount(selectedTokenPrice, 0)})
                  </span>
                </span>
              )
            ) : (
              'Zap In'
            )}
          </Typography>

          {isZapActive ? (
            <ArrowUpIcon className="mr-1 ml-auto mt-1.5 rotate-90" />
          ) : (
            <PlusIcon className="mr-0 ml-auto mt-0.5" />
          )}
        </Box>
      </Tooltip>
    )
  ) : (
    <Box
      className={`rounded-md flex mb-4 p-3 border border-neutral-800 w-full ${background}`}
    >
      <YellowTriangleIcon className="mt-0.5 mr-2.5" />
      <Typography variant="h6" className="text-white">
        Zap is temporarily not available
      </Typography>
    </Box>
  );
};

export default ZapInButton;
