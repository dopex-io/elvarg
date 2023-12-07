import React, { useCallback, useEffect } from 'react';
import { formatUnits } from 'viem';

import axios from 'axios';
import { useAccount } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { VARROCK_BASE_API_URL } from 'constants/env';

import AutoExercisers from './components/AutoExercisers';
import CostSummary from './components/CostSummary';
import InfoPanel from './components/InfoPanel';
import RangeSelector from './components/RangeSelector';
import Resources from './components/Resources';
import StrikesSection from './components/StrikesSection';
import TradeSideSelector from './components/TradeSideSelector';
import TTLSelector from './components/TTLSelector';

const AsidePanel = () => {
  const { selectedOptionsPool, setTokenBalances, isTrade } = useClammStore();
  const { address: userAddress } = useAccount();

  const updateTokenBalances = useCallback(async () => {
    if (!selectedOptionsPool || !userAddress) return;
    const { callToken, putToken } = selectedOptionsPool;
    if (!callToken.address || !putToken.address) return;
    const balances = await Promise.all([
      axios.get(`${VARROCK_BASE_API_URL}/token/balance`, {
        params: {
          token: callToken.address,
          user: userAddress,
        },
      }),
      axios.get(`${VARROCK_BASE_API_URL}/token/balance`, {
        params: {
          token: putToken.address,
          user: userAddress,
        },
      }),
    ]);

    const callTokenBalance = balances[0].data
      ? BigInt(balances[0].data.balance)
      : 0n;
    const putTokenBalance = balances[1].data
      ? BigInt(balances[1].data.balance)
      : 0n;
    const readableCallToken = formatUnits(callTokenBalance, callToken.decimals);
    const readablePutToken = formatUnits(putTokenBalance, putToken.decimals);
    setTokenBalances({
      callToken: callTokenBalance,
      putToken: putTokenBalance,
      readableCallToken,
      readablePutToken,
      callTokenSymbol: callToken.symbol,
      putTokenSymbol: putToken.symbol,
    });
  }, [selectedOptionsPool, userAddress, setTokenBalances]);

  useEffect(() => {
    updateTokenBalances();
  }, [updateTokenBalances]);

  return (
    <div className="sticky top-[80px] flex flex-col items-center justify-center w-full space-y-[12px]">
      <div className="w-full bg-cod-gray p-[12px] rounded-lg space-y-[4px]">
        <TradeSideSelector />
        {isTrade && <TTLSelector />}
        <StrikesSection />
        <RangeSelector />
        <CostSummary />
        {isTrade && <AutoExercisers />}
        <InfoPanel updateTokenBalances={updateTokenBalances} />
      </div>
      <Resources />
    </div>
  );
};

export default AsidePanel;
