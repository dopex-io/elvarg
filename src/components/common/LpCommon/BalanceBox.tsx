import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import { Typography } from 'components/UI';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_USD, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  assetIdx: number;
  usdBalance: BigNumber;
  underlyingBalance: BigNumber;
  underlyingSymbol: string;
}

const BalanceBox = ({
  assetIdx,
  usdBalance,
  underlyingBalance,
  underlyingSymbol,
}: Props) => {
  return (
    <Box className="flex flex-row justify-between mt-3 -ml-1 -mr-1 -mb-1">
      <Box className="flex">
        <Typography variant="h6" className="text-sm pt-2">
          <span className="text-stieglitz">Balance</span>
        </Typography>
      </Box>
      <Box className="ml-auto mr-0">
        {assetIdx === 0 ? (
          <Typography variant="h6" className="text-sm pl-1 pt-2">
            {`${formatAmount(
              getUserReadableAmount(usdBalance, DECIMALS_USD),
              2
            )} USDC`}
          </Typography>
        ) : (
          <Typography variant="h6" className="text-sm pl-1 pt-2">
            {`${formatAmount(
              getUserReadableAmount(underlyingBalance, DECIMALS_TOKEN),
              2
            )} ${underlyingSymbol?.toUpperCase()}`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BalanceBox;
