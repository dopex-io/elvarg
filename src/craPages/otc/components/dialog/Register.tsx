import React from 'react';
import Box from '@material-ui/core/Box';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

interface RegisterProps {
  open: boolean;
  handleClose: () => {};
}

const Register = ({ open, handleClose }: RegisterProps) => {
  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col">
        <Typography variant="h5" className="text-stieglitz">
          Register
        </Typography>
      </Box>
    </Dialog>
  );
};

export default Register;
