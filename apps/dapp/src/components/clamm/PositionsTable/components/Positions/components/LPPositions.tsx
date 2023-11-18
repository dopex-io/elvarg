import React, { useCallback, useMemo } from 'react';
import { Address, BaseError, formatUnits, Hex } from 'viem';

import { Checkbox } from '@mui/material';

import { Button } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/20/solid';
import { createColumnHelper } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';

import { PositionsTableProps } from 'components/clamm/PositionsTable';
import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

import { DEFAULT_CHAIN_ID } from 'constants/env';

export type LPPositionItem = {
  strike: {
    strikePrice: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  side: string;
  size: {
    token0Amount: string;
    token1Amount: string;
    token0Symbol: string;
    token1Symbol: string;
  };
  withdrawable: {
    token0Amount: string;
    token1Amount: string;
    token0Symbol: string;
    token1Symbol: string;
  };
  earned: {
    token0Amount: string;
    token1Amount: string;
    token0Symbol: string;
    token1Symbol: string;
  };
  withdrawButton: {
    disabled: boolean;
    handleWithdraw: (meta: any) => void;
  };
};

const columnHelper = createColumnHelper<LPPositionItem>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="flex space-x-2 text-left items-center justify-start">
        <Checkbox
          checked={info.getValue().isSelected}
          onChange={info.getValue().handleSelect}
          className="text-mineshaft"
          size="small"
        />
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().strikePrice.toFixed(3)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => {
      const { token0Amount, token1Amount, token0Symbol, token1Symbol } =
        info.getValue();

      return (
        <div className="flex flex-col items-start justify-center">
          {Number(token0Amount) !== 0 && (
            <span>
              {formatAmount(token0Amount, 3)}{' '}
              <span className="text-stieglitz">{token0Symbol}</span>
            </span>
          )}
          {Number(token1Amount) !== 0 && (
            <span>
              {formatAmount(token1Amount, 3)}{' '}
              <span className="text-stieglitz">{token1Symbol}</span>
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => (
      <div className="flex items-center space-x-[2px]">
        <span>{info.getValue()}</span>
        {info.getValue().toLowerCase() === 'put' ? (
          <ArrowDownRightIcon className="text-down-bad w-[14px] h-[14px]" />
        ) : (
          <ArrowUpRightIcon className="text-up-only w-[14px] h-[14px]" />
        )}
      </div>
    ),
  }),
  columnHelper.accessor('earned', {
    header: 'Earned',
    cell: (info) => {
      const { token0Amount, token1Amount, token0Symbol, token1Symbol } =
        info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          <span className="flex items-center justify-center space-x-[4px]">
            <span>{formatAmount(token0Amount, 3)}</span>
            <span className="text-stieglitz text-[13px]">{token0Symbol}</span>
            <span className="text-stieglitz text-[13px]"></span>
          </span>
          <span className="flex items-center justify-center space-x-[2px]">
            <span>{formatAmount(token1Amount, 3)}</span>
            <span className="text-stieglitz text-[13px]">{token1Symbol}</span>
            <span className="text-stieglitz text-[13px]"></span>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('withdrawable', {
    header: 'Withdrawable',
    cell: (info) => {
      const { token0Amount, token1Amount, token0Symbol, token1Symbol } =
        info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          <span>
            {formatAmount(token0Amount, 3)}{' '}
            <span className="text-stieglitz">{token0Symbol}</span>
          </span>
          <span>
            {formatAmount(token1Amount, 3)}{' '}
            <span className="text-stieglitz">{token1Symbol}</span>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('withdrawButton', {
    header: '',
    cell: (info) => {
      return (
        <Button
          disabled={info.getValue().disabled}
          onClick={info.getValue().handleWithdraw}
        >
          Withdraw
        </Button>
      );
    },
  }),
];

const LPPositions = ({
  selectPosition,
  selectedPositions,
  unselectPosition,
  removePosition,
  loading,
}: PositionsTableProps) => {
  const { tick, selectedOptionsPool } = useClammStore();
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
        removePosition(index);
        await updateLPPositions?.();
        toast.success('Transaction sent');
      } catch (err) {
        const error = err as BaseError;
        console.error(err);
        toast.error(error.shortMessage);
      }

      toast.remove(loadingToastId);
    },
    [walletClient, updateLPPositions, removePosition],
  );

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
            token0Symbol,
            token0Decimals,
            token1Decimals,
            token1Symbol,
            token0Withdrawable,
            token1Withdrawable,
            meta,
          }: any,
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
              token0Symbol: token0Symbol,
              token1Symbol: token1Symbol,
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
              token0Symbol: token0Symbol,
              token1Symbol: token1Symbol,
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
              token0Symbol: token0Symbol,
              token1Symbol: token1Symbol,
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
