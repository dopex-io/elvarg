import Box from '@material-ui/core/Box';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Typography from 'components/UI/Typography';
import Image from 'next/image';

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
          <Image src={imgSrc} alt="logo" width={32} height={32} />
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
