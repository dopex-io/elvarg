import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import { DPXVotingEscrow__factory } from '@dopex-io/sdk';

import Typography from 'components/UI/Typography';
import NumberDisplay from 'components/UI/NumberDisplay';
import WalletButton from 'components/common/WalletButton';
import LockDialog from './LockDialog';
import Stat from './Stat';

import { vedpxAddress } from 'store/VeDPX';
import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

const UserVeDPX = () => {
  const [dialog, setDialog] = useState<{ open: boolean }>({ open: false });

  const { signer, userVedpxData: userData } = useBoundStore();

  const sendTx = useSendTx();

  const handleClose = () => {
    setDialog((prevState: any) => {
      return { ...prevState, open: false };
    });
  };

  const handleWithdraw = async () => {
    if (!signer) return;
    const vedpx = DPXVotingEscrow__factory.connect(vedpxAddress, signer);

    await sendTx(vedpx.withdraw());
  };

  const isWithdrawable = useMemo(() => {
    const currentTime = Number((new Date().getTime() / 1000).toFixed());

    if (
      userData.lockEnd.toNumber() < currentTime &&
      !userData.lockedDpxBalance.isZero()
    ) {
      return true;
    }

    return false;
  }, [userData]);

  return (
    <Box>
      <Box className="mb-4">
        <Typography variant="h4" component="h2" className="mb-1">
          Your veDPX
        </Typography>
        <Typography variant="h6" component="p" color="stieglitz">
          DPX can be locked for upto four years. Locking 1 DPX for four years
          will get you one veDPX.
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
          <Box />
          {isWithdrawable ? (
            <Box className="p-3">
              <WalletButton onClick={handleWithdraw}>Withdraw</WalletButton>
            </Box>
          ) : null}
        </Box>
      </Box>
      <LockDialog {...dialog} handleClose={handleClose} />
    </Box>
  );
};

export default UserVeDPX;
