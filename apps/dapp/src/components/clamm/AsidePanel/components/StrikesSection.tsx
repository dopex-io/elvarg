import React, { useMemo, useState } from 'react';
import { hexToBigInt } from 'viem';

import { Switch } from '@dopex-io/ui';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import generateStrikes from 'utils/clamm/generateStrikes';
import { cn, formatAmount } from 'utils/general';

import SelectedStrikeItem from './SelectedStrikeItem';
import StrikesList from './StrikesList';

const StrikesSection = () => {
  const { selectedStrikes, strikesChain } = useStrikesChainStore();
  const { isTrade, tokenBalances, tick, selectedOptionsPool, markPrice } =
    useClammStore();
  const [editForAll, setEditForAll] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>('');

  const handleEditForAll = () => {
    setEditForAll((prev) => !prev);
  };

  const generatedStrikes = useMemo(() => {
    if (!selectedOptionsPool) return [];
    const { callToken, putToken } = selectedOptionsPool;

    const token0IsCallToken =
      hexToBigInt(callToken.address) < hexToBigInt(putToken.address);

    const token0Precision =
      10 ** (token0IsCallToken ? callToken.decimals : putToken.decimals);
    const token1Precision =
      10 ** (token0IsCallToken ? putToken.decimals : callToken.decimals);

    return generateStrikes(
      tick,
      token0Precision,
      token1Precision,
      !token0IsCallToken,
      150,
    );
  }, [tick, selectedOptionsPool]);

  const putStrikes = useMemo(() => {
    return isTrade
      ? strikesChain
          .filter(({ strike }) => markPrice > strike)
          .sort((a, b) => Number(b.strike) - Number(a.strike))
      : generatedStrikes
          .filter(({ strike }) => markPrice > strike)
          .sort((a, b) => Number(b.strike) - Number(a.strike));
  }, [generatedStrikes, isTrade, strikesChain, markPrice]);

  const callStrikes = useMemo(() => {
    return isTrade
      ? strikesChain
          .filter(({ type }) => type.toLowerCase() === 'call')
          .sort((a, b) => Number(a.strike) - Number(b.strike))
      : generatedStrikes
          .filter(({ type }) => type.toLowerCase() === 'call')
          .sort((a, b) => Number(a.strike) - Number(b.strike));
  }, [generatedStrikes, isTrade, strikesChain]);

  const selectedPutStrikesLength = useMemo(() => {
    return Array.from(selectedStrikes).filter(
      ([key, { isCall }]) => isCall === false,
    ).length;
  }, [selectedStrikes]);

  const selectedCallStrikesLength = useMemo(() => {
    return Array.from(selectedStrikes).filter(
      ([key, { isCall }]) => isCall === true,
    ).length;
  }, [selectedStrikes]);

  return (
    <div
      className={cn(
        'bg-umbra w-full flex flex-col space-y-[10px]',
        !isTrade && 'rounded-t-lg',
      )}
    >
      <span className="flex w-full items-center justify-between text-stieglitz px-[12px] pt-[12px] font-medium text-[13px]">
        <span>Strikes</span>

        <span className="flex items-center justify-center space-x-2">
          <span>Edit amounts for all</span>
          <Switch
            checked={editForAll}
            color="primary"
            onChange={handleEditForAll}
          />
        </span>
      </span>
      <div className="flex flex-col w-full space-y-[10px] px-[12px]">
        {Array.from(selectedStrikes).map(([strikeIndex, strikeData], index) => (
          <SelectedStrikeItem
            disabledInput={editForAll && index !== 0}
            key={index}
            strikeData={strikeData}
            strikeIndex={strikeIndex}
            editAllMode={editForAll}
            commonInputAmount={inputAmount}
            commonSetInputAmount={setInputAmount}
          />
        ))}
      </div>
      <div className="w-full flex">
        <StrikesList
          strikes={callStrikes}
          isPut={false}
          selectedLength={selectedCallStrikesLength}
        />
        <StrikesList
          strikes={putStrikes}
          isPut={true}
          selectedLength={selectedPutStrikesLength}
        />
      </div>
    </div>
  );
};

export default StrikesSection;
