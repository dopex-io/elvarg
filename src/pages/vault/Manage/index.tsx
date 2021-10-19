import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import ExerciseList from '../components/ExerciseList';

import { SsovProvider } from 'contexts/Ssov';

const Manage = () => {
  return (
    <SsovProvider>
      <Box className="overflow-x-hidden bg-black h-screen">
        <AppBar active="vault" />
        <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
          <Box className="flex flex-col mt-32">
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
