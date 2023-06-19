import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

interface ManageCardTitleProps {
  depositToken: string;
  underlying: string;
  poolType: string;
  strategy: string;
  epochLength: string;
}

const ManageTitle = (props: ManageCardTitleProps) => {
  const {
    depositToken = 'USDC.e',
    underlying,
    poolType,
    strategy,
    epochLength,
  } = props;

  const { atlanticPool } = useBoundStore();

  const poolId = useMemo(() => {
    if (!atlanticPool) return;

    const { underlying, depositToken } = atlanticPool.tokens;
    if (!underlying || !depositToken) return;

    return `${underlying}-USDC.e-${'PUTS'}-${atlanticPool.durationType.substring(
      0,
      1
    )}`;
  }, [atlanticPool]);

  return (
    <Box className="flex space-x-4 flex-wrap px-2">
      <Box className="flex -space-x-4 h-fit min-w-fit">
        <img
          src={`/images/tokens/${underlying?.toLowerCase()}.svg`}
          alt={underlying}
          className="border rounded-full border-umbra w-12 h-12 z-10"
        />
        <img
          src={`/images/tokens/${depositToken?.toLowerCase() || 'usdc'}.svg`}
          alt={depositToken}
          className="border rounded-full border-umbra w-12 h-12"
        />
      </Box>
      <Box className="min-w-fit">
        <Typography variant="h5">{strategy.toUpperCase()}</Typography>
        <Typography variant="h6" color="stieglitz">
          {poolId}
        </Typography>
      </Box>
      <Box className="hidden sm:flex my-auto space-x-3 flex-col sm:flex-row">
        <Typography
          variant="h6"
          className="my-auto bg-umbra rounded-md px-2 py-1"
        >
          {epochLength.toUpperCase()}
        </Typography>
        <Typography
          variant="h6"
          className="my-auto bg-umbra rounded-md px-2 py-1"
        >
          {poolType.toUpperCase()}
        </Typography>
        <Typography
          variant="h6"
          className="my-auto border border-primary rounded-md px-2 py-1"
        >
          {`$${formatAmount(
            getUserReadableAmount(
              BigNumber.from(atlanticPool?.underlyingPrice || '0'),
              8
            ),
            3
          )}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ManageTitle;
