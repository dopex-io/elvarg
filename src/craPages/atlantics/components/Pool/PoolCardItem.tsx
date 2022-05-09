import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface PoolCardItem {
  description: string;
  value: number;
}

const PoolCardItem = (props) => {
  const { description, value } = props;
  return (
    <Box className="flex justify-between">
      <Typography variant="h6" className="text-stieglitz">
        {description}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );
};

export default PoolCardItem;
