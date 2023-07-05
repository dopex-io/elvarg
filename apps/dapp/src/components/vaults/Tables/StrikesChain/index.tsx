import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';

import { Button, Disclosure, Menu } from '@dopex-io/ui';
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { Column, useTable } from 'react-table';
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

const StatItem = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const StrikesChain = ({ selectedToken }: { selectedToken: string }) => {
  const vault = useVaultState((vault) => vault.vault);
  const setActiveStrikeIndex = useVaultState(
    (vault) => vault.setActiveStrikeIndex
  );
  const activeStrikeIndex = useVaultState((vault) => vault.activeStrikeIndex);
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

      const _symbol = vault.isPut ? '$' : vault.base;

      return {
        strike: (
          <span className="space-x-1 text-left">
            <p className="text-stieglitz inline-block">$</p>
            <p className="inline-block">{strikeData.strike}</p>
          </span>
        ),
        breakeven: (
          <span className="text-left flex">
            <p className="text-stieglitz pr-1">$</p>
            <p className="pr-1">
              {(vault.isPut
                ? strikeData.strike - premiumFormatted
                : strikeData.strike + premiumFormatted * strikeData.spot
              ).toFixed(3)}
            </p>
          </span>
        ),
        availableCollateral: (
          <span className="space-y-1 text-xs">
            <span
              className={`flex ${
                vault.isPut ? 'flex-row-reverse justify-end' : 'space-x-1'
              }`}
            >
              <p className="inline-block">
                {formatAmount(strikeData.totalAvailableCollateral, 3)}
              </p>
              <p className="text-stieglitz inline-block">
                {vault.isPut ? '$' : vault.base}
              </p>
            </span>
            <p className="text-stieglitz text-xs">
              {formatAmount(strikeData.availableCollateralPercentage, 3)}%
            </p>
          </span>
        ),
        expiry: (
          <p className="inline-block">
            {format(
              new Date(Number((strikes.data as any)[0].result.expiry) * 1000),
              'dd LLL yyy'
            )}
          </p>
        ),
        button: (
          <div className="flex space-x-2 justify-end">
            <Button
              id={`strike-chain-button-${index}`}
              key={index}
              color="mineshaft"
              onClick={() => setActiveStrikeIndex(index)}
              className={`w-full space-x-2 text-xs hover:cursor-pointer ${
                index === activeStrikeIndex
                  ? 'ring-1 ring-frost animate-pulse'
                  : null
              }`}
            >
              <p className="text-stieglitz my-auto inline-block">{_symbol}</p>
              <p className="inline-block">
                {formatAmount(
                  formatUnits(
                    strikeData.premiumPerOption || 0n,
                    DECIMALS_TOKEN
                  ),
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
                handleClickMenu(e, index);
              }}
              data={STRIKES_MENU}
              className="w-fit"
            />
            {/* todo: OLP dialog
            Pass selected strike, ssov address, side into dialog
            */}
          </div>
        ),
        chevron: (
          <Disclosure.Button as="td" className="w-6">
            <ChevronDownIcon
              className={`text-stieglitz text-2xl cursor-pointer`}
            />
          </Disclosure.Button>
        ),
        disclosure: (
          <Disclosure.Panel as="tr" className="bg-umbra">
            <td colSpan={6}>
              <div className="grid grid-cols-6 gap-6 p-3">
                <StatItem name="IV" value={String(strikeData.iv)} />
                <StatItem
                  name="Delta"
                  value={formatAmount(strikeData.delta, 5)}
                />
                <StatItem
                  name="Vega"
                  value={formatAmount(strikeData.vega, 5)}
                />
                <StatItem
                  name="Gamma"
                  value={formatAmount(strikeData.gamma, 5)}
                />
                <StatItem
                  name="Theta"
                  value={formatAmount(strikeData.theta, 5)}
                />
              </div>
            </td>
          </Disclosure.Panel>
        ),
      };
    });
  }, [
    strikes,
    vaults,
    vault,
    activeStrikeIndex,
    setActiveStrikeIndex,
    handleClickMenu,
  ]);

  const columns: Array<Column> = useMemo(() => {
    return [
      {
        Header: 'Strike Price',
        accessor: 'strike',
      },
      {
        Header: 'Breakeven',
        accessor: 'breakeven',
      },
      {
        Header: 'Total Available',
        accessor: 'availableCollateral',
      },
      {
        Header: 'Expiry',
        accessor: 'expiry',
      },
      {
        Header: '',
        accessor: 'button',
      },
      {
        Header: '',
        accessor: 'chevron',
      },
    ];
  }, []);

  const tableInstance = useTable({ columns, data: strikeData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="space-y-2 bg-cod-gray rounded-lg py-3">
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
          <table {...getTableProps()} className="bg-cod-gray rounded-lg w-full">
            <thead className="border-b border-umbra sticky">
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
                        className={`m-3 py-1 px-4 ${textAlignment}`}
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
                  <Disclosure key={index}>
                    {({ open }: { open: boolean }) => {
                      return (
                        <>
                          <tr
                            {...row.getRowProps()}
                            className={`border-t border-umbra ${
                              open ? 'bg-umbra' : ''
                            }`}
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
                                  className={`m-3 py-4 px-3 ${textAlignment}`}
                                >
                                  <span className="text-sm">
                                    {cell.render('Cell', { open })}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                          {strikeData[index].disclosure}
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
