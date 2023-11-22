import { useMemo } from 'react';

import { useContractRead } from 'wagmi';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const useRewardAPR = () => {
  const { data: rewardPerTokenPPV = 0n } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.perpVaultStaking,
    functionName: 'rewardPerToken',
    args: [addresses.arb],
  });
  const { data: rewardPerTokenRT = 0n } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.perpVaultStaking,
    functionName: 'rewardPerToken',
    args: [addresses.arb],
  });
  const { data: rewardsDataRT = ['0x', 1n, 0n, 0n, 0n, 0n] } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.perpVaultStaking,
    functionName: 'rewardData',
    args: [addresses.arb],
  });
  const { data: rewardsDataPPV = ['0x', 1n, 0n, 0n, 0n, 0n] } = useContractRead(
    {
      abi: CurveMultiRewards,
      address: addresses.perpVaultStaking,
      functionName: 'rewardData',
      args: [addresses.arb],
    },
  );

  return useMemo(() => {
    const [ppvRewardAPR, rtRewardAPR] = [
      formatBigint(
        ((rewardPerTokenRT * (365n / 7n)) / rewardsDataRT[1]) * 100n,
        DECIMALS_TOKEN,
      ),
      formatBigint(
        ((rewardPerTokenPPV * (365n / 7n)) / rewardsDataPPV[1]) * 100n,
        DECIMALS_TOKEN,
      ),
    ];

    return {
      ppvRewardAPR,
      rtRewardAPR,
    };
  }, [rewardPerTokenPPV, rewardPerTokenRT, rewardsDataPPV, rewardsDataRT]);
};

export default useRewardAPR;
