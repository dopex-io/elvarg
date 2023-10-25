import { useCallback, useState } from 'react';
import { Address, zeroAddress } from 'viem';

import { RdpxV2Treasury__factory } from '@dopex-io/sdk';
import { multicall } from 'wagmi/actions';

import addresses from 'constants/rdpx/addresses';
import initialContractStates from 'constants/rdpx/initialStates';

interface RdpxV2CoreState {
  bondMaturity: bigint;
  bondingRatio: [bigint, bigint];
  feePercentage: bigint;
  isRelpActive: boolean;
  relpFactor: bigint;
  bondDiscountFactor: bigint;
  totalWethDelegated: bigint;
}

interface Props {
  user: Address;
}

const config = {
  abi: RdpxV2Treasury__factory.abi,
  address: addresses.v2core,
};

const useBondingData = ({ user = '0x' }: Props) => {
  const [state, setState] = useState<RdpxV2CoreState>(
    initialContractStates.core
  );

  const updateV2CoreData = useCallback(async () => {
    if (user === '0x' || user === zeroAddress)
      throw new Error('Invalid user address');

    const [
      { result: bondMaturity },
      { result: relpFactor },
      { result: bondDiscountFactor },
    ] = await multicall({
      contracts: [
        {
          ...config,
          functionName: 'bondMaturity',
        },
        {
          ...config,
          functionName: 'reLpFactor',
        },
        {
          ...config,
          functionName: 'bondDiscountFactor',
        },
        // { ...config, functionName: 'bondingRatio' },
        // {
        //   ...config,
        //   functionName: 'totalWethDelegated',
        // },
      ],
    });

    if (!bondMaturity || !relpFactor || !bondDiscountFactor)
      throw new Error('Could not fetch from RDPX Core contract');

    setState((s) => ({ ...s, bondMaturity, relpFactor, bondDiscountFactor }));
  }, [user]);

  return {
    coreContractState: state, // pass state
    updateV2CoreData, // pass handler to update at component level
  };
};

export default useBondingData;
