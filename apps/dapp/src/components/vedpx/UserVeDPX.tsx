import { useMemo, useState } from 'react';

import { DPXVotingEscrow__factory } from '@dopex-io/sdk';
import format from 'date-fns/format';

import { useBoundStore } from 'store';
import { vedpxAddress } from 'store/VeDPX';

import useSendTx from 'hooks/useSendTx';

import SignerButton from 'components/common/SignerButton';
import NumberDisplay from 'components/UI/NumberDisplay';

import LockDialog from './LockDialog';
import Stat from './Stat';

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

    await sendTx(vedpx, 'withdraw', []);
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
    <div>
      <div className="mb-4">
        <h2 className="text-xl text-white mb-1">Your veDPX</h2>
        <p className="text-stieglitz text-sm">
          DPX can be locked for upto four years. Locking 1 DPX for four years
          will get you one veDPX.
        </p>
      </div>
      <div className="bg-cod-gray rounded-xl mb-6 max-w-md">
        <div className="grid grid-cols-3">
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
          <div className="p-3">
            <SignerButton onClick={() => setDialog({ open: true })}>
              Lock
            </SignerButton>
          </div>
          <div />
          {isWithdrawable ? (
            <div className="p-3">
              <SignerButton onClick={handleWithdraw}>Withdraw</SignerButton>
            </div>
          ) : null}
        </div>
      </div>
      <LockDialog {...dialog} handleClose={handleClose} />
    </div>
  );
};

export default UserVeDPX;
