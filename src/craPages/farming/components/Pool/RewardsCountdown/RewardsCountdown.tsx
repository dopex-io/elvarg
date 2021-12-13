import Countdown from 'react-countdown';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';

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
