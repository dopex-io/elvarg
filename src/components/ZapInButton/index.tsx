import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '../UI/Typography';
import formatAmount from '../../utils/general/formatAmount';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import ZapIcon from '../Icons/ZapIcon';
import PlusIcon from '../Icons/PlusIcon';
import ArrowUpIcon from '../Icons/ArrowUpIcon';
import { useMemo } from 'react';
import RedTriangleIcon from '../Icons/RedTriangleIcon';
import YellowTriangleIcon from '../Icons/YellowTriangleIcon';
import ReloadIcon from '../Icons/ReloadIcon';

export interface Props {
  openZapIn: () => void;
  isZapActive: boolean;
  quote: object;
  isFetchingPath: boolean;
  path: object;
  tokenName: string;
  ssovTokenSymbol: number;
  selectedTokenPrice: number;
  isZapInAvailable: boolean;
}

const ZapInButton = ({
  openZapIn,
  isZapActive,
  quote,
  isFetchingPath,
  path,
  tokenName,
  ssovTokenSymbol,
  selectedTokenPrice,
  isZapInAvailable,
}: Props) => {
  const pathPrice: number = useMemo(() => {
    return path['toTokenAmount'] / path['fromTokenAmount'];
  }, [path]);

  const quotePrice: number = useMemo(() => {
    return quote['toTokenAmount'] / quote['fromTokenAmount'];
  }, [quote]);

  const slippage: number = useMemo(() => {
    return (pathPrice / quotePrice - 1) * 100;
  }, [pathPrice, quotePrice]);

  const slippageStatus: string = useMemo(() => {
    if (Math.abs(slippage) > 3) return 'high';
    else if (Math.abs(slippage) > 20) return 'extreme';
    return 'inactive';
  }, [slippage]);

  const slippageStatusClassName: {} = {
    high: 'text-yellow-500',
    extreme: 'text-red-500',
    inactive: 'text-green-500',
  };

  return isZapInAvailable ? (
    path['error'] ? (
      <Box className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-700">
        <RedTriangleIcon className="mt-0.5 mr-2.5" />
        <Typography variant="h6" className="text-white">
          Impossible to find a route
        </Typography>
      </Box>
    ) : isFetchingPath ? (
      <Box className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-700">
        <ReloadIcon className="mt-1 mr-2.5" />
        <Typography variant="h6" className="text-white">
          Fetching best route...
        </Typography>
      </Box>
    ) : (
      <Tooltip
        className="text-stieglitz"
        title={
          !slippage ? (
            <span>
              You will swap{' '}
              {quote['fromToken'] ? quote['fromToken']['symbol'] : '-'} to{' '}
              {quote['toToken'] ? quote['toToken']['symbol'] : '-'}{' '}
            </span>
          ) : slippageStatus === 'inactive' ? (
            <span>
              Slippage is acceptable{' '}
              <span className={slippageStatusClassName[slippageStatus]}>
                ({formatAmount(slippage, 2)}%)
              </span>
            </span>
          ) : (
            <span>
              Attention! Slippage is {slippageStatus}{' '}
              <span className={slippageStatusClassName[slippageStatus]}>
                ({formatAmount(slippage, 2)}%)
              </span>
            </span>
          )
        }
        placement={'top'}
      >
        <Box
          className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-700 cursor-pointer hover:bg-neutral-600"
          onClick={openZapIn}
        >
          {slippageStatus === 'inactive' ? (
            <ZapIcon className="mt-1 mr-2.5" />
          ) : null}
          {slippageStatus === 'high' ? (
            <YellowTriangleIcon className="mt-0.5 mr-2.5" />
          ) : null}
          {slippageStatus === 'extreme' ? (
            <RedTriangleIcon className="mt-0.5 mr-2.5" />
          ) : null}

          <Typography variant="h6" className="text-white">
            {isZapActive ? (
              path['toTokenAmount'] ? (
                <span>
                  1 {tokenName} ={' '}
                  {path['toTokenAmount'] && formatAmount(pathPrice, 4)}{' '}
                  {ssovTokenSymbol}{' '}
                  <span className="opacity-70">
                    (~${formatAmount(selectedTokenPrice, 0)})
                  </span>
                </span>
              ) : (
                <span>
                  1 {tokenName} ={' '}
                  {quote['toTokenAmount'] &&
                    formatAmount(
                      getUserReadableAmount(
                        quote['toTokenAmount'],
                        quote['toToken']['decimals']
                      ),
                      8
                    )}{' '}
                  {ssovTokenSymbol}{' '}
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
    <Box className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-700">
      <YellowTriangleIcon className="mt-0.5 mr-2.5" />
      <Typography variant="h6" className="text-white">
        Zap in is not available
      </Typography>
    </Box>
  );
};

export default ZapInButton;
