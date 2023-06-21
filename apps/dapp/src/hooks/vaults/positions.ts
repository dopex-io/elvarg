import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import graphSdk from 'graphql/graphSdk';
import queryClient from 'queryClient';
import { useAccount } from 'wagmi';

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

  const updateSsovPositions = useCallback(async () => {
    if (!address) return;
    const ssovQueryResult = await queryClient.fetchQuery({
      queryKey: ['ssovUserData'],
      queryFn: () => graphSdk.getSsovUserData({ user: address.toLowerCase() }),
    });

    const filteredWritePositions = ssovQueryResult.ssov_users[0].userPositions
      .filter((position) =>
        position.id.toLowerCase().includes(vaultAddress.toLowerCase())
      )
      .map((vault) => ({
        ...vault,
        tokenSymbol,
        side: isPut ? 'Put' : 'Call',
      }));
    setPositions(filteredWritePositions);

    const filteredBuyPositions =
      ssovQueryResult.ssov_users[0].userSSOVOptionBalance
        .filter((position) =>
          position.id.toLowerCase().includes(vaultAddress.toLowerCase())
        )
        .map((vault) => ({
          ...vault,
          tokenSymbol,
          side: isPut ? 'Put' : 'Call',
          amount: ethers.utils.parseUnits(vault.amount, DECIMALS_TOKEN),
        }));

    setOptionBalances(filteredBuyPositions);
  }, [address, isPut, tokenSymbol, vaultAddress]);

  useEffect(() => {
    updateSsovPositions();
  }, [updateSsovPositions]);

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
