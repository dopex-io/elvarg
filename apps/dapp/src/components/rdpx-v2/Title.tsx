import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Title = (/*props: Props*/) => {
  return (
    <Box>
      <Box className="text-center mx-auto max-w-xl flex flex-col items-center space-y-2">
        <span className="z-1 uppercase font-bold text-3xl tracking-[.5em]">
          Mint dpxETH
        </span>
        <Typography variant="h5" className="text-stieglitz">
          Bond rDPX to mint dpxETH
        </Typography>
        <Box className="flex w-48 justify-around"></Box>
      </Box>
    </Box>
  );
};

export default Title;
