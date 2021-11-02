import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import ExerciseList from '../components/ExerciseList';
import Stats from '../components/Stats';

import { SsovProvider } from 'contexts/Ssov';

const Manage = () => {
  return (
    <SsovProvider>
      <Box className="overflow-x-hidden bg-black h-screen">
        <AppBar active="SSOV" />
        <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
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
            <Stats className="mt-4" />
          </Box>
        </Box>
      </Box>
    </SsovProvider>
  );
};

export default Manage;
