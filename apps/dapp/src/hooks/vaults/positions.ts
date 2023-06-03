import { useCallback, useEffect, useState } from 'react';

import graphSdk from 'graphql/graphSdk';
import queryClient from 'queryClient';
import { useAccount } from 'wagmi';

import { getUserReadableAmount } from 'utils/contracts';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  vaultAddress: string;
  tokenSymbol: string;
  isPut: boolean;
}

const useFetchPositions = (props: Props) => {
  const { vaultAddress, tokenSymbol, isPut } = props;
  const { address } = useAccount();

  const [positions, setPositions] = useState<any>();
  const [optionBalances, setOptionBalances] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateSsovDepositPositions = useCallback(async () => {
    if (!address) return;
    const ssovQueryResult = await queryClient.fetchQuery({
      queryKey: ['ssovUserData'],
      queryFn: () => graphSdk.getSsovUserData({ user: address.toLowerCase() }),
    });

    const filteredPositions = ssovQueryResult.ssov_users[0].userPositions
      .filter((position) =>
        position.id.toLowerCase().includes(vaultAddress.toLowerCase())
      )
      .map((vault) => ({
        ...vault,
        tokenSymbol,
        side: isPut ? 'Put' : 'Call',
      }));
    setPositions(filteredPositions);
  }, [address, isPut, tokenSymbol, vaultAddress]);

  const updateSsovPurchasePositions = useCallback(async () => {
    if (!address) return;
    const ssovQueryResult = await queryClient.fetchQuery({
      queryKey: ['ssovUserData'],
      queryFn: () => graphSdk.getSsovUserData({ user: address.toLowerCase() }),
    });

    const filteredPositions =
      ssovQueryResult.ssov_users[0].userSSOVOptionBalance
        .filter((position) =>
          position.id.toLowerCase().includes(vaultAddress.toLowerCase())
        )
        .map((vault) => ({
          ...vault,
          tokenSymbol,
          side: isPut ? 'Put' : 'Call',
          amount: getUserReadableAmount(vault.amount, DECIMALS_TOKEN),
        }));

    setOptionBalances(filteredPositions);
  }, [address, isPut, tokenSymbol, vaultAddress]);

  useEffect(() => {
    updateSsovDepositPositions();
  }, [updateSsovDepositPositions]);

  useEffect(() => {
    updateSsovPurchasePositions();
  }, [updateSsovPurchasePositions]);

  useEffect(() => {
    if (optionBalances !== undefined && positions !== undefined)
      setLoading(false);
    else {
      setLoading(true);
    }
  }, [optionBalances, positions]);

  return {
    positions,
    optionBalances,
    isLoading: loading,
  };
};

export default useFetchPositions;
