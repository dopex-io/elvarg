import { Disclosure, Skeleton } from '@dopex-io/ui';
import {
  AccessorKeyColumnDef,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface Props<T> {
  data: T[];
  columns: (ColumnDef<T, any> | AccessorKeyColumnDef<T>)[];
  isContentLoading: boolean;
  disclosure?: React.ReactElement<Partial<T>>[];
}

const Placeholder = () => {
  return (
    <div className="flex justify-center my-auto w-full bg-cod-gray rounded-lg py-8">
      <p className="text-sm text-stieglitz">Nothing to show</p>
    </div>
  );
};

const TableLayout = <T extends object>({
  data,
  columns,
  disclosure,
  isContentLoading = true,
}: Props<T>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  if (isContentLoading)
    return Array.from(Array(4)).map((_, index) => {
      return (
        <Skeleton
          key={index}
          width="fitContent"
          height={70}
          color="carbon"
          variant="rounded"
        />
      );
    });

  return data.length > 0 ? (
    <div className="space-y-2 bg-cod-gray rounded-lg">
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
                      className={`m-3 py-2 px-4 ${textAlignment} w-1/${columns.length}`}
                    >
                      <span className="text-xs text-stieglitz font-normal">
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
          <tbody className="max-h-32 overflow-y-auto divide-y divide-umbra">
            {getRowModel().rows.map((row, index) => {
              return (
                <Disclosure key={row.id}>
                  {({ open }: { open: boolean }) => {
                    return (
                      <>
                        <tr className={`${open ? 'bg-umbra' : ''}`}>
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
                                  {flexRender(cell.column.columnDef.cell, {
                                    ...cell.getContext(),
                                    open,
                                  })}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                        {disclosure ? disclosure[index] : null}
                      </>
                    );
                  }}
                </Disclosure>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Placeholder />
  );
};

export default TableLayout;
