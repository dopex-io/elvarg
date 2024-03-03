import React, { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useShare from 'hooks/useShare';

import TableLayout from 'components/common/TableLayout';

import getOptionMarketPairPools from 'utils/clamm/getOptionMarketPairPools';
import { formatAmount, getExplorerUrl } from 'utils/general';
import { getTokenLogoURI, getTokenSymbol } from 'utils/token';

import { EXPIRIES_TO_KEY } from 'constants/clamm';
import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

import {
  ExerciseHistoryItem,
  historyPositionsColumns,
  HistoryPositionsItem,
  PurchaseHistoryItem,
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
      url.searchParams.set('first', '100');

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
      url.searchParams.set('first', '100');

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
    const _exerciseHistory = exerciseHistory.data;
    const _purchaseHistory = purchaseHistory.data;

    const history = [
      ...(_exerciseHistory ? _exerciseHistory : []).sort(
        (a: any, b: any) => b.timestamp - a.timestamp,
      ),
      ...(_purchaseHistory ? _purchaseHistory : []).sort(
        (a: any, b: any) => b.timestamp - a.timestamp,
      ),
    ];

    return history;
  }, [exerciseHistory, purchaseHistory]);

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
        const _item: ExerciseHistoryItem = item;
        const isCall = _item.type === 'call';
        const sizeReadable = Number(
          formatUnits(BigInt(_item.size), _item.sizeToken.decimals),
        );
        const sizeUsdValue = isCall
          ? sizeReadable * _item.exercisePrice
          : sizeReadable;

        const optionsAmount = !isCall
          ? Number(sizeUsdValue) / _item.strike
          : sizeReadable;

        const premiumReadable = Number(
          formatUnits(BigInt(_item.premium), _item.sizeToken.decimals),
        );

        const premiumUsdValue = isCall
          ? premiumReadable * _item.exercisePrice
          : premiumReadable;

        const profitUsdValue = Math.max(
          (isCall
            ? _item.exercisePrice - _item.strike
            : _item.strike - _item.exercisePrice) * optionsAmount,
          0,
        );

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
                address: selectedOptionsMarket.putToken.address,
                chainId: chainId,
              }),
            },
          ],
          market: {
            action: 'exercise',
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
            onShare: () => {
              handleShare({
                amount: optionsAmount,
                callTokenSymbol: market.callToken.symbol,
                putTokenSymbol: market.putToken.symbol,
                putTokenURI: market.putToken.imgSrc,
                callTokenURI: market.callToken.imgSrc,
                exercisePrice: _item.exercisePrice,
                premiumUsd: premiumUsdValue,
                profitUsd: profitUsdValue,
                strike: _item.strike,
                side: _item.type,
              });
            },
            txUrl: `${getExplorerUrl(chainId)}tx/${_item.txHash}`,
          },
          strike: {
            price: _item.strike,
            side: _item.type,
          },
        });
      } else {
        if (item['premium']) {
          const _item: PurchaseHistoryItem = item;
          const { address, decimals } = _item.token;

          history.push({
            actionInfo: [
              {
                label: 'Premium',
                amount: formatAmount(
                  formatUnits(BigInt(_item.premium), decimals),
                  5,
                ),
                symbol: getTokenSymbol({
                  address: address,
                  chainId: chainId,
                }),
              },
              {
                label: 'TTL',
                amount: EXPIRIES_TO_KEY[_item.ttl],
                symbol: '',
              },
            ],
            market: {
              action: 'purchase',
              ...market,
            },
            timestamp: _item.timestamp,
            size: {
              amount: formatAmount(
                formatUnits(BigInt(_item.size), decimals),
                5,
              ),
              symbol: getTokenSymbol({
                address: address,
                chainId: chainId,
              }),
            },
            other: {
              onShare: null,
              txUrl: `${getExplorerUrl(chainId)}tx/${_item.txHash}`,
            },
            strike: {
              price: _item.strike,
              side: _item.type,
            },
          });
        }
      }
    });

    return history.sort((a, b) => b.timestamp - a.timestamp);
  }, [chain?.id, tradeHistoryResponse, selectedOptionsMarket, handleShare]);

  return (
    <div className="flex flex-col py-[12px]">
      <span className="text-[13px] text-stieglitz px-[12px]">
        Only displaying last 100 recent activites
      </span>
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
