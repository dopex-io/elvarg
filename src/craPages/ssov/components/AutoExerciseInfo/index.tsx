import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

const AutoExerciseInfo = () => {
  return (
    <Box className={'w-full'}>
      <Typography variant="h4" className="text-white">
        Auto Exercise
      </Typography>
      <Typography variant="h4" className="text-stieglitz mt-3">
        All options are auto exercised on expiry by default and can be settled
        any time after expiry at your convenience.
      </Typography>
    </Box>
  );
};

export default AutoExerciseInfo;
