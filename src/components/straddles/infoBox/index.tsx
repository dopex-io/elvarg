import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  info: string;
  value: any;
  precision: number;
}

export default function InfoBox({ info, value, precision }: Props) {
  return (
    <Box className="flex justify-between mb-2 mx-2">
      <Typography variant="caption" color="stieglitz">
        {info}
      </Typography>
      <Typography variant="caption">{`${formatAmount(
        value,
        precision
      )} USDC`}</Typography>
    </Box>
  );
}
