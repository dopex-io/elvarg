import dynamic from 'next/dynamic';

import { Button } from '@dopex-io/ui';
import { useAccount, useContractRead } from 'wagmi';

import QuickLink from 'components/rdpx-v2/QuickLink';
import Typography2 from 'components/UI/Typography2';

import { quickLinks } from 'constants/rdpx';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const ClientRenderedRewardsChart = dynamic(
  () => import('../../Charts/RewardsChart'),
  {
    ssr: false,
  },
);

const StakingBody = () => {
  const { address: account } = useAccount();
  const { data: earned } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.multirewards,
    functionName: 'earned',
    args: [account || '0x', addresses.multirewards],
  });
  return (
    <div className="p-3 bg-cod-gray rounded-xl space-y-3">
      <div className="flex w-full">
        <QuickLink {...quickLinks.staking} />
      </div>
      <div className=" bg-umbra rounded-xl divide-y-2 divide-cod-gray">
        <div className="flex w-full divide-x-2 divide-cod-gray">
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">-</Typography2>
            <Typography2 variant="caption" color="stieglitz">
              Staked
            </Typography2>
          </span>
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">-</Typography2>
            <Typography2 variant="caption" color="stieglitz">
              Earnings
            </Typography2>
          </span>
        </div>
        <div className="flex flex-col w-full sm:w-full p-2">
          <ClientRenderedRewardsChart data={[]} width={620} height={170} />
        </div>
        {earned ? (
          <div className="p-3 flex space-x-2">
            <Button color="primary" size="medium" className="w-full">
              Claim
            </Button>
            <Button color="mineshaft" size="medium" className="w-full">
              Unstake
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StakingBody;
