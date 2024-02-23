import React, { useCallback, useMemo } from 'react';
import { Address, formatUnits, Hex, parseUnits, zeroAddress } from 'viem';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useShare from 'hooks/useShare';

import TableLayout from 'components/common/TableLayout';

import getOptionMarketPairPools from 'utils/clamm/getOptionMarketPairPools';
import { TradeHistory } from 'utils/clamm/varrock/types';
import { formatAmount, getExplorerUrl } from 'utils/general';
import { getTokenDecimals, getTokenLogoURI, getTokenSymbol } from 'utils/token';

import { EXPIRIES_TO_KEY } from 'constants/clamm';
import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

import {
  historyPositionsColumns,
  HistoryPositionsItem,
} from '../columnHelpers/tradeHistory';

const HistoryPositions = () => {
  const { selectedOptionsMarket } = useClammStore();
  const share = useShare((state) => state.open);

  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();

  const pools = useMemo(() => {
    if (!chain || !selectedOptionsMarket) return [];
    return getOptionMarketPairPools(chain.id, selectedOptionsMarket.address);
  }, [chain, selectedOptionsMarket]);

  const depositsHistory = useQueries({
    queries: pools.map((pool) => ({
      queryKey: [
        'clamm-deposit-history',
        userAddress,
        pool,
        chain?.id,
        selectedOptionsMarket?.address,
      ],
      queryFn: async () => {
        if (!chain || !userAddress || !selectedOptionsMarket) return [];
        const url = new URL(`${VARROCK_BASE_API_URL}/clamm/deposit/history`);
        url.searchParams.set(
          'chainId',
          (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
        );
        url.searchParams.set('pool', pool);
        url.searchParams.set('user', userAddress);
        url.searchParams.set('first', '1');
        url.searchParams.set('skip', '0');
        return fetch(url).then((res) => {
          if (!res.ok) {
            console.error(res.json());
            return [];
          }
          return res.json();
        });
      },
    })),
  });

  const withdrawHistory = useQueries({
    queries: pools.map((pool) => ({
      queryKey: [
        'clamm-withdraw-history',
        userAddress,
        pool,
        chain?.id,
        selectedOptionsMarket?.address,
      ],
      queryFn: async () => {
        if (!chain || !userAddress || !selectedOptionsMarket) return [];
        const url = new URL(`${VARROCK_BASE_API_URL}/clamm/withdraw/history`);
        url.searchParams.set(
          'chainId',
          (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
        );
        url.searchParams.set('pool', pool);
        url.searchParams.set('user', userAddress);
        url.searchParams.set('first', '1');
        url.searchParams.set('skip', '0');
        return fetch(url).then((res) => {
          if (!res.ok) {
            console.error(res.json());
            return [];
          }
          return res.json();
        });
      },
    })),
  });

  const exerciseHistory = useQuery({
    queryKey: [
      'clamm-exercise-history',
      userAddress,
      chain?.id,
      selectedOptionsMarket?.address,
    ],
    queryFn: async () => {
      if (!chain || !userAddress || !selectedOptionsMarket) return [];
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/exercise/history`);
      url.searchParams.set(
        'chainId',
        (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      );
      url.searchParams.set('user', userAddress);
      url.searchParams.set('first', '1');

      url.searchParams.set('skip', '0');
      url.searchParams.set('optionMarket', selectedOptionsMarket.address);
      return fetch(url).then((res) => {
        if (!res.ok) {
          console.error(res.json());
          return [];
        }
        return res.json();
      });
    },
  });

  const purchaseHistory = useQuery({
    queryKey: [
      'clamm-purchase-history',
      userAddress,
      chain?.id,
      selectedOptionsMarket?.address,
    ],
    queryFn: async () => {
      if (!chain || !userAddress || !selectedOptionsMarket) return [];
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/purchase/history`);
      url.searchParams.set(
        'chainId',
        (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      );
      url.searchParams.set('user', userAddress);
      url.searchParams.set('first', '1');

      url.searchParams.set('skip', '0');
      url.searchParams.set('optionMarket', selectedOptionsMarket.address);
      return fetch(url).then((res) => {
        if (!res.ok) {
          console.error(res.json());
          return [];
        }
        return res.json();
      });
    },
  });

  const tradeHistoryResponse = useMemo(() => {
    const _depositsHistory: { timestamp: number }[] = [];
    const _withdrawHistory: { timestamp: number }[] = [];

    depositsHistory.forEach(({ data }) => {
      if (data) {
        data.forEach((_data: any) => {
          _depositsHistory.push(_data);
        });
      }
    });
    withdrawHistory.forEach(({ data }) => {
      if (data) {
        data.forEach((_data: any) => {
          _withdrawHistory.push(_data);
        });
      }
    });

    const _exerciseHistory = exerciseHistory.data;
    const _purchaseHistory = purchaseHistory.data;

    const history = [
      ...(_exerciseHistory ? _exerciseHistory : []).sort(
        (a: any, b: any) => b.timestamp - a.timestamp,
      ),
      ...(_purchaseHistory ? _purchaseHistory : []).sort(
        (a: any, b: any) => b.timestamp - a.timestamp,
      ),
      ...(_depositsHistory ? _depositsHistory : []).sort(
        (a: any, b: any) => b.timestamp - a.timestamp,
      ),
      ...(_withdrawHistory ? _withdrawHistory : []).sort(
        (a: any, b: any) => b.timestamp - a.timestamp,
      ),
    ];

    return history;
  }, [depositsHistory, withdrawHistory, exerciseHistory, purchaseHistory]);

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
    if (!selectedOptionsMarket) return [];
    const chainId = chain?.id ?? DEFAULT_CHAIN_ID;
    const market = {
      callToken: {
        symbol: getTokenSymbol({
          address: selectedOptionsMarket.callToken.address,
          chainId,
        }),
        imgSrc: getTokenLogoURI({
          address: selectedOptionsMarket.callToken.address,
          chainId,
        }),
      },
      putToken: {
        symbol: getTokenSymbol({
          address: selectedOptionsMarket.putToken.address,
          chainId,
        }),
        imgSrc: getTokenLogoURI({
          address: selectedOptionsMarket.putToken.address,
          chainId,
        }),
      },
    };
    const history: HistoryPositionsItem[] = [];
    tradeHistoryResponse.map((item) => {
      if (item['exercisePrice']) {
        const _item: {
          strike: number;
          exercisePrice: number;
          premium: string;
          timestamp: number;
          ttl: string;
          profit: string;
          size: string;
          sizeToken: {
            address: Address;
            decimals: number;
            symbol: string;
          };
          profitToken: {
            address: Address;
            decimals: number;
            symbol: string;
          };
          type: string;
          txHash: Hex;
        } = item;
        const isCall = _item.type.toLowerCase() === 'call';
        history.push({
          actionInfo: [
            {
              label: 'Profit',
              amount: formatAmount(
                formatUnits(BigInt(_item.profit), _item.profitToken.decimals),
                5,
              ),
              symbol: getTokenSymbol({
                address: _item.profitToken.address,
                chainId: chainId,
              }),
            },
            {
              label: 'Exercise Price',
              amount: _item.exercisePrice.toString(),
              symbol: getTokenSymbol({
                address: _item.profitToken.address,
                chainId: chainId,
              }),
            },
          ],
          market: {
            action: 'Exercise',
            ...market,
          },
          timestamp: _item.timestamp,
          size: {
            amount: formatAmount(
              formatUnits(BigInt(_item.size), _item.sizeToken.decimals),
              5,
            ),
            symbol: getTokenSymbol({
              address: _item.sizeToken.address,
              chainId: chainId,
            }),
          },
          other: {
            onShare: () => {},
            txUrl: _item.txHash,
          },
          strike: {
            price: _item.strike,
            side: _item.type,
          },
        });
      }
    });

    return history;

    // [ "strike", "exercisePrice", "premium", "timestamp", "ttl", "type", "profit", "size", "sizeToken", "profitToken", … ]
    // HistoryPositions.tsx:362:28
    // Array(8) [ "txHash", "timestamp", "strike", "size", "ttl", "type", "premium", "token" ]
    // HistoryPositions.tsx:362:28
    // Array(6) [ "strikes", "txHash", "timestamp", "liquidity", "tokens", "handler" ]
    // HistoryPositions.tsx:362:28
    // Array(6) [ "liquidity", "timestamp", "strikes", "txHash", "tokens", "handler" ]
    return [];
    if (!selectedOptionsMarket) return [];
    // const { callToken, putToken } = selectedOptionsMarket;
    // const chainId = chain?.id ?? DEFAULT_CHAIN_ID;
    // return tradeHistoryResponse.map(
    //   ({ strike, action, timestamp, meta, size, side, ttl, priceAtAction }) => {
    //     const isCall = side === 'call';
    //     const { transactionHash, premium, profit } = meta;
    //     const premiumUsd =
    //       Number(
    //         formatUnits(
    //           BigInt(premium || 0),
    //           isCall ? callToken.decimals : putToken.decimals,
    //         ),
    //       ) * (isCall ? priceAtAction : 1);

    //     const profitUsd =
    //       Number(
    //         formatUnits(
    //           BigInt(profit ? profit : 0),
    //           isCall ? putToken.decimals : callToken.decimals,
    //         ),
    //       ) * (isCall ? 1 : priceAtAction);

    //     const notiionalSize = Number(
    //       formatUnits(
    //         isCall
    //           ? BigInt(size)
    //           : (BigInt(size) * parseUnits('1', putToken.decimals)) /
    //               parseUnits(strike.toString(), putToken.decimals),
    //         getTokenDecimals({
    //           chainId,
    //           address: isCall ? callToken.address : putToken.address,
    //         }),
    //       ),
    //     );

    //     const callTokenURI = getTokenLogoURI({
    //       chainId,
    //       address: callToken.address,
    //     });

    //     const putTokenURI = getTokenLogoURI({
    //       chainId,
    //       address: putToken.address,
    //     });

    //     const callTokenSymbol = getTokenSymbol({
    //       chainId,
    //       address: callToken.address,
    //     });

    //     const putTokenSymbol = getTokenSymbol({
    //       chainId,
    //       address: putToken.address,
    //     });

    //     return {
    //       strike: {
    //         price: strike,
    //         side,
    //       },
    //       timestamp,
    //       other: {
    //         onShare:
    //           action === 'exercise'
    //             ? () => {
    //                 handleShare({
    //                   premiumUsd,
    //                   profitUsd,
    //                   amount: notiionalSize,
    //                   callTokenURI,
    //                   putTokenURI,
    //                   side,
    //                   callTokenSymbol,
    //                   putTokenSymbol,
    //                   strike,
    //                   exercisePrice: priceAtAction,
    //                 });
    //               }
    //             : null,
    //         txUrl: `${getExplorerUrl(chainId)}tx/${transactionHash}`,
    //       },
    //       size: {
    //         amount: formatAmount(
    //           formatUnits(
    //             BigInt(size),
    //             getTokenDecimals({
    //               chainId,
    //               address: isCall ? callToken.address : putToken.address,
    //             }),
    //           ),
    //           4,
    //         ),
    //         symbol: getTokenSymbol({
    //           chainId,
    //           address: isCall ? callToken.address : putToken.address,
    //         }),
    //       },
    //       actionInfo:
    //         action === 'purchase'
    //           ? [
    //               {
    //                 label: 'Premium',
    //                 amount: formatAmount(
    //                   formatUnits(
    //                     BigInt(premium ?? 0),
    //                     getTokenDecimals({
    //                       chainId,
    //                       address: isCall
    //                         ? callToken.address
    //                         : putToken.address,
    //                     }),
    //                   ),
    //                   4,
    //                 ),
    //                 symbol: getTokenSymbol({
    //                   chainId,
    //                   address: isCall ? callToken.address : putToken.address,
    //                 }),
    //               },
    //               {
    //                 label: 'TTL',
    //                 amount: EXPIRIES_TO_KEY[ttl],
    //                 symbol: '',
    //               },
    //             ]
    //           : [
    //               {
    //                 label: 'Premium',
    //                 amount: formatAmount(
    //                   formatUnits(
    //                     BigInt(premium ?? 0),
    //                     getTokenDecimals({
    //                       chainId,
    //                       address: isCall
    //                         ? callToken.address
    //                         : putToken.address,
    //                     }),
    //                   ),
    //                   4,
    //                 ),
    //                 symbol: getTokenSymbol({
    //                   chainId,
    //                   address: isCall ? callToken.address : putToken.address,
    //                 }),
    //               },
    //               {
    //                 label: 'Profit',
    //                 amount: formatAmount(
    //                   formatUnits(
    //                     BigInt(profit ?? 0),
    //                     getTokenDecimals({
    //                       chainId,
    //                       address: isCall
    //                         ? putToken.address
    //                         : callToken.address,
    //                     }),
    //                   ),
    //                   4,
    //                 ),
    //                 symbol: getTokenSymbol({
    //                   chainId,
    //                   address: isCall ? putToken.address : callToken.address,
    //                 }),
    //               },
    //             ],
    //       market: {
    //         action,
    //         callToken: {
    //           symbol: getTokenSymbol({
    //             chainId,
    //             address: callToken.address,
    //           }),
    //           imgSrc: getTokenLogoURI({
    //             chainId,
    //             address: callToken.address,
    //           }),
    //         },
    //         putToken: {
    //           symbol: getTokenSymbol({
    //             chainId,
    //             address: putToken.address,
    //           }),
    //           imgSrc: getTokenLogoURI({
    //             chainId,
    //             address: putToken.address,
    //           }),
    //         },
    //       },
    //     };
    //   },
    // );
  }, [chain?.id, tradeHistoryResponse, selectedOptionsMarket]);

  return (
    <div className="py-[12px]">
      <TableLayout
        data={positions}
        columns={historyPositionsColumns}
        rowSpacing={2}
        pageSize={10}
        isContentLoading={false}
      />
    </div>
  );
};

export default HistoryPositions;
