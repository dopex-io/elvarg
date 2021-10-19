import Box from '@material-ui/core/Box';
import cx from 'classnames';

import Typography from 'components/UI/Typography';

import Boosted from 'assets/farming/Boosted';

interface FarmingHeaderProps {
  Icon: any;
  heading: string;
  className?: string;
}

const FarmingHeader = ({ Icon, heading, className }: FarmingHeaderProps) => {
  return (
    <Box className={cx('flex flex-col mb-8 w-full', className)}>
      <Box className="w-full flex flex-row justify-between">
        <Box className="flex flex-row mr-1">
          <Box className="mr-2 h-8 max-w-14 flex flex-row">
            <img src={Icon} alt="Icon" />
          </Box>
          <Typography variant="h5" className="text-white">
            {heading}
          </Typography>
        </Box>
        <Box>
          <Boosted />
        </Box>
      </Box>
    </Box>
  );
};

export default FarmingHeader;
