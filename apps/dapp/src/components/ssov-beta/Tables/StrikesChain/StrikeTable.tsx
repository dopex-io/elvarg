import React, { useCallback, useMemo } from 'react';
import { Address, formatUnits } from 'viem';

import { Button /* Menu,*/, Disclosure, Skeleton } from '@dopex-io/ui';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  // EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import useStrikesData from 'hooks/ssov/useStrikesData';
import useVaultsData from 'hooks/ssov/useVaultsData';
import useVaultStore from 'hooks/ssov/useVaultStore';

import TableLayout from 'components/common/TableLayout';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';

import { SsovDuration } from 'types/ssov';

// import { STRIKES_MENU } from 'constants/ssov';

export type MenuDataType = { textContent: SsovDuration }[];

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
    isPut: boolean;
    totalAvailableCollateral: number;
  };
  button: {
    index: number;
    base: string;
    isPut: boolean;
    premiumPerOption: bigint;
    activeStrikeIndex: number;
    setActiveStrikeIndex: () => void;
    handleSelection: React.ReactEventHandler;
  };
  disclosure: DisclosureStrikeItem;
}

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
          {formatAmount(
            value.isPut
              ? value.totalAvailableCollateral / value.strike
              : value.totalAvailableCollateral,
            3,
          )}
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
                {value.isPut ? '2CRV' : value.base}
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
          {/* TODO: OLP dialog
        Pass selected strike, ssov address, side into dialog
        */}
          {/* <Menu
            color="mineshaft"
            selection={
              <EllipsisVerticalIcon className="w-4 h-4 fill-current text-white" />
            }
            handleSelection={value.handleSelection}
            data={STRIKES_MENU}
            className="w-fit"
          /> */}
        </div>
      );
    },
  }),
];

const StrikesTable = ({ market }: { market: string }) => {
  const vault = useVaultStore((store) => store.vault);
  const activeStrikeIndex = useVaultStore((store) => store.activeStrikeIndex);

  const setActiveStrikeIndex = useVaultStore(
    (store) => store.setActiveStrikeIndex,
  );

  const { vaults } = useVaultsData({ market });

  const selectedVault = useMemo(() => {
    const selected = vaults.find(
      (_vault) =>
        vault.duration === _vault.duration && vault.isPut === _vault.isPut,
    );

    return selected;
  }, [vaults, vault]);

  const { strikesData, isLoading } = useStrikesData({
    ssovAddress: selectedVault?.contractAddress as Address,
    epoch: selectedVault?.currentEpoch,
  });

  const handleClickMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget.textContent === 'Orderbook') {
      console.log('try');
    }
  }, []);

  const strikeData = useMemo(() => {
    if (!strikesData || !selectedVault) return [];

    return strikesData.map((strikeData, index) => {
      const premiumFormatted = Number(
        formatUnits(strikeData.premiumPerOption || 0n, DECIMALS_TOKEN),
      );

      const tvl =
        Number(formatUnits(strikeData.totalCollateral, DECIMALS_TOKEN)) *
        Number(selectedVault?.currentPrice);

      let premiumApy =
        100 *
        (Number(formatUnits(strikeData.premiumsAccrued, DECIMALS_TOKEN)) /
          Number(
            formatUnits(
              strikeData.premiumsAccrued + strikeData.totalCollateral,
              DECIMALS_TOKEN,
            ),
          ));

      premiumApy = premiumApy * (365 / (vault.duration === 'WEEKLY' ? 7 : 30));

      const premiumInUSD =
        (selectedVault.isPut ? 1 : Number(selectedVault.currentPrice)) *
        premiumFormatted;

      return {
        strike: strikeData.strike,
        breakeven: (vault.isPut
          ? strikeData.strike - premiumInUSD
          : strikeData.strike + premiumInUSD
        ).toFixed(3),
        availableCollateral: {
          strike: strikeData.strike,
          isPut: vault.isPut,
          totalAvailableCollateral: strikeData.totalAvailableCollateral,
        },
        button: {
          index,
          base: vault.underlyingSymbol,
          isPut: vault.isPut,
          premiumPerOption: strikeData.premiumPerOption,
          activeStrikeIndex: activeStrikeIndex,
          setActiveStrikeIndex: () => setActiveStrikeIndex(index),
          handleSelection: (e: React.MouseEvent<HTMLElement>) => {
            handleClickMenu(e);
          },
        },
        disclosure: {
          iv: strikeData.iv,
          delta: strikeData.delta,
          theta: strikeData.theta,
          gamma: strikeData.gamma,
          vega: strikeData.vega,
          utilization: strikeData.utilization,
          tvl,
          apy: Number(selectedVault?.apy[index]),
          premiumApy,
        },
      };
    });
  }, [
    strikesData,
    selectedVault,
    vault.duration,
    vault.isPut,
    vault.underlyingSymbol,
    activeStrikeIndex,
    setActiveStrikeIndex,
    handleClickMenu,
  ]);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-4 p-2">
        {Array.from(Array(4)).map((_, index) => {
          return (
            <Skeleton
              key={index}
              width="fitContent"
              height={70}
              color="carbon"
              variant="rounded"
            />
          );
        })}
      </div>
    );

  return (
    <TableLayout<StrikeItem>
      data={strikeData}
      columns={columns}
      disclosure={strikeData.map((s, index) => (
        <TableDisclosure key={index} {...s.disclosure} />
      ))}
      rowSpacing={3}
      isContentLoading={isLoading}
    />
  );
};

export default StrikesTable;
