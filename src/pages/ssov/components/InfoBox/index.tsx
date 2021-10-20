import Box from '@material-ui/core/Box';
import cx from 'classnames';

import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  Icon: React.FC;
  heading: string;
  value: string;
  className?: string;
}

const InfoBox = ({ Icon, heading, value, className }: InfoBoxProps) => {
  return (
    <Box className={cx('flex flex-col p-4 bg-umbra rounded-xl', className)}>
      <Box className="mb-2 h-10 max-w-14 flex flex-row">
        <Icon />
      </Box>
      <Typography
        variant="caption"
        component="div"
        className="text-stieglitz text-left"
      >
        {heading}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
  );
};

export default InfoBox;
