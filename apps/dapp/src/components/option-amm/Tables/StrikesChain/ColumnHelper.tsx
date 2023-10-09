import { formatUnits } from 'viem';

import { Button, Disclosure } from '@dopex-io/ui';
import MinusCircleIcon from '@heroicons/react/24/outline/MinusCircleIcon';
import PlusCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import { StrikeItem } from 'components/option-amm/Tables/StrikesChain/StrikesTable';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

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

export default columns;
