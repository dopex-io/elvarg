import { SyntheticEvent, useMemo } from 'react';
import { formatUnits } from 'viem';

import { Button, Disclosure } from '@dopex-io/ui';
import MinusCircleIcon from '@heroicons/react/24/outline/MinusCircleIcon';
import PlusCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import useStrikesData from 'hooks/option-amm/useStrikesData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import TableLayout from 'components/common/TableLayout';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

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
    strike: number;
    totalAvailableCollateral: number;
  };
  button: {
    index: number;
    base: string;
    premiumPerOption: bigint;
    activeStrikeIndex: number;
    setActiveStrikeIndex: () => void;
    handleSelection: React.ReactEventHandler;
  };
  disclosure: DisclosureStrikeItem;
}

const columnHelper = createColumnHelper<StrikeItem>();

const columns = [
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
        <span className="text-sm">
          {formatAmount(value.totalAvailableCollateral, 3)}
        </span>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: () => null,
    cell: (info) => {
      const value = info.getValue();

      const approximationSymbol =
        Number(formatUnits(value.premiumPerOption || 0n, DECIMALS_TOKEN)) < 1
          ? '~'
          : null;

      return (
        <div className="flex space-x-2 justify-end">
          <Button
            id={`strike-chain-button-${value.index}`}
            color={
              value.activeStrikeIndex === value.index ? 'primary' : 'mineshaft'
            }
            onClick={value.setActiveStrikeIndex}
            className="space-x-2 text-xs"
          >
            <span className="flex items-center space-x-1">
              <span>
                {approximationSymbol}
                {formatAmount(
                  formatUnits(value.premiumPerOption || 0n, DECIMALS_USD),
                  3,
                )}{' '}
                {value.base}
              </span>
              {value.activeStrikeIndex === value.index ? (
                <MinusCircleIcon className="w-[14px]" />
              ) : (
                <PlusCircleIcon className="w-[14px]" />
              )}
            </span>
          </Button>
          <Disclosure.Button className="w-6">
            <ChevronDownIcon
              className={`text-stieglitz text-2xl cursor-pointer ${
                // @ts-ignore TODO: find the right way to pass a custom prop to a cell
                info.open ? 'rotate-180 transform' : ''
              }`}
            />
          </Disclosure.Button>
        </div>
      );
    },
  }),
];

const StatItem = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col px-1">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const TableDisclosure = (props: DisclosureStrikeItem) => {
  return (
    <Disclosure.Panel as="tr" className="bg-umbra">
      <td colSpan={4}>
        <div className="grid grid-cols-4 gap-6 p-3">
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

const StrikesTable = () => {
  const activeStrikeIndex = useVaultStore((store) => store.activeStrikeIndex);
  const vault = useVaultStore((store) => store.vault);
  const setActiveStrikeIndex = useVaultStore(
    (store) => store.setActiveStrikeIndex,
  );

  const { strikeData, greeks, loading } = useStrikesData({
    ammAddress: vault.address,
    duration: vault.duration,
    isPut: vault.isPut,
  });

  const data = useMemo(() => {
    // todo: fix bug updating strikeData in useStrikesData()
    if (!strikeData || !greeks) return [];
    return strikeData.map((sd, index) => {
      return {
        strike: Number(formatUnits(sd.strike || 0n, DECIMALS_STRIKE)),
        breakeven: formatUnits(
          sd.strike || 0n + sd.premiumPerOption || 0n,
          DECIMALS_STRIKE,
        ),
        availableCollateral: {
          strike: Number(
            formatUnits(sd.availableCollateral || 0n, DECIMALS_TOKEN),
          ),
          totalAvailableCollateral: Number(sd.availableCollateral),
        },
        button: {
          index,
          base: vault.collateralSymbol,
          quote: vault.underlyingSymbol,
          premiumPerOption: sd.premiumPerOption || 0n,
          activeStrikeIndex: activeStrikeIndex,
          setActiveStrikeIndex: () => setActiveStrikeIndex(index),
          handleSelection: (e: SyntheticEvent) => {
            console.log(e);
          },
        },
        disclosure: {
          iv: greeks[index].iv,
          delta: greeks[index].delta,
          theta: greeks[index].theta,
          gamma: greeks[index].gamma,
          vega: greeks[index].vega,
        },
      };
    });
  }, [
    activeStrikeIndex,
    greeks,
    setActiveStrikeIndex,
    strikeData,
    vault.collateralSymbol,
    vault.underlyingSymbol,
  ]);

  return (
    <TableLayout<StrikeItem>
      isContentLoading={loading}
      columns={columns}
      data={data}
      rowSpacing={3}
      pageSize={20}
      disclosure={greeks.map((s, index) => (
        <TableDisclosure key={index} {...s} />
      ))}
    />
  );
};

export default StrikesTable;
