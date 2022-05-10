import Countdown from 'react-countdown';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

// @ts-ignore TODO: FIX
const RewardsCountdown = ({ periodFinish, stakingAsset }) => {
  return (
    <Countdown
      date={new Date(periodFinish * 1000)}
      renderer={({ days, hours, minutes, seconds }) => {
        return (
          <Tooltip
            title={`Farming rewards for ${stakingAsset} pool end on ${new Date(
              periodFinish * 1000
            )}`}
          >
            <Box className="flex items-center w-full mb-4 text-wave-blue cursor-default">
              <QueryBuilderIcon className="text-sm mr-2" />
              <Typography
                className="text-sm font-mono text-wave-blue"
                variant="h6"
                component="div"
              >
                {days}d {hours}h {minutes}m {seconds}s
              </Typography>
            </Box>
          </Tooltip>
        );
      }}
    />
  );
};

export default RewardsCountdown;
