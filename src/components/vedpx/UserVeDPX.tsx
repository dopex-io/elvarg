import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';
import NumberDisplay from 'components/UI/NumberDisplay';
import WalletButton from 'components/common/WalletButton';
import LockDialog from './LockDialog';
import Stat from './Stat';

import { VeDPXContext } from 'contexts/VeDPX';

const UserVeDPX = () => {
  const [dialog, setDialog] = useState<{ open: boolean }>({ open: false });

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
          you 1 veDPX.
        </Typography>
      </Box>
      <Box className="bg-cod-gray rounded-xl mb-6 max-w-md">
        <Box className="grid grid-cols-3">
          <Stat
            name="veDPX Balance"
            value={
              <>
                <NumberDisplay n={userData.vedpxBalance} decimals={18} /> veDPX
              </>
            }
          />
          <Stat
            name="Your Locked DPX"
            value={
              <>
                <NumberDisplay n={userData.lockedDpxBalance} decimals={18} />{' '}
                DPX
              </>
            }
          />
          <Stat
            name="Locked Until"
            value={
              userData.lockEnd.toNumber() === 0
                ? '--'
                : `${format(userData.lockEnd.toNumber() * 1000, 'do MMM yyyy')}`
            }
          />
          <Box className="p-3">
            <WalletButton onClick={() => setDialog({ open: true })}>
              Lock
            </WalletButton>
          </Box>
        </Box>
      </Box>
      <LockDialog {...dialog} handleClose={handleClose} />
    </Box>
  );
};

export default UserVeDPX;
