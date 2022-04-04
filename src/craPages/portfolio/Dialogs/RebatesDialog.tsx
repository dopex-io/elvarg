import { useCallback } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';

const RebatesDialog = ({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal?: Function;
}) => {
  const handleCloseModal = useCallback(() => {
    return closeModal();
  }, [closeModal]);

  return (
    <Dialog
      handleClose={handleCloseModal}
      open={open}
      showCloseIcon
      classes={{ paper: 'rounded' }}
    >
      <Typography variant="h5" className="mb-3">
        Rebates
      </Typography>
      <Box className="items-center mb-4 rounded-md">
        <Box className="flex justify-between">
          <span className="text-sm text-white">Event</span>
          <span className="text-sm text-stieglitz">Epoch</span>
        </Box>
        <Box className="my-3 flex flex-col text-white">
          <span className="flex mx-auto my-10">No Rebates Claimed Yet.</span>
        </Box>
      </Box>
    </Dialog>
  );
};

export default RebatesDialog;
