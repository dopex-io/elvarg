import { ReactNode } from 'react';

import Box from '@mui/material/Box';
import c from 'classnames';
import Equal from 'svgs/icons/Equal';

import Typography from 'components/UI/Typography';

interface StatBoxProps {
  Top: ReactNode;
  Bottom: ReactNode;
}

const StatBox = ({ Top, Bottom }: StatBoxProps) => {
  return (
    <Box className="flex flex-col">
      <Typography
        variant="h4"
        className={c('text-wave-blue flex flex-row items-center')}
      >
        <Equal className={c('hidden mr-2')} />
        {Top}
      </Typography>
      <Box className="flex flex-row items-center">
        <Typography variant="h6" className="text-stieglitz">
          {Bottom}
        </Typography>
      </Box>
    </Box>
  );
};
export default StatBox;
