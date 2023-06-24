import { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import cx from 'classnames';

import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  Icon?: React.FC;
  imgSrc?: string;
  heading: string;
  value: ReactNode;
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
          <img src={imgSrc} alt="logo" className="w-10 h-auto" />
        ) : null}
      </Box>
      <Box className="flex flex-row">
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
      <Typography variant="h4">{value}</Typography>
    </Box>
  );
};

export default InfoBox;
