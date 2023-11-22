import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContractRead } from 'wagmi';

import { formatAmount } from 'utils/general';

import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const useRewardAPR = () => {
  // const ethPriceQuery = useQuery({
  //   queryKey: ['eth-price'],
  //   queryFn: async () => {
  //     return await axios.get('https://api.dopex.io/v2/price/eth');
  //   },
  // });

  // console.log(ethPriceQuery);

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
        ((3214 * 365) /
          (Number(formatUnits(1000000000000000000n, 18)) * 2020)) *
          100,
      ),
      formatAmount(
        ((9624 * 365) /
          (Number(
            formatUnits(
              totalSupplyrt === 0n ? 1000000000000000000n : totalSupplyrt!,
              18,
            ),
          ) *
            2020)) *
          100,
      ),
    ];

    return {
      ppvRewardAPR,
      rtRewardAPR,
    };
  }, [totalSupplyperp, totalSupplyrt]);
};

export default useRewardAPR;
