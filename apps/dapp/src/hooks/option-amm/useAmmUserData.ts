import { useCallback, useEffect, useState } from 'react';
import { Address, zeroAddress } from 'viem';

import {
  OptionAmm__factory,
  OptionAmmLp__factory,
  OptionAmmPortfolioManager__factory,
} from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

import getOptionPosition from 'utils/optionAmm/getOptionPosition';
import getPortfolio from 'utils/optionAmm/getPortfolio';
import getPositionIds from 'utils/optionAmm/getPositionIds';

import { mockOptionPositions } from 'constants/optionAmm/placeholders';

interface OptionPosition {
  _id: bigint;
  isPut: boolean;
  isShort: boolean;
  strike: bigint;
  premium: bigint;
  marginToLock: bigint;
  amount: bigint;
  exercised: bigint;
  markPrice: bigint;
  fees: bigint;
  openedAt: bigint;
  expiry: bigint;
}

export interface Portfolio {
  collateralAmount: bigint;
  activeCollateral: bigint;
  availableCollateral: bigint;
  totalCollateral: bigint;
  health: bigint;
  positions: bigint[];
  closedPositions: bigint[];
  liquidationThreshold: bigint;
}

export interface AmmLpData {
  totalSupply: bigint;
  userUnlockTime: bigint;
  userShares: bigint;
}

interface Props {
  ammAddress: Address;
  lpAddress: Address;
  portfolioManager: Address;
  positionMinter: Address;
  account: Address;
}

const useAmmUserData = (props: Props) => {
  const { ammAddress, lpAddress, portfolioManager, positionMinter, account } =
    props;

  const [optionPositions, setOptionPositions] = useState<OptionPosition[]>([]);
  const [portfolioData, setPortfolioData] = useState<Portfolio>();
  const [lpData, setLpData] = useState<AmmLpData>();
  const [loading, setLoading] = useState<boolean>(false);

  const updateUserOptionPositions = useCallback(async () => {
    if (positionMinter === '0x' || !account) return;
    setLoading(true);
    const positionIds = await getPositionIds({
      positionMinter,
      owner: account,
    });

    const optionPositionPromises = [];

    for (let i = 0; i < positionIds.length; i++) {
      const promise = getOptionPosition({
        optionAmm: ammAddress,
        tokenId: positionIds[i],
      });
      optionPositionPromises.push(promise);
    }
    const result = await Promise.all(optionPositionPromises); // multicall

    const _optionPositions: OptionPosition[] = [];

    for (let i = 0; i < result.length; i++) {
      const optionPosition: OptionPosition = {
        _id: positionIds[i],
        isPut: result[i][0],
        isShort: result[i][1],
        strike: result[i][2],
        premium: result[i][3],
        marginToLock: result[i][4],
        amount: result[i][5],
        exercised: result[i][6],
        markPrice: result[i][7],
        fees: result[i][8],
        openedAt: result[i][9],
        expiry: result[i][10],
      };
      _optionPositions.push(optionPosition);
    }
    // setOptionPositions(_optionPositions);
    setOptionPositions(mockOptionPositions);
    setLoading(false);
  }, [account, ammAddress, positionMinter]);

  const updatePortfolio = useCallback(async () => {
    if (
      portfolioManager === '0x' ||
      account === zeroAddress ||
      positionMinter === '0x'
    )
      return;

    console.log(account);

    const [collateralAmount, borrowedAmount] = await getPortfolio({
      portfolioManager,
      accountAddress: account,
    });

    const _portfolioData = {
      collateralAmount,
      borrowedAmount,
    };

    const positionIds = await getPositionIds({
      positionMinter,
      owner: account,
    });

    const filteredClosedPositions = optionPositions.filter(
      (p) => p.exercised === p.amount,
    );

    const closedPositions = filteredClosedPositions.map((p) => p._id);

    const config = {
      abi: OptionAmmPortfolioManager__factory.abi,
      address: portfolioManager,
    };

    const [
      health,
      [longMargin, shortMargin, longPnl, shortPnl],
      totalPortfolioCollateral,
      liquidationThreshold,
    ] = await Promise.all([
      readContract({
        ...config,
        functionName: 'getPortfolioHealth',
        args: [account],
      }),
      readContract({
        ...config,
        functionName: 'getPortfolioActiveCollateral',
        args: [account],
      }),
      readContract({
        ...config,
        functionName: 'getPortfolioCollateralAmount',
        args: [account],
      }),
      readContract({
        address: ammAddress,
        abi: OptionAmm__factory.abi,
        functionName: 'MM_LIQUIDATION_THRESHOLD',
      }),
    ]); // todo: replace with wagmi multicall on mainnet

    /**
     * 0: activeShorts
     * 1: activeLongs
     * 2: shortPnl
     * 3: longPnl
     * activeCollateral = Math.abs(activeShorts - activeLongs) + shortPnl + longPnl
     */
    const abs = (n: bigint) => (n === -0n || n < 0n ? -n : n);
    let netActiveCollateral =
      abs(longMargin - shortMargin) + (longPnl + shortPnl);

    const availableCollateral = totalPortfolioCollateral - netActiveCollateral;

    setPortfolioData({
      ..._portfolioData,
      positions: positionIds,
      closedPositions: closedPositions,
      health,
      activeCollateral: netActiveCollateral,
      availableCollateral,
      totalCollateral: collateralAmount,
      liquidationThreshold,
    });
  }, [account, ammAddress, optionPositions, portfolioManager, positionMinter]);

  const updateLpData = useCallback(async () => {
    if (lpAddress === '0x' || !account || account === zeroAddress) return;

    const config = {
      abi: OptionAmmLp__factory.abi,
      address: lpAddress,
    };

    const [totalSupply, userUnlockTime, userShares] = await Promise.all([
      readContract({
        ...config,
        functionName: 'totalSupply',
      }),
      readContract({
        ...config,
        functionName: 'lockedUsers',
        args: [account],
      }),
      readContract({
        ...config,
        functionName: 'balanceOf',
        args: [account],
      }),
    ]); // todo: replace with wagmi multicall on mainnet

    setLpData({
      totalSupply,
      userUnlockTime,
      userShares,
    });
  }, [account, lpAddress]);

  useEffect(() => {
    updateUserOptionPositions();
  }, [updateUserOptionPositions]);

  useEffect(() => {
    updatePortfolio();
  }, [updatePortfolio]);

  useEffect(() => {
    updateLpData();
  }, [updateLpData]);

  return {
    optionPositions,
    updateUserOptionPositions,
    portfolioData,
    updatePortfolio,
    lpData,
    updateLpData,
    loading,
  };
};

export default useAmmUserData;
