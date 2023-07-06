import { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import format from 'date-fns/format';

// import { useAccount } from 'wagmi';

import { BuyPosition } from 'hooks/vaults/positions';
import useVaultState from 'hooks/vaults/state';

import Placeholder from 'components/vaults/Tables/Placeholder';

import { formatAmount } from 'utils/general';
import computeOptionPnl from 'utils/math/computeOptionPnl';

interface Props {
  positions: BuyPosition[];
  isLoading?: boolean;
}

interface BuyPositionData {
  strike: number;
  size: string;
  side: string;
  expiry: number;
  breakeven: string;
  pnl: string;
  button: {
    handleSettle: () => void;
    id: string;
    epoch: number;
    currentEpoch: number;
  };
}

const columnHelper = createColumnHelper<BuyPositionData>();

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
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p className="text-stieglitz">{info.getValue()}</p>,
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <p className="inline-block">
        {format(info.getValue() * 1000, 'dd MMM yyyy')}
      </p>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('breakeven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">$ {info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('pnl', {
    header: 'PnL',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">$ {info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();

      return (
        <Button
          key={value.id}
          color={value.epoch > value.currentEpoch ? 'mineshaft' : 'primary'}
          onClick={value.handleSettle}
          disabled={Number(value.epoch) >= value.currentEpoch}
          className={`w-fit space-x-2 ${
            value.epoch > value.currentEpoch
              ? 'cursor-not-allowed'
              : 'cursor-default'
          }`}
        >
          <p className="inline-block">Settle</p>
        </Button>
      );
    },
  }),
];

const BuyPositions = (props: Props) => {
  const { positions: _positions, isLoading = true } = props;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const vault = useVaultState((state) => state.vault);

  // const { address } = useAccount();
  // const { config } = usePrepareContractWrite({
  //   abi: vault.abi as any,
  //   address: vault.address as `0x${string}`,
  //   functionName: 'settle',
  //   args: [
  //     0, // placeholder for strike index
  //     ethers.utils
  //       .parseUnits(_positions[activeIndex]?.balance || '0', 18)
  //       .toString(),
  //     18,
  //     _positions[activeIndex]?.epoch,
  //     address,
  //   ],
  //   // todo: pass strike index properly
  //   // todo: handle OTM expiries
  // });

  // const writeInstance = useContractWrite(config);

  const handleSettle = useCallback((index: number) => {
    setActiveIndex(index);
    // writeInstance.write?.();
  }, []);

  const positions = useMemo(() => {
    if (!_positions) return [];
    return _positions.map((position, index: number) => {
      const size = Number(formatUnits(BigInt(position.balance), 18));

      let premium = position.premium;
      if (position.side === 'Call') {
        premium = position.premium * vault.underlyingPrice;
      }

      const breakeven = formatAmount(premium / size + position.strike, 5);
      const pnl = formatAmount(
        computeOptionPnl({
          strike: position.strike,
          price: vault.underlyingPrice,
          size,
          side: position.side.toLowerCase() as 'call' | 'put',
        }) - premium,
        5
      );

      return {
        side: position.side,
        strike: position.strike || 0,
        size:
          Number(formatUnits(BigInt(position.balance), 18)).toFixed(3) || '0',
        expiry: position.expiry,
        breakeven,
        pnl,
        button: {
          id: position.id,
          handleSettle: () => handleSettle(index),
          epoch: position.epoch,
          currentEpoch: vault.currentEpoch,
        },
      };
    });
  }, [_positions, handleSettle, vault]);

  const table = useReactTable({
    columns,
    data: positions,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  return (
    <div className="space-y-2">
      {positions.length > 0 ? (
        <div className="space-y-2 bg-cod-gray rounded-lg py-3">
          <div className="overflow-x-auto">
            <table className="bg-cod-gray rounded-lg w-full">
              <thead className="sticky">
                {getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index: number) => {
                      let textAlignment;
                      if (index === 0) {
                        textAlignment = 'text-left';
                      } else if (index === columns.length - 1) {
                        textAlignment = 'text-right';
                      } else {
                        textAlignment = 'text-left';
                      }
                      return (
                        <th
                          key={header.id}
                          className={`m-3 py-1 px-4 ${textAlignment} w-1/${columns.length}`}
                        >
                          <span className="text-sm text-stieglitz font-normal">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="max-h-32 overflow-y-auto">
                {getRowModel().rows.map((row) => {
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-umbra border-b border-umbra`}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        let textAlignment;
                        if (index === 0) {
                          textAlignment = 'text-left';
                        } else if (index === columns.length - 1) {
                          textAlignment = 'text-right';
                        } else {
                          textAlignment = 'text-left';
                        }
                        return (
                          <td
                            key={cell.id}
                            className={`m-3 py-2 px-3 ${textAlignment}`}
                          >
                            <span className="text-sm">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Placeholder isLoading={isLoading} />
      )}
    </div>
  );
};

export default BuyPositions;
