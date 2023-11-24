import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import formatBigint from 'utils/general/formatBigint';

export interface CamelotPosition {
  id: bigint;
  composition: readonly [bigint, bigint];
  liquidity: bigint;
  button: {
    label: string;
    onClick: () => void;
  };
}

const columnHelper = createColumnHelper<CamelotPosition>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Position ID',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="inline-block">{Number(info.getValue())}</p>
      </span>
    ),
  }),
  columnHelper.accessor('composition', {
    header: 'Composition',
    cell: (info) => {
      const [rdpxAmount, wethAmount] = info.getValue();
      return (
        <div className="flex space-x-2">
          <span className="flex space-x-1">
            <p className="text-white">{Number(formatBigint(rdpxAmount))} </p>
            <p className="text-stieglitz">RDPX</p>
          </span>
          <span className="flex space-x-1">
            <p className="text-white">{Number(formatBigint(wethAmount))} </p>
            <p className="text-stieglitz">WETH</p>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const button = info.getValue();
      return (
        <Button size="small" onClick={button.onClick} className="w-20">
          {button.label}
        </Button>
      );
    },
  }),
];

export default columns;
