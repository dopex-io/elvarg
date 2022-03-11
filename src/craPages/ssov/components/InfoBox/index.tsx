import Box from '@mui/material/Box';
import cx from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  imgSrc?: string;
  heading: string;
  value: string;
  className?: string;
  tooltip?: string;
}

const InfoBox = ({
  imgSrc,
  heading,
  value,
  className,
  tooltip,
}: InfoBoxProps) => {
  return (
    <Box className={cx('flex flex-col p-4 bg-umbra rounded-xl', className)}>
      <Typography variant="h5">{value}</Typography>
      <Box className="flex flex-row mt-1">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-left"
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
    </Box>
  );
};

export default InfoBox;
