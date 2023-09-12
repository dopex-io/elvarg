import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';

import { OptionAmmPortfolioManager__factory } from '@dopex-io/sdk';
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
  health: bigint;
  positions: bigint[];
  closedPositions: bigint[];
}

interface Props {
  ammAddress: Address;
  portfolioManager: Address;
  positionMinter: Address;
  accountAddress: Address;
}

const useAmmUserData = (props: Props) => {
  const { ammAddress, portfolioManager, positionMinter, accountAddress } =
    props;

  const [optionPositions, setOptionPositions] = useState<OptionPosition[]>([]);
  const [portfolioData, setPortfolioData] = useState<Portfolio>();
  const [loading, setLoading] = useState<boolean>(false);

  const updateUserOptionPositions = useCallback(async () => {
    if (!positionMinter || !accountAddress) return;
    setLoading(true);
    const positionIds = await getPositionIds({
      positionMinter,
      owner: accountAddress,
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
  }, [accountAddress, ammAddress, positionMinter]);

  const updatePortfolio = useCallback(async () => {
    if (portfolioManager === '0x' || !accountAddress || accountAddress === '0x')
      return;

    const [collateralAmount, borrowedAmount] = await getPortfolio({
      portfolioManager,
      accountAddress,
    });

    const _portfolioData = {
      collateralAmount,
      borrowedAmount,
    };

    const positionIds = await getPositionIds({
      positionMinter,
      owner: accountAddress,
    });

    const filteredClosedPositions = optionPositions.filter(
      (p) => p.exercised === p.amount,
    );

    const closedPositions = filteredClosedPositions.map((p) => p._id);

    const config = {
      abi: OptionAmmPortfolioManager__factory.abi,
      address: portfolioManager,
    };

    const health = await readContract({
      ...config,
      functionName: 'getPortfolioHealth',
      args: [accountAddress],
    });

    let activeCollateral = await readContract({
      ...config,
      functionName: 'getPortfolioActiveCollateral',
      args: [accountAddress],
    });
    let totalPortfolioCollateral = await readContract({
      ...config,
      functionName: 'getPortfolioCollateralAmount',
      args: [accountAddress],
    });

    /**
     * 0: activeShorts
     * 1: activeLongs
     * 2: shortPnl
     * 3: longPnl
     * activeCollateral = Math.abs(activeShorts - activeLongs) + shortPnl + longPnl
     */
    const abs = (n: bigint) => (n === -0n || n < 0n ? -n : n);
    let netActiveCollateral =
      abs(activeCollateral[0] - activeCollateral[1]) +
      (activeCollateral[2] + activeCollateral[3]);

    const availableCollateral = totalPortfolioCollateral - netActiveCollateral;

    setPortfolioData({
      ..._portfolioData,
      positions: positionIds,
      closedPositions: closedPositions,
      health,
      activeCollateral: netActiveCollateral,
      availableCollateral,
    });
  }, [accountAddress, optionPositions, portfolioManager, positionMinter]);

  useEffect(() => {
    updateUserOptionPositions();
  }, [updateUserOptionPositions]);

  useEffect(() => {
    updatePortfolio();
  }, [updatePortfolio]);

  return {
    updateUserOptionPositions,
    optionPositions,
    loading,
    portfolioData,
  };
};

export default useAmmUserData;
