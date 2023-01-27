import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface SwapInfoProps {
  description: string;
  value: string;
}

const SwapInfo = (props: SwapInfoProps) => {
  const { description, value } = props;

  return (
    <Box className="flex justify-between">
      <Typography variant="h6" color="stieglitz">
        {description}
      </Typography>
      <Typography variant="h6" color="white">
        {value}
      </Typography>
    </Box>
  );
};

export default SwapInfo;
