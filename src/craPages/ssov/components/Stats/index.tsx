import { useContext, useMemo } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

import Typography from 'components/UI/Typography';
import ArrowUpIcon from 'components/Icons/ArrowUpIcon';
import FlagIcon from 'components/Icons/FlagIcon';

import { WalletContext } from 'contexts/Wallet';
import { BnbConversionContext } from 'contexts/BnbConversion';

const STRIKE_INDEX_TO_COLOR = {
  0: '#F80196',
  1: '#FF617D',
  2: '#F09242',
  3: '#FFE600',
  4: '#6DFFB9',
};

const Stats = ({
  activeSsovContextSide,
}: {
  activeSsovContextSide: string;
}) => {
  const { chainId } = useContext(WalletContext);
  const { convertToBNB } = useContext(BnbConversionContext);
  const ssovContext = useContext(SsovContext);
  const { tokenName, tokenPrice } = ssovContext[activeSsovContextSide].ssovData;

  const {
    epochStrikes,
    totalEpochOptionsPurchased,
    totalEpochStrikeDeposits,
    totalEpochPremium,
  } = ssovContext[activeSsovContextSide].ssovEpochData;

  const totalPurchased: number = useMemo(() => {
    let total: number = 0;
    totalEpochOptionsPurchased.map(
      (amount) =>
        (total += getUserReadableAmount(
          amount,
          getTokenDecimals(tokenName, chainId)
        ))
    );
    return total;
  }, [totalEpochOptionsPurchased]);

  const totalDeposits: number = useMemo(() => {
    let total: number = 0;
    totalEpochStrikeDeposits.map(
      (amount) =>
        (total += getUserReadableAmount(
          amount,
          getTokenDecimals(tokenName, chainId)
        ))
    );
    return total;
  }, [totalEpochStrikeDeposits]);

  return ssovContext[activeSsovContextSide].selectedEpoch > 0 ? (
    <Box>
      <Typography variant="h4" className="text-white mb-7">
        Stats
      </Typography>
      <Box className="flex">
        <Box className="w-1/2 pr-2.5">
          <Box
            className={
              'p-3 pl-4 pr-4 rounded-xl rounded-br-none rounded-bl-none border-[0.1px] border-b-0 border-gray-600 w-full'
            }
          >
            <Typography variant="h5" className="text-stieglitz">
              Purchased
            </Typography>
            <Box className="h-[9.5em] flex relative">
              <img
                src={'/assets/chart-placeholder.png'}
                className={'w-full blur-sm'}
              />
              <Typography
                variant="h5"
                className="text-stieglitz ml-auto mr-auto mt-auto mb-auto text-sm opacity-90 absolute left-[40%] top-[45%]"
              >
                Not available yet
              </Typography>
            </Box>
          </Box>
          <Box className={'w-full flex'}>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none border-r-none rounded-br-none border-[0.1px] border-gray-600 w-1/2'
              }
            >
              <Typography variant="h4" className="text-white mb-1">
                {formatAmount(totalPurchased, 2)} {tokenName}
              </Typography>
              <Typography variant="h5" className="text-stieglitz">
                Total
              </Typography>
            </Box>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none rounded-bl-none border-[0.1px] border-gray-600 w-1/2'
              }
            >
              <Typography variant="h4" className="text-white mb-1">
                {formatAmount(totalPurchased / totalDeposits, 2)}%
              </Typography>
              <Typography variant="h5" className="text-stieglitz">
                Utilization
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="w-1/2 pl-2.5">
          <Box
            className={
              'p-3 pl-4 pr-4 pb-0 rounded-xl rounded-br-none rounded-bl-none border-[0.1px] border-b-0 border-gray-600 w-full'
            }
          >
            <Box className="flex mb-4">
              <Typography variant="h5" className="text-stieglitz">
                Premiums Collected
              </Typography>
              <ArrowUpIcon className="mr-1 ml-auto mt-1.5 rotate-180 cursor-not-allowed" />
            </Box>
            {epochStrikes.map((strike, strikeIndex) => (
              <Box className="flex" key={strikeIndex}>
                <Box
                  className={`rounded-md flex mb-4 p-2 pt-1 pb-1 bg-cod-gray`}
                >
                  <FlagIcon
                    className={'mt-[6px] mr-1.5'}
                    fill={STRIKE_INDEX_TO_COLOR[strikeIndex]}
                  />
                  <Typography
                    variant={'h6'}
                    className={'text-sm text-stieglitz'}
                  >
                    ${getUserReadableAmount(strike, 8)}
                  </Typography>
                </Box>
                <Typography
                  variant={'h6'}
                  className={
                    'text-sm text-stieglitz mt-1 ml-auto mr-2 opacity-60'
                  }
                >
                  $
                  {formatAmount(
                    activeSsovContextSide === 'CALL'
                      ? getUserReadableAmount(
                          totalEpochPremium[strikeIndex],
                          getTokenDecimals(tokenName, chainId)
                        ) * getUserReadableAmount(tokenPrice, 8)
                      : getUserReadableAmount(
                          totalEpochPremium[strikeIndex],
                          getTokenDecimals(tokenName, chainId)
                        ),
                    2
                  )}
                </Typography>
                <Typography
                  variant={'h6'}
                  className={'text-sm text-white mt-1 mr-0'}
                >
                  {formatAmount(
                    activeSsovContextSide === 'CALL'
                      ? getUserReadableAmount(
                          totalEpochPremium[strikeIndex],
                          getTokenDecimals(tokenName, chainId)
                        )
                      : getUserReadableAmount(
                          totalEpochPremium[strikeIndex],
                          getTokenDecimals(tokenName, chainId)
                        ) / getUserReadableAmount(tokenPrice, 8),
                    2
                  )}{' '}
                  {tokenName}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box className={'w-full flex'}>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none border-r-none border-[0.1px] border-gray-600 w-full'
              }
            >
              <Tooltip title={'Not implemented yet'}>
                <Box className="flex mb-1">
                  <Typography variant="h5" className="text-stieglitz">
                    APR
                  </Typography>
                  <ArrowUpIcon className="mr-1 ml-auto mt-2 rotate-240 opacity-50 hover:opacity-70 cursor-not-allowed" />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Stats;
