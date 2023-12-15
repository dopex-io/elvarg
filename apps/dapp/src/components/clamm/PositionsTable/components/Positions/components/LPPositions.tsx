import React, { useCallback, useMemo } from 'react';
import { Address, BaseError, formatUnits, Hex } from 'viem';

import toast from 'react-hot-toast';
import { useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';

import { PositionsTableProps } from 'components/clamm/PositionsTable';
import TableLayout from 'components/common/TableLayout';

import { getTokenSymbol } from 'utils/token';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { columns, LPPositionItem } from './columnHelpers/lpPositions';

const LPPositions = ({
  selectPosition,
  selectedPositions,
  unselectPosition,
  loading,
}: PositionsTableProps) => {
  const { tick } = useClammStore();
  const { lpPositions, updateLPPositions } = useClammPositions();
  const { chain } = useNetwork();
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

  const positions = useMemo(() => {
    const chainId = chain?.id ?? DEFAULT_CHAIN_ID;
    return lpPositions
      .map(
        (
          {
            strikePrice,
            token0LiquidityInToken,
            token1LiquidityInToken,
            token0Earned,
            token1Earned,
            token0Address,
            token0Decimals,
            token1Decimals,
            token1Address,
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
              token0Symbol: getTokenSymbol({
                address: token0Address,
                chainId,
              }),
              token1Symbol: getTokenSymbol({
                address: token1Address,
                chainId,
              }),
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
              token0Symbol: getTokenSymbol({
                address: token0Address,
                chainId,
              }),
              token1Symbol: getTokenSymbol({
                address: token1Address,
                chainId,
              }),
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
              token0Symbol: getTokenSymbol({
                address: token0Address,
                chainId,
              }),
              token1Symbol: getTokenSymbol({
                address: token1Address,
                chainId,
              }),
            },
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
    chain?.id,
    tick,
    lpPositions,
    selectPosition,
    selectedPositions,
    unselectPosition,
    handleWithdraw,
  ]);
  return (
    <TableLayout<LPPositionItem>
      data={positions}
      columns={columns}
      rowSpacing={3}
      isContentLoading={loading}
      pageSize={10}
    />
  );
};

export default LPPositions;
