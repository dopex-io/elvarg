import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import ExerciseList from '../components/ExerciseList';

import { SsovProvider } from 'contexts/Ssov';

const Manage = () => {
  return (
    <SsovProvider>
      <Box className="overflow-x-hidden bg-black h-screen">
        <AppBar active="SSOV" />
        <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
          <Alert severity="warning" className="mt-12">
            Deposits for the first epoch (1st November to 26th November) open on
            29th October 8:00 AM UTC till 1st November 8:00 AM UTC
          </Alert>
          <Box className="flex flex-col mt-20">
            <Box className="flex flex-row mb-4">
              <Box className="w-1/2 flex flex-shrink">
                <Description />
              </Box>
              <Box className="w-1/2 flex flex-row-reverse flex-shrink">
                <ManageCard />
              </Box>
            </Box>
            <ExerciseList />
          </Box>
        </Box>
      </Box>
    </SsovProvider>
  );
};

export default Manage;
