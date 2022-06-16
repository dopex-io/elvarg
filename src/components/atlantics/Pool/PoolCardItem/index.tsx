import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface PoolCardItemProps {
  description: string;
  value: number | string;
}

const PoolCardItem = (props: PoolCardItemProps) => {
  const { description, value } = props;
  return (
    <Box className="flex justify-between">
      {/* why doesnt stieglitz work lol */}
      {/* lol no idea even hyphenated colors in tailwind config don't work */}
      <Typography variant="h6" className="text-stieglitz text-gray-500">
        {description}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );
};

export default PoolCardItem;
