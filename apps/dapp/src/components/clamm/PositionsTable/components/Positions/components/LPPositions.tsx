import React, { useCallback, useMemo } from 'react';
import {
  Address,
  BaseError,
  encodeFunctionData,
  formatUnits,
  Hex,
  parseAbi,
} from 'viem';

import { Checkbox } from '@mui/material';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import TableLayout from 'components/common/TableLayout';

import formatValue from 'utils/clamm/formatValue';

import { DEFAULT_CHAIN_ID } from 'constants/env';

export type LPPositionItem = {
  strike: {
    strikePrice: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  size: {
    callTokenAmount: string;
    putTokenAmount: string;
    callTokenSymbol: string;
    putTokenSymbol: string;
  };
  withdrawable: {
    callTokenAmount: string;
    putTokenAmount: string;
    callTokenSymbol: string;
    putTokenSymbol: string;
  };
  earned: {
    callTokenAmount: string;
    putTokenAmount: string;
    callTokenSymbol: string;
    putTokenSymbol: string;
  };
  withdrawButton: {
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
        <p className="inline-block">{info.getValue().strikePrice.toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => {
      const {
        callTokenAmount,
        putTokenAmount,
        callTokenSymbol,
        putTokenSymbol,
      } = info.getValue();

      return (
        <div className="flex flex-col items-start justify-center">
          {Number(callTokenAmount) !== 0 && (
            <span>
              {formatValue(callTokenAmount)}{' '}
              <span className="text-stieglitz">{callTokenSymbol}</span>
            </span>
          )}
          {Number(putTokenAmount) !== 0 && (
            <span>
              {formatValue(putTokenAmount)}{' '}
              <span className="text-stieglitz">{putTokenSymbol}</span>
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('earned', {
    header: 'Earned',
    cell: (info) => {
      const {
        callTokenAmount,
        putTokenAmount,
        callTokenSymbol,
        putTokenSymbol,
      } = info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          <span>
            {formatValue(callTokenAmount)}{' '}
            <span className="text-stieglitz">{callTokenSymbol}</span>
          </span>
          <span>
            {formatValue(putTokenAmount)}{' '}
            <span className="text-stieglitz">{putTokenSymbol}</span>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('withdrawable', {
    header: 'Withdrawable',
    cell: (info) => {
      const {
        callTokenAmount,
        putTokenAmount,
        callTokenSymbol,
        putTokenSymbol,
      } = info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          <span>
            {formatValue(callTokenAmount)}{' '}
            <span className="text-stieglitz">{callTokenSymbol}</span>
          </span>
          <span>
            {formatValue(putTokenAmount)}{' '}
            <span className="text-stieglitz">{putTokenSymbol}</span>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('withdrawButton', {
    header: '',
    cell: (info) => {
      return <Button onClick={info.getValue().handleWithdraw}>Withdraw</Button>;
    },
  }),
];

const LPPositions = ({
  positions,
  selectPosition,
  selectedPositions,
  unselectPosition,
}: any) => {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });

  const handleWithdraw = useCallback(
    async (txData: Hex, to: Address) => {
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
        const reciept = await publicClient.waitForTransactionReceipt({
          hash,
        });
        toast.success('Transaction sent');
      } catch (err) {
        const error = err as BaseError;
        console.error(err);
        toast.error(error.shortMessage);
      }
      toast.remove(loadingToastId);
    },
    [walletClient],
  );

  const lpPositions = useMemo(() => {
    return positions.map(
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

        return {
          earned: {
            callTokenAmount: formatUnits(
              BigInt(token0Earned),
              Number(token0Decimals),
            ),
            putTokenAmount: formatUnits(
              BigInt(token1Earned),
              Number(token1Decimals),
            ),
            callTokenSymbol: token0Symbol,
            putTokenSymbol: token1Symbol,
          },
          size: {
            callTokenAmount: formatUnits(
              BigInt(token0LiquidityInToken),
              Number(token0Decimals),
            ),
            putTokenAmount: formatUnits(
              BigInt(token1LiquidityInToken),
              Number(token1Decimals),
            ),
            callTokenSymbol: token0Symbol,
            putTokenSymbol: token1Symbol,
          },
          strike: {
            handleSelect: () => {
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
            callTokenAmount: formatUnits(
              BigInt(token0Withdrawable),
              Number(token0Decimals),
            ),
            putTokenAmount: formatUnits(
              BigInt(token1Withdrawable),
              Number(token1Decimals),
            ),
            callTokenSymbol: token0Symbol,
            putTokenSymbol: token1Symbol,
          },
          withdrawButton: {
            handleWithdraw: () => {
              const { txData, to } = meta.withdrawTx;
              handleWithdraw(txData, to);
            },
          },
        };
      },
    );
  }, [
    positions,
    selectPosition,
    selectedPositions,
    unselectPosition,
    handleWithdraw,
  ]);
  return (
    <TableLayout<LPPositionItem>
      data={lpPositions}
      columns={columns}
      rowSpacing={3}
      isContentLoading={false}
      pageSize={10}
    />
  );
};

export default LPPositions;
