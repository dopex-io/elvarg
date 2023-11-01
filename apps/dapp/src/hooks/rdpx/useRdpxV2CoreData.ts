import { useCallback, useState } from 'react';
import { Address, parseUnits, zeroAddress } from 'viem';

import { range } from 'lodash';
import { erc20ABI } from 'wagmi';
import { multicall, readContract, readContracts } from 'wagmi/actions';

import { DECIMALS_TOKEN } from 'constants/index';
import RdpxReserve from 'constants/rdpx/abis/RdpxReserve';
import RdpxV2Bond from 'constants/rdpx/abis/RdpxV2Bond';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';
import initialContractStates from 'constants/rdpx/initialStates';

interface RdpxV2CoreState {
  bondMaturity: bigint;
  bondDiscountFactor: bigint;
  ethPrice: bigint;
  dpxethPriceInEth: bigint;
  rdpxPriceInEth: bigint;
  maxMintableBonds: bigint;
  bondComposition: readonly [bigint, bigint];
  discount: bigint;
}

interface UserBond {
  amount: bigint;
  maturity: bigint;
  timestamp: bigint;
  id: bigint;
}

export interface DelegatePosition {
  _id: bigint;
  owner: Address;
  amount: bigint;
  fee: bigint;
  activeCollateral: bigint;
}

interface Props {
  user: Address;
}

const coreContractConfig = {
  abi: RdpxV2Core,
  address: addresses.v2core,
};

const bondConfig = {
  abi: RdpxV2Bond,
  address: addresses.bond,
};

const useRdpxV2CoreData = ({ user = '0x' }: Props) => {
  const [rdpxV2CoreState, setRdpxV2CoreState] = useState<RdpxV2CoreState>(
    initialContractStates.v2core,
  );
  const [userBonds, setUserBonds] = useState<UserBond[]>([]);
  const [userDelegatePositions, setUserDelegatePositions] = useState<
    DelegatePosition[]
  >([]);
  const [delegatePositions, setDelegatePositions] = useState<
    DelegatePosition[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const updateRdpxV2CoreState = useCallback(async () => {
    if (user === '0x' || user === zeroAddress) return;

    const [
      { result: bondMaturity = 0n },
      { result: bondDiscountFactor = 0n },
      { result: rdpxPriceInEth = 0n },
      { result: dpxethPriceInEth = 0n },
      { result: ethPrice = 0n },
      { result: bondComposition = [0n, 0n] as const },
      { result: wethBalance = 0n },
      { result: rdpxBalance = 0n },
      { result: rdpxReserve = 0n },
    ] = await readContracts({
      // multicall
      contracts: [
        {
          ...coreContractConfig,
          functionName: 'bondMaturity',
        },
        {
          ...coreContractConfig,
          functionName: 'bondDiscountFactor',
        },
        { ...coreContractConfig, functionName: 'getRdpxPrice' },
        { ...coreContractConfig, functionName: 'getDpxEthPrice' },
        { ...coreContractConfig, functionName: 'getEthPrice' },
        {
          ...coreContractConfig,
          functionName: 'calculateBondCost',
          args: [parseUnits('1', DECIMALS_TOKEN), 0n],
        },
        {
          abi: erc20ABI,
          address: addresses.weth,
          functionName: 'balanceOf',
          args: [user],
        },
        {
          abi: erc20ABI,
          address: addresses.rdpx,
          functionName: 'balanceOf',
          args: [user],
        },
        {
          abi: RdpxReserve,
          address: addresses.rdpxReserve,
          functionName: 'rdpxReserve',
        },
      ],
    });

    // Math.min(Total RDPX / Cost of 1 bond in RDPX, Total ETH / Cost of 1 bond in ETH)
    const maxRdpxBondable =
      (rdpxBalance * parseUnits('1', DECIMALS_TOKEN)) /
      (bondComposition[0] || 1n);
    const maxEthBondable =
      (wethBalance * parseUnits('1', DECIMALS_TOKEN)) /
      (bondComposition[1] || 1n);

    let maxMintableBonds: bigint = 0n;
    if (maxRdpxBondable < maxEthBondable) {
      maxMintableBonds =
        (maxRdpxBondable * parseUnits('1', DECIMALS_TOKEN)) /
        parseUnits('1', DECIMALS_TOKEN);
    } else {
      maxMintableBonds =
        (maxEthBondable * parseUnits('1', DECIMALS_TOKEN)) /
        parseUnits('1', DECIMALS_TOKEN);
    }

    const discount =
      Math.ceil(
        Number(bondDiscountFactor) * Math.sqrt(Number(rdpxReserve)) * 1e2,
      ) / Math.sqrt(Number(parseUnits('1', DECIMALS_TOKEN)));

    setRdpxV2CoreState((prev) => ({
      ...prev,
      bondMaturity,
      bondDiscountFactor,
      dpxethPriceInEth,
      bondComposition,
      rdpxPriceInEth,
      ethPrice,
      discount: parseUnits(discount.toString(), 0),
      maxMintableBonds,
    }));
  }, [user]);

  const updateUserBonds = useCallback(async () => {
    if (user === '0x') return;

    setLoading(true);

    const balance = await readContract({
      ...bondConfig,
      functionName: 'balanceOf',
      args: [user],
    });

    let multicallAggregate = [];
    for (const i of range(Number(balance))) {
      const contractCall = readContract({
        ...bondConfig,
        functionName: 'tokenOfOwnerByIndex',
        args: [user, BigInt(i)],
      });
      multicallAggregate.push(contractCall);
    }
    const tokenIds = await Promise.all(multicallAggregate); // multicall

    multicallAggregate = [];
    for (const id of tokenIds) {
      const contractCall = readContract({
        ...coreContractConfig,
        functionName: 'bonds',
        args: [BigInt(id)],
      });
      multicallAggregate.push(contractCall);
    }
    let userBonds = await Promise.all(multicallAggregate);

    try {
      setUserBonds(
        userBonds.map((bond, index) => ({
          amount: bond[0],
          maturity: bond[1] * 1000n,
          timestamp: bond[2],
          id: tokenIds[index],
        })),
      );
      setLoading(false);
    } catch (e) {
      console.error(e);
      throw new Error('Something went wrong updating user bonds...');
    }
  }, [user]);

  const updateUserDelegatePositions = useCallback(async () => {
    if (user === '0x') return;

    setLoading(true);

    const totalDelegates = await readContract({
      ...coreContractConfig,
      functionName: 'getDelegatesLength',
    });

    const delegateCalls = [];
    for (const i of range(Number(totalDelegates))) {
      const fnCall = readContract({
        ...coreContractConfig,
        functionName: 'delegates',
        args: [BigInt(i)],
      });
      delegateCalls.push(fnCall);
    }

    const delegates = await Promise.all(delegateCalls);

    const delegatePositions = delegates.map((delegate, index) => ({
      _id: BigInt(index),
      owner: delegate[0],
      amount: delegate[1],
      fee: delegate[2],
      activeCollateral: delegate[3],
    }));

    const _userDelegatePositions = delegatePositions.filter(
      (pos) => pos.owner === user && pos.amount - pos.activeCollateral !== 0n,
    );
    setUserDelegatePositions(_userDelegatePositions);
    setDelegatePositions(delegatePositions);
    setLoading(false);
  }, [user]);

  // pass states and respective handlers
  return {
    userBonds,
    updateUserBonds,
    rdpxV2CoreState,
    updateRdpxV2CoreState,
    userDelegatePositions,
    updateUserDelegatePositions,
    delegatePositions,
    loading,
  };
};

export default useRdpxV2CoreData;
