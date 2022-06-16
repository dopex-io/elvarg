import { ReactNode } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Stat = ({ name, value }: { name: ReactNode; value: ReactNode }) => {
  return (
    <Box className="p-3">
      <Typography variant="h6" color="stieglitz" className="mb-1.5 font-medium">
        {name}
      </Typography>
      <Typography variant="h5" className="font-medium">
        {value}
      </Typography>
    </Box>
  );
};

export default Stat;
