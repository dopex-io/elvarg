import { useCallback, useMemo, useState } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import format from 'date-fns/format';
import Countdown from 'react-countdown';
import { useAccount } from 'wagmi';

import { RewardAccrued, WritePosition } from 'hooks/ssov/useSsovPositions';
import useVaultsData from 'hooks/ssov/useVaultsData';
import useVaultStore from 'hooks/ssov/useVaultStore';

import WithdrawStepper from 'components/ssov-beta/Dialogs/WithdrawStepper';
import Placeholder from 'components/ssov-beta/Tables/Placeholder';

import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  positions?: WritePosition[];
  isLoading?: boolean;
}

interface WritePositionData {
  strike: string;
  amount: { amount: number; symbol: string; isPut: boolean };
  side: string;
  expiry: number;
  premium: { premium: number; symbol: string; isPut: boolean };
  rewardsAccrued: RewardAccrued[];
  button: {
    tokenId: number;
    epoch: number;
    currentEpoch: number;
    handler: () => void;
    expiry: number;
    textContent: string;
    disabled: boolean;
    canStake: boolean;
  };
}

const columnHelper = createColumnHelper<WritePositionData>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p className="text-stieglitz">{info.getValue()}</p>,
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <p className="inline-block">
        {format(info.getValue() * 1000, 'dd MMM yyyy')}
      </p>
    ),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => {
      const value = info.getValue();

      return (
        <span>
          {formatAmount(value.amount, 3, true)}{' '}
          <span className="text-stieglitz">
            {value.isPut ? '2CRV' : value.symbol}
          </span>
        </span>
      );
    },
  }),
  columnHelper.accessor('premium', {
    header: 'Premiums',
    cell: (info) => {
      const value = info.getValue();

      return (
        <span>
          {formatAmount(value.premium, 3, true)}{' '}
          <span className="text-stieglitz">
            {value.isPut ? '2CRV' : value.symbol}
          </span>
        </span>
      );
    },
  }),
  columnHelper.accessor('rewardsAccrued', {
    header: 'Rewards',
    cell: (info) =>
      info.getValue().map((rewardAccrued, index) => (
        <span className="flex space-x-1 text-xs" key={`reward-id-${index}`}>
          <p className="inline-block">
            {formatAmount(formatUnits(rewardAccrued.amount, DECIMALS_TOKEN), 3)}{' '}
          </p>
          <p className="inline-block text-stieglitz" key={`reward-id-${index}`}>
            {rewardAccrued.symbol}
          </p>
        </span>
      )),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();

      return (
        <Button
          key={value.tokenId}
          color={value.disabled ? 'mineshaft' : 'primary'}
          onClick={value.handler}
          disabled={value.disabled}
          className={value.disabled ? 'cursor-not-allowed' : ''}
        >
          {value.disabled ? (
            <Countdown
              date={new Date(value.expiry * 1000)}
              renderer={({ days, hours, minutes }) => {
                return (
                  <span className="text-xs md:text-sm text-white pt-1">
                    {days}d {hours}h {minutes}m
                  </span>
                );
              }}
            />
          ) : (
            value.textContent
          )}
        </Button>
      );
    },
  }),
];

const BUTTONS = {
  claimAndWithdraw: {
    textContent: 'Withdraw',
    disabled: false,
  },
  claimOnly: {
    textContent: 'Claim',
    disabled: false,
  },
  stakeOnly: {
    textContent: 'Stake',
    disabled: false,
  },
  fallback: {
    textContent: 'Withdraw',
    disabled: true,
  },
};

const WritePositions = (props: Props) => {
  const { positions: _positions, isLoading = false } = props;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const vault = useVaultStore((vault) => vault.vault);

  const { address: accountAddress } = useAccount();

  const { vaults } = useVaultsData({ market: vault.underlyingSymbol });

  const selectedVault = useMemo(() => {
    const selected = vaults.find(
      (_vault) =>
        vault.duration === _vault.duration && vault.isPut === _vault.isPut,
    );

    return selected;
  }, [vaults, vault]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const positions = useMemo(() => {
    if (!_positions) return [];

    const handleClick = (index: number) => {
      setActiveIndex(index);
      setOpen(true);
    };

    return _positions.map((position: WritePosition, index: number) => {
      const canBeWithdrawn = position.expiry < new Date().getTime() / 1000;
      const canBeStaked =
        !!position.rewardsInfo.length &&
        !position.rewardsAccrued.length &&
        !canBeWithdrawn;
      const canBeClaimedOnly =
        !!position.rewardsAccrued.length && !canBeWithdrawn;
      let _button = BUTTONS.fallback;
      let handler = handleClick;
      // canBeStaked => ¬canBeClaimed & ¬canBeWithdrawn
      if (canBeStaked) {
        _button = BUTTONS.stakeOnly;
      }
      // canBeClaimed => ¬canBeStaked & canBeWithdrawn
      else if (canBeClaimedOnly) {
        _button = BUTTONS.claimOnly;
      }
      // canBeWithdrawn => ¬canBeStaked & canBeClaimed
      else if (canBeWithdrawn) {
        _button = BUTTONS.claimAndWithdraw;
      } else {
        _button = BUTTONS.fallback;
      }

      return {
        side: position.side,
        strike: String(position.strike) || '0',
        amount: {
          amount: position.balance,
          symbol: vault.underlyingSymbol,
          isPut: position.side === 'Put',
        },
        expiry: position.expiry,
        rewardsAccrued: position.rewardsAccrued,
        premium: {
          premium: position.accruedPremium,
          symbol: vault.underlyingSymbol,
          isPut: position.side === 'Put',
        },
        button: {
          tokenId: position.tokenId,
          epoch: position.epoch,
          currentEpoch: selectedVault?.currentEpoch || 0,
          expiry: position.expiry,
          handler: () => handler(index),
          textContent: _button.textContent,
          disabled: _button.disabled,
          canStake: canBeStaked,
        },
      };
    });
  }, [_positions, vault.underlyingSymbol, selectedVault?.currentEpoch]);

  const renderStepperCondition = useMemo(() => {
    return !_positions || !_positions[activeIndex] || !accountAddress;
  }, [_positions, accountAddress, activeIndex]);

  const table = useReactTable({
    columns,
    data: positions,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  return (
    <div className="space-y-2">
      {positions.length > 0 ? (
        <div className="space-y-2 bg-cod-gray rounded-lg py-3">
          <div className="overflow-x-auto">
            <table className="bg-cod-gray rounded-lg w-full">
              <thead className="sticky">
                {getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index: number) => {
                      let textAlignment;
                      if (index === 0) {
                        textAlignment = 'text-left';
                      } else if (index === columns.length - 1) {
                        textAlignment = 'text-right';
                      } else {
                        textAlignment = 'text-left';
                      }
                      return (
                        <th
                          key={header.id}
                          className={`m-3 py-2 px-3 ${textAlignment} w-1/${columns.length}`}
                        >
                          <span className="text-sm text-stieglitz font-normal">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}{' '}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="max-h-32 overflow-y-auto">
                {getRowModel().rows.map((row) => {
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-umbra border-b border-umbra"
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        let textAlignment;
                        if (index === 0) {
                          textAlignment = 'text-left';
                        } else if (index === columns.length - 1) {
                          textAlignment = 'text-right';
                        } else {
                          textAlignment = 'text-left';
                        }
                        return (
                          <td
                            key={cell.id}
                            className={`m-3 py-2 px-3 ${textAlignment}`}
                          >
                            <span className="text-sm">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}{' '}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Placeholder isLoading={isLoading} />
      )}
      {!renderStepperCondition ? (
        <WithdrawStepper
          isOpen={open}
          handleClose={handleClose}
          data={{
            ssov: (_positions?.[activeIndex]?.address ??
              zeroAddress) as Address,
            tokenId: BigInt(positions[activeIndex].button.tokenId),
            to: accountAddress as Address,
            epoch: BigInt(positions[activeIndex].button.epoch || 0),
            expiry: positions[activeIndex].expiry || 0,
            canStake: positions[activeIndex].button.canStake,
            rewardsAccrued: positions[activeIndex].rewardsAccrued,
          }}
        />
      ) : null}
    </div>
  );
};

export default WritePositions;
