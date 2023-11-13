import { useCallback, useState } from 'react';
import { Address, parseUnits } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getHistoricDataDocument } from 'graphql/rdpx-v2';

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

interface UserAggregate {
  bonds: Bond[];
  redeems: Redeem[];
}

interface Props {
  user: Address;
}

const useSubgraphQueries = ({ user = '0x' }: Props) => {
  const [userAggregatedData, setUserAggregatedData] = useState<UserAggregate>({
    bonds: [],
    redeems: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  const updateUserBondingHistory = useCallback(async () => {
    const bonds = await queryClient
      .fetchQuery({
        queryKey: ['getAllBonds'],
        queryFn: () =>
          request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getHistoricDataDocument),
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
          request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getHistoricDataDocument),
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

    setUserAggregatedData({
      bonds,
      redeems,
    });
    setLoading(false);
  }, [user]);

  return { userAggregatedData, updateUserBondingHistory, loading };
};

export default useSubgraphQueries;
