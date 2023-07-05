import React, { useCallback, useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';

import { Button, Disclosure, Menu } from '@dopex-io/ui';
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import PlusIcon from 'svgs/icons/PlusIcon';

import useVaultQuery from 'hooks/vaults/query';
import useVaultState, { DurationType } from 'hooks/vaults/state';
import useContractData from 'hooks/vaults/useContractData';

import Placeholder from 'components/vaults/Tables/Placeholder';
import FilterPanel from 'components/vaults/Tables/StrikesChain/FilterPanel';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';
import { STRIKES_MENU } from 'constants/vaults/dropdowns';

export type MenuDataType = { textContent: DurationType }[];

interface DisclosureStrikeItem {
  iv: number;
  delta: number;
  theta: number;
  vega: number;
  gamma: number;
}

interface StrikeItem {
  strike: number;
  breakeven: string;
  availableCollateral: {
    base: string;
    isPut: boolean;
    totalAvailableCollateral: number;
    availableCollateralPercentage: number;
  };
  button: {
    index: number;
    base: string;
    isPut: boolean;
    premiumPerOption: bigint;
  };
  chevron: null;
  disclosure: DisclosureStrikeItem;
}

const StatItem = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const TableDisclosure = (props: DisclosureStrikeItem) => {
  return (
    <Disclosure.Panel as="tr" className="bg-umbra">
      <td colSpan={5}>
        <div className="grid grid-cols-6 gap-6 p-3">
          <StatItem name="IV" value={String(props.iv)} />
          <StatItem name="Delta" value={formatAmount(props.delta, 5)} />
          <StatItem name="Vega" value={formatAmount(props.vega, 5)} />
          <StatItem name="Gamma" value={formatAmount(props.gamma, 5)} />
          <StatItem name="Theta" value={formatAmount(props.theta, 5)} />
        </div>
      </td>
    </Disclosure.Panel>
  );
};

const columnHelper = createColumnHelper<StrikeItem>();

const StrikesChain = ({ selectedToken }: { selectedToken: string }) => {
  const vault = useVaultState((vault) => vault.vault);
  const setActiveStrikeIndex = useVaultState(
    (vault) => vault.setActiveStrikeIndex
  );

  const { selectedVault, vaults, updateSelectedVault } = useVaultQuery({
    vaultSymbol: selectedToken,
  });

  const { ...strikes } = useContractData({
    contractAddress: selectedVault?.contractAddress,
    epoch: selectedVault?.currentEpoch,
  });

  const handleClickMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>, index: number) => {
      if (e.currentTarget.textContent === 'Orderbook') {
        console.log(index);
      }
    },
    []
  );

  useEffect(() => {
    updateSelectedVault(vault.durationType, vault.isPut as boolean);
  }, [updateSelectedVault, vault]);

  const strikeData = useMemo(() => {
    if (
      !strikes.epochStrikeData ||
      !strikes.data ||
      !strikes.data[0] ||
      !(strikes.data[0] as any).result.expiry ||
      !vaults
    )
      return [];

    return strikes.epochStrikeData.map((strikeData, index) => {
      const premiumFormatted = Number(
        formatUnits(strikeData.premiumPerOption || 0n, DECIMALS_TOKEN)
      );

      return {
        strike: strikeData.strike,
        breakeven: (vault.isPut
          ? strikeData.strike - premiumFormatted
          : strikeData.strike + premiumFormatted * strikeData.spot
        ).toFixed(3),
        availableCollateral: {
          base: vault.base,
          isPut: vault.isPut,
          totalAvailableCollateral: strikeData.totalAvailableCollateral,
          availableCollateralPercentage:
            strikeData.availableCollateralPercentage,
        },
        button: {
          index,
          base: vault.base,
          isPut: vault.isPut,
          premiumPerOption: strikeData.premiumPerOption,
        },
        chevron: null,
        disclosure: {
          iv: strikeData.iv,
          delta: strikeData.delta,
          theta: strikeData.theta,
          gamma: strikeData.gamma,
          vega: strikeData.vega,
        },
      };
    });
  }, [strikes, vaults, vault]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor('strike', {
        header: 'Strike',
        cell: (info) => (
          <span className="space-x-1 text-left">
            <p className="text-stieglitz inline-block">$</p>
            <p className="inline-block">{info.getValue()}</p>
          </span>
        ),
      }),
      columnHelper.accessor('breakeven', {
        header: 'Breakeven',
        cell: (info) => (
          <span className="text-left flex">
            <p className="text-stieglitz pr-1">$</p>
            <p className="pr-1">{info.getValue()}</p>
          </span>
        ),
      }),
      columnHelper.accessor('availableCollateral', {
        header: 'Total Available',
        cell: (info) => {
          const value = info.getValue();

          return (
            <span className="space-y-1 text-xs">
              <span
                className={`flex ${
                  value.isPut ? 'flex-row-reverse justify-end' : 'space-x-1'
                }`}
              >
                <p className="inline-block">
                  {formatAmount(value.totalAvailableCollateral, 3)}
                </p>
                <p className="text-stieglitz inline-block">
                  {value.isPut ? '$' : value.base}
                </p>
              </span>
              <p className="text-stieglitz text-xs">
                {formatAmount(value.availableCollateralPercentage, 3)}%
              </p>
            </span>
          );
        },
      }),
      columnHelper.accessor('button', {
        header: () => null,
        cell: (info) => {
          const value = info.getValue();

          const _symbol = value.isPut ? '$' : value.base;

          return (
            <div className="flex space-x-2 justify-end">
              <Button
                id={`strike-chain-button-${value.index}`}
                color="mineshaft"
                onClick={() => setActiveStrikeIndex(value.index)}
                className="space-x-2 text-xs hover:cursor-pointer"
              >
                <p className="my-auto inline-block">{_symbol}</p>
                <p className="inline-block">
                  {formatAmount(
                    formatUnits(value.premiumPerOption || 0n, DECIMALS_TOKEN),
                    3
                  )}
                </p>
                <PlusIcon
                  className="w-[10px] h-[10px] inline-block"
                  color="#8E8E8E"
                />
              </Button>
              <Menu
                color="mineshaft"
                selection={
                  <EllipsisVerticalIcon className="w-4 h-4 fill-current text-white" />
                }
                handleSelection={(e: React.MouseEvent<HTMLElement>) => {
                  handleClickMenu(e, value.index);
                }}
                data={STRIKES_MENU}
                className="w-fit"
              />
              {/* todo: OLP dialog
          Pass selected strike, ssov address, side into dialog
          */}
            </div>
          );
        },
      }),
      columnHelper.accessor('chevron', {
        header: () => null,
        cell: () => {
          return (
            <Disclosure.Button as="td" className="w-6">
              <ChevronDownIcon
                className={`text-stieglitz text-2xl cursor-pointer`}
              />
            </Disclosure.Button>
          );
        },
      }),
    ];
  }, [handleClickMenu, setActiveStrikeIndex]);

  const table = useReactTable({
    columns,
    data: strikeData,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  return (
    <div className="space-y-2 bg-cod-gray rounded-lg pt-3">
      <div className="relative h-12 mx-3">
        {vaults[0] && (
          <FilterPanel
            selectedToken={selectedToken}
            isPut={vault.isPut}
            durationType={vault.durationType}
          />
        )}
      </div>
      <div className="overflow-x-auto">
        {strikeData.length > 0 && !strikes.isLoading ? (
          <table className="bg-cod-gray rounded-lg w-full">
            <thead className="border-b border-umbra sticky">
              {getHeaderGroups().map((headerGroup) => (
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
                        className={`m-3 py-1 px-4 ${textAlignment}`}
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
              {getRowModel().rows.map((row, index) => {
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
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                          <TableDisclosure {...strikeData[index].disclosure} />
                        </>
                      );
                    }}
                  </Disclosure>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Placeholder isLoading={strikes.isLoading} />
        )}
      </div>
    </div>
  );
};

export default StrikesChain;
