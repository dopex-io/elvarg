import React, { useEffect, useState } from 'react';
import { formatUnits, zeroAddress } from 'viem';

import { erc20ABI, useAccount, useContractReads, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import AMMSelector from './components/AMMSelector';
import AutoExercisers from './components/AutoExercisers';
import CostSummary from './components/CostSummary';
import DepositTypeSelector from './components/DepositTypeSelector';
import InfoPanel from './components/InfoPanel';
import MantleIntegration from './components/Notices/MantleIntegration';
import StipRewards from './components/Notices/StipRewards';
import Walkthrough from './components/Notices/Walkthrough';
import LPRangeSelector from './components/RangeSelector';
import StrikesSection from './components/StrikesSection';
import TradeSideSelector from './components/TradeSideSelector';
import TTLSelector from './components/TTLSelector';

const AsidePanel = () => {
  const { selectedOptionsMarket, setTokenBalances, isTrade } = useClammStore();
  const [strikesSelectionMode, setStrikesSelectionMode] = useState<0 | 1>(0);
  const { address: userAddress } = useAccount();

  const { data, refetch: updateTokenBalances } = useContractReads({
    contracts: [
      {
        abi: erc20ABI,
        address: selectedOptionsMarket?.callToken.address,
        functionName: 'balanceOf',
        args: [userAddress ?? zeroAddress],
      },
      {
        abi: erc20ABI,
        address: selectedOptionsMarket?.putToken.address,
        functionName: 'balanceOf',
        args: [userAddress ?? zeroAddress],
      },
    ],
  });

  useEffect(() => {
    if (!data || !selectedOptionsMarket) return;
    const callTokenBalance = (data[0].result ?? 0n) as bigint;
    const putTokenBalance = (data[1].result ?? 0n) as bigint;
    const readableCallToken = formatUnits(
      callTokenBalance,
      selectedOptionsMarket.callToken.decimals,
    );
    const readablePutToken = formatUnits(
      putTokenBalance,
      selectedOptionsMarket.putToken.decimals,
    );
    setTokenBalances({
      callToken: callTokenBalance,
      putToken: putTokenBalance,
      readableCallToken,
      readablePutToken,
      callTokenSymbol: selectedOptionsMarket.callToken.symbol,
      putTokenSymbol: selectedOptionsMarket.putToken.symbol,
    });
  }, [data, selectedOptionsMarket, setTokenBalances]);

  const singleSelectDepositTye = !isTrade && strikesSelectionMode === 0;

  return (
    <div className="sticky top-[80px] flex flex-col items-center justify-center w-full space-y-[12px]">
      <div className={'w-full bg-cod-gray p-[12px] rounded-lg space-y-[4px]'}>
        <TradeSideSelector />
        {!isTrade && (
          <DepositTypeSelector
            selectionModeIndex={strikesSelectionMode}
            setSelectionMode={setStrikesSelectionMode}
          />
        )}
        {isTrade && <TTLSelector />}
        {!isTrade && <AMMSelector />}
        {!isTrade &&
          strikesSelectionMode === 1 &&
          !selectedOptionsMarket?.deprecated && <LPRangeSelector />}
        {(isTrade || singleSelectDepositTye) && <StrikesSection />}
        <CostSummary />
        {isTrade && <AutoExercisers />}
        {strikesSelectionMode !== 1 && (
          <InfoPanel updateTokenBalances={updateTokenBalances} />
        )}
        {strikesSelectionMode === 1 && isTrade && (
          <InfoPanel updateTokenBalances={updateTokenBalances} />
        )}
      </div>
      <MantleIntegration />
      <StipRewards />
      <Walkthrough />
    </div>
  );
};

export default AsidePanel;
