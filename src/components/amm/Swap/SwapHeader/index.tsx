import { useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

import Typography from 'components/UI/Typography';

const SwapHeader = () => {
  const handleClick = useCallback(() => {}, []);

  return (
    <Box className="flex justify-between">
      <Typography variant="h5" className="my-auto pl-2">
        Swap
      </Typography>
      <IconButton onClick={handleClick} className="p-0">
        <MoreVertRoundedIcon className="fill-current text-white" />
      </IconButton>
    </Box>
  );
};

export default SwapHeader;
