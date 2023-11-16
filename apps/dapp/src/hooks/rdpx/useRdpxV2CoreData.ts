import { useCallback, useState } from 'react';
import { Address, parseUnits, zeroAddress } from 'viem';

import request from 'graphql-request';
import { range } from 'lodash';
import { erc20ABI } from 'wagmi';
import { multicall, readContract, readContracts } from 'wagmi/actions';

import queryClient from 'queryClient';

import {
  getDelegatesDocument,
  getUserDelegatesDocument,
} from 'graphql/rdpx-v2';

import { DECIMALS_TOKEN } from 'constants/index';
import RdpxReserve from 'constants/rdpx/abis/RdpxReserve';
import RdpxV2Bond from 'constants/rdpx/abis/RdpxV2Bond';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';
import initialContractStates from 'constants/rdpx/initialStates';
import { DOPEX_RDPX_V2_SUBGRAPH_API_URL } from 'constants/subgraphs';

interface RdpxV2CoreState {
  bondMaturity: bigint;
  bondDiscountFactor: bigint;
  ethPrice: bigint;
  dpxethPriceInEth: bigint;
  rdpxPriceInEth: bigint;
  maxMintableBonds: bigint;
  bondComposition: readonly [bigint, bigint];
  discount: bigint;
  receiptTokenSupply: bigint;
  receiptTokenMaxSupply: bigint;
  receiptTokenBacking: readonly [bigint, bigint];
  rdpxSupply: bigint;
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

const receiptTokenConfig = {
  abi: ReceiptToken,
  address: addresses.receiptToken,
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
      { result: coreParameters = [0n, 0n, 0n] as const },
      { result: rdpxPriceInEth = 0n },
      { result: dpxethPriceInEth = 0n },
      { result: ethPrice = 0n },
      { result: bondComposition = [0n, 0n] as const },
      { result: wethBalance = 0n },
      { result: rdpxBalance = 0n },
      { result: rdpxReserve = 0n },
      { result: receiptTokenSupply = 0n },
      { result: receiptTokenMaxSupply = 0n },
      { result: rdpxSupply = 0n },
    ] = await multicall({
      // multicall
      contracts: [
        {
          ...coreContractConfig,
          functionName: 'getCoreParameters',
        },
        { ...coreContractConfig, functionName: 'getRdpxPrice' },
        { ...coreContractConfig, functionName: 'getDpxEthPrice' },
        { ...coreContractConfig, functionName: 'getEthPrice' },
        {
          ...coreContractConfig,
          functionName: 'calculateBondCost',
          args: [parseUnits('1', DECIMALS_TOKEN)],
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
        { ...receiptTokenConfig, functionName: 'totalSupply' },
        { ...receiptTokenConfig, functionName: 'maxSupply' },
        { abi: erc20ABI, address: addresses.rdpx, functionName: 'totalSupply' },
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
        Number(coreParameters[1]) * Math.sqrt(Number(rdpxReserve)) * 1e2,
      ) / Math.sqrt(Number(parseUnits('1', DECIMALS_TOKEN)));

    setRdpxV2CoreState((prev) => ({
      ...prev,
      bondMaturity: coreParameters[2],
      bondDiscountFactor: coreParameters[1],
      dpxethPriceInEth,
      bondComposition,
      rdpxPriceInEth,
      ethPrice,
      discount: parseUnits(discount.toString(), 0),
      maxMintableBonds,
      receiptTokenSupply,
      receiptTokenMaxSupply,
      rdpxSupply,
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

    const userPositions = await queryClient
      .fetchQuery({
        queryKey: ['getUserDelegates'],
        queryFn: () =>
          request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getUserDelegatesDocument, {
            sender: user,
          }),
      })
      .then((res) =>
        res.delegates
          .sort((a, b) => Number(a.fee - b.fee))
          .map((pos) => ({
            _id: BigInt(pos.delegateId),
            owner: user as Address,
            amount: parseUnits(pos.amount, 0),
            fee: parseUnits(pos.fee, 0),
            activeCollateral: parseUnits(pos.activeCollateral, 0),
          })),
      )
      .catch(() => []);

    const delegates = await queryClient
      .fetchQuery({
        queryKey: ['getDelegates'],
        queryFn: () =>
          request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getDelegatesDocument),
      })
      .then((res) =>
        res.delegates
          .sort((a, b) => Number(a.fee - b.fee)) // sort by fees
          .map((pos) => ({
            _id: BigInt(pos.delegateId),
            owner: pos.transaction.sender as Address,
            amount: parseUnits(pos.amount, 0),
            fee: parseUnits(pos.fee, 0),
            activeCollateral: parseUnits(pos.activeCollateral, 0),
          })),
      )
      .catch(() => []);

    setUserDelegatePositions(userPositions);
    setDelegatePositions(delegates);
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