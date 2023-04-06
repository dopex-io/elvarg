import { useCallback, useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { RdpxV2Bond__factory, RdpxV2Treasury__factory } from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import format from 'date-fns/format';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@dopex-io/ui';

import Placeholder from 'components/rdpx-v2/Tables/Placeholder';

import { useBoundStore } from 'store';

import { getUserReadableAmount } from 'utils/contracts';

import useSendTx from 'hooks/useSendTx';

const UserBonds = () => {
  const sendTx = useSendTx();

  const {
    signer,
    accountAddress,
    userDscBondsData,
    treasuryContractState,
    treasuryData,
    updateUserDscBondsData,
    isLoading,
  } = useBoundStore();

  const handleRedeem = useCallback(
    async (tokenId: number) => {
      if (!signer || !treasuryContractState.contracts || !accountAddress)
        return;

      const bond = RdpxV2Bond__factory.connect(
        treasuryContractState.contracts.bond.address,
        signer
      );

      const treasury = RdpxV2Treasury__factory.connect(
        treasuryContractState.contracts.treasury.address,
        signer
      );

      const isApproved = (await bond.getApproved(tokenId))
        .toString()
        .toLowerCase()
        .includes(treasury.address.toLowerCase());

      try {
        if (!isApproved)
          await sendTx(bond, 'approve', [treasury.address, tokenId]);
        await sendTx(treasury, 'redeem', [tokenId, accountAddress]).then(() =>
          updateUserDscBondsData()
        );
      } catch (e) {
        console.log(e);
      }
    },
    [
      accountAddress,
      sendTx,
      signer,
      treasuryContractState.contracts,
      updateUserDscBondsData,
    ]
  );

  const userBonds = useMemo(() => {
    if (userDscBondsData.bonds.length === 0 || !treasuryData) return [];

    return userDscBondsData.bonds.map((bond) => {
      const redeemable =
        Number(bond.maturity) * 1000 > Math.ceil(Number(new Date()));
      return {
        tokenId: '#' + Number(bond.tokenId),
        amount: (
          <Tooltip title={getUserReadableAmount(bond.amount, 18)}>
            <p className="text-sm">
              {getUserReadableAmount(bond.amount, 18).toFixed(3)}{' '}
              <span className="text-stieglitz">dpxETH</span>
            </p>
          </Tooltip>
        ),
        timestamp: format(Number(bond.timestamp) * 1000, 'HH:mm, dd LLL'),
        timeLeft: (
          <Countdown
            date={Number(bond.maturity) * 1000}
            renderer={({ days, hours, minutes }) => {
              return (
                <div className="flex my-auto space-x-2">
                  <img
                    src="/assets/timer.svg"
                    className="h-[1rem] my-1 "
                    alt="Timer"
                  />
                  <p className="ml-auto my-auto text-sm text-stieglitz">
                    {days}d {hours}h {minutes}m
                  </p>
                </div>
              );
            }}
          />
        ),
        redeemButton: (
          <Button
            disabled={redeemable}
            onClick={() => handleRedeem(bond.tokenId)}
          >
            Redeem
          </Button>
        ),
      };
    });
  }, [handleRedeem, treasuryData, userDscBondsData.bonds]);

  const columns: Array<Column> = useMemo(() => {
    return [
      {
        Header: 'Token ID',
        accessor: 'tokenId',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Bond Time',
        accessor: 'timestamp',
      },
      {
        Header: 'Redeemable',
        accessor: 'timeLeft',
      },
      {
        Header: 'Action',
        accessor: 'redeemButton',
      },
    ];
  }, []);

  const tableInstance = useTable({ columns, data: userBonds });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="space-y-2">
      <h6 className="mx-2">Bonds</h6>
      <div className="overflow-x-auto">
        {userBonds.length > 0 ? (
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

export default UserBonds;
