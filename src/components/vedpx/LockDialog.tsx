import { useState, useCallback, useContext, useEffect, useMemo } from 'react';
import { BigNumber, utils } from 'ethers';
import {
  ERC20__factory,
  DPXVotingEscrow__factory,
  VeDPXYieldDistributor__factory,
} from '@dopex-io/sdk';
import { useDebounce } from 'use-debounce';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import format from 'date-fns/format';

import useSendTx from 'hooks/useSendTx';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import CustomButton from 'components/UI/Button';

import { WalletContext } from 'contexts/Wallet';
import {
  VeDPXContext,
  vedpxAddress,
  vedpxYieldDistributorAddress,
} from 'contexts/VeDPX';

import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

const ACTION_COPY = {
  create_lock: {
    cta: 'Lock',
    description: 'You are locking in DPX for the first time to get veDPX!',
  },
  increase_amount: {
    cta: 'Increase Amount',
    description:
      'You are increasing the total amount of locked DPX. Your unlock time will remain the same.',
  },
  increase_amount_and_time: {
    cta: 'Increase Amount & Time',
    description:
      'You are increasing the total amount of locked DPX and the unlock time for your DPX.',
  },
  increase_unlock_time: {
    cta: 'Increase Time',
    description:
      'You are increasing the unlock time for your locked DPX. The amount of DPX locked will remain the same.',
  },
  no_change: { cta: 'Lock', description: '' },
};

const LockDialog = (props: { open: boolean; handleClose: () => void }) => {
  const { open, handleClose } = props;

  const [error, setError] = useState('');
  const [value, setValue] = useState('0');
  const [lockPeriod, setLockPeriod] = useState(0);
  const [approved, setApproved] = useState(false);

  const [amount] = useDebounce(value, 1000);

  const { signer } = useContext(WalletContext);
  const { userData, data, updateData, updateUserData } =
    useContext(VeDPXContext);

  const sendTx = useSendTx();

  useEffect(() => {
    const currentTime = new Date().getTime() / 1000;
    const maxTime = currentTime + 4 * 365 * 86400;
    const unlockTime = userData.lockEnd.toNumber() + lockPeriod * 86400 * 7;

    if (!value) {
      setError('');
    } else if (isNaN(Number(value))) {
      setError('Please only enter numbers');
    } else if (utils.parseEther(value).gt(userData.dpxBalance)) {
      setError('Cannot deposit more than wallet balance');
    } else if (unlockTime > maxTime) {
      setError('Cannot lock for more than 4 years');
    } else {
      setError('');
    }
  }, [value, userData, lockPeriod]);

  const action = useMemo(() => {
    let _amount;
    try {
      _amount = utils.parseEther(value);
    } catch {
      _amount = BigNumber.from(0);
    }

    if (userData.lockedDpxBalance.isZero()) return 'create_lock';
    if (lockPeriod && !_amount.isZero()) return 'increase_amount_and_time';
    if (!_amount.isZero()) return 'increase_amount';
    if (lockPeriod) return 'increase_unlock_time';

    return 'no_change';
  }, [lockPeriod, userData, value]);

  const handleChange = useCallback((e: { target: { value: string } }) => {
    setValue(e.target.value);
  }, []);

  const handleMax = useCallback(() => {
    setValue(utils.formatEther(userData.dpxBalance));
  }, [userData.dpxBalance]);

  const handleDeposit = useCallback(async () => {
    if (!signer) return;
    try {
      const vedpx = DPXVotingEscrow__factory.connect(vedpxAddress, signer);
      const vedpxYieldDistributor = VeDPXYieldDistributor__factory.connect(
        vedpxYieldDistributorAddress,
        signer
      );

      const currentTime = new Date().getTime() / 1000;

      const _amount = utils.parseEther(amount);

      let unlockTime = userData.lockEnd.isZero()
        ? Number(currentTime.toFixed()) + lockPeriod * 86400 * 7
        : Number(
            (userData.lockEnd.toNumber() + lockPeriod * 86400 * 7).toFixed()
          );

      if (action === 'create_lock') {
        await sendTx(vedpx.create_lock(_amount, unlockTime + 86400 * 7));
      } else if (action === 'increase_amount_and_time') {
        await sendTx(vedpx.increase_amount_and_time(_amount, unlockTime));
      } else if (action === 'increase_unlock_time') {
        await sendTx(vedpx.increase_unlock_time(unlockTime));
      } else if (action === 'increase_amount') {
        await sendTx(vedpx.increase_amount(_amount));
      }

      await sendTx(vedpxYieldDistributor.checkpoint());

      await updateData();
      await updateUserData();
    } catch (err) {
      console.log(err);
    }
  }, [
    action,
    amount,
    lockPeriod,
    sendTx,
    signer,
    userData,
    updateData,
    updateUserData,
  ]);

  const handleApprove = useCallback(async () => {
    if (!signer) return;
    try {
      const dpx = ERC20__factory.connect(
        '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
        signer
      );

      await sendTx(dpx.approve(vedpxAddress, MAX_VALUE));
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx]);

  useEffect(() => {
    (async function () {
      if (!!error || !signer || !amount) return;

      const _accountAddress = await signer?.getAddress();
      let allowance = await ERC20__factory.connect(
        '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
        signer
      ).allowance(_accountAddress, vedpxAddress);

      if (
        utils.parseEther(amount).lte(allowance) &&
        allowance.toString() !== '0'
      ) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [signer, data, amount, error]);

  const handleLockPeriod = (
    _event: Event,
    _value: number | number[],
    _activeThumb: number
  ) => {
    setLockPeriod(_value as number);
  };

  const buttonDisabled = useMemo(() => {
    if (!!error || (!Number(value) && !lockPeriod)) return true;
    else if (action === 'create_lock' && (!lockPeriod || !Number(value)))
      return true;
    return false;
  }, [action, error, lockPeriod, value]);

  return (
    <Dialog open={open} showCloseIcon handleClose={handleClose}>
      <Box className="flex flex-col space-y-3">
        <Typography variant="h5">Lock DPX</Typography>
        <Input
          type="number"
          leftElement={
            <Box className="mr-2 flex space-x-2">
              <img
                src={`/images/tokens/dpx.svg`}
                alt={'DPX'}
                className="w-8 h-8"
              />
              <CustomButton
                size="small"
                color="secondary"
                className="bg-mineshaft px-5 min-w-0"
                onClick={handleMax}
              >
                MAX
              </CustomButton>
            </Box>
          }
          bottomElement={
            <Typography variant="caption" color="stieglitz">
              Balance: {utils.formatEther(userData.dpxBalance?.toString())}
            </Typography>
          }
          onChange={handleChange}
          value={value}
          placeholder="0.0"
        />
        <Box className="bg-umbra p-3 rounded-md">
          <Box className="flex justify-between mb-3">
            <Typography variant="caption" color="stieglitz">
              Lock Period
            </Typography>
            <Typography variant="caption">{lockPeriod} Weeks</Typography>
          </Box>
          <Box className="mx-3">
            <Slider value={lockPeriod} onChange={handleLockPeriod} max={207} />
          </Box>
        </Box>
        <Box className="border-umbra border rounded-lg flex justify-evenly">
          <Box className="border-r-umbra border-r p-3 w-full">
            <Box className="mb-1 flex space-x-1 items-center">
              <ArrowForwardIcon className="w-4 text-mineshaft mr-2" />
              <Typography variant="h5" color="wave-blue">
                {formatAmount(
                  utils.formatEther(
                    userData.lockedDpxBalance.add(
                      utils.parseEther(
                        (isNaN(Number(value)) ? '0' : value) || '0'
                      )
                    )
                  ),
                  2
                )}
              </Typography>
            </Box>
            <Typography variant="caption" color="stieglitz">
              Locked DPX
            </Typography>
          </Box>
          <Box className="p-3 w-full">
            <Box className="mb-1 flex space-x-1 items-center">
              <ArrowForwardIcon className="w-4 text-mineshaft mr-2" />
              <Typography variant="h5" color="wave-blue">
                {format(
                  action === 'create_lock'
                    ? (new Date().getTime() / 1000 + lockPeriod * 86400 * 7) *
                        1000
                    : (userData.lockEnd.toNumber() + lockPeriod * 86400 * 7) *
                        1000,
                  'do MMM yyyy'
                )}
              </Typography>
            </Box>
            <Typography variant="caption" color="stieglitz">
              Locked Until
            </Typography>
          </Box>
        </Box>
        {action !== 'no_change' ? (
          <Box className="bg-umbra p-3 rounded-md">
            <Typography variant="h5" color="down-bad">
              {ACTION_COPY[action].description}
            </Typography>
          </Box>
        ) : null}
        {error ? (
          <Typography
            variant="h5"
            color="black"
            className="mb-1 font-medium bg-down-bad rounded-lg p-3"
          >
            {error}
          </Typography>
        ) : null}
        <CustomButton
          size="medium"
          fullWidth
          disabled={buttonDisabled}
          onClick={approved ? handleDeposit : handleApprove}
        >
          {approved ? ACTION_COPY[action].cta : 'Approve'}
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default LockDialog;
