import { useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import format from 'date-fns/format';
import { useAccount } from 'wagmi';

import useAmmUserData, {
  OptionPosition,
} from 'hooks/option-amm/useAmmUserData';
import useStrikesData from 'hooks/option-amm/useStrikesData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import TableLayout from 'components/common/TableLayout';
import SettleConfirmation from 'components/option-amm/Dialog/SettleConfirmation';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

interface ColumnDef {
  id: bigint;
  side: string;
  strike: string;
  premium: string;
  pnl: bigint;
  amount: string;
  expiry: bigint;
  button: {
    id: number;
    isShort: boolean;
    handleSettle: () => void;
    expiry: number;
    canItBeSettled: boolean;
  };
}

const columnHelper = createColumnHelper<ColumnDef>();

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
  columnHelper.accessor('amount', {
    header: 'Size',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('premium', {
    header: 'Premium',
    cell: (info) => (
      <span className="space-x-1">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('pnl', {
    header: 'Profit/Loss',
    cell: (info) => (
      <span className="space-x-1">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">
          {formatAmount(formatUnits(info.getValue(), DECIMALS_STRIKE), 3)}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">
          {format(Number(info.getValue()) * 1000, 'dd LLL yyyy')}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => (
      <Button
        className="inline-block"
        onClick={info.getValue().handleSettle}
        color="primary"
        disabled={!info.getValue().canItBeSettled}
        size="small"
        variant="contained"
      >
        {info.getValue().isShort ? 'Cover' : 'Exercise'}
      </Button>
    ),
  }),
];

interface Props {
  positions?: OptionPosition[];
  isShort: boolean;
  isLoading: boolean;
}

interface ClosePositionParams {
  id: bigint;
  amount: bigint;
}

const LongOrShortPositions = (props: Props) => {
  const { positions: _positions, isLoading = false, isShort } = props;

  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);

  const { expiryData } = useStrikesData({
    ammAddress: vault.address,
    isPut: vault.isPut,
    duration: vault.duration,
  });
  const { portfolioData } = useAmmUserData({
    ammAddress: vault.address,
    positionMinter: vault.positionMinter,
    portfolioManager: vault.portfolioManager,
    lpAddress: vault.lp,
    account: address || '0x',
  });

  const [closePositionParams, setClosePositionParams] =
    useState<ClosePositionParams>({
      id: 0n,
      amount: 0n,
    });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const positions = useMemo(() => {
    if (!_positions || !expiryData || !portfolioData) return [];
    return _positions.map((position, index: number) => {
      const size = position.amount;

      let premium = formatUnits(position.premium, DECIMALS_USD);
      const id = position._id;

      const breakeven =
        position.strike +
        ((position.isPut ? -1n : 1n) *
          (position.premium * parseUnits('1', DECIMALS_TOKEN + 2))) /
          (position.amount || 1n);

      const expiryElapsed = position.expiry < new Date().getTime() / 1000;

      let pnl: bigint = 0n;
      if (!isShort && expiryData.markPrice > breakeven) {
        pnl = position.isPut
          ? breakeven - expiryData.markPrice
          : expiryData.markPrice - breakeven;
      } else if (isShort) pnl = -position.premium; // @todo: calculate premium accrued minus total collateral

      if (pnl < 0) pnl = 0n;

      const canItBeSettled =
        expiryElapsed && ((!isShort && pnl > 0n) || (isShort && true)); // replace true with

      return {
        id,
        side: position.isPut ? 'Put' : 'Call',
        strike: formatUnits(position.strike || 0n, DECIMALS_STRIKE),
        premium,
        amount:
          Number(formatUnits(BigInt(size), DECIMALS_TOKEN)).toFixed(3) || '0',
        expiry: position.expiry,
        breakeven,
        pnl,
        button: {
          id: index,
          isShort,
          handleSettle: () => {
            setActiveIndex(index);
            setClosePositionParams({ id: id, amount: size });
            setOpen(true);
          },
          expiry: Number(position.expiry),
          canItBeSettled,
        },
      };
    });
  }, [_positions, expiryData, isShort, portfolioData]);

  return (
    <>
      <TableLayout<ColumnDef>
        data={positions}
        columns={columns}
        isContentLoading={isLoading}
        rowSpacing={2}
      />
      <SettleConfirmation
        open={open}
        handleClose={handleClose}
        data={{
          tokenId: closePositionParams.id,
          amount: closePositionParams.amount,
          expiry: positions[activeIndex]?.expiry || 0n,
          side: positions[activeIndex]?.side || '-',
          isShort: isShort,
          title: isShort
            ? 'Closing Short Position...'
            : 'Exercising Long Position...',
          pnl: positions[activeIndex]?.pnl,
        }}
      />
    </>
  );
};

export default LongOrShortPositions;
