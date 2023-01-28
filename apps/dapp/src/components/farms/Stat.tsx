import { ReactNode } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Stat = ({ name, value }: { name: string; value: ReactNode }) => {
  return (
    <Box className="bg-umbra p-3 w-full rounded-md">
      <Typography variant="h5">{value}</Typography>
      <Typography variant="caption" color="stieglitz">
        {name}
      </Typography>
    </Box>
  );
};

export default Stat;
