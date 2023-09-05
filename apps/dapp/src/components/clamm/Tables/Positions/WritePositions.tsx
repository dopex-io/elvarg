import { useCallback, useMemo, useState } from 'react';
import { Address, formatUnits, parseEther } from 'viem';

import { PositionsManager__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';
import { ClammWritePosition } from 'store/Vault/clamm';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

import { CHAINS } from 'constants/chains';
import { MARKETS } from 'constants/clamm/markets';

import WithdrawModal from './WithdrawModal/WithdrawModal';

interface WritePositionData {
  strikeSymbol: string;
  strike: string;
  size: string;
  size2: {
    token0: string;
    token1: string;
    token0Symbol: string;
    token1Symbol: string;
  };
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
  premium2: {
    token0: string;
    token1: string;
    token0Symbol: string;
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
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => {
      // @ts-ignore
      const { token0, token1, token0Symbol, token1Symbol } = info.getValue();
      console.log('token 0 type', Number(token0) > 0);
      console.log('token 1 type', Number(token1) > 0);
      return (
        <div className="flex flex-col items-start justify-center">
          {Number(token0) !== 0 && (
            <span>
              {token0} <span className="text-stieglitz">{token0Symbol}</span>
            </span>
          )}
          {Number(token1) !== 0 && (
            <span>
              {token1} <span className="text-stieglitz">{token1Symbol}</span>
            </span>
          )}
        </div>
      );
    },
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
  columnHelper.accessor('premium2', {
    header: 'Premiums',
    cell: (info) => {
      const { token0, token0Symbol, token1, token1Symbol } = info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          {
            <span>
              {token0} <span className="text-stieglitz">{token0Symbol}</span>
            </span>
          }
          <span>
            {token1} <span className="text-stieglitz">{token1Symbol}</span>
          </span>
        </div>
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

type BurnPositionProps = {
  tickLower: number;
  tickUpper: number;
  shares: bigint;
};

const WritePositions = ({
  writePositions,
}: {
  writePositions: ClammWritePosition[] | undefined;
}) => {
  const {
    positionManagerContract,
    clammMarkPrice,
    selectedUniswapPool,
    chainId,
  } = useBoundStore();
  const [selectedPosition, setSelectedPosition] = useState<BurnPositionProps>();

  const tokenDecimalsAndSymbols = useMemo(() => {
    const amount0Symbol =
      selectedUniswapPool.token0 == selectedUniswapPool.underlyingToken
        ? selectedUniswapPool.underlyingTokenSymbol
        : selectedUniswapPool.collateralTokenSymbol;
    const amount1Symbol =
      selectedUniswapPool.token1 == selectedUniswapPool.collateralTokenSymbol
        ? selectedUniswapPool.collateralTokenSymbol
        : selectedUniswapPool.underlyingTokenSymbol;

    const amount0Decimals = CHAINS[chainId].tokenDecimals[amount0Symbol];
    const amount1Decimals = CHAINS[chainId].tokenDecimals[amount1Symbol];

    return {
      amount0Decimals,
      amount1Decimals,
      amount0Symbol,
      amount1Symbol,
    };
  }, [
    chainId,
    selectedUniswapPool.collateralTokenSymbol,
    selectedUniswapPool.token0,
    selectedUniswapPool.token1,
    selectedUniswapPool.underlyingToken,
    selectedUniswapPool.underlyingTokenSymbol,
  ]);

  const { config: burnPositionConfig } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: positionManagerContract,
    functionName: 'burnPosition',
    args: [
      {
        pool: MARKETS['ARB-USDC'].uniswapPoolAddress,
        tickLower: selectedPosition?.tickLower || 0,
        tickUpper: selectedPosition?.tickUpper || 0,
        shares: 1n,
      },
    ],
  });
  const { write: burnPosition } = useContractWrite(burnPositionConfig);

  const handleBurn = useCallback(
    (index: number, withdrawable: bigint) => {
      if (!writePositions) return;

      console.log(
        'parameters',
        writePositions[index].tickLower,
        writePositions[index].tickUpper,
        writePositions[index].balance,
      );
      setSelectedPosition({
        tickLower: writePositions[index].tickLower,
        tickUpper: writePositions[index].tickUpper,
        shares: withdrawable - 10000000000000n,
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
        // size: formatAmount(Number(position.size), 3),
        size: {
          token0: formatAmount(
            formatUnits(
              position.size.token0,
              tokenDecimalsAndSymbols.amount0Decimals,
            ),
            4,
          ),
          token0Symbol: tokenDecimalsAndSymbols.amount0Symbol,
          token1: formatAmount(
            formatUnits(
              position.size.token1,
              tokenDecimalsAndSymbols.amount1Decimals,
            ),
            4,
          ),
          token1Symbol: tokenDecimalsAndSymbols.amount1Symbol,
        },
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
        premium2: {
          token0: formatAmount(
            formatUnits(
              position.premiums2.token0,
              tokenDecimalsAndSymbols.amount1Decimals,
            ),
            4,
          ),
          token0Symbol: tokenDecimalsAndSymbols.amount0Symbol,
          token1: formatAmount(
            formatUnits(
              position.premiums2.token1,
              tokenDecimalsAndSymbols.amount1Decimals,
            ),
            4,
          ),
          token1Symbol: tokenDecimalsAndSymbols.amount1Symbol,
        },
        button: {
          handleBurn: () => handleBurn(index, position.withdrawable),
          id: index,
        },
      };
    });
  }, [
    writePositions,
    clammMarkPrice,
    handleBurn,
    tokenDecimalsAndSymbols.amount0Decimals,
    tokenDecimalsAndSymbols.amount1Decimals,
    tokenDecimalsAndSymbols.amount0Symbol,
    tokenDecimalsAndSymbols.amount1Symbol,
  ]);

  return (
    <div>
      <WithdrawModal open={true} handleClose={() => 0} />
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
