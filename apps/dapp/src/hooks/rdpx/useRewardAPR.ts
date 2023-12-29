'use client';

import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContractReads } from 'wagmi';

import { formatAmount } from 'utils/general';

import CommunalFarm from 'constants/rdpx/abis/CommunalFarm';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const useRewardAPR = () => {
  const priceQuery = useQuery({
    queryKey: ['eth-price'],
    queryFn: async () => {
      const [eth, arb, dpx, rdpx] = await Promise.all([
        axios.get('https://api.dopex.io/v2/price/eth'),
        axios.get('https://api.dopex.io/v2/price/arb'),
        axios.get('https://api.dopex.io/v2/price/dpx'),
        axios.get('https://api.dopex.io/v2/price/rdpx'),
      ]);

      return {
        eth: eth.data.cgPrice,
        arb: arb.data.cgPrice,
        dpx: dpx.data.cgPrice,
        rdpx: rdpx.data.cgPrice,
      };
    },
    staleTime: 50000,
  });

  const data = useContractReads({
    contracts: [
      {
        abi: CurveMultiRewards,
        address: addresses.receiptTokenStaking,
        functionName: 'totalSupply',
      },
      {
        abi: CurveMultiRewards,
        address: addresses.perpVaultStaking,
        functionName: 'totalSupply',
      },
      {
        abi: CurveMultiRewards,
        address: addresses.rtethEthStaking,
        functionName: 'totalSupply',
      },
      {
        abi: CommunalFarm,
        address: addresses.communalFarm,
        functionName: 'totalLiquidityLocked',
      },
    ],
  });

  return useMemo(() => {
    if (
      data.data === undefined ||
      data.data[0].result === undefined ||
      data.data[1].result === undefined ||
      data.data[2].result === undefined ||
      data.data[3].result === undefined ||
      priceQuery.data === undefined
    ) {
      return {
        ppvRewardAPR: '0',
        rtRewardAPR: '0',
        rtethEthRewardAPR: '0',
        singleSidedStakingRewardsAPR: '0',
      };
    }

    const perpVaultDailyRewardsInUSD = 1698 * Number(priceQuery.data.arb);
    const receiptTokenDailyRewardsInUSD = 5120 * Number(priceQuery.data.arb);
    const rtethEthDailyRewardsInUSD = 5 * Number(priceQuery.data.dpx);
    const singleSidedStakingRewardsInUSD = 1573 * Number(priceQuery.data.arb);

    const [
      ppvRewardAPR,
      rtRewardAPR,
      rtethEthRewardAPR,
      singleSidedStakingRewardsAPR,
    ] = [
      formatAmount(
        ((perpVaultDailyRewardsInUSD * 365) /
          (Number(formatUnits(data.data[1].result, 18)) *
            Number(priceQuery.data.eth))) *
          100,
      ),
      formatAmount(
        ((receiptTokenDailyRewardsInUSD * 365) /
          (Number(formatUnits(data.data[0].result, 18)) *
            Number(priceQuery.data.eth))) *
          100,
      ),
      formatAmount(
        ((rtethEthDailyRewardsInUSD * 365) /
          (Number(formatUnits(data.data[2].result, 18)) *
            Number(priceQuery.data.eth))) *
          100,
      ),
      formatAmount(
        ((singleSidedStakingRewardsInUSD * 365) /
          (Number(formatUnits(data.data[3].result, 18)) *
            Number(priceQuery.data.rdpx))) *
          100,
      ),
    ];

    return {
      ppvRewardAPR,
      rtRewardAPR,
      rtethEthRewardAPR,
      singleSidedStakingRewardsAPR,
    };
  }, [data.data, priceQuery.data]);
};

export default useRewardAPR;
