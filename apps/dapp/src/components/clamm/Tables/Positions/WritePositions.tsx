import { useCallback, useMemo, useState } from 'react';

import { PositionsManager__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { WritePosition } from 'store/Vault/clamm';

import TableLayout from 'components/common/TableLayout';

import { MARKETS } from 'constants/clamm/markets';

interface WritePositionData {
  strike: number;
  size: {
    token0Amount: string;
    token0Symbol: string;
    token1Amount: string;
    token1Symbol: string;
  };
  side: boolean;
  earned: {
    token0Amount: string;
    token0Symbol: string;
    token1Amount: string;
    token1Symbol: string;
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
        <p className="inline-block">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => {
      // @ts-ignore
      const { token0Amount, token1Amount, token0Symbol, token1Symbol } =
        info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          {Number(token0Amount) !== 0 && (
            <span>
              {token0Amount}{' '}
              <span className="text-stieglitz">{token0Symbol}</span>
            </span>
          )}
          {Number(token1Amount) !== 0 && (
            <span>
              {token1Amount}{' '}
              <span className="text-stieglitz">{token1Symbol}</span>
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p>{info.getValue() ? 'Call' : 'Put'}</p>,
  }),

  columnHelper.accessor('earned', {
    header: 'Premiums',
    cell: (info) => {
      const { token0Amount, token0Symbol, token1Amount, token1Symbol } =
        info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          {
            <span>
              {token0Amount}{' '}
              <span className="text-stieglitz">{token0Symbol}</span>
            </span>
          }
          <span>
            {token1Amount}{' '}
            <span className="text-stieglitz">{token1Symbol}</span>
          </span>
        </div>
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

type BurnPositionProps = {
  tickLower: number;
  tickUpper: number;
  shares: bigint;
};

const WritePositions = ({
  writePositions,
}: {
  writePositions: WritePosition[];
}) => {
  const [selectedPosition, setSelectedPosition] = useState<BurnPositionProps>();

  const { config: burnPositionConfig } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F',
    functionName: 'burnPosition',
    args: [
      {
        pool: MARKETS['ARB-USDC'].uniswapPoolAddress,
        tickLower: selectedPosition?.tickLower || 0,
        tickUpper: selectedPosition?.tickUpper || 0,
        shares: selectedPosition?.shares || 0n,
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
        shares: BigInt(writePositions[index].shares),
      });
      burnPosition?.();
    },
    [burnPosition, writePositions],
  );

  const positions: WritePositionData[] = useMemo(() => {
    return writePositions.map((position: WritePosition, index: number) => {
      return {
        strike: position.strike,
        size: {
          token0Amount: position.liquidity.token0Amount,
          token0Symbol: position.liquidity.token0Symbol,
          token1Amount: position.liquidity.token1Amount,
          token1Symbol: position.liquidity.token1Symbol,
        },
        side: position.callOrPut,
        earned: {
          token0Amount: position.earnings.token0Amount,
          token0Symbol: position.earnings.token0Symbol,
          token1Amount: position.earnings.token1Amount,
          token1Symbol: position.earnings.token1Symbol,
        },
        button: {
          handleBurn: () => handleBurn(index),
          id: index,
        },
      };
    });
  }, [writePositions, handleBurn]);

  return (
    <div>
      <TableLayout<WritePositionData>
        data={positions}
        columns={columns}
        rowSpacing={2}
        isContentLoading={false}
      />
    </div>
  );
};

export default WritePositions;
