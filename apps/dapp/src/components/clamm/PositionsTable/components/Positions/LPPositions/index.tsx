import React, { useCallback, useMemo, useState } from 'react';
import {
  Address,
  BaseError,
  formatUnits,
  Hex,
  hexToBigInt,
  parseUnits,
} from 'viem';

import toast from 'react-hot-toast';
import { useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';
import useUserBalance from 'hooks/useUserBalance';

import { PositionsTableProps } from 'components/clamm/PositionsTable';
import ClaimButton from 'components/clamm/StrikesChain/components/ClaimButton';
import TableLayout from 'components/common/TableLayout';

import { LPPositionMeta } from 'utils/clamm/varrock/types';
import { getTokenSymbol } from 'utils/token';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { columns, LPPositionItem } from '../columnHelpers/lpPositions';
import MultiWithdrawButton from './components/MultWithdrawButton';
import PositionsSummary from './components/PositionSummary';
import UtilityButtons from './components/UtilityButtons';

const LPPositions = ({ loading }: PositionsTableProps) => {
  const { lpPositions, updateLPPositions } = useClammPositions();
  const { tick, markPrice, selectedOptionsPool } = useClammStore();
  const { chain } = useNetwork();
  const { checkEthBalance } = useUserBalance();
  const [selectedPositions, setSelectedPositions] = useState<
    Map<number, LPPositionMeta>
  >(new Map());

  const selectPosition = useCallback((key: number, positionInfo: any) => {
    setSelectedPositions((prev) => new Map(prev.set(key, positionInfo)));
  }, []);
  const unselectPosition = useCallback((key: number) => {
    setSelectedPositions((prev) => {
      prev.delete(key);
      return new Map(prev);
    });
  }, []);

  const tokenInfo = useMemo(() => {
    if (!selectedOptionsPool)
      return {
        token0Symbol: '-',
        token1Symbol: '-',
        token0Price: 1n,
        token1Price: 1n,
      };
    const { callToken, putToken } = selectedOptionsPool;

    const token0isCall =
      hexToBigInt(callToken.address) < hexToBigInt(putToken.address);

    return {
      token0Symbol: getTokenSymbol({
        address: token0isCall ? callToken.address : putToken.address,
        chainId: chain?.id ?? DEFAULT_CHAIN_ID,
      }),
      token1Symbol: getTokenSymbol({
        address: token0isCall ? putToken.address : callToken.address,
        chainId: chain?.id ?? DEFAULT_CHAIN_ID,
      }),
      token0Price: parseUnits((token0isCall ? markPrice : 1).toString(), 18),
      token1Price: parseUnits((token0isCall ? 1 : markPrice).toString(), 18),
    };
  }, [selectedOptionsPool, markPrice, chain]);

  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });

  const handleWithdraw = useCallback(
    async (txData: Hex, to: Address, index: number) => {
      if (!walletClient) return;
      const { publicClient } = wagmiConfig;

      const loadingToastId = toast.loading('Opening wallet');
      try {
        const request = await walletClient.prepareTransactionRequest({
          account: walletClient.account,
          to: to,
          data: txData,
          type: 'legacy',
        });
        checkEthBalance(request);

        const hash = await walletClient.sendTransaction(request);
        await publicClient.waitForTransactionReceipt({
          hash,
        });
        await updateLPPositions?.();
        toast.success('Transaction sent');
      } catch (err) {
        const error = err as BaseError;
        console.error(err);
        toast.error(error.shortMessage);
      }

      toast.remove(loadingToastId);
    },
    [walletClient, updateLPPositions],
  );

  const selectAll = useCallback(() => {
    lpPositions.forEach(({ meta }, index) => {
      if (BigInt(meta.withdrawableShares) !== 0n) {
        selectPosition(index, meta);
      }
    });
  }, [selectPosition, lpPositions]);

  const deselectAll = useCallback(() => {
    lpPositions.forEach((_, index) => {
      unselectPosition(index);
    });
  }, [lpPositions, unselectPosition]);

  const positions = useMemo(() => {
    return lpPositions
      .map(
        (
          {
            strikePrice,
            token0LiquidityInToken,
            token1LiquidityInToken,
            token0Earned,
            token1Earned,
            token0Decimals,
            token1Decimals,
            token0Withdrawable,
            token1Withdrawable,
            meta,
          },
          index: number,
        ) => {
          const isSelected = Boolean(selectedPositions.get(index));
          let side = 'Put';
          if (Number(meta.tickLower) < tick) {
            side = 'Put';
          }
          if (Number(meta.tickUpper) > tick) {
            side = 'Call';
          }

          return {
            earned: {
              token0Amount: formatUnits(
                BigInt(token0Earned),
                Number(token0Decimals),
              ),
              token1Amount: formatUnits(
                BigInt(token1Earned),
                Number(token1Decimals),
              ),
              token0Symbol: tokenInfo.token0Symbol,
              token1Symbol: tokenInfo.token1Symbol,
            },
            side: side,
            size: {
              token0Amount: formatUnits(
                BigInt(token0LiquidityInToken),
                Number(token0Decimals),
              ),
              token1Amount: formatUnits(
                BigInt(token1LiquidityInToken),
                Number(token1Decimals),
              ),
              token0Symbol: tokenInfo.token0Symbol,
              token1Symbol: tokenInfo.token1Symbol,
            },
            strike: {
              handleSelect: () => {
                if (BigInt(meta.withdrawableShares) === 0n) return;
                if (!isSelected) {
                  selectPosition(index, meta);
                } else {
                  unselectPosition(index);
                }
              },
              isSelected: isSelected,
              strikePrice: strikePrice,
            },
            withdrawable: {
              token0Amount: formatUnits(
                BigInt(token0Withdrawable),
                Number(token0Decimals),
              ),
              token1Amount: formatUnits(
                BigInt(token1Withdrawable),
                Number(token1Decimals),
              ),
              token0Symbol: tokenInfo.token0Symbol,
              token1Symbol: tokenInfo.token1Symbol,
            },
            timestamp: meta.timestamp,
            withdrawButton: {
              disabled: BigInt(meta.withdrawableShares) === 0n,
              handleWithdraw: () => {
                const { txData, to } = meta.withdrawTx;
                handleWithdraw(txData, to, index);
              },
            },
          };
        },
      )
      .sort(
        (a: any, b: any) =>
          Number(a.strike.strikePrice) - Number(b.strike.strikePrice),
      );
  }, [
    tokenInfo.token0Symbol,
    tokenInfo.token1Symbol,
    tick,
    lpPositions,
    selectPosition,
    selectedPositions,
    unselectPosition,
    handleWithdraw,
  ]);

  const totalEarned = useMemo(() => {
    const earned = positions.reduce(
      (prev, curr) => {
        return {
          token0: parseUnits(curr.earned.token0Amount, 18) + prev.token0,
          token1: parseUnits(curr.earned.token1Amount, 18) + prev.token1,
        };
      },
      {
        token0: 0n,
        token1: 0n,
      },
    );

    return formatUnits(
      earned.token0 * tokenInfo.token0Price +
        earned.token1 * tokenInfo.token1Price,
      36,
    );
  }, [positions, tokenInfo.token0Price, tokenInfo.token1Price]);

  const totalDeposit = useMemo(() => {
    const deposits = positions.reduce(
      (prev, curr) => {
        return {
          token0: parseUnits(curr.size.token0Amount, 18) + prev.token0,
          token1: parseUnits(curr.size.token1Amount, 18) + prev.token1,
        };
      },
      {
        token0: 0n,
        token1: 0n,
      },
    );

    return formatUnits(
      deposits.token0 * tokenInfo.token0Price +
        deposits.token1 * tokenInfo.token1Price,
      36,
    );
  }, [positions, tokenInfo.token0Price, tokenInfo.token1Price]);

  const totalWithdrawable = useMemo(() => {
    const withdrawable = positions.reduce(
      (prev, curr) => {
        return {
          token0: parseUnits(curr.withdrawable.token0Amount, 18) + prev.token0,
          token1: parseUnits(curr.withdrawable.token1Amount, 18) + prev.token1,
        };
      },
      {
        token0: 0n,
        token1: 0n,
      },
    );

    return {
      token0: formatUnits(withdrawable.token0, 18),
      token1: formatUnits(withdrawable.token1, 18),
    };
  }, [positions]);

  return (
    <div className="w-full flex flex-col space-y-[12px] py-[12px]">
      <div className="px-[12px] flex items-center justify-between overflow-x-scroll">
        <PositionsSummary
          totalDeposit={totalDeposit}
          totalEarned={totalEarned}
          totalWithdrawable={{
            token0: {
              amount: totalWithdrawable.token0,
              symbol: tokenInfo.token0Symbol,
            },
            token1: {
              amount: totalWithdrawable.token1,
              symbol: tokenInfo.token1Symbol,
            },
          }}
        />
        <div className="flex items-center space-x-[6px]">
          <ClaimButton />
          <MultiWithdrawButton
            positions={selectedPositions}
            deselectAll={deselectAll}
          />
          <UtilityButtons
            selectAll={selectAll}
            deselectAll={deselectAll}
            refresh={updateLPPositions!}
          />
        </div>
      </div>
      <TableLayout<LPPositionItem>
        data={positions}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading}
        pageSize={10}
      />
    </div>
  );
};

export default LPPositions;
