import { FC } from 'react';

import { Box, CircularProgress } from '@mui/material';

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return (
    <Box className="absolute left-[49%] top-[49%]">
      <CircularProgress />
    </Box>
  );
};

export default Loading;
