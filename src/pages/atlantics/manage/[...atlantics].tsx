import Box from '@mui/material/Box';
import Head from 'next/head';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';

interface ManageProps {}

const Manage = (props) => {
  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="atlantics" />
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="mx-auto mb-8">
          <Box className="flex flex-col flex-wrap divide-y divide-umbra">
            <Typography variant="h6" className="text-stieglitz">
              {}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Manage;
