import { ReactNode } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface RfqItemProps {
  info: string;
  value: string | ReactNode;
}

const RfqCardItem = (props: RfqItemProps) => {
  const { info, value } = props;
  return (
    <Box className="flex justify-between">
      <Typography variant="h6" className="text-stieglitz">
        {info}
      </Typography>
      {typeof value === 'string' ? (
        <Typography variant="h6" className="text-white">
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );
};

export default RfqCardItem;
