import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';

export interface RedeemRequestType {
  epoch: bigint;
  amount: bigint;
  composition: readonly [bigint, bigint];
  button: {
    label: string;
    disabled: boolean;
    handler: () => void;
  };
}

const columnHelper = createColumnHelper<RedeemRequestType>();

const columns = [
  columnHelper.accessor('epoch', {
    header: 'Epoch',
    cell: (info) => (
      <Typography2 variant="caption">{Number(info.getValue())}</Typography2>
    ),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => {
      const balance = info.getValue();
      return (
        <Typography2 variant="caption">
          {formatBigint(balance, DECIMALS_TOKEN)}{' '}
          <span className="text-stieglitz"> LP</span>
        </Typography2>
      );
    },
  }),
  columnHelper.accessor('composition', {
    header: 'Composition',
    cell: (info) => {
      const [wethAmount, rdpxAmount] = info.getValue();
      return (
        <td className="flex space-x-1">
          <span className="flex space-x-1">
            <Typography2 variant="caption">
              {formatBigint(wethAmount || 0n, DECIMALS_TOKEN)}{' '}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              WETH
            </Typography2>
          </span>
          <span className="flex space-x-1">
            <Typography2 variant="caption">
              {formatBigint(rdpxAmount || 0n, DECIMALS_TOKEN)}{' '}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              rDPX
            </Typography2>
          </span>
        </td>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const { disabled, handler, label } = info.getValue();
      return (
        <Button
          disabled={disabled}
          onClick={handler}
          size="small"
          className="my-2"
        >
          {label}
        </Button>
      );
    },
  }),
];

export default columns;
