import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import Typography from 'components/UI/Typography';
import PoolCardItem from './PoolCardItem';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { IconButton } from '@mui/material';

interface PoolCardProps {
  tokenId: string;
  poolType: string;
  isPut: boolean;
  epochLength: 'weekly' | 'monthly';
  deposits: BigNumber;
}

const PoolCard = (props: PoolCardProps) => {
  const { tokenId, poolType, isPut, epochLength, deposits } = props;

  const type = useMemo(() => (isPut ? 'put' : 'call'), [isPut]);

  return (
    <Box
      className="bg-umbra rounded-lg p-3 border border-umbra hover:border-primary transition ease-in-out hover:duration-250"
      role="button"
    >
      <Box className="flex justify-between">
        <Box className="flex space-x-2">
          <img
            src={`/assets/${tokenId}.svg`}
            alt={tokenId}
            className="h-[2rem] w-[2rem] border border-mineshaft rounded-full"
          />
          <Typography variant="h6" className="my-auto">
            {poolType}
          </Typography>
          <img
            src={'/assets/' + type + 's.svg'}
            className="h-[1.6rem] w-[3.2rem] my-auto"
            alt={type}
          />
        </Box>
        <IconButton className="p-0">
          <ArrowForwardRoundedIcon className="fill-current text-white" />
        </IconButton>
      </Box>
      <Box className="space-y-2 mt-2">
        <PoolCardItem description="Epoch Length" value={epochLength} />
        <PoolCardItem
          description="Deposits"
          value={getUserReadableAmount(deposits, 18)}
        />
      </Box>
    </Box>
  );
};

export default PoolCard;
// Perps
// Nested Puts
// Insured Stables
