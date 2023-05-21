import { useCallback, useMemo, useState } from 'react';

import { Button } from '@dopex-io/ui';
import Countdown from 'react-countdown';
import { Column, useTable } from 'react-table';
import { useBoundStore } from 'store';
import PlusIcon from 'svgs/icons/PlusIcon';

import { DurationType } from 'store/Vault/vault';

import Placeholder from 'components/vaults/Tables/Placeholder';
import FilterPanel from 'components/vaults/Tables/StrikesChain/FilterPanel';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

export type MenuDataType = { textContent: DurationType }[];

const DURATION_TYPE_OPTIONS: MenuDataType = [
  {
    textContent: 'WEEKLY',
  },
  {
    textContent: 'MONTHLY',
  },
];

const StrikesChain = () => {
  const { isLoading, selectedVaultData, filter } = useBoundStore();

  const [activeStrike, setActiveStrike] = useState<number>(0);

  const strikeData = useMemo(() => {
    if (!selectedVaultData || !selectedVaultData.epochData) return [];

    const handleActiveStrike = (index: number) => {
      setActiveStrike(index);
    };

    return selectedVaultData.epochData.strikeData.map((strikeData, idx) => {
      if (!strikeData) return [];
      const availableCollateralPercentage =
        ((getUserReadableAmount(strikeData.totalCollateral, DECIMALS_TOKEN) -
          getUserReadableAmount(strikeData.activeCollateral, DECIMALS_TOKEN)) /
          getUserReadableAmount(strikeData.totalCollateral, DECIMALS_TOKEN)) *
          100 || 0;

      const totalAvailable = getUserReadableAmount(
        strikeData.totalCollateral.div(
          selectedVaultData.epochData?.collateralExchangeRate ?? '1'
        ),
        10
      );

      const totalPurchased = getUserReadableAmount(
        strikeData.activeCollateral.div(
          selectedVaultData.epochData?.collateralExchangeRate ?? '1'
        ),
        10
      );

      return {
        strike: (
          <span className="space-x-2 text-left">
            <p className="text-stieglitz font-bold inline-block">$</p>
            <p className="inline-block">
              {getUserReadableAmount(strikeData.strike, DECIMALS_STRIKE)}
            </p>
          </span>
        ),
        availableCollateral: (
          <span className="space-y-1">
            <span className="space-x-2">
              <p className="inline-block">{formatAmount(totalAvailable, 3)}</p>
              <p className="text-stieglitz font-bold inline-block">
                {filter.base}
              </p>
            </span>
            <p className="text-stieglitz text-xs">
              {formatAmount(availableCollateralPercentage, 2)}%
            </p>
          </span>
        ),
        premiumsAccrued: (
          <span className="space-x-2">
            <p className="inline-block">{totalPurchased}</p>
            <p className="text-stieglitz font-bold inline-block">
              {filter.base}
            </p>
          </span>
        ),
        expiry: (
          <p className="inline-block">
            <Countdown
              date={new Date(strikeData.expiry.toNumber() * 1000)}
              renderer={({ days, hours, minutes }) => {
                return (
                  <span className="flex space-x-2">
                    <img
                      src="/assets/timer.svg"
                      className="h-[0.9rem] my-auto"
                      alt="timer"
                    />
                    <span className="ml-auto mr-1">
                      {days}d {hours}h {minutes}m
                    </span>
                  </span>
                );
              }}
            />
          </p>
        ),
        button: (
          <Button
            id={`strike-chain-button-${idx}`}
            key={idx}
            color="mineshaft"
            onClick={() => handleActiveStrike(idx)}
            className={`w-fit space-x-2 ${
              idx === activeStrike ? 'ring-1 ring-frost animate-pulse' : null
            }`}
          >
            <p className="text-stieglitz my-auto inline-block">
              {strikeData.isPut ? '$' : filter.base}
            </p>
            <p className="inline-block">
              {getUserReadableAmount(
                strikeData.premiumPerOption,
                DECIMALS_TOKEN
              ).toFixed(3)}
            </p>
            <PlusIcon
              className="my-auto w-[12px] h-[12px] inline-block"
              color="#8E8E8E"
            />
          </Button>
        ),
      };
    });
  }, [activeStrike, filter.base, selectedVaultData]);

  const columns: Array<Column> = useMemo(() => {
    return [
      {
        Header: 'Strike Price',
        accessor: 'strike',
      },
      {
        Header: 'Total Available',
        accessor: 'availableCollateral',
      },
      {
        Header: 'Total Purchased',
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
        <FilterPanel isPut={filter.isPut} expiries={DURATION_TYPE_OPTIONS} />
      </div>
      <div className="overflow-x-auto">
        {strikeData.length > 0 ? (
          <table {...getTableProps()} className="bg-cod-gray rounded-lg w-full">
            <thead className="border-b border-umbra sticky">
              {headerGroups.map((headerGroup: any, index: number) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column: any, index: number) => {
                    let textAlignment;
                    if (index === length - 1) {
                      textAlignment = 'text-left';
                    } else if (index === 0) {
                      textAlignment = 'text-left';
                    } else {
                      textAlignment = 'text-right';
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
                      if (index === length - 1) {
                        textAlignment = 'text-left';
                      } else if (index === 0) {
                        textAlignment = 'text-left';
                      } else {
                        textAlignment = 'text-right';
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
          <Placeholder isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default StrikesChain;
