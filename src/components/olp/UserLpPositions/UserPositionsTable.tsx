import { TableCell, TableRow } from '@mui/material';
import { BigNumber } from 'ethers';

import { LpPosition } from 'store/Vault/olp';

import {
  BodyCell,
  getLiquidityBodyCell,
} from 'components/common/LpCommon/Table';
import { CustomButton } from 'components/UI';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  lpPosition: LpPosition;
  actions: Function;
  underlyingSymbol: string;
}

export default function UserPositionsTable(props: Props) {
  const { lpPosition, actions, underlyingSymbol } = props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <BodyCell
        data={`$${formatAmount(
          getUserReadableAmount(lpPosition.strike, DECIMALS_STRIKE),
          2
        )}`}
      />
      {getLiquidityBodyCell(
        underlyingSymbol,
        lpPosition.usdLiquidity,
        lpPosition.underlyingLiquidity,
        lpPosition.usdLiquidity.gt(BigNumber.from(0))
      )}
      {getLiquidityBodyCell(
        underlyingSymbol,
        lpPosition.usdLiquidityUsed,
        lpPosition.underlyingLiquidityUsed,
        lpPosition.usdLiquidity.gt(BigNumber.from(0))
      )}
      <BodyCell
        data={`${formatAmount(getUserReadableAmount(lpPosition.discount, 0))}%`}
      />
      <BodyCell
        data={`${getUserReadableAmount(lpPosition.purchased, DECIMALS_TOKEN)}`}
      />
      <TableCell align="center" className="pt-2">
        <CustomButton
          className="cursor-pointer text-white"
          color="primary"
          onClick={() => actions()}
        >
          Kill
        </CustomButton>
      </TableCell>
    </TableRow>
  );
}
