import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface PoolStatsRowProps {
  description: string;
  value: string;
}

const PoolStatsRow = (props: PoolStatsRowProps) => {
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

export default PoolStatsRow;
// also used in components/atlantics/Manage/ManageCard
