import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import { Button } from '@dopex-io/ui';
import { BuyPosition } from 'hooks/vaults/positions';
import useVaultState from 'hooks/vaults/state';
import { Column, useTable } from 'react-table';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import Placeholder from 'components/vaults/Tables/Placeholder';

interface Props {
  positions: BuyPosition[];
  isLoading?: boolean;
}

const BuyPositions = (props: Props) => {
  const { positions: _positions, isLoading = true } = props;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const vault = useVaultState((vault) => vault.vault);
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    abi: vault.abi as any,
    address: vault.address as `0x${string}`,
    functionName: 'settle',
    args: [
      0, // placeholder for strike index
      ethers.utils
        .parseUnits(_positions[activeIndex]?.balance || '0', 18)
        .toString(),
      18,
      _positions[activeIndex]?.epoch,
      address,
    ],
    // todo: pass strike index properly
    // todo: handle OTM expiries
  });

  const writeInstance = useContractWrite(config);

  const handleSettle = useCallback(
    (index: number) => {
      setActiveIndex(index);
      writeInstance.write?.();
    },
    [writeInstance]
  );

  const positions = useMemo(() => {
    if (!_positions) return [];
    return _positions.map((position: any, index: number) => {
      return {
        side: <p className="text-stieglitz">{position.side}</p>,
        strike: (
          <span className="space-x-2 text-left">
            <p className="text-stieglitz inline-block">$</p>
            <p className="inline-block">{position.strike || '0'}</p>
          </span>
        ),
        amount: (
          <span className="space-x-2">
            <p className="inline-block">
              {Number(
                ethers.utils.formatUnits(position.balance, 'ether')
              ).toFixed(3) || '0'}
            </p>
          </span>
        ),
        epoch: <p className="inline-block">{position.epoch}</p>,
        button: (
          <Button
            key={position.id}
            color={
              position.epoch > vault.currentEpoch ? 'mineshaft' : 'primary'
            }
            onClick={() => handleSettle(index)}
            disabled={Number(position.epoch) >= vault.currentEpoch}
            className={`w-fit space-x-2 ${
              position.epoch > vault.currentEpoch
                ? 'cursor-not-allowed'
                : 'cursor-default'
            }`}
          >
            <p className="inline-block">Settle</p>
          </Button>
        ),
      };
    });
  }, [_positions, handleSettle, vault]);

  const columns: Array<Column> = useMemo(() => {
    return [
      {
        Header: 'Strike Price',
        accessor: 'strike',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Side',
        accessor: 'side',
      },
      {
        Header: 'Epoch',
        accessor: 'epoch',
      },
      {
        Header: '',
        accessor: 'button',
      },
    ];
  }, []);

  const tableInstance = useTable({ columns, data: positions });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="space-y-2">
      {positions.length > 0 ? (
        <div className="space-y-2 bg-cod-gray rounded-lg py-3">
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="bg-cod-gray rounded-lg w-full"
            >
              <thead className="sticky">
                {headerGroups.map((headerGroup: any, index: number) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column: any, index: number) => {
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
                          {...column.getHeaderProps()}
                          key={index}
                          className={`m-3 py-1 px-4 ${textAlignment} w-1/${columns.length}`}
                        >
                          <span className="text-sm text-stieglitz font-normal">
                            {column.render('Header')}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="max-h-32 overflow-y-auto"
              >
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={index}
                      className={`hover:bg-umbra border-b border-umbra`}
                    >
                      {row.cells.map((cell, index) => {
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
                            {...cell.getCellProps()}
                            key={index}
                            className={`m-3 py-2 px-3 ${textAlignment}`}
                          >
                            <span className="text-sm">
                              {cell.render('Cell')}
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
