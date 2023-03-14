import { useCallback, useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { RdpxV2Bond__factory, RdpxV2Treasury__factory } from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';
import Button from 'components/UI/Button';

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
        amount: getUserReadableAmount(bond.amount, 18) + ' dpxETH',
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
                  <Typography
                    variant="h6"
                    className="ml-auto my-auto"
                    color="stieglitz"
                  >
                    {days}d {hours}h {minutes}m
                  </Typography>
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
        Header: 'Redeemable',
        accessor: 'timeLeft',
      },
      {
        Header: 'Bond Time',
        accessor: 'timestamp',
      },
      {
        Header: 'Actions',
        accessor: 'redeemButton',
      },
    ];
  }, []);

  const tableInstance = useTable({ columns, data: userBonds });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return userBonds.length > 0 ? (
    <table {...getTableProps()} className="bg-cod-gray rounded-lg">
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
                  className="px-3 py-4"
                >
                  <Typography
                    variant="h6"
                    className={`font-normal ${textAlignment}`}
                    color="stieglitz"
                  >
                    {column.render('Header')}
                  </Typography>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="max-h-32 overflow-y-auto">
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={index}>
              {row.cells.map((cell, index) => {
                const textAlignment =
                  index === row.cells.length - 1 ? 'text-right' : 'text-left';
                return (
                  <td
                    {...cell.getCellProps()}
                    key={index}
                    className={`m-3 py-2 px-3 ${textAlignment}`}
                  >
                    <Typography variant="h6" color="white">
                      {cell.render('Cell')}
                    </Typography>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <div className="flex justify-center my-auto w-full bg-cod-gray rounded-lg py-8">
      <Typography variant="h6" color="stieglitz">
        Nothing to show
      </Typography>
    </div>
  );
};

export default UserBonds;
