import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface PoolStatsBoxInterface {
  stat: string | number;
  description: string;
}

const PoolStatsBox = (props: PoolStatsBoxInterface) => {
  const { stat, description } = props;

  return (
    <Box className="w-1/2 p-3">
      <Typography variant="h6">{stat}</Typography>
      <Typography variant="h6" color="stieglitz">
        {description}
      </Typography>
    </Box>
  );
};

export default PoolStatsBox;
// also used in components/atlantics/Manage/ManageCard
