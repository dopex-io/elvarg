import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';

import { Button, Dialog } from '@dopex-io/ui';
import { format } from 'date-fns';
import { erc20ABI, useAccount, useContractRead } from 'wagmi';

import useCommunalFarm from 'hooks/rdpx/useCommunalFarm';

import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import { PanelState } from 'components/rdpx-v2/Dialogs/ManageFarm';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';
import Slider from 'components/UI/Slider';

import { DECIMALS_TOKEN } from 'constants/index';
import addresses from 'constants/rdpx/addresses';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ManageCommunalFarm = ({ open, handleClose }: Props) => {
  const [amount, setAmount] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [panelState, setPanelState] = useState<PanelState>(PanelState.Stake);

  const { address: user = '0x' } = useAccount();

  const { data: userBalance = 0n, refetch: refetchRdpxBalance } =
    useContractRead({
      abi: erc20ABI,
      address: addresses.rdpx,
      functionName: 'balanceOf',
      args: [user],
    });
  const {
    updateCommunalFarmState,
    communalFarmState,
    userCommunalFarmData,
    updateUserCommunalFarmData,
  } = useCommunalFarm({
    user,
  });

  const onChange = useCallback((e: any) => {
    setAmount(e.target.value);
  }, []);

  const onClickMax = useCallback(() => {
    setAmount(formatUnits(userBalance, DECIMALS_TOKEN));
  }, [userBalance]);

  useEffect(() => {
    updateCommunalFarmState();
  }, [updateCommunalFarmState]);

  useEffect(() => {
    updateUserCommunalFarmData();
  }, [updateUserCommunalFarmData]);

  const sliderValueToTime = useMemo(() => {
    if (!communalFarmState)
      return {
        lockDuration: 0,
        unlockTime: Math.ceil(new Date().getTime() / 1000),
      };
    const range = Number(
      (
        communalFarmState.maxLockTime - communalFarmState.minLockTime
      ).toString(),
    );
    const multiplier = sliderValue;
    const lockDuration = range * (multiplier / 100);
    const unlockTime = Math.ceil(new Date().getTime() / 1000) + lockDuration;

    return { lockDuration, unlockTime };
  }, [communalFarmState, sliderValue]);

  const disabled = useMemo(() => {
    if (!sliderValueToTime) return true;
    return (
      (sliderValueToTime.lockDuration == 0 &&
        panelState === PanelState.Stake) ||
      amount == '' ||
      parseUnits(amount, DECIMALS_TOKEN) > userBalance
    );
  }, [amount, panelState, sliderValueToTime, userBalance]);

  return (
    <Dialog
      title="Manage"
      isOpen={open}
      handleClose={() => {
        handleClose();
        // resetStakeHook();
        // resetUnstakeHook();
      }}
      showCloseIcon
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between bg-umbra rounded-md p-0.5">
          {[PanelState.Stake, PanelState.Unstake].map((label, index) => (
            <Button
              key={index}
              size="xsmall"
              className="text-white border-0 w-1/2 hover:text-white"
              color={label === panelState ? 'carbon' : 'umbra'}
              onClick={() => {
                setPanelState(
                  label === PanelState.Stake
                    ? PanelState.Stake
                    : PanelState.Unstake,
                );
              }}
            >
              {label === PanelState.Stake ? 'Stake' : 'Unstake'}
            </Button>
          ))}
        </div>
        <PanelInput
          amount={amount}
          handleChange={onChange}
          maxAmount={userBalance}
          handleMax={onClickMax}
          iconPath="/images/tokens/rdpx.svg"
          label="Balance"
          symbol="rDPX"
        />
        <div className="relative z-50">
          {panelState === PanelState.Stake ? (
            <div>
              <Slider
                value={[sliderValue]}
                onValueChange={(e) => {
                  setSliderValue(e[e.length - 1]);
                }}
                max={100}
                min={0}
                defaultValue={[0]}
                step={0.1}
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col space-y-2 border border-carbon p-2 rounded-md">
          {panelState === PanelState.Stake ? (
            <>
              <RowItem
                label="Locked Until"
                content={`${format(
                  new Date(sliderValueToTime?.unlockTime * 1000),
                  'd LLL yyyy',
                )}`}
              />
            </>
          ) : null}
          <RowItem
            label="Staked"
            content={`${Number(
              formatUnits(userCommunalFarmData.totalLocked, DECIMALS_TOKEN),
            ).toFixed(3)} rDPX`}
          />
          <RowItem
            label="TVL"
            content={`${Number(
              formatUnits(communalFarmState.totalLocked, DECIMALS_TOKEN),
            ).toFixed(3)} rDPX`}
          />
        </div>
        <Button size="small" onClick={() => null} disabled={disabled}>
          {false ? <CircularProgress size={16} /> : null}
          {panelState === PanelState.Stake ? 'Stake' : 'Unstake'}
        </Button>
      </div>
    </Dialog>
  );
};

export default ManageCommunalFarm;
