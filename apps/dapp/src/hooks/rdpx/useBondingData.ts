import { useCallback, useState } from 'react';
import { Address, zeroAddress } from 'viem';

import { RdpxV2Bond__factory, RdpxV2Treasury__factory } from '@dopex-io/sdk';
import { range } from 'lodash';
import { multicall, readContract, readContracts } from 'wagmi/actions';

import addresses from 'constants/rdpx/addresses';
import initialContractStates from 'constants/rdpx/initialStates';

interface RdpxV2CoreState {
  bondMaturity: bigint;
  bondingRatio: [bigint, bigint];
  feePercentage: bigint;
  isRelpActive: boolean;
  relpFactor: bigint;
  dscPrice: bigint;
  rdpxPriceInEth: bigint;
  secondLowerPeg: bigint;
  firstLowerPeg: bigint;
  upperPeg: bigint;
  bondDiscountFactor: bigint;
  totalWethDelegated: bigint;
}

interface UserBond {
  amount: bigint;
  maturity: bigint;
  timestamp: bigint;
  id: bigint;
  // collateralRatio: bigint;
}

interface Props {
  user: Address;
}

const coreContractConfig = {
  abi: RdpxV2Treasury__factory.abi,
  address: addresses.v2core,
};

const bondConfig = {
  abi: RdpxV2Bond__factory.abi,
  address: addresses.bond,
};

const useBondingData = ({ user = '0x' }: Props) => {
  const [state, setState] = useState<RdpxV2CoreState>(
    initialContractStates.v2core
  );
  const [userBonds, setUserBonds] = useState<UserBond[]>([]);

  const updateV2CoreData = useCallback(async () => {
    if (user === '0x' || user === zeroAddress)
      throw new Error('Invalid user address');

    const [
      { result: bondMaturity = 0n },
      { result: relpFactor = 0n },
      { result: bondDiscountFactor = 0n },
      { result: rdpxPriceInEth = 0n },
      { result: dscPrice = 0n },
      { result: secondLowerPeg = 0n },
      { result: firstLowerPeg = 0n },
      { result: upperPeg = 0n },
      // { result: bondCostPerReceipt = 0n },
      // { result: bondingRatio = 0n },
      // { result: totalWethDelegated = 0n },
    ] = await readContracts({
      // multicall
      contracts: [
        {
          ...coreContractConfig,
          functionName: 'bondMaturity',
        },
        {
          ...coreContractConfig,
          functionName: 'reLpFactor',
        },
        {
          ...coreContractConfig,
          functionName: 'bondDiscountFactor',
        },
        { ...coreContractConfig, functionName: 'getRdpxPrice' },
        { ...coreContractConfig, functionName: 'getDscPrice' },
        { ...coreContractConfig, functionName: 'DSC_SECOND_LOWER_PEG' },
        { ...coreContractConfig, functionName: 'DSC_FIRST_LOWER_PEG' },
        { ...coreContractConfig, functionName: 'DSC_UPPER_PEG' },
        // {
        //   abi: erc20ABI,
        //   address: addresses.weth,
        //   functionName: 'balanceOf',
        //   args: [user],
        // },
        // {
        //   abi: erc20ABI,
        //   address: addresses.rdpx,
        //   functionName: 'balanceOf',
        //   args: [user],
        // },
        // { ...coreContractConfig, functionName: 'bondingRatio' },
        // {
        //   ...coreContractConfig,
        //   functionName: 'totalWethDelegated',
        // },
      ],
    });

    if (!bondMaturity || !relpFactor || !bondDiscountFactor)
      throw new Error('Could not fetch from RDPX Core contract');

    setState((s) => ({
      ...s,
      bondMaturity,
      relpFactor,
      bondDiscountFactor,
      dscPrice,
      rdpxPriceInEth,
      secondLowerPeg,
      firstLowerPeg,
      upperPeg,
    }));
  }, [user]);

  const updateUserBonds = useCallback(async () => {
    if (user === '0x') return;

    const balance = await readContract({
      ...bondConfig,
      functionName: 'balanceOf',
      args: [user],
    });

    let multicallAggregate = [];
    for (const i of range(Number(balance))) {
      const contractCall = {
        ...bondConfig,
        functionName: 'tokenOfOwnerByIndex',
        args: [user, BigInt(i)],
      };
      multicallAggregate.push(contractCall);
    }
    const tokenIds = (
      await readContracts({ contracts: { ...multicallAggregate } })
    ) // multicall
      .map((res) => res.result) as bigint[];

    multicallAggregate = [];
    for (const id of tokenIds) {
      const config = {
        ...coreContractConfig,
        functionName: 'bonds',
        args: [id],
      };
      multicallAggregate.push(config);
    }
    let userBonds = (await readContracts({
      // multicall
      contracts: [...multicallAggregate],
      allowFailure: false,
    })) as {
      amount: bigint;
      maturity: bigint;
      timestamp: bigint;
    }[];

    try {
      setUserBonds(
        userBonds.map((bond, index) => ({
          ...bond,
          id: tokenIds[index],
        }))
      );
    } catch (e) {
      console.error(e);
      throw new Error('Something went wrong updating user bonds...');
    }
  }, [user]);

  // pass states and respective handlers
  return {
    userBonds,
    updateUserBonds,
    coreContractState: state,
    updateV2CoreData,
  };
};

export default useBondingData;
