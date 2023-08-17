import { useCallback, useMemo, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import format from 'date-fns/format';
import Countdown from 'react-countdown';
import { useAccount } from 'wagmi';

import { BuyPosition } from 'hooks/ssov/useSsovPositions';
import useVaultsData from 'hooks/ssov/useVaultsData';
import useVaultStore from 'hooks/ssov/useVaultStore';

import TableLayout from 'components/common/TableLayout';
import SettleStepper from 'components/ssov-beta/Dialogs/SettleStepper';

import { STRIKE_DECIMALS } from 'utils/contracts/atlantics/pool';
import { formatAmount } from 'utils/general';
import computeOptionPnl from 'utils/math/computeOptionPnl';

interface Props {
  positions?: BuyPosition[];
  isLoading?: boolean;
}

interface BuyPositionData {
  strike: number;
  size: string;
  side: string;
  expiry: number;
  breakeven: string;
  pnl: string;
  button: {
    handleSettle: () => void;
    id: number;
    epoch: number;
    currentEpoch: number;
    expiry: number;
    canItBeSettled: boolean;
  };
}

const columnHelper = createColumnHelper<BuyPositionData>();

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
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('breakeven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">$ {info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('pnl', {
    header: 'PnL',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">$ {info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();

      return (
        <Button
          key={value.id}
          color={value.canItBeSettled ? 'primary' : 'mineshaft'}
          onClick={value.handleSettle}
          disabled={!value.canItBeSettled}
        >
          {value.canItBeSettled ? (
            'Settle'
          ) : (
            <Countdown
              date={new Date(value.expiry * 1000)}
              renderer={({ days, hours, minutes, seconds }) => {
                return (
                  <span className="text-xs md:text-sm text-white pt-1">
                    {seconds > 0 ? `${days}d ${hours}h ${minutes}m` : 'Expired'}
                  </span>
                );
              }}
            />
          )}
        </Button>
      );
    },
  }),
];

const BuyPositions = (props: Props) => {
  const { positions: _positions, isLoading = false } = props;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);

  const { vaults } = useVaultsData({ market: vault.underlyingSymbol });

  const selectedVault = useMemo(() => {
    const selected = vaults.find(
      (_vault) =>
        vault.duration === _vault.duration && vault.isPut === _vault.isPut,
    );

    return selected;
  }, [vaults, vault]);

  const handleSettle = useCallback((index: number) => {
    setActiveIndex(index);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const positions = useMemo(() => {
    if (!_positions) return [];
    return _positions.map((position, index: number) => {
      const size = Number(formatUnits(BigInt(position.balance), 18));

      let premium = position.premium;
      if (position.side === 'Call') {
        premium = position.premium * Number(selectedVault?.currentPrice);
      }

      const breakeven = formatAmount(premium / size + position.strike, 5);
      const expiryElapsed = position.expiry < new Date().getTime() / 1000;
      const pnl = formatAmount(
        computeOptionPnl({
          strike: position.strike,
          price: position.epochSettlementPrice,
          size,
          side: position.side.toLowerCase() as 'call' | 'put',
        }) - premium,
        5,
      );

      return {
        side: position.side,
        strike: position.strike || 0,
        size:
          Number(formatUnits(BigInt(position.balance), 18)).toFixed(3) || '0',
        expiry: position.expiry,
        breakeven,
        pnl,
        button: {
          id: index,
          handleSettle: () => handleSettle(index),
          epoch: position.epoch,
          currentEpoch: selectedVault?.currentEpoch || 0,
          expiry: position.expiry,
          canItBeSettled: expiryElapsed && Number(pnl) > 0,
        },
      };
    });
  }, [
    _positions,
    handleSettle,
    selectedVault?.currentEpoch,
    selectedVault?.currentPrice,
  ]);

  return (
    <div className="space-y-2">
      <TableLayout<BuyPositionData>
        data={positions}
        columns={columns}
        isContentLoading={isLoading}
      />
      <SettleStepper
        isOpen={open}
        handleClose={handleClose}
        data={{
          token: _positions?.[activeIndex]?.optionToken as Address,
          vault: _positions?.[activeIndex]?.vault as Address,
          strike: parseUnits(
            _positions?.[activeIndex]?.strike.toString() || '0',
            STRIKE_DECIMALS,
          ),
          amount: BigInt(_positions?.[activeIndex]?.balance || 0),
          epoch: BigInt(_positions?.[activeIndex]?.epoch || 0),
          to: address as Address,
        }}
      />
    </div>
  );
};

export default BuyPositions;
