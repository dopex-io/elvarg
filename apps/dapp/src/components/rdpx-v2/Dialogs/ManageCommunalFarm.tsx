import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';

import { Button, Dialog } from '@dopex-io/ui';
import { format } from 'date-fns';
import { useAccount } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useCommunalFarm from 'hooks/rdpx/useCommunalFarm';

import { PanelState } from 'components/rdpx-v2/Dialogs/ManageFarm';

import { formatBigint } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';
import CommunalFarm from 'constants/rdpx/abis/CommunalFarm';
import addresses from 'constants/rdpx/addresses';

type Props = {
  open: boolean;
  handleClose: () => void;
};

type RowItemProps = {
  label: string;
  content?: React.ReactNode | string;
};

const RowItem = (props: RowItemProps) => {
  const { label, content } = props;
  return (
    <div className="flex justify-between text-sm">
      <p className="text-stieglitz">{label}</p>
      {content}
    </div>
  );
};

const ManageCommunalFarm = ({ open, handleClose }: Props) => {
  const [panelState, setPanelState] = useState<PanelState>(PanelState.Unstake);
  const [unstakingIndex, setUnstakingIndex] = useState<number | null>(null);

  const { address: user = '0x' } = useAccount();
  const {
    updateCommunalFarmState,
    userCommunalFarmData,
    updateUserCommunalFarmData,
    refetchCommunalFarmState,
    refetchCommunalFarmUserData,
  } = useCommunalFarm({
    user,
  });

  const accumulatedUnlockableData = useMemo(() => {
    const unlockablePositions = userCommunalFarmData.lockedStakes.filter(
      (ls) => new Date(Number(ls.ending_timestamp) * 1000) < new Date(),
    );

    const totalLiquidity = unlockablePositions.reduce(
      (prev, curr) => prev + curr.liquidity,
      0n,
    );
    // **note** unlockablePositions[] is unused
    return { totalLiquidity, unlockablePositions };
  }, [userCommunalFarmData.lockedStakes]);

  const unstake = useCallback(
    async (index: number) => {
      setUnstakingIndex(index);
      const write = async () =>
        writeContract({
          abi: CommunalFarm,
          address: addresses.communalFarm,
          functionName: 'withdrawLocked',
          args: [userCommunalFarmData.lockedStakes[index].kek_id],
        });
      await write()
        .then(
          async () =>
            await Promise.all([
              refetchCommunalFarmUserData(),
              updateUserCommunalFarmData(),
            ]),
        )
        .catch((e) => console.error(e))
        .finally(() => setUnstakingIndex(null));
    },
    [
      refetchCommunalFarmUserData,
      updateUserCommunalFarmData,
      userCommunalFarmData.lockedStakes,
    ],
  );

  useEffect(() => {
    updateCommunalFarmState();
  }, [updateCommunalFarmState]);

  useEffect(() => {
    updateUserCommunalFarmData();
  }, [updateUserCommunalFarmData]);

  return (
    <Dialog
      title="Manage"
      isOpen={open}
      handleClose={() => {
        handleClose();
        refetchCommunalFarmState().then(() => updateCommunalFarmState());
        refetchCommunalFarmUserData().then(() => updateUserCommunalFarmData());
      }}
      showCloseIcon
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between bg-umbra rounded-md p-0.5">
          {[PanelState.Unstake].map((label, index) => (
            <Button
              key={index}
              size="xsmall"
              className="text-white border-0 w-full hover:text-white"
              color={label === panelState ? 'carbon' : 'umbra'}
              onClick={() => {
                setPanelState(PanelState.Unstake);
              }}
            >
              Unstake
            </Button>
          ))}
        </div>
        <div className="flex flex-col space-y-2 p-2 border border-carbon rounded-md">
          {userCommunalFarmData.lockedStakes.length > 0 ? (
            userCommunalFarmData.lockedStakes.map((pos, index) => (
              <span key={index} className="flex justify-between w-full">
                <p className="text-stieglitz text-sm my-auto">
                  {format(new Date(Number(pos.ending_timestamp) * 1000), 'Pp')}
                </p>
                <p className="text-sm my-auto">
                  {formatBigint(pos.liquidity)} rDPX
                </p>
                <p className="text-sm my-auto">
                  {Number(
                    formatUnits(pos.lock_multiplier, DECIMALS_TOKEN),
                  ).toFixed(3)}
                  x
                </p>
                <Button
                  size="xsmall"
                  onClick={async () => await unstake(index)}
                  disabled={
                    pos.ending_timestamp >
                    Math.ceil(new Date().getTime() / 1000)
                  }
                  className="space-x-2 items-center"
                >
                  {unstakingIndex === index ? (
                    <CircularProgress
                      size={12}
                      className="fill-current text-white"
                    />
                  ) : null}
                  <span>Unstake</span>
                </Button>
              </span>
            ))
          ) : (
            <p className="text-sm text-stieglitz text-center">
              Your positions will appear here.
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2 border border-carbon p-2 rounded-md">
          <RowItem
            label="Unlockable"
            content={`${formatBigint(
              accumulatedUnlockableData.totalLiquidity,
            )} rDPX`}
          />
          <RowItem
            label="Staked"
            content={`${Number(
              formatUnits(userCommunalFarmData.totalLocked, DECIMALS_TOKEN),
            ).toFixed(3)} rDPX`}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ManageCommunalFarm;
