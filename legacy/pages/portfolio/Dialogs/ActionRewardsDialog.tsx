import { useCallback, useContext } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';

import { PortfolioContext } from 'contexts/Portfolio';

const ActionRewardsDialog = ({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal?: Function;
}) => {
  const { actionRewards = [] } = useContext(PortfolioContext);

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
        Action Rewards
      </Typography>
      <Box className="items-center rounded-md">
        <Box className="flex justify-between">
          <span className="text-sm text-white">Event</span>
          <span className="text-sm text-stieglitz">Epoch</span>
        </Box>
        {actionRewards.length !== 0 ? (
          <Box className="p-2 bg-umbra rounded-md mt-3 flex flex-col text-white">
            {actionRewards.map((item, index) => {
              return (
                <Box className="flex justify-between" key={index}>
                  <Box className="flex flex-col">
                    <span className=" my-1">{item.description}</span>
                    <Box className="flex">
                      <Box className="bg-mineshaft px-2 py-1 mt-1 mb-2 rounded-md">
                        <span className="text-sm opacity-50 text-stieglitz">
                          DPX{' '}
                        </span>
                        {item.amount.toString().substring(0, 8)}
                      </Box>
                    </Box>
                  </Box>
                  <span className="my-auto mr-2">{item.poolEpoch}</span>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box className="my-3 flex flex-col text-white">
            <span className="flex mx-auto my-10">
              No Action Rewards Claimed Yet.
            </span>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default ActionRewardsDialog;
