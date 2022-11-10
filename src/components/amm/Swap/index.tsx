import Box from '@mui/material/Box';

import SwapHeader from 'components/amm/Swap/SwapHeader';
import SwapBody from 'components/amm/Swap/SwapBody';

const Swap = () => {
  return (
    <Box className="my-auto rounded-xl bg-cod-gray space-y-2 p-2">
      <SwapHeader />
      <SwapBody />
    </Box>
  );
};

export default Swap;
