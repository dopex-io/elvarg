import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { CircularProgress } from '@mui/material';

import { Button } from '@dopex-io/ui';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import useRewardAPR from 'hooks/rdpx/useRewardAPR';

import ContractLink from 'components/rdpx-v2/Body/Farm/Card/ContractLink';
import Stats from 'components/rdpx-v2/Body/Farm/Card/Stats';
import Title from 'components/rdpx-v2/Body/Farm/Card/Title';
import ManageFarm from 'components/rdpx-v2/Dialogs/ManageFarm';
import Typography2 from 'components/UI/Typography2';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

interface Props {
  title: string;
  subtitle: string;
  url: string;
  imgSrc?: string | [string, string];
  disabled?: boolean;
}

const Card = (props: Props) => {
  const { title, subtitle, imgSrc = '', url, disabled } = props;

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
    writeAsync: claim,
    // isSuccess: claimed,
    isLoading: claiming,
  } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.rtethEthStaking,
    functionName: 'getReward',
  });
  const { data: earned = 0n, refetch: refetchEarned } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.rtethEthStaking,
    functionName: 'earned',
    args: [user, addresses.dpx],
  });
  const { data: totalSupply = 0n, refetch: refetchTvl } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.rtethEthStaking,
    functionName: 'totalSupply',
  });
  const { data: stakedBalance = 0n, refetch: refetchStakedBalance } =
    useContractRead({
      abi: CurveMultiRewards,
      address: addresses.rtethEthStaking,
      functionName: 'balanceOf',
      args: [user],
    });

  const { rtethEthRewardAPR } = useRewardAPR();

  const handleClose = () => {
    setOpen(false);
  };

  const onClaim = useCallback(async () => {
    claim()
      .then(async () => await Promise.all([refetchEarned(), refetchTvl()]))
      .catch((e) => console.error(e));
  }, [claim, refetchEarned, refetchTvl]);

  useEffect(() => {
    let prefix = '';
    if (earned < parseUnits('1', 15)) {
      prefix = '<';
    }
    const tvl = Number(formatUnits(totalSupply, DECIMALS_TOKEN)).toFixed(3);

    setStats([
      {
        label: 'TVL',
        value: tvl,
        unit: 'LP',
      },
      {
        label: 'APR',
        value: rtethEthRewardAPR,
        unit: '%',
      },
      {
        label: 'Earned',
        value: prefix.concat(
          Number(formatUnits(earned, DECIMALS_TOKEN)).toFixed(3),
        ),
        unit: 'DPX',
      },
    ]);
  }, [earned, rtethEthRewardAPR, totalSupply]);

  return (
    <div className="bg-cod-gray rounded-lg p-3 w-full  max-w-[390px] space-y-2">
      <div className="flex justify-between">
        <Title imgSrc={imgSrc} title={title} subtitle={subtitle} />
        <div className="flex space-x-2 h-fit my-auto">
          {earned > 0n ? (
            <Button
              size="xsmall"
              disabled={claiming}
              onClick={onClaim}
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
        <ManageFarm open={open} handleClose={handleClose} data={[]} />
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
              {Number(formatUnits(stakedBalance, DECIMALS_TOKEN)).toFixed(3)}
            </p>
            <p className="text-stieglitz">rtETH-WETH LP</p>
          </span>
        )}
      </div>
      <ContractLink url={url} text="Deposit on Curve.fi to get LP tokens" />
    </div>
  );
};

export default Card;
