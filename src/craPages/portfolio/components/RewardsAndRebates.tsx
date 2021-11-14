import { useState, useContext, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import Typography from 'components/UI/Typography';
import CallRewardsDialog from '../Dialogs/CallRewardsDialog';
import ActionRewardsDialog from '../Dialogs/ActionRewardsDialog';
import RebatesDialog from '../Dialogs/RebatesDialog';

import { PortfolioContext } from 'contexts/Portfolio';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const RewardsAndRebates = () => {
  const {
    totalDpxEarnedFromCalls,
    totalDpxEarnedFromActions,
    totalRdpxEarnedFromRebates,
  } = useContext(PortfolioContext);
  const [claimCallsDialog, setClaimCallsDialog] = useState(false);
  const [claimActionDialog, setClaimActionDialog] = useState(false);
  const [claimRebatesDialog, setClaimRebatesDialog] = useState(false);

  const handleCallsClick = useCallback(() => {
    setClaimCallsDialog(true);
  }, []);
  const handleActionsClick = useCallback(() => {
    setClaimActionDialog(true);
  }, []);
  const handleRebatesClick = useCallback(() => {
    setClaimRebatesDialog(true);
  }, []);

  const handleClaimCallsDialogClose = useCallback(() => {
    setClaimCallsDialog(false);
  }, []);
  const handleClaimActionDialogClose = useCallback(() => {
    setClaimActionDialog(false);
  }, []);
  const handleClaimRebatesDialogClose = useCallback(() => {
    setClaimRebatesDialog(false);
  }, []);

  return (
    <>
      <CallRewardsDialog
        open={claimCallsDialog}
        closeModal={handleClaimCallsDialogClose}
      />
      <ActionRewardsDialog
        open={claimActionDialog}
        closeModal={handleClaimActionDialogClose}
      />
      <RebatesDialog
        open={claimRebatesDialog}
        closeModal={handleClaimRebatesDialogClose}
      />
      <Box className="bg-cod-gray rounded-lg my-2 md:mt-1.5 md:mr-1.5">
        <Typography variant="h6" className="text-xl p-3 text-stieglitz">
          Rewards & Rebates
        </Typography>
        <Box className="p-3">
          <Box
            className="flex bg-umbra pl-2 rounded-md"
            onClick={handleCallsClick}
            role="button"
          >
            <Box className="flex-col">
              <Box className="flex">
                <FiberManualRecordIcon className="my-1 px-1 pt-1" />
                <span className="text-md text-white my-auto">Call Rewards</span>
              </Box>
              <Box className="flex">
                <Box className="bg-mineshaft px-2 py-1 mt-1 mb-2 rounded-md">
                  <span className="text-sm opacity-50 text-stieglitz">
                    DPX{' '}
                  </span>
                  {formatAmount(
                    getUserReadableAmount(
                      totalDpxEarnedFromCalls.toString(),
                      18
                    ).toString(),
                    8
                  )}
                </Box>
              </Box>
            </Box>
            <div className="flex-grow" />
            <IconButton className="h-full w-auto my-auto">
              <ChevronRightIcon className="fill-current text-white" />
            </IconButton>
          </Box>
          <Box
            className="flex bg-umbra pl-2 mt-2 rounded-md"
            onClick={handleActionsClick}
            role="button"
          >
            <Box className="flex-col">
              <Box className="flex">
                <FiberManualRecordIcon className="my-1 px-1 pt-1 fill-current text-blue-400" />
                <span className="text-md  my-auto">Action Rewards</span>
              </Box>
              <Box className="flex">
                <Box className="bg-mineshaft px-2 py-1 mt-1 mb-2 rounded-md">
                  <span className="text-sm opacity-50 text-stieglitz">
                    DPX{' '}
                  </span>
                  {formatAmount(
                    getUserReadableAmount(
                      totalDpxEarnedFromActions.toString(),
                      18
                    ).toString(),
                    8
                  )}
                </Box>
              </Box>
            </Box>
            <div className="flex-grow" />
            <IconButton className="h-full w-auto my-auto">
              <ChevronRightIcon className="fill-current text-white" />
            </IconButton>
          </Box>
          <Box
            className="flex bg-umbra pl-2 mt-2 rounded-md"
            onClick={handleRebatesClick}
            role="button"
          >
            <Box className="flex-col">
              <Box className="flex">
                <FiberManualRecordIcon className="my-1 px-1 pt-1 fill-current text-pink-500" />
                <span className="text-md  my-auto">Rebates</span>
              </Box>
              <Box className="flex">
                <Box className="bg-mineshaft px-2 py-1 mt-1 mb-2 rounded-md">
                  <span className="text-sm opacity-50 text-stieglitz">
                    rDPX{' '}
                  </span>
                  {formatAmount(
                    getUserReadableAmount(
                      totalRdpxEarnedFromRebates.toString(),
                      18
                    ).toString(),
                    8
                  )}
                </Box>
              </Box>
            </Box>
            <div className="flex-grow" />
            <IconButton className="h-full w-auto my-auto">
              <ChevronRightIcon className="fill-current text-white" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RewardsAndRebates;
