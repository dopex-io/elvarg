import dynamic from 'next/dynamic';

import { Button } from '@dopex-io/ui';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import QuickLink from 'components/rdpx-v2/QuickLink';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { quickLinks } from 'constants/rdpx';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const rewardTokenSymbol = 'ARB';

const StakingBody = () => {
  const { address: account } = useAccount();
  const { data: earned = 0n } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'earned',
    args: [account || '0x', addresses.arb],
  });
  const { data: staked = 0n } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'balanceOf',
    args: [account || '0x'],
  });
  const { write: claim } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'getReward',
  });
  const { write: unstake } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'exit',
  });

  return (
    <div className="p-3 bg-cod-gray rounded-xl space-y-3">
      <div className="flex w-full">
        <QuickLink {...quickLinks.staking} />
      </div>
      <div className=" bg-umbra rounded-xl divide-y-2 divide-cod-gray">
        <div className="flex w-full divide-x-2 divide-cod-gray">
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">
              {formatBigint(staked)} rtETH
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              Staked
            </Typography2>
          </span>
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">
              {formatBigint(earned)} {rewardTokenSymbol}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              Earnings
            </Typography2>
          </span>
        </div>
        {earned ? (
          <div className="p-3 flex space-x-2">
            <Button
              color="mineshaft"
              size="medium"
              className="w-full"
              onClick={() => claim()}
            >
              Claim
            </Button>
            <Button
              color="mineshaft"
              size="medium"
              className="w-full"
              disabled={!unstake}
              onClick={() => unstake()}
            >
              Unstake
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StakingBody;
