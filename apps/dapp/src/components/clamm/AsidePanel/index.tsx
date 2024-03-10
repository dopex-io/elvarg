import React, { useEffect, useState } from 'react';
import { formatUnits, zeroAddress } from 'viem';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { erc20ABI, useAccount, useContractReads, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import AMMSelector from './components/AMMSelector';
import AutoExercisers from './components/AutoExercisers';
import CostSummary from './components/CostSummary';
import DepositTypeSelector from './components/DepositTypeSelector';
import InfoPanel from './components/InfoPanel';
import LPRangeSelector from './components/RangeSelector';
import StrikesSection from './components/StrikesSection';
import TradeSideSelector from './components/TradeSideSelector';
import TTLSelector from './components/TTLSelector';

const AsidePanel = () => {
  const { selectedOptionsMarket, setTokenBalances, isTrade } = useClammStore();
  const [strikesSelectionMode, setStrikesSelectionMode] = useState<0 | 1>(0);
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();

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
      <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
        <span className="flex w-full justify-between">
          <h6 className="flex items-center justify-center space-x-1 text-xs">
            <img src="/images/tokens/dpx.svg" alt="dpx" className="h-[18px]" />
            <span>NEW: CLAMM on Mantle Mainnet</span>
          </h6>
        </span>
        <p className="text-stieglitz text-xs">
          We have deployed CLAMM on Mantle Mainnet for the markets: WMNT/USDT,
          WETH/USDC and WETH/USDT.
          <a
            className="text-wave-blue font-medium underline"
            href="https://blog.dopex.io/articles/clamm-upgrade-realising-strykes-vision"
            target="_blank"
          >
            Read more
          </a>
        </p>
      </div>
      <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
        <span className="flex w-full justify-between">
          <h6 className="flex items-center justify-center space-x-[4px] text-xs">
            <img src="/images/tokens/arb.svg" alt="ARB" className="h-[14px]" />
            <span>ARB STIP rewards</span>
          </h6>
        </span>
        <p className="text-stieglitz text-xs">
          <b className="text-up-only">600,000 ARB</b> in STIP rewards are
          allocated for strikes in range of{' '}
          <b className="text-white ">+/-2.5%</b> from spot price across all
          option markets.
        </p>
      </div>
      <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
        <span className="flex w-full justify-between">
          <h6 className="flex items-center justify-center space-x-[4px] text-xs">
            <img src="/images/tokens/dpx.svg" alt="dpx" className="h-[20px]" />
            <span>Dopex V2 Tutorial</span>
          </h6>
        </span>
        <p className="text-stieglitz text-xs">
          Need help understanding how to use CLAMM to purchase options and
          deposit to earn premiums and swap fees? Check out the{' '}
          <a
            className="text-wave-blue font-semi underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://learn.dopex.io/quick-start/clamm-walkthrough"
          >
            CLAMM: Walkthrough
          </a>
        </p>
      </div>
    </div>
  );
};

export default AsidePanel;
