import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  getAddress,
  Hex,
} from 'viem';

import {
  ArrowDownRightIcon,
  ArrowPathIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import DopexV2OptionMarketV2 from 'abis/clamm/DopexV2OptionMarketV2';
import toast from 'react-hot-toast';
import { useNetwork, useWalletClient } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useShare from 'hooks/useShare';
import useUserBalance from 'hooks/useUserBalance';

import TableLayout from 'components/common/TableLayout';

import { cn, formatAmount } from 'utils/general';
import { getTokenLogoURI, getTokenSymbol } from 'utils/token';

import { HANDLER_TO_SWAPPER } from 'constants/clamm';
import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

import { BuyPositionItem, columns } from '../columnHelpers/buyPositions';
import MultiExerciseButton from './components/MultiExerciseButton';
import PositionSummary from './components/PositionSummary';

export type OptionExerciseData = {
  profit?: string;
  token?: Address;
  swapData?: Hex[];
  swappers?: Address[];
  tx: {
    to?: Address;
    data: Hex;
  };
};

type Option = {
  size: string;
  premium: string;
  strike: number;
  type: string;
  token: {
    address: Address;
    decimals: number;
    symbol: string;
  };
  meta: {
    tokenId: string;
    expiry: number;
    handlers: {
      name: Address;
      deprecated: boolean;
      handler: Address;
      pool: Address;
    }[];
    liquidities: string[];
  };
};
const BuyPositions = ({
  setBuyPositionsLength,
}: {
  setBuyPositionsLength: Dispatch<React.SetStateAction<number>>;
}) => {
  const share = useShare((state) => state.open);
  const { chain } = useNetwork();
  const { selectedOptionsMarket, markPrice } = useClammStore();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  // const { checkEthBalance } = useUserBalance();
  const [selectedOptions, setSelectedOptions] = useState<
    Map<string, OptionExerciseData>
  >(new Map());

  const [isRefetching, setIsRefetching] = useState(false);

  const { data, error, isError, refetch, isLoading } = useQuery<Option[]>({
    queryKey: [
      'clamm-buy-positions',
      chain?.id,
      selectedOptionsMarket?.address,
      walletClient?.account.address,
    ],
    queryFn: async () => {
      if (!chain || !selectedOptionsMarket || !walletClient) return [];
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/purchase/positions`);
      url.searchParams.set('chainId', chain.id.toString());
      url.searchParams.set('optionMarket', selectedOptionsMarket.address);
      url.searchParams.set('user', walletClient.account.address);
      return await fetch(url).then((res) => res.json());
    },
  });

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
      currentPrice: number;
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
        currentPrice,
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
            name: 'Mark Price',
            value: formatAmount(currentPrice, 4),
          },
        ],
      });
    },
    [share],
  );

  const handleRefresh = useCallback(async () => {
    if (!isRefetching) {
      setIsRefetching(true);
      refetch().finally(() => setTimeout(() => setIsRefetching(false), 5000));
    }
  }, [refetch, isRefetching]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  const optionsPositions = useMemo(() => {
    if (error || isError || !data) {
      console.error(error);
      return [];
    }
    return data;
  }, [data, error, isError]);

  const generateExerciseTx = useCallback(
    async (tokenId: string, liquidities: string[], handlers: string[]) => {
      if (!selectedOptionsMarket || !chain) return;

      const loadingid = toast.loading('Preparing exercise');

      if (chain.id === 42161) {
        const oneInchSwapperId = '1inch';
        const url = new URL(`${VARROCK_BASE_API_URL}/clamm/exercise/prepare`);
        url.searchParams.set('chainId', chain.id.toString());
        url.searchParams.set('optionMarket', selectedOptionsMarket.address);
        url.searchParams.set('optionId', tokenId);
        url.searchParams.set('swapperId', oneInchSwapperId);
        url.searchParams.set('slippage', '1');

        const res = await fetch(url).then((res) => res.json());
        if (res['error']) {
          toast.error('Failed to prepare exercise. Please try again');
        } else {
          let _res: OptionExerciseData = res;

          if (!_res['tx']) {
            toast.error('Failed to prepare exercise. Please try again');
            return;
          }
          setSelectedOptions((prev) => {
            prev.set(tokenId, _res);
            return new Map(prev);
          });
          toast.success('Added to exercise queue');
        }
      } else {
        const swappers = HANDLER_TO_SWAPPER[chain.id];
        if (!swappers) {
          console.error('Exercise swapper not set!');
          return;
        }
        const swapper = handlers.map((name) => swappers[name]);
        const slippage = 1000n;
        const liquidityToExercise = liquidities.map((liq) => BigInt(liq));
        const swapData = liquidityToExercise.map((liq) =>
          encodeAbiParameters(
            [
              {
                name: 'fee',
                type: 'uint24',
              },
              {
                name: 'minAmountOut',
                type: 'uint256',
              },
            ],
            [500, liq - (liq * slippage) / 1000n],
          ),
        );

        const swapTx = encodeFunctionData({
          abi: DopexV2OptionMarketV2,
          functionName: 'exerciseOption',
          args: [
            {
              optionId: BigInt(tokenId),
              swapper,
              swapData,
              liquidityToExercise,
            },
          ],
        });

        setSelectedOptions((prev) => {
          prev.set(tokenId, {
            tx: {
              data: swapTx,
            },
          });
          return new Map(prev);
        });
      }
      toast.remove(loadingid);
    },
    [selectedOptionsMarket, chain],
  );

  const positions: BuyPositionItem[] = useMemo(() => {
    if (!selectedOptionsMarket) return [];
    const chainId = chain?.id ?? DEFAULT_CHAIN_ID;
    if (!optionsPositions['map']) return [];
    return optionsPositions
      .map(
        ({
          strike,
          token,
          type,
          size,
          premium,
          meta: { expiry, tokenId, liquidities, handlers },
        }) => {
          const side = type;
          const { address, decimals } = token;
          const isCall = type === 'call';
          const sizeReadable = Number(formatUnits(BigInt(size), decimals));
          const sizeUsdValue = isCall ? sizeReadable * markPrice : sizeReadable;

          const optionsAmount =
            side.toLowerCase() === 'put'
              ? Number(sizeUsdValue) / strike
              : sizeReadable;

          const premiumReadable = Number(
            formatUnits(BigInt(premium), decimals),
          );

          const premiumUsdValue = isCall
            ? premiumReadable * markPrice
            : premiumReadable;

          const breakEven =
            side.toLowerCase() === 'put'
              ? Number(strike) - premiumUsdValue / optionsAmount
              : Number(strike) + premiumUsdValue / optionsAmount;

          const profitUsdValue = Math.max(
            (isCall ? markPrice - strike : strike - markPrice) * optionsAmount,
            0,
          );

          const profitReadable =
            side.toLowerCase() === 'put'
              ? profitUsdValue / markPrice
              : profitUsdValue;

          const callTokenSymbol = getTokenSymbol({
            address: selectedOptionsMarket.callToken.address,
            chainId,
          });
          const putTokenSymbol = getTokenSymbol({
            address: selectedOptionsMarket.putToken.address,
            chainId,
          });

          const callTokenURI = getTokenLogoURI({
            address: selectedOptionsMarket.callToken.address,
            chainId,
          });

          const putTokenURI = getTokenLogoURI({
            address: selectedOptionsMarket.putToken.address,
            chainId,
          });

          return {
            strike: {
              disabled: profitUsdValue === 0,
              isSelected: Boolean(selectedOptions.get(tokenId)),
              price: strike,
              handleSelect: async () => {
                if (Boolean(selectedOptions.get(tokenId))) {
                  setSelectedOptions((prev) => {
                    prev.delete(tokenId);
                    return new Map(prev);
                  });
                } else {
                  await generateExerciseTx(
                    tokenId,
                    liquidities,
                    handlers.map(({ name }) => name),
                  );
                }
              },
            },
            breakEven,
            side: type,
            size: {
              amount: sizeReadable,
              symbol: getTokenSymbol({
                address: getAddress(address),
                chainId,
              }),
              usdValue: sizeUsdValue,
            },
            premium: {
              amount: premiumReadable,
              symbol: getTokenSymbol({
                address: getAddress(address),
                chainId,
              }),
              usdValue: premiumUsdValue,
            },
            expiry,
            profit: {
              amount: profitReadable,
              symbol: getTokenSymbol({
                address: isCall
                  ? selectedOptionsMarket?.putToken.address
                  : selectedOptionsMarket?.callToken.address,
                chainId,
              }),
              usdValue: profitUsdValue,
            },
            share: () => {
              handleShare({
                amount: optionsAmount,
                callTokenSymbol,
                putTokenSymbol,
                putTokenURI,
                callTokenURI,
                currentPrice: markPrice,
                premiumUsd: premiumUsdValue,
                profitUsd: profitUsdValue,
                strike,
                side,
              });
            },
          };
        },
      )
      .sort((a, b) => b.expiry - a.expiry);
  }, [
    handleShare,
    selectedOptions,
    optionsPositions,
    chain?.id,
    markPrice,
    selectedOptionsMarket,
    generateExerciseTx,
  ]);

  const optionsSummary = useMemo(() => {
    const totalProfitUsd = positions.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.profit.usdValue),
      0,
    );

    const totalOptions = positions.reduce((accumulator, currentValue) => {
      return (
        accumulator +
        (currentValue.side.toLowerCase() === 'put'
          ? Number(currentValue.size.amount) / Number(currentValue.strike.price)
          : Number(currentValue.size.amount))
      );
    }, 0);

    const totalPremiumUsd = positions.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.premium.usdValue),
      0,
    );

    return {
      totalProfitUsd,
      totalOptions,
      totalPremiumUsd,
    };
  }, [positions]);

  useEffect(() => {
    setBuyPositionsLength(positions.length);
  }, [setBuyPositionsLength, positions.length]);

  return (
    <div className="w-full flex flex-col space-y-[12px] py-[12px]">
      <div className="bg-cod-gray flex px-[12px] items-center justify-between space-x-[12px]">
        <PositionSummary
          callTokenSymbol={selectedOptionsMarket?.callToken.symbol ?? '-'}
          totalOptions={optionsSummary.totalOptions}
          totalPremiumUsd={optionsSummary.totalPremiumUsd}
          totalProfitUsd={optionsSummary.totalProfitUsd}
        />
        <div className="flex items-center space-x-[6px]">
          <div className="h-fit w-fit p-[2px] bg-mineshaft rounded-md">
            <ArrowPathIcon
              height={22}
              width={22}
              onClick={isRefetching ? () => {} : handleRefresh}
              className={cn(
                'bg-mineshaft text-stieglitz p-[2px] hover:text-white cursor-pointer',
                isRefetching && 'animate-spin cursor-progress',
              )}
            />
          </div>
          <MultiExerciseButton
            clearPositions={() => {
              setSelectedOptions(new Map());
            }}
            positions={selectedOptions}
          />
        </div>
      </div>
      <TableLayout<BuyPositionItem>
        data={positions}
        columns={columns}
        rowSpacing={3}
        isContentLoading={isRefetching || isLoading}
        pageSize={10}
      />
    </div>
  );
};

export default BuyPositions;
