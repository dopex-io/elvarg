import {
  AccessorKeyColumnDef,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import Placeholder from 'components/ssov-beta/Tables/Placeholder';

interface Props<T> {
  data: T[];
  columns: (ColumnDef<T, any> | AccessorKeyColumnDef<T>)[];
  isContentLoading: boolean;
}

const TableLayout = <T extends object>({
  data,
  columns,
  isContentLoading,
}: Props<T>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  return data.length > 0 ? (
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
                              header.getContext(),
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
                <tr key={row.id} className={`border-b border-umbra`}>
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
                        className={`m-3 py-2 px-4 ${textAlignment}`}
                      >
                        <span className="text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
    <Placeholder isLoading={isContentLoading} />
  );
};

export default TableLayout;
