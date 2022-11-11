import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const DetailsSwapSection = () => {
  return (
    <Box className="bg-carbon rounded-lg p-3 space-y-1">
      <Box className="flex justify-between">
        <Typography variant="h6" color="stieglitz">
          Price
        </Typography>
        <Typography variant="h6">Price</Typography>
      </Box>
      <Box className="flex justify-between">
        <Typography variant="h6" color="stieglitz">
          Fees (Incl. Gas)
        </Typography>
        <Typography variant="h6">Fees</Typography>
      </Box>
    </Box>
  );
};

export default DetailsSwapSection;
