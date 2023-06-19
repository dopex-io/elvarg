import { useEffect, useMemo } from 'react';

import { Button } from '@dopex-io/ui';
import { format } from 'date-fns';
import useVaultQuery from 'hooks/vaults/query';
import useVaultState, { DurationType } from 'hooks/vaults/state';
import useFetchStrikes from 'hooks/vaults/strikes';
import { Column, useTable } from 'react-table';
import PlusIcon from 'svgs/icons/PlusIcon';

import Placeholder from 'components/vaults/Tables/Placeholder';
import FilterPanel from 'components/vaults/Tables/StrikesChain/FilterPanel';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';

export type MenuDataType = { textContent: DurationType }[];

const StrikesChain = ({ selectedToken }: { selectedToken: string }) => {
  const vault = useVaultState((vault) => vault.vault);
  const setActiveStrikeIndex = useVaultState(
    (vault) => vault.setActiveStrikeIndex
  );
  const activeStrikeIndex = useVaultState((vault) => vault.activeStrikeIndex);
  const { selectedVault, vaults, updateSelectedVault } = useVaultQuery({
    vaultSymbol: selectedToken,
  });
  const strikes = useFetchStrikes({
    contractAddress: selectedVault?.contractAddress,
    epoch: selectedVault?.currentEpoch,
  });

  useEffect(() => {
    updateSelectedVault(vault.durationType, vault.isPut as boolean);
  }, [updateSelectedVault, vault]);

  const strikeData = useMemo(() => {
    if (
      !strikes.epochStrikeData ||
      !strikes.data ||
      !strikes.data[0] ||
      !(strikes.data[0] as any).expiry ||
      !vaults
    )
      return [];

    return strikes.epochStrikeData.map((strikeData, index) => {
      return {
        asset: (
          <span className="space-x-2 text-left">
            <img
              src={`images/tokens/${vault.base.toLowerCase()}.svg`}
              alt={vault.base.toLowerCase()}
              className="w-6 h-6"
            />
          </span>
        ),
        strike: (
          <span className="space-x-2 text-left">
            <p className="text-stieglitz inline-block">$</p>
            <p className="inline-block">{strikeData.strike}</p>
          </span>
        ),
        availableCollateral: (
          <span className="space-y-1 text-xs">
            <span className="space-x-2">
              <p className="inline-block">
                {formatAmount(strikeData.totalAvailableCollateral, 3)}
              </p>
              <p className="text-stieglitz inline-block">{vault.base}</p>
            </span>
            <p className="text-stieglitz text-xs">
              {formatAmount(strikeData.availableCollateralPercentage, 3)}%
            </p>
          </span>
        ),
        premiumsAccrued: (
          <span className="space-x-2">
            <p className="inline-block">
              {formatAmount(strikeData.totalPurchased, 3)}
            </p>
          </span>
        ),
        expiry: (
          <p className="inline-block">
            {format(
              new Date((strikes.data as any)[0].expiry.toNumber() * 1000),
              'dd LLL yyy'
            )}
          </p>
        ),
        button: (
          <Button
            id={`strike-chain-button-${index}`}
            key={index}
            color="mineshaft"
            onClick={() => setActiveStrikeIndex(index)}
            className={`w-fit space-x-2 text-xs ${
              index === activeStrikeIndex
                ? 'ring-1 ring-frost animate-pulse'
                : null
            }`}
          >
            <p className="text-stieglitz my-auto inline-block">
              {vault.isPut ? '$' : vault.base}
            </p>
            <p className="inline-block">
              {formatAmount(
                getUserReadableAmount(
                  strikeData.premiumPerOption,
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
        ),
      };
    });
  }, [
    strikes.epochStrikeData,
    strikes.data,
    vaults,
    vault.base,
    vault.isPut,
    activeStrikeIndex,
    setActiveStrikeIndex,
  ]);

  const columns: Array<Column> = useMemo(() => {
    return [
      {
        Header: 'Asset',
        accessor: 'asset',
      },
      {
        Header: 'Strike Price',
        accessor: 'strike',
      },
      {
        Header: 'Total Available',
        accessor: 'availableCollateral',
      },
      {
        Header: 'Purchased',
        accessor: 'premiumsAccrued',
      },
      {
        Header: 'Expiry',
        accessor: 'expiry',
      },
      {
        Header: '',
        accessor: 'button',
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
                          <span className="text-sm">{cell.render('Cell')}</span>
                        </td>
                      );
                    })}
                  </tr>
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
