import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';

import { Button, Dialog } from '@dopex-io/ui';
import { format } from 'date-fns';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useTokenData from 'hooks/helpers/useTokenData';
import useCommunalFarm from 'hooks/rdpx/useCommunalFarm';

import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import { PanelState } from 'components/rdpx-v2/Dialogs/ManageFarm';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';
import Slider from 'components/UI/Slider';

import { formatBigint } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';
import CommunalFarm from 'constants/rdpx/abis/CommunalFarm';
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
  const {
    updateCommunalFarmState,
    communalFarmState,
    userCommunalFarmData,
    updateUserCommunalFarmData,
    refetchCommunalFarmState,
    refetchCommunalFarmUserData,
  } = useCommunalFarm({
    user,
  });
  const {
    approved,
    updateAllowance,
    balance: userBalance,
    updateBalance,
  } = useTokenData({
    token: addresses.mockStakeToken,
    spender: addresses.communalFarm,
    owner: user,
    amount,
  });
  const { writeAsync: approve, isLoading: approving } = useContractWrite({
    abi: erc20ABI,
    address: addresses.mockStakeToken,
    functionName: 'approve',
    args: [addresses.communalFarm, parseUnits(amount, DECIMALS_TOKEN)],
  });

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

  const accumulatedUnlockableData = useMemo(() => {
    const unlockablePositions = userCommunalFarmData.lockedStakes.filter(
      (ls) => new Date(Number(ls.ending_timestamp) * 1000) < new Date(),
    );

    const totalLiquidity = unlockablePositions.reduce(
      (prev, curr) => prev + curr.liquidity,
      0n,
    );
    return { totalLiquidity, unlockablePositions };
  }, [userCommunalFarmData.lockedStakes]);

  const { writeAsync: stake, isLoading: staking } = useContractWrite({
    abi: CommunalFarm,
    address: addresses.communalFarm,
    functionName: 'stakeLocked',
    args: [
      parseUnits(amount, DECIMALS_TOKEN),
      BigInt(Math.ceil(sliderValueToTime.lockDuration)),
    ],
  });

  const onChange = useCallback((e: any) => {
    setAmount(e.target.value);
  }, []);

  const onClickMax = useCallback(() => {
    setAmount(formatUnits(userBalance, DECIMALS_TOKEN));
  }, [userBalance]);

  const onClick = useCallback(() => {
    if (panelState === PanelState.Stake) {
      approved
        ? stake()
            .catch((e) => console.error(e))
            .finally(() => refetchCommunalFarmUserData())
        : approve()
            .then(async () => {
              await Promise.all([updateBalance(), updateAllowance()]).then(() =>
                stake(),
              );
            })
            .catch((e) => console.error(e))
            .finally(() => refetchCommunalFarmUserData());
    }
  }, [
    approve,
    approved,
    panelState,
    refetchCommunalFarmUserData,
    stake,
    updateAllowance,
    updateBalance,
  ]);

  const unstake = useCallback(
    async (index: number) => {
      const write = async () =>
        writeContract({
          abi: CommunalFarm,
          address: addresses.communalFarm,
          functionName: 'withdrawLocked',
          args: [accumulatedUnlockableData.unlockablePositions[index].kek_id],
        });
      await write()
        .then(() => refetchCommunalFarmUserData())
        .catch((e) => console.error(e));
    },
    [
      accumulatedUnlockableData.unlockablePositions,
      refetchCommunalFarmUserData,
    ],
  );

  const disabled = useMemo(() => {
    if (!sliderValueToTime) return true;
    return (
      (sliderValueToTime.lockDuration == 0 &&
        panelState === PanelState.Stake) ||
      amount == '' ||
      parseUnits(amount, DECIMALS_TOKEN) > userBalance ||
      staking ||
      approving
    );
  }, [amount, approving, panelState, sliderValueToTime, staking, userBalance]);

  useEffect(() => {
    updateCommunalFarmState();
  }, [updateCommunalFarmState]);

  useEffect(() => {
    updateUserCommunalFarmData();
  }, [updateUserCommunalFarmData]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance]);

  return (
    <Dialog
      title="Manage"
      isOpen={open}
      handleClose={() => {
        handleClose();
        refetchCommunalFarmState();
        refetchCommunalFarmUserData();
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
        {panelState === PanelState.Stake ? (
          <PanelInput
            amount={amount}
            handleChange={onChange}
            maxAmount={
              panelState === PanelState.Stake
                ? userBalance
                : userCommunalFarmData.totalLocked
            }
            handleMax={onClickMax}
            iconPath="/images/tokens/rdpx.svg"
            label="Balance"
            symbol="rDPX"
          />
        ) : (
          <div className="flex flex-col space-y-3">
            {accumulatedUnlockableData.unlockablePositions.map((pos, index) => (
              <span key={index} className="flex justify-between w-full">
                <p className="text-stieglitz text-sm my-auto">
                  {format(new Date(Number(pos.ending_timestamp) * 1000), 'pp')}
                </p>
                <p className="text-sm my-auto">
                  {formatBigint(pos.liquidity)} rDPX
                </p>
                <Button
                  size="xsmall"
                  onClick={async () => await unstake(index)}
                >
                  Unstake
                </Button>
              </span>
            ))}
          </div>
        )}
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
                  'Pp',
                )}`}
              />
            </>
          ) : (
            <RowItem
              label="Unlockable"
              content={`${formatBigint(
                accumulatedUnlockableData.totalLiquidity,
              )} rDPX`}
            />
          )}
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
        <Button
          size="small"
          onClick={onClick}
          disabled={disabled}
          className="space-x-2 items-center"
        >
          {approving || staking ? (
            <CircularProgress size={12} className="fill-current text-white" />
          ) : null}
          <span>{panelState === PanelState.Stake ? 'Stake' : 'Unstake'}</span>
        </Button>
      </div>
    </Dialog>
  );
};

export default ManageCommunalFarm;
