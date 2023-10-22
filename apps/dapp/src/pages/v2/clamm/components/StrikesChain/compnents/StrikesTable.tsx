import React, { useEffect, useMemo, useState } from 'react';

import { Checkbox } from '@mui/material';

import { Button, Disclosure } from '@dopex-io/ui';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import { createColumnHelper } from '@tanstack/react-table';
import cx from 'classnames';

import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

type StrikeDisclosureItem = {
  iv: number;
  tvl: number;
  utilization: number;
  normalApy: number;
  rewardsApy: number;
};

const columnHelper = createColumnHelper<StrikeItem>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike',
    cell: (info) => (
      <span className="flex space-x-1 text-left items-center">
        <Checkbox
          onChange={info.getValue().handleSelect}
          className="text-mineshaft"
          size="small"
        />
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">
          {formatAmount(info.getValue().amount, 5)}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('breakeven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="text-left flex">
        <p className="text-stieglitz pr-1">$</p>
        <p className="pr-1">{formatAmount(info.getValue(), 5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('liquidity', {
    header: 'liquidity',
    cell: (info) => (
      <StatItem
        name={`${info.getValue().amount} ${info.getValue().symbol}`}
        value={`$ ${formatAmount(info.getValue().usd)}`}
      />
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: ({ getValue }) => (
      <div className="flex space-x-2 justify-end">
        <Button
          color={getValue().isSelected ? 'primary' : 'mineshaft'}
          className={cx()}
        >
          <div className="flex items-center space-x-1">
            <span>$ {formatAmount(getValue().premium)}</span>
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

type StrikeItem = {
  strike: {
    amount: number;
    handleSelect: (event: any, checked: boolean) => void;
  };
  breakeven: number;
  liquidity: { symbol: string; amount: number; usd: number };
  button: {
    index: number;
    premium: number;
    handleSelect: Function;
    isSelected: boolean;
  };
  isSelected: boolean;
  disclosure: {
    iv: number;
    tvl: number;
    utilization: number;
    normalApy: number;
    rewardsApy: number;
  };
};

export const StatItem = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col px-1">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const TableDisclosure = (props: StrikeDisclosureItem) => {
  return (
    <Disclosure.Panel as="tr" className="bg-umbra">
      <td colSpan={5}>
        <div className="grid grid-cols-5 gap-6 p-3">
          <StatItem name="IV" value={String(props.iv)} />
          <StatItem
            name="Utilization"
            value={`${formatAmount(props.utilization, 5)}%`}
          />
          <StatItem name="TVL" value={`$${formatAmount(props.tvl, 2, true)}`} />
          <StatItem
            name="Reward APY"
            value={`${formatAmount(props.normalApy, 2, true)}%`}
          />
          <StatItem
            name="Premium APY"
            value={`${formatAmount(props.rewardsApy, 2, true)}%`}
          />
        </div>
      </td>
    </Disclosure.Panel>
  );
};

const StrikesTable = () => {
  const { selectStrike, deselectStrike, selectedStrikes } =
    useStrikesChainStore();

  const [strikes, setStrikes] = useState<StrikeItem[]>([]);
  useEffect(() => {
    const index = 0;
    setStrikes([
      {
        strike: {
          amount: 1000,
          handleSelect: (_: any, checked: boolean) => {
            if (checked) {
              selectStrike(index, 1000);
            } else {
              deselectStrike(index);
            }
          },
        },
        breakeven: 1200,
        liquidity: {
          amount: 1000,
          usd: 100,
          symbol: 'ETH',
        },
        isSelected: false,
        button: {
          index: index,
          premium: 10.23,
          handleSelect: () => {},
          isSelected: selectedStrikes.has(index),
        },
        disclosure: {
          iv: 10,
          tvl: 10000,
          utilization: 90,
          normalApy: 10,
          rewardsApy: 10,
        },
      },
    ]);
  }, [deselectStrike, selectStrike, selectedStrikes]);

  // const strikesData = useMemo(() => {
  //   const index = 0;
  //   console.log('IS SELECTED', selectedStrikes.has(index));
  //   return [
  //     {
  //       strike: {
  //         amount: 1000,
  //         handleSelect: (_: any, checked: boolean) => {
  //           if (checked) {
  //             selectStrike(index, 1000);
  //           } else {
  //             deselectStrike(index);
  //           }
  //         },
  //       },
  //       breakeven: 1200,
  //       liquidity: {
  //         amount: 1000,
  //         usd: 100,
  //         symbol: 'ETH',
  //       },
  //       isSelected: false,
  //       button: {
  //         index: index,
  //         premium: 10.23,
  //         handleSelect: () => {},
  //         isSelected: selectedStrikes.has(index),
  //       },
  //       disclosure: {
  //         iv: 10,
  //         tvl: 10000,
  //         utilization: 90,
  //         normalApy: 10,
  //         rewardsApy: 10,
  //       },
  //     },
  //   ];
  // }, [selectStrike, selectedStrikes, deselectStrike]);

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
