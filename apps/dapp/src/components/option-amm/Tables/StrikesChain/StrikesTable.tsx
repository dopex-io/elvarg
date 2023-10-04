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
    totalCollateral: number;
    totalAvailableCollateral: number;
  };
  premiumAccrued: number;
  button: {
    index: number;
    disabled: boolean;
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
    header: 'Active Collateral',
    cell: (info) => {
      const value = info.getValue();

      return (
        <span className="text-left flex">
          <p className="text-stieglitz pr-1">$</p>
          <p className="pr-1">{formatAmount(value.totalCollateral, 3)}</p>
        </span>
      );
    },
  }),
  columnHelper.accessor('premiumAccrued', {
    header: 'Premiums Accrued',
    cell: (info) => {
      return (
        <span className="text-left flex">
          <p className="text-stieglitz pr-1">$</p>
          <p className="text-sm">{formatAmount(info.getValue(), 3)}</p>
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
            disabled={value.disabled}
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
      <td colSpan={5}>
        <div className="grid grid-cols-5 gap-6 p-3">
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

  const { expiryData, strikeData, greeks, loading } = useStrikesData({
    ammAddress: vault.address,
    duration: vault.duration,
    isPut: vault.isPut,
  });

  const data = useMemo(() => {
    if (!strikeData || !greeks || !expiryData) return [];

    return strikeData.map((sd, index) => {
      const isITM: boolean = vault.isPut
        ? sd.strike > expiryData.markPrice
        : sd.strike < expiryData.markPrice;
      return {
        strike: Number(formatUnits(sd.strike || 0n, DECIMALS_STRIKE)),
        breakeven: formatUnits(
          vault.isPut
            ? sd.strike || 0n - sd.premiumPerOption || 0n
            : sd.strike || 0n + sd.premiumPerOption || 0n,
          DECIMALS_STRIKE,
        ),
        availableCollateral: {
          strike: Number(
            formatUnits(sd.availableCollateral || 0n, DECIMALS_TOKEN),
          ),
          totalCollateral: Number(
            formatUnits(sd.totalCollateral, DECIMALS_TOKEN),
          ),
          totalAvailableCollateral: Number(
            formatUnits(sd.totalAvailableCollateral, DECIMALS_TOKEN),
          ),
        },
        premiumAccrued: Number(formatUnits(sd.premiumsAccrued, DECIMALS_USD)),
        button: {
          index,
          disabled: isITM,
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
    strikeData,
    greeks,
    expiryData,
    vault.isPut,
    vault.collateralSymbol,
    vault.underlyingSymbol,
    activeStrikeIndex,
    setActiveStrikeIndex,
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
