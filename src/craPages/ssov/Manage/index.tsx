import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import ExerciseList from '../components/ExerciseList';
import Stats from '../components/Stats';

const Manage = () => {
  const { asset } = useParams();

  const ssov = asset === 'rdpx' ? 'rdpx' : 'dpx';

  return (
    <Box className="overflow-x-hidden bg-black h-screen">
      <AppBar active="SSOV" />
      <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="flex flex-col mt-20">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description ssov={ssov} />
            <ManageCard ssov={ssov} />
          </Box>
          <ExerciseList ssov={ssov} />
          <Stats ssov={ssov} className="mt-4" />
        </Box>
      </Box>
    </Box>
  );
};

export default Manage;
