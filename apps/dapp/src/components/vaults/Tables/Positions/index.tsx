import { useCallback, useMemo, useState } from 'react';

import { Button } from '@dopex-io/ui';
import useFetchPositions from 'hooks/vaults/positions';
import useVaultQuery from 'hooks/vaults/query';
import useVaultState from 'hooks/vaults/state';
import { Column, useTable } from 'react-table';

import { ButtonGroup } from 'components/vaults/AsidePanel';
import Placeholder from 'components/vaults/Tables/Placeholder';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

const Positions = () => {
  const vault = useVaultState((vault) => vault.vault);
  const { positions, optionBalances, isLoading } = useFetchPositions({
    vaultAddress: vault.address,
    tokenSymbol: vault.base,
    isPut: vault.isPut,
  });
  const { vaults } = useVaultQuery({
    vaultSymbol: vault.base,
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleWithdraw = useCallback(async (index: number) => {
    return new Promise((r) => r);
  }, []);

  const writePositions = useMemo(() => {
    if (!positions) return [];

    return (activeIndex === 0 ? optionBalances : positions).map(
      (position: any, index: number) => {
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
          side: <p className="text-stieglitz">{position.side}</p>,
          strike: (
            <span className="space-x-2 text-left">
              <p className="text-stieglitz inline-block">$</p>
              <p className="inline-block">
                {getUserReadableAmount(position.strike, DECIMALS_STRIKE)}
              </p>
            </span>
          ),
          amount: (
            <span className="space-x-2">
              <p className="inline-block">
                {getUserReadableAmount(position.amount, DECIMALS_TOKEN)}
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
              onClick={() => handleWithdraw(index)}
              disabled={Number(position.epoch) >= vault.currentEpoch}
              className={`w-fit space-x-2 ${
                position.epoch > vault.currentEpoch
                  ? 'cursor-not-allowed'
                  : 'cursor-default'
              }`}
            >
              <p className="inline-block">
                {activeIndex === 0 ? 'Settle' : 'Withdraw'}
              </p>
            </Button>
          ),
        };
      }
    );
  }, [
    activeIndex,
    handleWithdraw,
    optionBalances,
    positions,
    vault.base,
    vault.currentEpoch,
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
        Header: 'Side',
        accessor: 'side',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
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

  const buttonLabels = useMemo(() => {
    if (!optionBalances || !positions) return [null, null];
    return [
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <p className="flex">Buy Positions</p>
        <p className="px-[5px] rounded-full bg-carbon">
          {optionBalances.length}
        </p>
      </div>,
      <div className="flex space-x-2" key="buy-positions">
        <p className="flex">Sell Positions</p>
        <p className="px-[5px] rounded-full bg-carbon">{positions.length}</p>
      </div>,
    ];
  }, [optionBalances, positions]);

  const tableInstance = useTable({ columns, data: writePositions });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="space-y-2">
      <ButtonGroup
        active={activeIndex}
        labels={buttonLabels}
        handleClick={handleClick}
      />
      {writePositions.length > 0 ? (
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

export default Positions;
