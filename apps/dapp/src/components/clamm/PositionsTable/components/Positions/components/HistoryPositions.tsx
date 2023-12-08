import React, { useCallback, useMemo } from 'react';
import { formatUnits, zeroAddress } from 'viem';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useShare from 'hooks/useShare';

import TableLayout from 'components/common/TableLayout';

import { TradeHistory } from 'utils/clamm/varrock/types';
import { formatAmount, getExplorerTxURL } from 'utils/general';
import { getTokenDecimals, getTokenLogoURI, getTokenSymbol } from 'utils/token';

import { EXPIRIES_TO_KEY } from 'constants/clamm';
import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

import { historyPositionsColumns } from './columnHelpers';

const HistoryPositions = () => {
  const { selectedOptionsPool } = useClammStore();
  const share = useShare((state) => state.open);

  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();

  const { data, isError, isLoading } = useQuery({
    staleTime: 15000,
    queryKey: [
      'trade-history',
      selectedOptionsPool?.optionsPoolAddress ?? zeroAddress,
      userAddress ?? zeroAddress,
    ],
    queryFn: async () => {
      const url = new URL(
        `${VARROCK_BASE_API_URL}/clamm/positions/trade-history`,
      );
      url.searchParams.set('chainId', String(chain?.id ?? DEFAULT_CHAIN_ID));
      url.searchParams.set('user', userAddress ?? zeroAddress);
      url.searchParams.set(
        'optionMarket',
        selectedOptionsPool?.optionsPoolAddress ?? zeroAddress,
      );
      return await fetch(url).then((res) => res.json());
    },
  });

  const tradeHistoryResponse: TradeHistory[] = useMemo(() => {
    if (isError || !data) {
      return [];
    } else {
      console.log(data);
      return data;
    }
  }, [data, isError]);

  const handleShare = useCallback(
    async (position: {
      premiumUsd: number;
      profitUsd: number;
      amount: number;
      callTokenURI: string;
      putTokenURI: string;
      callTokenSymbol: string;
      putTokenSymbol: string;
      side: string;
      strike: number;
      exercisePrice: number;
    }) => {
      const {
        amount,
        callTokenURI,
        premiumUsd,
        profitUsd,
        putTokenURI,
        side,
        callTokenSymbol,
        putTokenSymbol,
        strike,
        exercisePrice,
      } = position;
      share({
        title: (
          <div className="flex items-center justify-start space-x-[6px]">
            <div className="flex -space-x-2 self-center">
              <img
                className="w-[24px] h-[24px] z-10 border border-gray-500 rounded-full"
                src={callTokenURI}
                alt={callTokenSymbol}
              />
              <img
                className="w-[24px] h-[24px]"
                src={putTokenURI}
                alt={putTokenSymbol}
              />
            </div>
            <div className="flex items-center justify-center text-[13px] space-x-[4px]">
              <span>{callTokenSymbol}</span>
              <span>-</span>
              <span>{putTokenSymbol}</span>
            </div>
            <span>{formatAmount(amount)}x</span>
            <span className="flex items-center justify-center space-x-[4px]">
              {side === 'put' ? 'Puts' : 'Calls'}
              {side === 'put' ? (
                <ArrowDownRightIcon className="text-down-bad w-[14px] h-[14px]" />
              ) : (
                <ArrowUpRightIcon className="text-up-only w-[14px] h-[14px]" />
              )}
            </span>
          </div>
        ),
        percentage: (profitUsd * 100) / premiumUsd,
        customPath: '/clamm',
        stats: [
          {
            name: 'Strike',
            value: formatAmount(strike, 4),
          },
          {
            name: 'Exercise Strike',
            value: formatAmount(exercisePrice, 4),
          },
        ],
      });
    },
    [share],
  );

  const positions = useMemo(() => {
    if (!selectedOptionsPool) return [];
    const { callToken, putToken } = selectedOptionsPool;
    const chainId = chain?.id ?? DEFAULT_CHAIN_ID;
    return tradeHistoryResponse.map(
      ({ strike, action, timestamp, meta, size, side, ttl, priceAtAction }) => {
        const isCall = side === 'call';
        const { transactionHash, premium, profit } = meta;
        const premiumUsd =
          Number(
            formatUnits(
              BigInt(premium || 0),
              isCall ? callToken.decimals : putToken.decimals,
            ),
          ) * (isCall ? priceAtAction : 1);

        const profitUsd =
          Number(
            formatUnits(
              BigInt(profit ? profit : 0),
              isCall ? putToken.decimals : callToken.decimals,
            ),
          ) * (isCall ? 1 : priceAtAction);

        const callTokenURI = getTokenLogoURI({
          chainId,
          address: callToken.address,
        });

        const putTokenURI = getTokenLogoURI({
          chainId,
          address: putToken.address,
        });

        const callTokenSymbol = getTokenSymbol({
          chainId,
          address: callToken.address,
        });

        const putTokenSymbol = getTokenSymbol({
          chainId,
          address: putToken.address,
        });

        return {
          strike: {
            price: strike,
            side,
          },
          timestamp,
          other: {
            onShare:
              action === 'exercise'
                ? () => {
                    handleShare({
                      premiumUsd,
                      profitUsd,
                      amount: Number(
                        formatUnits(
                          BigInt(size),
                          getTokenDecimals({
                            chainId,
                            address: isCall
                              ? callToken.address
                              : putToken.address,
                          }),
                        ),
                      ),
                      callTokenURI,
                      putTokenURI,
                      side,
                      callTokenSymbol,
                      putTokenSymbol,
                      strike,
                      exercisePrice: priceAtAction,
                    });
                  }
                : null,
            txUrl: getExplorerTxURL(chainId, transactionHash),
          },
          size: {
            amount: formatAmount(
              formatUnits(
                BigInt(size),
                getTokenDecimals({
                  chainId,
                  address: isCall ? callToken.address : putToken.address,
                }),
              ),
              4,
            ),
            symbol: getTokenSymbol({
              chainId,
              address: isCall ? callToken.address : putToken.address,
            }),
          },
          actionInfo:
            action === 'purchase'
              ? [
                  {
                    label: 'Premium',
                    amount: formatAmount(
                      formatUnits(
                        BigInt(premium ?? 0),
                        getTokenDecimals({
                          chainId,
                          address: isCall
                            ? callToken.address
                            : putToken.address,
                        }),
                      ),
                      4,
                    ),
                    symbol: getTokenSymbol({
                      chainId,
                      address: isCall ? callToken.address : putToken.address,
                    }),
                  },
                  {
                    label: 'TTL',
                    amount: EXPIRIES_TO_KEY[ttl],
                    symbol: '',
                  },
                ]
              : [
                  {
                    label: 'Premium',
                    amount: formatAmount(
                      formatUnits(
                        BigInt(premium ?? 0),
                        getTokenDecimals({
                          chainId,
                          address: isCall
                            ? callToken.address
                            : putToken.address,
                        }),
                      ),
                      4,
                    ),
                    symbol: getTokenSymbol({
                      chainId,
                      address: isCall ? callToken.address : putToken.address,
                    }),
                  },
                  {
                    label: 'Profit',
                    amount: formatAmount(
                      formatUnits(
                        BigInt(profit ?? 0),
                        getTokenDecimals({
                          chainId,
                          address: isCall
                            ? putToken.address
                            : callToken.address,
                        }),
                      ),
                      4,
                    ),
                    symbol: getTokenSymbol({
                      chainId,
                      address: isCall ? putToken.address : callToken.address,
                    }),
                  },
                ],
          market: {
            action,
            callToken: {
              symbol: getTokenSymbol({
                chainId,
                address: callToken.address,
              }),
              imgSrc: getTokenLogoURI({
                chainId,
                address: callToken.address,
              }),
            },
            putToken: {
              symbol: getTokenSymbol({
                chainId,
                address: putToken.address,
              }),
              imgSrc: getTokenLogoURI({
                chainId,
                address: putToken.address,
              }),
            },
          },
        };
      },
    );
  }, [chain?.id, tradeHistoryResponse, selectedOptionsPool, handleShare]);

  return (
    <div className="py-[12px]">
      <TableLayout
        data={positions}
        columns={historyPositionsColumns}
        rowSpacing={2}
        pageSize={10}
        isContentLoading={isLoading}
      />
    </div>
  );
};

export default HistoryPositions;
