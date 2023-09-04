import { useCallback, useMemo, useState } from 'react';
import { parseEther } from 'viem';

import { PositionsManager__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';
import { ClammWritePosition } from 'store/Vault/clamm';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

interface WritePositionData {
  strikeSymbol: string;
  strike: string;
  size: string;
  isPut: boolean;
  earnedAndPrice: {
    earned: string;
    price: number;
    tokenSymbol: string;
  };
  premiumsAndPrice: {
    premiums: string;
    price: number;
    tokenSymbol: string;
  };
  button: {
    handleBurn: () => void;
    id: number;
  };
}

const columnHelper = createColumnHelper<WritePositionData>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('isPut', {
    header: 'Side',
    cell: (info) => <p>{info.getValue() ? 'Put' : 'Call'}</p>,
  }),
  columnHelper.accessor('premiumsAndPrice', {
    header: 'Premiums',
    cell: (info) => {
      const value = info.getValue();
      const usdPrice = formatAmount(value.price * Number(value.premiums), 3);
      return (
        <>
          <span className="space-x-2">
            <p className="text-stieglitz inline-block">$</p>
            <p className="text-up-only inline-block">{usdPrice}</p>
          </span>
          <p className="text-stieglitz">
            {value.premiums} {value.tokenSymbol}
          </p>
        </>
      );
    },
  }),
  columnHelper.accessor('earnedAndPrice', {
    header: 'Total Earned',
    cell: (info) => {
      const value = info.getValue();
      const usdPrice = formatAmount(value.price * Number(value.earned), 3);
      return (
        <>
          <span className="space-x-2">
            <p className="text-stieglitz inline-block">$</p>
            <p className="text-up-only inline-block">{usdPrice}</p>
          </span>
          <p className="text-stieglitz">
            {value.earned} {value.tokenSymbol}
          </p>
        </>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();
      return (
        <Button key={value.id} color={'primary'} onClick={value.handleBurn}>
          Withdraw
        </Button>
      );
    },
  }),
];

type BurnPositionProps = Pick<
  ClammWritePosition,
  'tickLower' | 'tickUpper' | 'size'
>;

const WritePositions = ({
  writePositions,
}: {
  writePositions: ClammWritePosition[] | undefined;
}) => {
  const { positionManagerContract, uniswapPoolContract, clammMarkPrice } =
    useBoundStore();
  const [selectedPosition, setSelectedPosition] = useState<BurnPositionProps>();

  const { config: burnPositionConfig } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: positionManagerContract,
    functionName: 'burnPosition',
    args: [
      {
        pool: uniswapPoolContract,
        tickLower: selectedPosition?.tickLower || 0,
        tickUpper: selectedPosition?.tickUpper || 0,
        shares: parseEther((selectedPosition?.size || 0).toString()),
      },
    ],
  });
  const { write: burnPosition } = useContractWrite(burnPositionConfig);

  const handleBurn = useCallback(
    (index: number) => {
      if (!writePositions) return;
      setSelectedPosition({
        tickLower: writePositions[index].tickLower,
        tickUpper: writePositions[index].tickUpper,
        size: writePositions[index].size,
      });
      burnPosition?.();
    },
    [burnPosition, writePositions],
  );

  const positions: WritePositionData[] = useMemo(() => {
    if (!writePositions) return [];
    return writePositions.map((position: ClammWritePosition, index: number) => {
      return {
        strikeSymbol: position.strikeSymbol,
        strike: formatAmount(position.strike, 3),
        size: formatAmount(Number(position.size), 3),
        isPut: position.isPut,
        earnedAndPrice: {
          earned: formatAmount(position.earned, 3),
          price: clammMarkPrice,
          tokenSymbol: position.strikeSymbol.split('-')[0],
        },
        premiumsAndPrice: {
          premiums: formatAmount(position.premiums, 3),
          price: clammMarkPrice,
          tokenSymbol: position.strikeSymbol.split('-')[0],
        },
        button: {
          handleBurn: () => handleBurn(index),
          id: index,
        },
      };
    });
  }, [writePositions, clammMarkPrice, handleBurn]);

  return (
    <TableLayout<WritePositionData>
      data={positions}
      columns={columns}
      rowSpacing={2}
      isContentLoading={false}
    />
  );
};

export default WritePositions;
