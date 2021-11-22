import Box from '@material-ui/core/Box';

import CustomButton from 'components/UI/CustomButton';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

const AutoExerciseAlert = ({ open, handleClose }) => {
  const handleClick = () => {
    handleClose();
  };

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col">
        <Typography variant="h4" className="mb-5">
          Auto Exercise your options now!
        </Typography>
        <Typography variant="h5" className="mb-4 text-stieglitz">
          The Auto Exercise feature is now available! This allows you to
          delegate your options to a contract that will automatically exercise
          your options during the exercise window at a minimal fee.
        </Typography>
        <CustomButton size="large" onClick={handleClick}>
          Close
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default AutoExerciseAlert;
