import { useMemo, useState, useCallback, useEffect } from 'react';
import { Column, useTable } from 'react-table';
import { RdpxV2Treasury__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import Tooltip from '@mui/material/Tooltip';

import Placeholder from 'components/rdpx-v2/Tables/Placeholder';

import { useBoundStore } from 'store';
import { DelegateType } from 'store/RdpxV2/dpxeth-bonding';

import useSendTx from 'hooks/useSendTx';

import { getUserReadableAmount } from 'utils/contracts';

const DelegatePositions = () => {
  const sendTx = useSendTx();

  const {
    signer,
    accountAddress,
    treasuryContractState,
    treasuryData,
    updateTreasuryData,
    isLoading,
  } = useBoundStore();

  const [userPositions, setUserPositions] = useState<DelegateType[]>([]);

  const handleWithdraw = useCallback(
    async (tokenId: number) => {
      if (!signer || !treasuryContractState.contracts || !accountAddress)
        return;

      const treasury = RdpxV2Treasury__factory.connect(
        treasuryContractState.contracts.treasury.address,
        signer
      );

      try {
        await sendTx(treasury, 'withdraw', [tokenId]).then(() => {
          updateTreasuryData();
        });
      } catch (e) {
        console.log(e);
      }
    },
    [accountAddress, sendTx, signer, treasuryContractState.contracts]
  );

  const delegatePositions = useMemo(() => {
    if (!userPositions || userPositions.length === 0) return [];

    return userPositions.map((position) => ({
      id: position._id,
      amount: (
        <Tooltip title={getUserReadableAmount(position.amount, 18)}>
          <p className="text-sm">
            {getUserReadableAmount(position.amount, 18).toFixed(3)}{' '}
            <span className="text-stieglitz">WETH</span>
          </p>
        </Tooltip>
      ),
      activeCollateral: (
        <p className="text-sm">
          {getUserReadableAmount(position.activeCollateral, 18).toFixed(3)}{' '}
          <span className="text-stieglitz">WETH</span>
        </p>
      ),
      balance: (
        <Tooltip
          title={getUserReadableAmount(
            position.amount.sub(position.activeCollateral),
            18
          )}
        >
          <p className="text-sm">
            {getUserReadableAmount(
              position.amount.sub(position.activeCollateral),
              18
            ).toFixed(3)}{' '}
            <span className="text-stieglitz">WETH</span>
          </p>
        </Tooltip>
      ),
      fee: getUserReadableAmount(position.fee, 8) + '%',
      withdrawButton: (
        <Button
          disabled={position.amount.sub(position.activeCollateral).eq('0')}
          onClick={() => handleWithdraw(position._id)}
        >
          Withdraw
        </Button>
      ),
    }));
  }, [userPositions, treasuryData]);

  useEffect(() => {
    (async () => {
      if (!treasuryData.availableDelegates) return;
      const _userPositions: DelegateType[] =
        treasuryData.availableDelegates.filter(
          (delegate: DelegateType) =>
            delegate.owner === accountAddress && delegate.amount.gt('0')
        );
      setUserPositions(_userPositions);
    })();
  }, [treasuryData]);

  const columns: Array<Column> = useMemo(() => {
    return [
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Active Collateral',
        accessor: 'activeCollateral',
      },
      {
        Header: 'Borrow Fee',
        accessor: 'fee',
      },
      {
        Header: 'Withdrawable',
        accessor: 'balance',
      },
      {
        Header: 'Action',
        accessor: 'withdrawButton',
      },
    ];
  }, []);

  const tableInstance = useTable({ columns, data: delegatePositions });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="space-y-2">
      <h6 className="mx-2">Delegated Positions</h6>
      <div className="overflow-x-auto">
        {delegatePositions.length > 0 ? (
          <table {...getTableProps()} className="bg-cod-gray rounded-lg w-full">
            <thead className="border-b border-umbra sticky">
              {headerGroups.map((headerGroup: any, index: number) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column: any, index: number) => {
                    const textAlignment =
                      index === headerGroup.headers.length - 1
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <th
                        {...column.getHeaderProps()}
                        key={index}
                        className={`m-3 py-3 px-3 ${textAlignment} w-1/${columns.length}`}
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
                  <tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      const textAlignment =
                        index === row.cells.length - 1
                          ? 'text-right'
                          : 'text-left';
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

export default DelegatePositions;
