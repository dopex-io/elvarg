import { useCallback, useMemo } from 'react';

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
  earned: string;
  premiums: string;
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
  columnHelper.accessor('premiums', {
    header: 'Premiums',
    cell: (info) => (
      <>
        <span className="space-x-2">
          <p className="text-stieglitz inline-block">$</p>
          <p className="text-up-only inline-block">{info.getValue()}</p>
        </span>
        <p className="text-stieglitz">0.21 ETH</p>
      </>
    ),
  }),
  columnHelper.accessor('earned', {
    header: 'Total Earned',
    cell: (info) => (
      <>
        <span className="space-x-2">
          <p className="text-stieglitz inline-block">$</p>
          <p className="text-up-only inline-block">{info.getValue()}</p>
        </span>
        <p className="text-stieglitz">0.21 ETH</p>
      </>
    ),
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

const WritePositions = ({
  writePositions,
}: {
  writePositions: ClammWritePosition[];
}) => {
  const { positionManagerContract, uniswapPoolContract } = useBoundStore();

  // IUniswapV3Pool pool;
  // int24 tickLower;
  // int24 tickUpper;
  // uint256 shares;
  const tickLower = 2299; // TODO: any decimals?
  const tickUpper = 2302;
  const shares = 0;
  const { config: burnPositionConfig } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: positionManagerContract,
    functionName: 'burnPosition',
    args: [
      {
        pool: uniswapPoolContract,
        tickLower: tickLower,
        tickUpper: tickUpper,
        shares: BigInt(shares),
      },
    ],
  });
  const { write: burnPosition } = useContractWrite(burnPositionConfig);

  // TODO: how to burn based on ID?
  const handleBurn = useCallback(
    (index: number) => {
      if (!writePositions) return;
      // const writePosition = writePositions[index];
      burnPosition?.();
    },
    [burnPosition, writePositions],
  );

  const positions = useMemo(() => {
    if (!writePositions) return [];
    return writePositions.map((position: ClammWritePosition, index: number) => {
      return {
        strikeSymbol: position.strikeSymbol,
        strike: formatAmount(position.strike, 3),
        size: formatAmount(Number(position.size)),
        isPut: position.isPut,
        earned: formatAmount(position.earned, 3),
        premiums: formatAmount(position.premiums, 3),
        button: {
          handleBurn: () => handleBurn(index),
          id: index,
        },
      };
    });
  }, [writePositions, handleBurn]);

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
