import { useContext } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { RateVaultContext } from 'contexts/RateVault';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import Typography from 'components/UI/Typography';

import ArrowUpIcon from 'svgs/icons/ArrowUpIcon';
import FlagIcon from 'svgs/icons/FlagIcon';

const STRIKE_INDEX_TO_COLOR = {
  0: '#F80196',
  1: '#FF617D',
  2: '#F09242',
  3: '#FFE600',
  4: '#6DFFB9',
};

const Stats = ({
  activeVaultContextSide,
}: {
  activeVaultContextSide: string;
}) => {
  const rateVaultContext = useContext(RateVaultContext);

  const {
    totalCallsPurchased,
    totalPutsPurchased,
    totalCallsDeposits,
    totalPutsDeposits,
  } = rateVaultContext.rateVaultEpochData;

  return rateVaultContext?.rateVaultEpochData?.epochStrikes ? (
    <Box>
      <Typography variant="h4" className="text-white mb-7">
        Stats
      </Typography>
      <Box className="lg:flex">
        <Box className="lg:w-1/2 lg:pr-2.5 lg:mb-0 mb-5">
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
                alt="Chart"
                src="/assets/chart-placeholder.png"
                className="w-full blur-sm"
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
                $
                {formatAmount(
                  totalCallsPurchased.add(totalPutsPurchased).toNumber(),
                  2
                )}
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
                {totalCallsDeposits.add(totalPutsDeposits).gt(0)
                  ? formatAmount(
                      getUserReadableAmount(
                        totalCallsPurchased
                          .add(totalPutsPurchased)
                          .div(totalCallsDeposits.add(totalPutsDeposits)),
                        18
                      ),
                      2
                    )
                  : 0}
                %
              </Typography>
              <Typography variant="h5" className="text-stieglitz">
                Utilization
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="lg:w-1/2 lg:pl-2.5 lg:mb-0 mb-5">
          <Box
            className={
              'p-3 pl-4 pr-4 pb-0 rounded-xl rounded-br-none rounded-bl-none border-[0.1px] border-b-0 border-gray-600 w-full'
            }
          >
            <Box className="flex mb-4">
              <Typography variant="h5" className="text-stieglitz">
                Deposits
              </Typography>
              <ArrowUpIcon className="mr-1 ml-auto mt-1.5 rotate-180 cursor-not-allowed" />
            </Box>

            {rateVaultContext.rateVaultEpochData.epochStrikes.map(
              (strike, strikeIndex) => {
                const deposits =
                  activeVaultContextSide === 'CALL'
                    ? rateVaultContext.rateVaultEpochData.callsDeposits[
                        strikeIndex
                      ]
                    : rateVaultContext.rateVaultEpochData.putsDeposits[
                        strikeIndex
                      ];
                return (
                  <Box className="flex" key={strikeIndex}>
                    <Box
                      className={`rounded-md flex mb-4 p-2 pt-1 pb-1 bg-cod-gray`}
                    >
                      <FlagIcon
                        className={'mt-[6px] mr-1.5'}
                        /* @ts-ignore TODO: FIX */
                        fill={STRIKE_INDEX_TO_COLOR[strikeIndex]}
                      />
                      <Typography
                        variant={'h6'}
                        className={'text-sm text-stieglitz'}
                      >
                        {getUserReadableAmount(strike, 8)}%
                      </Typography>
                    </Box>

                    <Typography
                      variant={'h6'}
                      className={'text-sm text-white mt-1  ml-auto mr-2'}
                    >
                      $
                      {formatAmount(
                        getUserReadableAmount(
                          deposits || BigNumber.from('0'),
                          18
                        ),
                        2
                      )}
                    </Typography>
                  </Box>
                );
              }
            )}
          </Box>
          <Box className={'w-full flex'}>
            <Box
              className={
                'p-4 pl-5 pr-5 rounded-xl rounded-tr-none rounded-tl-none border-r-none border-[0.1px] border-gray-600 w-full'
              }
            >
              <Box className="flex mb-1">
                <Typography variant="h5" className="text-stieglitz">
                  Current MIM3CRV rate
                </Typography>
                <Typography variant="h5" className="mr-1 ml-auto text-white">
                  <span>
                    {formatAmount(
                      getUserReadableAmount(
                        rateVaultContext.rateVaultEpochData.rate,
                        8
                      ),
                      2
                    )}
                    %
                  </span>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Stats;
