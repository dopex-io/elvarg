import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { useContractRead } from 'wagmi';

import { formatAmount } from 'utils/general';
import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const useRewardAPR = () => {
  const { data: totalSupplyperp } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.perpVaultStaking,
    functionName: 'totalSupply',
  });

  const { data: totalSupplyrt } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'totalSupply',
  });

  return useMemo(() => {
    if (totalSupplyperp === undefined || totalSupplyrt === undefined) {
      return {
        ppvRewardAPR: '0',
        rtRewardAPR: '0',
      };
    }

    const [ppvRewardAPR, rtRewardAPR] = [
      formatAmount(
        (3214 * 365) / (Number(formatUnits(1000000000000000000n, 18)) * 2020),
      ),
      formatAmount(
        (9624 * 365) /
          (Number(
            formatUnits(
              totalSupplyrt === 0n ? 1000000000000000000n : totalSupplyrt!,
              18,
            ),
          ) *
            2020),
      ),
    ];

    return {
      ppvRewardAPR,
      rtRewardAPR,
    };
  }, [totalSupplyperp, totalSupplyrt]);
};

export default useRewardAPR;
