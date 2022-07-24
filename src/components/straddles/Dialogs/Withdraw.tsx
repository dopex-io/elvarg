import React from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export interface Props {
  open: boolean;
  handleClose: () => {};
}

const WithdrawModal = ({ open, handleClose }: Props) => {
  return (
    <Modal
      className="flex items-center justify-center"
      open={open}
      onClose={handleClose}
    >
      <Box className=" max-w-sm">
        <Box className="bg-cod-gray rounded-2xl p-3 pr-2">
          <Box className="flex justify-between items-center mb-2">
            <Typography variant="h6" className="text-sm">
              Withdrawal Method
            </Typography>
            <CloseIcon
              role="button"
              className="h-6 w-6"
              onClick={() => handleClose()}
            />
          </Box>
          <Box className="border rounded-lg border-neutral-800 mb-2">
            <Box className="flex justify-between items-center m-2">
              <Typography variant="h6" className="text-sm">
                Delegate Withdrawal
              </Typography>
              <Box className="h-fit w-fit bg-primary px-1 rounded-sm">
                <Typography variant="h6" className="text-sm">
                  Queue
                </Typography>
              </Box>
            </Box>
            <Box className="m-2">
              <Typography variant="h6" className="text-gray-400 text-sm">
                Managed contracts will automatically send your funds to your
                address as soon the epoch expires.
              </Typography>
              <Typography
                role="button"
                variant="h6"
                className="w-fit pt-4 text-sm text-wave-blue"
              >
                Contract
              </Typography>
            </Box>
          </Box>
          <Box className="border rounded-lg border-neutral-800 mt-2">
            <Box className="flex justify-between items-center m-2">
              <Typography variant="h6" className="text-sm">
                Withdraw Manually
              </Typography>
              <Box className="w-fit bg-neutral-800 px-2 rounded-sm flex items-center text-gray-400">
                <TimerOutlinedIcon className="w-4 mr-1" />
                <Typography variant="h6" className="text-sm">
                  2D 11H 3M
                </Typography>
              </Box>
            </Box>
            <Box className="m-2">
              <Typography variant="h6" className="text-gray-400 text-sm">
                You can only withdraw after this epochs expiry and before next
                one.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default WithdrawModal;
