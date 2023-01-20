import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import info from 'components/atlantics/Description/info.json';

const Description = () => {
  return (
    <Box className="space-y-1 py-4">
      <Typography variant="h4">{String(info?.title)}</Typography>
      <Typography variant="h6" color="stieglitz">
        String(info?.description))
      </Typography>
    </Box>
  );
};

export default Description;
