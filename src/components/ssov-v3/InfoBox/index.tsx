import Box from '@mui/material/Box';
import cx from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  Icon?: React.FC;
  imgSrc?: string;
  heading: string;
  value: string;
  className?: string;
  tooltip?: string;
}

const InfoBox = ({
  Icon,
  imgSrc,
  heading,
  value,
  className,
  tooltip,
}: InfoBoxProps) => {
  return (
    <Box className={cx('flex flex-col p-4 bg-umbra rounded-xl', className)}>
      <Box className="mb-2 flex flex-row">
        {Icon ? (
          <Icon />
        ) : imgSrc ? (
          <img src={imgSrc} alt="logo" className="w-10 h-10" />
        ) : null}
      </Box>
      <Box className="flex flex-row">
        <Typography
          variant="caption"
          component="div"
          className="text-left"
          color="stieglitz"
        >
          {heading}
        </Typography>
        {tooltip ? (
          <Box className="ml-1 flex items-center">
            <Tooltip
              className="h-4 text-stieglitz"
              title={tooltip}
              arrow={true}
            >
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
