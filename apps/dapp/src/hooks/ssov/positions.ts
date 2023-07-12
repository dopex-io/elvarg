import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import request from 'graphql-request';
import { Address, useAccount } from 'wagmi';

import queryClient from 'queryClient';

import { getSsovUserDataDocument } from 'graphql/ssovs';

import getSsovCheckpointData from 'utils/ssov/getSsovCheckpointData';
import getSsovEpochTimes from 'utils/ssov/getSsovEpochTimes';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import { DOPEX_SSOV_SUBGRAPH_API_URL } from 'constants/subgraphs';

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
  id: string;
  expiry: number;
  accruedPremium: number;
}

export interface BuyPosition {
  strike: number;
  premium: number;
  balance: string;
  epoch: number;
  expiry: number;
  side: string;
  id: string;
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
      queryKey: ['getSsovUserData', address.toLowerCase()],
      queryFn: async () =>
        request(DOPEX_SSOV_SUBGRAPH_API_URL, getSsovUserDataDocument, {
          user: address.toLowerCase(),
        }),
    });

    const filteredWritePositions =
      ssovQueryResult.users[0].userSSOVDeposit.filter(
        (position) =>
          position.ssov.id.toLowerCase() === vaultAddress.toLowerCase()
      );

    const _writePositions = [];

    for (let i = 0; i < filteredWritePositions.length; i++) {
      const vault = filteredWritePositions[i];

      const epochTimes = await getSsovEpochTimes({
        epoch: Number(vault.epoch),
        ssovAddress: vaultAddress as Address,
      });

      const checkpointData = await getSsovCheckpointData({
        positionId: Number(vault.id.split('#')[1]),
        ssovAddress: vaultAddress as Address,
      });

      const activeCollateralShare =
        (checkpointData.totalCollateral * checkpointData.activeCollateral) /
        checkpointData.totalCollateral;

      const accruedPremium =
        checkpointData.activeCollateral === 0n
          ? 0n
          : (activeCollateralShare * checkpointData.accruedPremium) /
            checkpointData.activeCollateral;

      _writePositions[i] = {
        ...vault,
        strike: Number(formatUnits(vault.strike, DECIMALS_STRIKE)),
        balance: Number(formatUnits(vault.amount, 18)),
        epoch: Number(vault.epoch),
        side: isPut ? 'Put' : 'Call',
        tokenId: Number(vault.id.split('#')[1]),
        address: vault.ssov.id.toLowerCase(),
        expiry: Number(epochTimes[1]),
        accruedPremium: Number(formatUnits(accruedPremium, DECIMALS_TOKEN)),
      };
    }

    setWritePositions(_writePositions);

    const filteredBuyPositions =
      ssovQueryResult.users[0].userSSOVOptionBalance.filter((position) =>
        position.id.toLowerCase().includes(vaultAddress.toLowerCase())
      );

    const _buyPositions = [];

    for (let i = 0; i < filteredBuyPositions.length; i++) {
      const vault = filteredBuyPositions[i];

      const epochTimes = await getSsovEpochTimes({
        epoch: Number(vault.epoch),
        ssovAddress: vaultAddress as Address,
      });

      _buyPositions[i] = {
        ...vault,
        side: isPut ? 'Put' : 'Call',
        strike: Number(formatUnits(vault.strike, DECIMALS_STRIKE)),
        premium: Number(formatUnits(vault.premium, DECIMALS_TOKEN)),
        epoch: Number(vault.epoch),
        expiry: Number(epochTimes[1]),
        balance: vault.amount,
      };
    }

    setBuyPositions(_buyPositions);
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
