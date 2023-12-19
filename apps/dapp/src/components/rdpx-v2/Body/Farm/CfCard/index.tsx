import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';

import { Button } from '@dopex-io/ui';
import { useAccount, useContractWrite } from 'wagmi';

import useCommunalFarm from 'hooks/rdpx/useCommunalFarm';
import useRewardAPR from 'hooks/rdpx/useRewardAPR';

import ContractLink from 'components/rdpx-v2/Body/Farm/Card/ContractLink';
import Stats from 'components/rdpx-v2/Body/Farm/Card/Stats';
import Title from 'components/rdpx-v2/Body/Farm/Card/Title';
import ManageCommunalFarm from 'components/rdpx-v2/Dialogs/ManageCommunalFarm';
import Typography2 from 'components/UI/Typography2';

import { DECIMALS_TOKEN } from 'constants/index';
import CommunalFarm from 'constants/rdpx/abis/CommunalFarm';
import addresses from 'constants/rdpx/addresses';

type Props = {
  title: string;
  subtitle: string;
  url: string;
  imgSrc?: string | [string, string];
  disabled?: boolean;
};

const CfCard = (props: Props) => {
  const { title, subtitle, url, imgSrc = '', disabled = true } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<
    {
      label: string;
      value: string;
      unit: string;
    }[]
  >([]);

  const { address: user = '0x' } = useAccount();

  const {
    updateUserCommunalFarmData,
    userCommunalFarmData,
    updateCommunalFarmState,
    communalFarmState,
  } = useCommunalFarm({
    user,
  });
  const { singleSidedStakingRewardsAPR } = useRewardAPR();

  const { writeAsync: claim, isLoading: claiming } = useContractWrite({
    abi: CommunalFarm,
    address: addresses.communalFarm,
    functionName: 'getReward',
    account: user,
  });

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    updateCommunalFarmState();
  }, [updateCommunalFarmState]);

  useEffect(() => {
    updateUserCommunalFarmData();
  }, [updateUserCommunalFarmData]);

  useEffect(() => {
    let prefix = '';
    if (userCommunalFarmData.unlockable < parseUnits('1', 15)) {
      prefix = '<';
    }
    const tvl = Number(
      formatUnits(communalFarmState.totalLocked, DECIMALS_TOKEN),
    ).toFixed(3);

    setStats([
      {
        label: 'TVL',
        value: tvl,
        unit: 'rDPX',
      },
      {
        label: 'APR',
        value: singleSidedStakingRewardsAPR || '',
        unit: '%',
      },
      ...userCommunalFarmData.earnedTokens.map((userReward) => ({
        label: 'Earned',
        value: prefix.concat(
          Number(formatUnits(userReward.earned || 0n, DECIMALS_TOKEN)).toFixed(
            3,
          ),
        ),
        unit: userReward.symbol,
      })),
    ]);
  }, [userCommunalFarmData, communalFarmState, singleSidedStakingRewardsAPR]);

  return (
    <div className="bg-cod-gray rounded-lg p-3 w-full  max-w-[390px] space-y-2 flex flex-col">
      <div className="flex justify-between">
        <Title imgSrc={imgSrc} title={title} subtitle={subtitle} />
        <div className="flex space-x-2 h-fit my-auto">
          {userCommunalFarmData.earnedTokens.length > 0 ? ( // only accounts for the first reward token in the address[] array
            <Button
              size="xsmall"
              disabled={claiming}
              onClick={async () =>
                await claim()
                  .then(() => updateUserCommunalFarmData())
                  .catch((e) => console.error(e))
              }
              className="flex space-x-1"
            >
              {claiming ? (
                <CircularProgress
                  size={16}
                  className="fill-current text-white my-auto"
                />
              ) : null}
              <p className="my-auto">Claim</p>
            </Button>
          ) : null}
          <Button
            size="xsmall"
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            Manage
          </Button>
        </div>
        <ManageCommunalFarm open={open} handleClose={handleClose} />
      </div>
      <Stats stats={stats} />
      <p className="text-sm text-stieglitz">Staked Balance</p>
      <div className="h-fit bg-umbra p-2 rounded-md text-center">
        {!user ? (
          <Typography2 variant="caption" color="stieglitz">
            Connect your wallet
          </Typography2>
        ) : (
          <span className="flex w-fit p-2 bg-carbon rounded-md space-x-2 text-sm">
            <p className="text-white">
              {Number(
                formatUnits(userCommunalFarmData.totalLocked, DECIMALS_TOKEN),
              ).toFixed(3)}
            </p>
            <p className="text-stieglitz">rDPX</p>
          </span>
        )}
      </div>
      <div className="flex flex-col h-full justify-end">
        <ContractLink url={url} text="Farm Contract" />
      </div>
    </div>
  );
};

export default CfCard;
