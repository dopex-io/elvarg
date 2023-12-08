import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { cn } from 'utils/general';

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
        className={className ? cn(className) : 'text-xs text-white'}
      >
        {value}
      </Typography>
    </Box>
  );
}
