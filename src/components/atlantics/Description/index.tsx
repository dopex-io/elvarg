import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Description = () => {
  return (
    <Box className="space-y-1 py-4">
      <Typography variant="h4">Pools</Typography>
      <Typography variant="h6" color="stieglitz">
        Deposit and Earn
      </Typography>
    </Box>
  );
};

export default Description;
