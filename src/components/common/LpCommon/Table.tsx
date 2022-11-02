import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { BigNumber } from 'ethers';

import { Typography } from 'components/UI';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

import { LpPosition } from 'store/Vault/olp';

export const StyleTable = styled(TableContainer)`
  table {
    border-collapse: separate !important;
    border-spacing: 0 0.5em !important;
  }
  td {
    border: solid 1px #000;
    border-style: solid none;
    padding: 10px 16px;
  }
`;

export const HeaderCell = ({ title }: { title: string }) => {
  return (
    <TableCell
      align="right"
      className="text-stieglitz bg-cod-gray border-0 pb-3"
    >
      <Typography variant="h6" color="text-stieglitz" className="text-center">
        {title}
      </Typography>
    </TableCell>
  );
};

export const BodyCell = ({ data }: { data: string }) => {
  return (
    <TableCell className="pt-1">
      <Typography variant="h6" className="text-center">
        {data}
      </Typography>
    </TableCell>
  );
};

export const getStrikeBodyCell = (strike: BigNumber) => {
  return (
    <BodyCell
      data={`$${formatAmount(
        getUserReadableAmount(strike, DECIMALS_STRIKE),
        2
      )}`}
    />
  );
};

export const getUntransformedBodyCell = (num: BigNumber) => {
  return <BodyCell data={`${formatAmount(getUserReadableAmount(num, 0))}%`} />;
};

export const getLiquidityBodyCell = (
  underlying: string,
  usdValue: BigNumber,
  underlyingValue: BigNumber,
  showUsd: boolean = true
) => {
  if (showUsd) {
    return (
      <BodyCell
        data={`$${formatAmount(
          getUserReadableAmount(usdValue, DECIMALS_USD),
          2
        )}`}
      />
    );
  }
  return (
    <BodyCell
      data={`${formatAmount(
        getUserReadableAmount(underlyingValue, DECIMALS_TOKEN),
        2
      )} ${underlying.toUpperCase()}`}
    />
  );
};

export const DialogRow = ({ data, value }: { data: string; value: string }) => {
  return (
    <Box className="flex flex-row justify-between">
      <Box className="flex">
        <Typography variant="h6" className="text-sm pl-1 pt-2">
          <span className="text-stieglitz">{data}</span>
        </Typography>
      </Box>
      <Box className="ml-auto mr-0">
        <Typography
          variant="h6"
          color="text-stieglitz"
          className="text-sm pl-1 pt-2 pr-3"
        >
          <span className="text-stieglitz">{value}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export const LiquidityDialogRow = ({
  data,
  underlying,
  lpPositionSelected,
}: {
  data: string;
  underlying: string;
  lpPositionSelected: LpPosition;
}) => {
  if (lpPositionSelected?.usdLiquidity.gt(BigNumber.from(0))) {
    return (
      <DialogRow
        data={data}
        value={`${formatAmount(
          getUserReadableAmount(lpPositionSelected?.usdLiquidity, DECIMALS_USD),
          2
        )} USDC`}
      />
    );
  }
  return (
    <DialogRow
      data={data}
      value={`${formatAmount(
        getUserReadableAmount(
          lpPositionSelected?.underlyingLiquidity,
          DECIMALS_TOKEN
        ),
        2
      )} ${underlying}`}
    />
  );
};

export const NumberLiquidityDialogRow = ({
  data,
  underlying,
  usdValue,
  underlyingValue,
  isUsd,
}: {
  data: string;
  underlying: string;
  usdValue: number;
  underlyingValue: number;
  isUsd: boolean;
}) => {
  if (isUsd) {
    return (
      <DialogRow data={data} value={`${formatAmount(usdValue, 2)} USDC`} />
    );
  }
  return (
    <DialogRow
      data={data}
      value={`${formatAmount(underlyingValue, 4)} ${underlying}`}
    />
  );
};
