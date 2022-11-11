import Box from '@mui/material/Box';

import Header from 'components/amm/SwapPanel/Header';
import Body from 'components/amm/SwapPanel/Body';

const Swap = () => {
  return (
    <Box className="my-auto rounded-xl bg-cod-gray space-y-2 p-2">
      <Header />
      <Body />
    </Box>
  );
};

export default Swap;
