import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import { utils as ethersUtils } from 'ethers';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/common/WalletButton';
import ManageDialog from './ManageDialog';
import Stat from './Stat';

import formatAmount from 'utils/general/formatAmount';

import { VeDPXContext } from 'contexts/VeDPX';

const UserVeDPX = () => {
  const [dialog, setDialog] = useState<any>({});

  const { userData } = useContext(VeDPXContext);

  const handleClose = () => {
    setDialog((prevState: any) => {
      return { ...prevState, open: false };
    });
  };

  return (
    <Box>
      <Box className="mb-4">
        <Typography variant="h4" component="h2" className="mb-1">
          Your veDPX
        </Typography>
        <Typography variant="h6" component="p" color="stieglitz">
          DPX can be locked for upto 4 years, locking 1 DPX for 4 years will get
          you 4 veDPX.
        </Typography>
      </Box>
      <Box className="bg-cod-gray rounded-xl mb-6 max-w-md">
        <Box className="grid grid-cols-3">
          <Stat
            name="veDPX Balance"
            value={`${formatAmount(
              ethersUtils.formatEther(userData.vedpxBalance),
              3
            )} DPX`}
          />
          <Stat
            name="Your Locked DPX"
            value={`${formatAmount(
              ethersUtils.formatEther(userData.lockedDpxBalance),
              3
            )} DPX`}
          />
          <Stat
            name="Locked Until"
            value={`${format(
              userData.lockEnd.toNumber() * 1000,
              'do MMM yyyy'
            )}`}
          />
          <Box className="p-3">
            <WalletButton onClick={() => setDialog({ open: true })}>
              Lock
            </WalletButton>
          </Box>
        </Box>
      </Box>
      <ManageDialog {...dialog} handleClose={handleClose} />
    </Box>
  );
};

export default UserVeDPX;
