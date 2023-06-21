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

interface WritePosition {
  strike: number;
  balance: number;
  side: string;
  epoch: number;
}

interface BuyPosition {
  strike: number;
  premium: number;
  balance: number;
  epoch: number;
  side: string;
}

const useFetchPositions = (props: Props) => {
  const { vaultAddress, tokenSymbol, isPut } = props;
  // const { selectedVault } = useVaultQuery({
  //   vaultSymbol: tokenSymbol,
  // });
  const { address } = useAccount();
  // const contractReads = useContractReads({
  //   contracts: [
  //     {
  //       abi: SsovV3__factory.abi,
  //       address: vaultAddress as `0x${string}`,
  //       functionName: 'getEpochTimes',
  //       args: [selectedVault?.currentEpoch], todo: retrieve epochTimes for each position's corresponding epoch
  //     },
  //   ],
  // });

  const [writePositions, setWritePositions] = useState<WritePosition[]>([]);
  const [buyPositions, setBuyPositions] = useState<BuyPosition[]>([]);
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
        strike: Number(ethers.utils.formatUnits(vault.strike, DECIMALS_STRIKE)),
        balance: Number(ethers.utils.formatUnits(vault.amount, 'ether')),
        epoch: Number(vault.epoch),
        side: isPut ? 'Put' : 'Call',
      }));
    setWritePositions(filteredWritePositions);

    const filteredBuyPositions =
      ssovQueryResult.ssov_users[0].userSSOVOptionBalance
        .filter((position) =>
          position.id.toLowerCase().includes(vaultAddress.toLowerCase())
        )
        .map((vault) => ({
          side: isPut ? 'Put' : 'Call',
          strike: Number(
            ethers.utils.formatUnits(vault.strike, DECIMALS_STRIKE)
          ),
          premium: Number(
            ethers.utils.formatUnits(vault.premium, DECIMALS_USD)
          ),
          epoch: Number(vault.epoch),
          balance: Number(ethers.utils.formatUnits(vault.amount, 'ether')),
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
