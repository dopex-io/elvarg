import { Box } from '@mui/material';
import { BigNumber } from 'ethers';

import { Typography } from 'components/UI';

import { getReadableTime } from 'utils/contracts';

const WithdrawInfoBox = ({ expiry }: { expiry: BigNumber }) => {
  return (
    <Box className="rounded-xl flex flex-col p-2 border border-none w-full">
      <Box className="flex">
        <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
          Withdrawable
        </Typography>
        <Box className={'text-right'}>
          <Typography variant="h6" className="text-white mr-auto ml-0">
            {expiry ? getReadableTime(expiry) : '-'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WithdrawInfoBox;
