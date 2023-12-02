'use client';

import { formatUnits } from 'viem';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import useAtlanticStraddlePositions, {
  DepositPosition,
} from '../hooks/useAtlanticStraddlePositions';
import Table from './table';

const columnHelper = createColumnHelper<DepositPosition>();

const columns = [
  columnHelper.accessor('amount', {
    header: () => 'Amount',
    cell: (info) => formatUnits(info.getValue(), 6),
    footer: (info) => info.column.id,
  }),

  columnHelper.accessor('epoch', {
    header: () => 'Epoch',
    cell: (info) => Number(info.renderValue()),
    footer: (info) => info.column.id,
  }),
];

export default function AtlanticStraddles() {
  const positions = useAtlanticStraddlePositions({
    user: '0x6fb737d1ebb73cda6cfa36fd16d9273065d1b084',
  });

  const table = useReactTable({
    data: positions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className="border-b-[0.5px] border-white/25"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => (
                <Table.CellHeader key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.CellHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              className="border-b-[0.5px] border-white/25 border-opacity-50"
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
