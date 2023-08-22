import { SyntheticEvent, useMemo } from 'react';
import { formatUnits } from 'viem';

import { Button, Disclosure } from '@dopex-io/ui';
import MinusCircleIcon from '@heroicons/react/24/outline/MinusCircleIcon';
import PlusCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import TableLayout from 'components/common/TableLayout';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';
import { strikesPlaceholder } from 'constants/optionAmm/placeholders';

interface DisclosureStrikeItem {
  iv: number;
  delta: number;
  theta: number;
  vega: number;
  gamma: number;
  utilization: number;
  tvl: number;
  apy: number;
  premiumApy: number;
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
                  formatUnits(value.premiumPerOption || 0n, DECIMALS_TOKEN),
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
  <div className="flex flex-col">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const TableDisclosure = (props: DisclosureStrikeItem) => {
  return (
    <Disclosure.Panel as="tr" className="bg-umbra">
      <td colSpan={5}>
        <div className="grid grid-cols-5 gap-6 p-3">
          <StatItem name="IV" value={String(props.iv)} />
          <StatItem name="Delta" value={formatAmount(props.delta, 5)} />
          <StatItem name="Vega" value={formatAmount(props.vega, 5)} />
          <StatItem name="Gamma" value={formatAmount(props.gamma, 5)} />
          <StatItem name="Theta" value={formatAmount(props.theta, 5)} />
          <StatItem
            name="Utilization"
            value={`${formatAmount(props.utilization, 5)}%`}
          />
          <StatItem name="TVL" value={`$${formatAmount(props.tvl, 2, true)}`} />
          <StatItem
            name="Reward APY"
            value={`${formatAmount(props.apy, 2, true)}%`}
          />
          <StatItem
            name="Premium APY"
            value={`${formatAmount(props.premiumApy, 2, true)}%`}
          />
        </div>
      </td>
    </Disclosure.Panel>
  );
};

interface Props {
  market: string;
}

const StrikesTable = (props: Props) => {
  const {} = props;

  const activeStrikeIndex = useVaultStore((store) => store.activeStrikeIndex);
  const setActiveStrikeIndex = useVaultStore(
    (store) => store.setActiveStrikeIndex,
  );

  const data = useMemo(() => {
    return strikesPlaceholder.map((strikeData, index) => {
      return {
        strike: strikeData.strike,
        breakeven: strikeData.breakeven,
        availableCollateral: strikeData.availableCollateral,
        button: {
          index: strikeData.button.index,
          base: strikeData.button.base,
          premiumPerOption: strikeData.button.premiumPerOption,
          activeStrikeIndex: activeStrikeIndex,
          setActiveStrikeIndex: () => setActiveStrikeIndex(index),
          handleSelection: (e: SyntheticEvent) => {
            console.log(e);
          },
        },
        disclosure: {
          iv: strikeData.disclosure.iv,
          delta: strikeData.disclosure.delta,
          theta: strikeData.disclosure.theta,
          gamma: strikeData.disclosure.gamma,
          vega: strikeData.disclosure.vega,
          utilization: strikeData.disclosure.utilization,
          tvl: strikeData.disclosure.tvl,
          apy: strikeData.disclosure.apy,
          premiumApy: strikeData.disclosure.premiumApy,
        },
      };
    });
  }, [activeStrikeIndex, setActiveStrikeIndex]);

  return (
    <TableLayout<StrikeItem>
      isContentLoading={false}
      columns={columns}
      data={data}
      disclosure={strikesPlaceholder.map((s, index) => (
        <TableDisclosure key={index} {...s.disclosure} />
      ))}
    />
  );
};

export default StrikesTable;
