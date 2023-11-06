import React, { useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';

import { Checkbox } from '@mui/material';

import { Button, Disclosure } from '@dopex-io/ui';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import { createColumnHelper } from '@tanstack/react-table';
import cx from 'classnames';
import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import TableLayout from 'components/common/TableLayout';

import getStrikesChain from 'utils/clamm/varrock/getStrikesChain';

type StrikeDisclosureItem = {
  earningsApy: number;
  rewardsApy: number;
  utilization: number;
  totalDeposits: {
    amount: number;
    symbol: string;
  };
};

type StrikeItem = {
  strike: {
    amount: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  sources: {
    name: string;
    compositionPercentage: number;
  }[];
  options: number;
  button: {
    isSelected: boolean;
    handleSelect: () => void;
  };
  liquidity: {
    symbol: string;
    usd: number;
    amount: number;
  };
  disclosure: StrikeDisclosureItem;
};

const columnHelper = createColumnHelper<StrikeItem>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike',
    cell: (info) => (
      <span className="flex space-x-1 text-left items-center">
        <Checkbox
          checked={info.getValue().isSelected}
          onChange={info.getValue().handleSelect}
          className="text-mineshaft"
          size="small"
        />
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().amount.toFixed(4)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('liquidity', {
    header: 'Liquidity',
    cell: (info) => (
      <StatItem
        name={`${info.getValue().amount.toFixed(4)} ${info.getValue().symbol}`}
        value={`$ ${info.getValue().usd.toFixed(2)}`}
      />
    ),
  }),
  columnHelper.accessor('options', {
    header: 'Options',
    cell: (info) => (
      <span className="flex space-x-1 text-left items-center">
        <p>{info.getValue().toFixed(4)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('sources', {
    header: 'Sources',
    cell: (info) => {
      const sources = info.getValue();
      return (
        <span className="flex text-left items-center space-x-1">
          {sources.map(
            ({ name, compositionPercentage }: any, index: number) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                <img
                  className={`w-[30px] h-[30px] z-10 border border-umbra rounded-full`}
                  src={`/images/exchanges/${name.toLowerCase()}.svg`}
                  alt={name.toLowerCase()}
                />
                <span className="text-xs text-stieglitz">
                  {compositionPercentage}%
                </span>
              </div>
            ),
          )}
        </span>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: ({ getValue }) => (
      <div className="flex space-x-2 justify-end">
        <Button
          onClick={getValue().handleSelect}
          color={getValue().isSelected ? 'primary' : 'mineshaft'}
          className={cx()}
        >
          <div className="flex items-center space-x-1">
            {getValue().isSelected ? (
              <MinusCircleIcon className="w-[14px]" />
            ) : (
              <PlusCircleIcon className="w-[14px]" />
            )}
          </div>
        </Button>
        <Disclosure.Button className="w-6">
          <ChevronDownIcon
            className={`text-stieglitz text-2xl cursor-pointer`}
          />
        </Disclosure.Button>
      </div>
    ),
  }),
];

export const StatItem = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col px-1">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const TableDisclosure = (props: StrikeDisclosureItem) => {
  return (
    <Disclosure.Panel as="tr" className="bg-umbra">
      <td colSpan={6}>
        <div className="grid grid-cols-6 gap-6 p-3">
          <StatItem
            name="Utilization"
            value={`${props.utilization.toFixed(3)}%`}
          />
          <StatItem
            name="Reward APY"
            value={`${props.earningsApy.toFixed(3)}%`}
          />
          <StatItem
            name="Premium APY"
            value={`${props.rewardsApy.toFixed(3)}%`}
          />
          <StatItem
            name="Total Deposits"
            value={`${Number(props.totalDeposits.amount).toFixed(3)} ${
              props.totalDeposits.symbol
            }`}
          />
        </div>
      </td>
    </Disclosure.Panel>
  );
};

const StrikesTable = () => {
  const {
    selectStrike,
    deselectStrike,
    selectedStrikes,
    initialize,
    strikesChain,
  } = useStrikesChainStore();

  const { selectedOptionsPool, isPut } = useClammStore();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!selectedOptionsPool || !chain) return;

    getStrikesChain(
      chain.id,
      selectedOptionsPool.callToken.address,
      selectedOptionsPool.putToken.address,
      10,
      0,
      initialize,
      (err) => {
        toast.error(err);
      },
    );
  }, [chain, initialize, selectedOptionsPool]);

  const strikes = useMemo(() => {
    if (!strikesChain) return [];
    return strikesChain
      .map(
        (
          {
            earningsApy,
            liquidityAvailableUsd,
            liquidityInToken,
            meta,
            liquidityAvailableInToken,
            optionsAvailable,
            rewardsApy,
            sources,
            strike,
            tokenDecimals,
            tokenSymbol,
            utilization,
            type,
          },
          index,
        ) => {
          const isSelected = Boolean(selectedStrikes.get(index));

          return {
            type,
            strike: {
              amount: strike,
              isSelected,
              handleSelect: () => {
                return isSelected
                  ? deselectStrike(index)
                  : selectStrike(index, {
                      amount0: 0,
                      amount1: optionsAvailable,
                      isCall: type === 'call' ? true : false,
                      strike: strike,
                      ttl: '24h',
                      tokenDecimals: Number(tokenDecimals),
                      tokenSymbol,
                      meta: {
                        tickLower: Number(meta.tickLower),
                        tickUpper: Number(meta.tickUpper),
                        amount0: 0n,
                        amount1: 0n,
                      },
                    });
              },
            },
            sources,
            options: Number(optionsAvailable),
            button: {
              isSelected,
              handleSelect: () => {
                return isSelected
                  ? deselectStrike(index)
                  : selectStrike(index, {
                      amount0: 0,
                      amount1: optionsAvailable,
                      isCall: type === 'call' ? true : false,
                      strike: strike,
                      ttl: '24h',
                      tokenDecimals: Number(tokenDecimals),
                      tokenSymbol,
                      meta: {
                        tickLower: Number(meta.tickLower),
                        tickUpper: Number(meta.tickUpper),
                        amount0: 0n,
                        amount1: 0n,
                      },
                    });
              },
            },
            liquidity: {
              symbol: tokenSymbol,
              usd: Number(liquidityAvailableUsd),
              amount: Number(
                formatUnits(BigInt(liquidityAvailableInToken), tokenDecimals),
              ),
            },
            disclosure: {
              earningsApy: Number(earningsApy),
              rewardsApy: Number(rewardsApy),
              utilization: Number(utilization),
              totalDeposits: {
                amount: Number(
                  formatUnits(BigInt(liquidityInToken), tokenDecimals),
                ),
                symbol: tokenSymbol,
              },
            },
          };
        },
      )
      .filter(({ type }) => (isPut ? type === 'put' : type === 'call'));
  }, [strikesChain, selectStrike, deselectStrike, selectedStrikes, isPut]);

  return (
    <TableLayout<StrikeItem>
      data={strikes}
      columns={columns}
      rowSpacing={3}
      disclosure={strikes.map((s, index) => (
        <TableDisclosure key={index} {...s.disclosure} />
      ))}
      isContentLoading={false}
      pageSize={10}
    />
  );
};

export default StrikesTable;