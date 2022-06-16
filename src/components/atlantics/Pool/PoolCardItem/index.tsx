import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface PoolCardItemProps {
  description: string;
  value: number | string;
}

const PoolCardItem = (props: PoolCardItemProps) => {
  const { description, value } = props;
  return (
    <Box className="flex justify-between">
      <Typography variant="h6" color="stieglitz">
        {description}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );
};

export default PoolCardItem;
