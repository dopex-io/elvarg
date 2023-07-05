import { useCallback, useMemo, useState } from 'react';

import { Button } from '@dopex-io/ui';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { WritePosition } from 'hooks/vaults/positions';
import useVaultState from 'hooks/vaults/state';

import Placeholder from 'components/vaults/Tables/Placeholder';

interface Props {
  positions: WritePosition[];
  isLoading?: boolean;
}

interface WritePositionData {
  strike: string;
  amount: string;
  side: string;
  epoch: number;
  button: {
    tokenId: number;
    epoch: number;
    currentEpoch: number;
    handleWithdraw: () => void;
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
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p className="text-stieglitz">{info.getValue()}</p>,
  }),
  columnHelper.accessor('epoch', {
    header: 'Epoch',
    cell: (info) => <p className="inline-block">{info.getValue()}</p>,
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();

      return (
        <Button
          key={value.tokenId}
          color={value.epoch > value.currentEpoch ? 'mineshaft' : 'primary'}
          onClick={value.handleWithdraw}
          disabled={Number(value.epoch) >= value.currentEpoch}
          className={`w-fit space-x-2 ${
            value.epoch > value.currentEpoch
              ? 'cursor-not-allowed'
              : 'cursor-default'
          }`}
        >
          <p className="inline-block">Withdraw</p>
        </Button>
      );
    },
  }),
];

const WritePositions = (props: Props) => {
  const { positions: _positions, isLoading = true } = props;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const vault = useVaultState((vault) => vault.vault);
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    abi: vault.abi as any,
    address: vault.address as `0x${string}`,
    functionName: 'withdraw',
    args: [_positions[activeIndex]?.tokenId, address],
  });
  const writeInstance = useContractWrite(config);

  const handleWithdraw = useCallback(
    (index: number) => {
      setActiveIndex(index);
      writeInstance.write?.();
    },
    [writeInstance]
  );

  const positions = useMemo(() => {
    if (!_positions) return [];

    return _positions.map((position: WritePosition, index: number) => {
      return {
        side: position.side,
        strike: String(position.strike) || '0',
        amount: position.balance.toFixed(3) || '0',
        epoch: position.epoch,
        button: {
          tokenId: position.tokenId,
          epoch: position.epoch,
          currentEpoch: vault.currentEpoch,
          handleWithdraw: () => handleWithdraw(index),
        },
      };
    });
  }, [_positions, vault, handleWithdraw]);

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
                                )}{' '}
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
                              )}{' '}
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

export default WritePositions;
