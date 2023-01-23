import React from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  label: string;
  value: number | string | undefined;
}

const GridItem = (props: Props) => {
  const { label, value } = props;

  return (
    <Box className="flex flex-col space-y-2 w-1/2 p-2 divide-carbon">
      <Typography variant="caption" color="stieglitz">
        {label}
      </Typography>
      <Typography variant="h6">${formatAmount(value, 3, false)}</Typography>
    </Box>
  );
};

export default GridItem;
