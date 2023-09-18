import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import format from 'date-fns/format';

import { OptionPosition } from 'hooks/option-amm/useAmmUserData';

import TableLayout from 'components/common/TableLayout';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

interface ColumnDef {
  id: bigint;
  side: string;
  // isShort: boolean;
  strike: string;
  premium: string;
  // marginToLock: string;
  amount: string;
  // exercised: string;
  // markPrice: string;
  // fees: string;
  // openedAt: bigint;
  expiry: bigint;
  button: {
    id: number;
    handleSettle: () => void;
    // epoch: number;
    // currentEpoch: number;
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
      <span className="space-x-2">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue()}</p>
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
        disabled={true} // info.getValue().canItBeSettled}
        size="small"
        variant="contained"
      >
        Exercise
      </Button>
    ),
  }),
];

interface Props {
  positions?: OptionPosition[];
  isLoading: boolean;
}

const LongOrShortPositions = (props: Props) => {
  const { positions: _positions, isLoading = false } = props;

  // const [activeIndex, setActiveIndex] = useState<number>(0);
  // const [open, setOpen] = useState<boolean>(false);

  // const { address } = useAccount();
  // const vault = useVaultStore((store) => store.vault);

  // const { vaults } = useVaultsData({ market: vault.underlyingSymbol });

  // const selectedVault = useMemo(() => {
  //   const selected = vaults.find(
  //     (_vault) =>
  //       vault.duration === _vault.duration && vault.isPut === _vault.isPut,
  //   );

  //   return selected;
  // }, [vaults, vault]);

  // const handleSettle = useCallback((index: number) => {
  //   setActiveIndex(index);
  //   setOpen(true);
  // }, []);

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const positions = useMemo(() => {
    if (!_positions) return [];
    return _positions.map((position, index: number) => {
      const size = position.amount;

      let premium = formatUnits(position.premium, DECIMALS_USD);
      const id = position._id;

      // const breakeven = premium / size + position.strike; // 1e6 / 1e6 + 1e8
      // const expiryElapsed = position.expiry < new Date().getTime() / 1000;
      const pnl = 0;

      return {
        id,
        side: position.isPut ? 'Put' : 'Call',
        strike: formatUnits(position.strike || 0n, DECIMALS_STRIKE),
        premium,
        amount:
          Number(formatUnits(BigInt(position.amount), DECIMALS_TOKEN)).toFixed(
            3,
          ) || '0',
        // size:
        //   Number(formatUnits(BigInt(position.amount), DECIMALS_TOKEN)).toFixed(
        //     3,
        //   ) || '0',
        expiry: position.expiry,
        breakeven: 0n,
        pnl,
        button: {
          id: index,
          handleSettle: () => {},
          // currentEpoch: selectedVault?.currentEpoch || 0,
          expiry: Number(position.expiry),
          canItBeSettled: false, // expiryElapsed && Number(pnl) > 0,
        },
      };
    });
  }, [_positions]);

  return (
    <TableLayout<ColumnDef>
      data={positions}
      columns={columns}
      isContentLoading={isLoading}
      rowSpacing={2}
    />
  );
};

export default LongOrShortPositions;
