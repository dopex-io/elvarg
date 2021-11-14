import Box from '@material-ui/core/Box';
import cx from 'classnames';
import { Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  Icon: React.FC;
  heading: string;
  value: string;
  className?: string;
  toolTip?: string;
}

const InfoBox = ({
  Icon,
  heading,
  value,
  className,
  toolTip,
}: InfoBoxProps) => {
  return (
    <Box className={cx('flex flex-col p-4 bg-umbra rounded-xl', className)}>
      <Box className="mb-2 h-10 max-w-14 flex flex-row">
        <Icon />
      </Box>
      <Box className="flex flex-row">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-left"
        >
          {heading}
        </Typography>
        {toolTip ? (
          <Box className="ml-1 flex items-center">
            <Tooltip className="h-4 text-stieglitz" title={toolTip}>
              <InfoOutlinedIcon />
            </Tooltip>
          </Box>
        ) : null}
      </Box>
      <Typography variant="h4">{value}</Typography>
    </Box>
  );
};

export default InfoBox;
