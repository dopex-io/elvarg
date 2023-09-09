import React, { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Button /* Menu,*/, Disclosure, Skeleton } from '@dopex-io/ui';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  // EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useBoundStore } from 'store';

import Placeholder from 'components/ssov-beta/Tables/Placeholder';

import formatAmount from 'utils/general/formatAmount';

const ROWS_PER_PAGE = 5;

const StatItem = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const TableDisclosure = (props: any) => {
  return (
    <Disclosure.Panel as="tr" className="bg-umbra">
      <td colSpan={5}>
        <div className="grid grid-cols-5 gap-6 p-3">
          <StatItem name="IV" value={String(props.iv)} />
          <StatItem name="Delta" value={formatAmount(props.delta, 5)} />
          <StatItem name="Vega" value={formatAmount(props.vega, 5)} />
          <StatItem name="Gamma" value={formatAmount(props.gamma, 5)} />
          <StatItem name="Theta" value={formatAmount(props.theta, 5)} />
          <StatItem
            name="Utilization"
            value={`${formatAmount(props.utilization, 5)}%`}
          />
          <StatItem name="TVL" value={`$${formatAmount(props.tvl, 2, true)}`} />
        </div>
      </td>
    </Disclosure.Panel>
  );
};

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike',
    cell: (info) => (
      <span className="space-x-1 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('breakeven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="text-left flex">
        <p className="text-stieglitz pr-1">$</p>
        <p className="pr-1">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('liquidityAvailable', {
    header: 'Liquidity',
    cell: (info) => {
      return (
        <span className="text-left flex">
          <p className="text-stieglitz pr-1">$</p>
          <p className="pr-1">
            {formatAmount(info.getValue().amount, 5, true)}
          </p>
        </span>
      );
    },
  }),
  columnHelper.accessor('optionsAvailable', {
    header: 'Available',
    cell: (info) => {
      return (
        <span className="text-left flex">
          <p className="pr-1">{formatAmount(info.getValue(), 5, true)}</p>
        </span>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: () => null,
    cell: (info) => {
      const { onClick, premium, symbol, isSelected } = info.getValue();

      const approximationSymbol = premium < 1 ? '~' : null;

      return (
        <div className="flex space-x-2 justify-end">
          <Button
            color={isSelected ? 'primary' : 'mineshaft'}
            onClick={onClick}
            className="space-x-2 text-xs"
          >
            <span className="flex items-center space-x-1">
              <span>
                {approximationSymbol}
                {formatAmount(premium, 5)} {symbol}
              </span>
              {/* {isActive ? (
                <MinusCircleIcon className="w-[14px]" />
              ) : (
                <PlusCircleIcon className="w-[14px]" />
              )} */}
            </span>
          </Button>
        </div>
      );
    },
  }),
  // columnHelper.accessor('chevron', {
  //   header: () => null,
  //   cell: (info) => {
  //     return (
  //       <Disclosure.Button className="w-6">
  //         <ChevronDownIcon
  //           className={`text-stieglitz text-2xl cursor-pointer ${
  //             // @ts-ignore TODO: find the right way to pass a custom prop to a cell
  //             info.open ? 'rotate-180 transform' : ''
  //           }`}
  //         />
  //       </Disclosure.Button>
  //     );
  //   },
  // }),
];

const Table = ({ strikeData }: any) => {
  const table = useReactTable({
    columns,
    data: strikeData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: ROWS_PER_PAGE,
      },
    },
  });

  return (
    <div className="space-y-2 bg-cod-gray rounded-lg pt-3">
      <div className="overflow-x-auto">
        {strikeData.length > 0 ? (
          <>
            <table className="bg-cod-gray rounded-lg w-full">
              <thead className="border-b border-umbra sticky">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
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
                          className={`m-3 py-1 px-3 ${textAlignment}`}
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
                {table.getRowModel().rows.map((row, index) => {
                  return (
                    <Disclosure key={row.id}>
                      {({ open }: { open: boolean }) => {
                        return (
                          <>
                            <tr
                              className={`border-t border-umbra ${
                                open ? 'bg-umbra' : ''
                              }`}
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
                                    className={`m-3 py-4 px-3 ${textAlignment}`}
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
                            <TableDisclosure
                              {...strikeData[index].disclosure}
                            />
                          </>
                        );
                      }}
                    </Disclosure>
                  );
                })}
              </tbody>
            </table>
            {/* <TableLayout<StrikeItem>
              data={strikeData}
              columns={columns}
              disclosure={strikeData.map((s, index) => (
                <TableDisclosure key={index} {...s.disclosure} />
              ))}
              rowSpacing={3}
              isContentLoading={isLoading}
            /> */}
            <div className="p-1 flex items-center gap-1 justify-end">
              <span className="text-stieglitz text-sm mr-1">
                Rows per page:
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="text-white text-sm rounded-md bg-carbon p-1 mr-3"
              >
                {[5, 10].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="flex items-center">
                {/* <Menu
                  color="mineshaft"
                  dropdownVariant="icon"
                  handleSelection={e => {
                    table.setPageSize(Number(e.target.innerText))
                  }}
                  selection={table.getState().pagination.pageSize}
                  data={[3, 5, 10].map((s) => ({
                    textContent: `${s}`,
                    isDisabled: false,
                  }))}
                  className="z-10"
                  showArrow
                /> */}
                <span className="text-stieglitz text-sm mr-3">
                  {table.getState().pagination.pageSize *
                    table.getState().pagination.pageIndex +
                    1}{' '}
                  -{' '}
                  {Math.min(
                    table.getState().pagination.pageSize *
                      (table.getState().pagination.pageIndex + 1),
                    strikeData.length,
                  )}{' '}
                  of {strikeData.length}
                </span>
              </span>
              <button
                className="text-sm w-8 h-8 rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="text-stieglitz text-sm p-1" />
              </button>
              {Array.from(Array(table.getPageCount())).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    const page = (e.target as HTMLButtonElement).value
                      ? Number((e.target as HTMLButtonElement).value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className={`p-1 rounded w-8 h-8 text-stieglitz ${
                    table.getState().pagination.pageIndex === index
                      ? 'bg-carbon text-white'
                      : ''
                  } text-sm`}
                  value={index + 1}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="text-sm w-8 h-8 rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="text-stieglitz text-sm p-1" />
              </button>
            </div>
          </>
        ) : (
          <Placeholder isLoading={false} />
        )}
      </div>
    </div>
  );
};

const StrikesTable = () => {
  const {
    isPut,
    // selectedExpiry,
    tokenPrices,
    // isTrade,
    // selectedPair,
    ticksData,
    optionsPool,
    loading,
    keys,
    setSelectedClammStrike,
  } = useBoundStore();

  // const { strikesData: clammStrikesData, isLoading } = useStrikesData({
  //   uniswapPoolAddress: MARKETS[selectedPair].uniswapPoolAddress,
  //   isPut: isPut,
  //   selectedExpiryPeriod: selectedExpiry,
  //   currentPrice: clammMarkPrice,
  //   isTrade: isTrade,
  //   selectedUniswapPool: selectedUniswapPool,
  // });

  const [selectedStrikeIndex, setSelectedStrkikeIndex] = useState(0);
  const setActiveStrikeIndex = useCallback(
    (index: number) => setSelectedStrkikeIndex(index),
    // updateSelectedStrike(clammStrikesData[index].strike),
    [],
  );

  const strikeData = useMemo(() => {
    if (!optionsPool) return [];

    return ticksData
      .map(
        (
          {
            liquidityAvailable,
            tickLowerPrice,
            tickUpperPrice,
            tickLower,
            tickUpper,
          },
          index,
        ) => {
          const liquidityAvailableAtTick = formatUnits(
            liquidityAvailable[
              isPut ? keys.putAssetAmountKey : keys.callAssetAmountKey
            ],
            optionsPool[
              isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
            ],
          );
          const optionsAvailable = isPut
            ? Number(liquidityAvailableAtTick) / tickLowerPrice
            : Number(liquidityAvailableAtTick);

          const premium = 0;
          const breakeven = isPut
            ? tickLowerPrice - premium
            : tickUpperPrice + premium;

          return {
            strike: isPut ? tickLowerPrice : tickUpperPrice,
            liquidityAvailable: {
              amount: Number(liquidityAvailableAtTick),
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
            },
            premium,
            breakeven,
            optionsAvailable,
            button: {
              onClick: () => {
                setActiveStrikeIndex(index);
                setSelectedClammStrike({
                  tickLower: tickLower,
                  tickUpper: tickUpper,
                });
              },
              premium: premium,
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
              isSelected: index === selectedStrikeIndex,
            },
          };
        },
      )
      .filter(({ liquidityAvailable }) => liquidityAvailable.amount !== 0);
  }, [
    setSelectedClammStrike,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
    ticksData,
    optionsPool,
    isPut,
    selectedStrikeIndex,
    setActiveStrikeIndex,
  ]);

  // const strikeData: StrikeItem[] = useMemo(() => {
  //   if (optionsPool) return [];

  //   // Strike
  //   // Break even
  //   // total available
  //   // premium button
  //   //      premium token and premium amount
  //   return [];
  //   if (!clammStrikesData) return [];
  //   return clammStrikesData.map(
  //     (strikeData: ClammStrikeData, index: number) => {
  //       return {
  //         strike: strikeData.strike,
  //         liquidity: strikeData.liquidity,
  //         breakeven: strikeData.breakeven,
  //         button: {
  //           index,
  //           base: underlyingTokenSymbol,
  //           isPut: isPut,
  //           premiumPerOption: strikeData.premiumPerOption,
  //           strike: strikeData.strike,
  //           activeStrikeIndex: activeStrikeIndex,
  //           setActiveStrikeIndex: () => setActiveStrikeIndex(index),
  //         },
  //         chevron: null,
  //         disclosure: {
  //           iv: strikeData.iv,
  //           liquidity: strikeData.liquidity,
  //           delta: strikeData.delta,
  //           theta: strikeData.theta,
  //           gamma: strikeData.gamma,
  //           vega: strikeData.vega,
  //           utilization: strikeData.utilization,
  //           tvl: strikeData.tvl,
  //           apy: strikeData.apy,
  //           premiumApy: strikeData.premiumApy,
  //         },
  //       };
  //     },
  //   );
  // }, [
  //   activeStrikeIndex,
  //   clammStrikesData,
  //   isPut,
  //   setActiveStrikeIndex,
  //   underlyingTokenSymbol,
  // ]);

  if (loading.ticksData)
    return (
      <div className="grid grid-cols-1 gap-4 p-2">
        {Array.from(Array(4)).map((_, index) => {
          return (
            <Skeleton
              key={index}
              width="fitContent"
              height={70}
              color="carbon"
              variant="rounded"
            />
          );
        })}
      </div>
    );

  return <Table strikeData={strikeData} />;
};

export default StrikesTable;
