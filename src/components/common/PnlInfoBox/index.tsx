import cx from 'classnames';

import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

interface Props {
  info: string;
  value: any;
  className?: string;
  color?: string;
}

export default function PnlInfoBox({ info, value, className, color }: Props) {
  return (
    <Box className="flex justify-between mb-3.5">
      <Typography
        variant="caption"
        component="div"
        color="stieglitz"
        className="text-xs"
      >
        {info}
      </Typography>
      <Typography
        variant="caption"
        component="div"
        color={color ? color : ''}
        className={className ? cx(className) : 'text-xs'}
      >
        {value}
      </Typography>
    </Box>
  );
}
