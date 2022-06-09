import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import { useMemo } from 'react';

interface ManageCardTitleProps {
  depositToken: string;
  underlying: string;
  poolType: string;
  strategy: string;
  epochLength: string;
}

const ManageTitle = (props: ManageCardTitleProps) => {
  const { depositToken, underlying, poolType, strategy, epochLength } = props;

  return (
    <Box className="flex space-x-3 w-3/4">
      <Box className="relative w-[4.6rem]">
        {poolType === 'PUTS' && (
          <img
            src={`/images/tokens/${depositToken.toLowerCase()}.svg`}
            alt={depositToken}
            className="w-[2.625rem] border rounded-full border-umbra absolute left-[1.6rem]"
          />
        )}
        <img
          src={`/images/tokens/${underlying.toLowerCase()}.svg`}
          alt={underlying}
          className="w-[2.625rem] border rounded-full border-umbra"
        />
      </Box>
      <Box className="my-auto">
        <Typography variant="h5">{strategy.toUpperCase()}</Typography>
      </Box>
      <Typography
        variant="h6"
        className="my-auto bg-umbra rounded-[0.4em] px-2 py-1"
      >
        {epochLength.toUpperCase()}
      </Typography>
      <Typography
        variant="h6"
        className="my-auto bg-umbra rounded-[0.4em] px-2 py-1"
      >
        {poolType.toUpperCase()}
      </Typography>
    </Box>
  );
};

export default ManageTitle;
