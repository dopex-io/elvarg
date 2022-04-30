import { ReactNode } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Stat = ({ name, value }: { name: string; value: ReactNode }) => {
  return (
    <Box className="flex flex-row justify-between">
      <Typography variant="h6" component="div" className="text-stieglitz">
        {name}
      </Typography>
      <Typography variant="h6" component="div">
        {value}
      </Typography>
    </Box>
  );
};

export default Stat;
