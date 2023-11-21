import { useCallback, useEffect, useState } from 'react';
import { Address, parseUnits } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import {
  getDelegateBonds,
  getHistoricBondsDocument,
  getHistoricRedeemRequestsDocument,
  getRdpxSuppliesDocument,
} from 'graphql/rdpx-v2';

import { DOPEX_RDPX_V2_SUBGRAPH_API_URL } from 'constants/subgraphs';

interface Bond {
  owner: Address;
  rdpxRequired: bigint;
  wethRequired: bigint;
  receiptTokenAmount: bigint;
  timestamp: bigint;
  txHash: string;
}

interface Redeem {
  _id: bigint;
  owner: Address;
  receiptTokenAmount: bigint;
  timestamp: bigint;
  txHash: string;
}

interface RedeemRequest {
  epoch: bigint;
  amount: bigint;
  owner: Address;
  ethAmount: bigint;
  rdpxAmount: bigint;
  txHash: string; // transaction hash is stored as entity id
}

interface DelegateBond {
  amount: bigint;
  ethAmount: bigint;
  rdpxAmount: bigint;
  txHash: String;
}

interface UserAggregate {
  bonds: Bond[];
  redeems: Redeem[];
}

interface Props {
  user: Address;
}

const useSubgraphQueries = ({ user = '0x' }: Props) => {
  const [userBondsHistoryData, setUserBondsHistoryData] =
    useState<UserAggregate>({
      bonds: [],
      redeems: [],
    });
  const [userRedeemRequestsHistory, setUserRedeemRequestsHistory] = useState<
    RedeemRequest[]
  >([]);
  const [delegateBonds, setDelegateBonds] = useState<DelegateBond[]>([]);
  const [cumulativeRdpxBurned, setCumulativeRdpxBurned] = useState<
    {
      amount: bigint;
      timestamp: bigint;
    }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);

  const updateUserBondingHistory = useCallback(async () => {
    const bonds = await queryClient
      .fetchQuery({
        queryKey: ['getAllBonds'],
        queryFn: () =>
          request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getHistoricBondsDocument),
      })
      .then((res) =>
        res.bonds
          .map((pos) => ({
            owner: pos.transaction.sender as Address,
            rdpxRequired: parseUnits(pos.rdpxRequired, 0),
            wethRequired: parseUnits(pos.wethRequired, 0),
            receiptTokenAmount: parseUnits(pos.receiptTokenAmount, 0),
            timestamp: parseUnits(pos.transaction.timestamp, 0),
            txHash: pos.transaction.hash,
          }))
          .filter((bond) => bond.owner === user.toLowerCase()),
      )
      .catch(() => []);

    const redeems = await queryClient
      .fetchQuery({
        queryKey: ['getAllRedeems'],
        queryFn: () =>
          request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getHistoricBondsDocument),
      })
      .then((res) =>
        res.redeemBonds
          .map((pos) => ({
            _id: BigInt(pos.bondId),
            owner: pos.to as Address,
            receiptTokenAmount: parseUnits(pos.receiptTokenAmount, 0),
            timestamp: parseUnits(pos.transaction.timestamp, 0),
            txHash: pos.transaction.hash,
          }))
          .filter((bond) => bond.owner === user.toLowerCase()),
      )
      .catch(() => []);

    setUserBondsHistoryData({
      bonds,
      redeems,
    });
    setLoading(false);
  }, [user]);

  const updateHistoricLpRedeemRequests = useCallback(async () => {
    const redeemRequests = await queryClient
      .fetchQuery({
        queryKey: ['getAllRedeems'],
        queryFn: () =>
          request(
            DOPEX_RDPX_V2_SUBGRAPH_API_URL,
            getHistoricRedeemRequestsDocument,
            {
              sender: user.toLowerCase(),
            },
          ),
      })
      .then((res) =>
        res.redeemRequests
          .map((pos) => ({
            epoch: BigInt(pos.epoch),
            amount: BigInt(pos.amount),
            owner: pos.sender as Address,
            ethAmount: parseUnits(pos.ethAmount, 0),
            rdpxAmount: parseUnits(pos.rdpxAmount, 0),
            txHash: pos.id, // transaction hash is stored as entity id
          }))
          .filter((bond) => bond.owner === user.toLowerCase()),
      )
      .catch(() => []);

    setUserRedeemRequestsHistory(redeemRequests);

    setLoading(false);
  }, [user]);

  const updateDelegateBonds = useCallback(async () => {
    const delegateBonds = await queryClient
      .fetchQuery({
        queryKey: ['getAllRedeems'],
        queryFn: () =>
          request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getDelegateBonds, {
            sender: user.toLowerCase(),
          }),
      })
      .then((res) =>
        res.bonds.map((pos) => ({
          amount: BigInt(pos.receiptTokenAmount),
          ethAmount: parseUnits(pos.wethRequired, 0),
          rdpxAmount: parseUnits(pos.rdpxRequired, 0),
          txHash: pos.id, // transaction hash is stored as entity id
        })),
      )
      .catch(() => []);

    setDelegateBonds(delegateBonds);
  }, [user]);

  const updateRdpxBurned = useCallback(async () => {
    const supplies = (
      await queryClient
        .fetchQuery({
          queryKey: ['getRdpxSupplies'],
          queryFn: () =>
            request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getRdpxSuppliesDocument),
        })
        .then((res) => res.totalRdpxSupplies)
    )
      .map((supplyEntity) => ({
        supply: supplyEntity.amount,
        timestamp: supplyEntity.transaction.timestamp,
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    let sum = 0n;
    const burnedCumulation = [];
    for (let i = 1; i < supplies.length; i++) {
      sum += BigInt(supplies[i].supply) - BigInt(supplies[i - 1].supply);
      burnedCumulation.push({ amount: sum, timestamp: supplies[i].timestamp });
    }
    setCumulativeRdpxBurned(burnedCumulation);
  }, []);

  useEffect(() => {
    updateDelegateBonds();
  }, [updateDelegateBonds]);

  return {
    userBondsHistoryData,
    userRedeemRequestsHistory,
    delegateBonds,
    updateUserBondingHistory,
    updateHistoricLpRedeemRequests,
    updateDelegateBonds,
    cumulativeRdpxBurned,
    updateRdpxBurned,
    loading,
  };
};

export default useSubgraphQueries;
