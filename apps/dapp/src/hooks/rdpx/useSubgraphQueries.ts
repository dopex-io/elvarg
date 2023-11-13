import { useCallback, useState } from 'react';
import { Address, parseUnits } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import {
  getHistoricBondsDocument,
  getHistoricRedeemRequestsDocument,
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

  return {
    userBondsHistoryData,
    userRedeemRequestsHistory,
    updateUserBondingHistory,
    updateHistoricLpRedeemRequests,
    loading,
  };
};

export default useSubgraphQueries;
