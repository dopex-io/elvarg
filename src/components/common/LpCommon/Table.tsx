import { Box, TableContainer, TableCell } from '@mui/material';
import { Typography } from 'components/UI';
import styled from '@emotion/styled';
import { BigNumber } from 'ethers';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

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

export const getHeaderCell = (title: string) => {
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

export const getBodyCell = (data: string) => {
  return (
    <TableCell className="pt-1">
      <Typography variant="h6" className="text-center">
        {data}
      </Typography>
    </TableCell>
  );
};

export const getStrikeBodyCell = (strike: BigNumber) => {
  return getBodyCell(
    `$${formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}`
  );
};

export const getUntransformedBodyCell = (num: BigNumber) => {
  return getBodyCell(`${formatAmount(getUserReadableAmount(num, 0))}%`);
};

export const getLiquidityBodyCell = (
  underlying: string,
  usdValue: BigNumber,
  underlyingValue: BigNumber,
  showUsd: boolean = true
) => {
  if (showUsd) {
    return getBodyCell(
      `$${formatAmount(getUserReadableAmount(usdValue, DECIMALS_USD), 2)}`
    );
  }
  return getBodyCell(
    `${formatAmount(
      getUserReadableAmount(underlyingValue, DECIMALS_TOKEN),
      2
    )} ${underlying.toUpperCase()}`
  );
};

export const getDialogRow = (data: string, value: string) => {
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
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export const getLiquidityDialogRow = (
  data: string,
  underlying: string,
  usdValue: BigNumber,
  underlyingValue: BigNumber,
  isUsd: boolean
) => {
  if (isUsd) {
    return getDialogRow(
      data,
      `${formatAmount(getUserReadableAmount(usdValue, DECIMALS_USD), 2)} USDC`
    );
  }
  return getDialogRow(
    data,
    `${formatAmount(
      getUserReadableAmount(underlyingValue, DECIMALS_TOKEN),
      2
    )} ${underlying}`
  );
};

export const getNumberLiquidityDialogRow = (
  data: string,
  underlying: string,
  usdValue: number,
  underlyingValue: number,
  isUsd: boolean
) => {
  if (isUsd) {
    return getDialogRow(data, `${formatAmount(usdValue, 2)} USDC`);
  }
  return getDialogRow(
    data,
    `${formatAmount(underlyingValue, 4)} ${underlying}`
  );
};
