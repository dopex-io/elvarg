import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import graphSdk from 'graphql/graphSdk';
import queryClient from 'queryClient';
import { useAccount } from 'wagmi';

import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';

// import useVaultQuery from './query';
// todo: get epoch times for each write position to display on the table

interface Props {
  vaultAddress: string;
  tokenSymbol: string;
  isPut: boolean;
}

export interface WritePosition {
  strike: number;
  balance: number;
  side: string;
  epoch: number;
  tokenId: number;
  address: string;
}

export interface BuyPosition {
  strike: number;
  premium: number;
  balance: string;
  epoch: number;
  side: string;
}

const useFetchPositions = (props: Props) => {
  const { vaultAddress, isPut } = props;
  const { address } = useAccount();

  const [writePositions, setWritePositions] = useState<WritePosition[]>([]);
  const [buyPositions, setBuyPositions] = useState<BuyPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const updateSsovPositions = useCallback(async () => {
    if (!address) return;
    const ssovQueryResult = await queryClient.fetchQuery({
      queryKey: ['ssovUserData'],
      queryFn: () => graphSdk.getSsovUserData({ user: address.toLowerCase() }),
    });

    const filteredWritePositions = ssovQueryResult.ssov_users[0].userSSOVDeposit
      .filter(
        (position) =>
          position.ssov.id.toLowerCase() === vaultAddress.toLowerCase()
      )
      .map((vault) => ({
        ...vault,
        strike: Number(ethers.utils.formatUnits(vault.strike, DECIMALS_STRIKE)),
        balance: Number(ethers.utils.formatUnits(vault.amount, 'ether')),
        epoch: Number(vault.epoch),
        side: isPut ? 'Put' : 'Call',
        tokenId: Number(vault.id.split('#')[1]),
        address: vault.ssov.id.toLowerCase(),
      }));
    setWritePositions(filteredWritePositions);

    const filteredBuyPositions =
      ssovQueryResult.ssov_users[0].userSSOVOptionBalance
        .filter((position) =>
          position.id.toLowerCase().includes(vaultAddress.toLowerCase())
        )
        .map((vault) => ({
          ...vault,
          side: isPut ? 'Put' : 'Call',
          strike: Number(
            ethers.utils.formatUnits(vault.strike, DECIMALS_STRIKE)
          ),
          premium: Number(
            ethers.utils.formatUnits(vault.premium, DECIMALS_USD)
          ),
          epoch: Number(vault.epoch),
          balance: vault.amount,
        }));
    setBuyPositions(filteredBuyPositions);
  }, [address, isPut, vaultAddress]);

  useEffect(() => {
    updateSsovPositions();
  }, [updateSsovPositions]);

  useEffect(() => {
    if (buyPositions !== undefined && writePositions !== undefined)
      setLoading(false);
    else {
      setLoading(true);
    }
  }, [buyPositions, writePositions]);

  return {
    writePositions,
    buyPositions,
    isLoading: loading,
  };
};

export default useFetchPositions;
