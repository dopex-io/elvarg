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
  const { selectedStrikes, getPurchasableStrikesChain } =
    useStrikesChainStore();
  const { isTrade, tokenBalances, tick, selectedOptionsMarket, markPrice } =
    useClammStore();
  const [editForAll, setEditForAll] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>('');

  const handleEditForAll = () => {
    setEditForAll((prev) => !prev);
  };

  const generatedStrikes = useMemo(() => {
    if (!selectedOptionsMarket) return [];
    const { callToken, putToken } = selectedOptionsMarket;

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
  }, [tick, selectedOptionsMarket]);

  const putStrikes = useMemo(() => {
    return isTrade
      ? getPurchasableStrikesChain()
          .sort((a, b) => Number(b.strike) - Number(a.strike))
          .filter(({ strike }) => markPrice > strike)
      : generatedStrikes
          .filter(({ strike }) => markPrice > strike)
          .sort((a, b) => Number(b.strike) - Number(a.strike));
  }, [generatedStrikes, markPrice, isTrade, getPurchasableStrikesChain]);

  const callStrikes = useMemo(() => {
    return isTrade
      ? getPurchasableStrikesChain()
          .sort((a, b) => Number(a.strike) - Number(b.strike))
          .filter(({ strike }) => strike > markPrice)
      : generatedStrikes
          .filter(({ type }) => type.toLowerCase() === 'call')
          .sort((a, b) => Number(a.strike) - Number(b.strike));
  }, [generatedStrikes, isTrade, markPrice, getPurchasableStrikesChain]);

  const selectedPutStrikesLength = useMemo(() => {
    return Array.from(selectedStrikes).filter(
      ([_, { strike }]) => strike < markPrice,
    ).length;
  }, [selectedStrikes, markPrice]);

  const selectedCallStrikesLength = useMemo(() => {
    return Array.from(selectedStrikes).filter(
      ([_, { strike }]) => strike > markPrice,
    ).length;
  }, [selectedStrikes, markPrice]);

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
        {Array.from(selectedStrikes).map(([strikeKey, strikeData], index) => (
          <SelectedStrikeItem
            disabledInput={editForAll && index !== 0}
            key={index}
            strikeData={strikeData}
            strikeKey={strikeKey}
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
      <div className="text-[13px] p-[13px] font-medium flex items-center justify-between">
        <span className="text-stieglitz">Balance</span>
        <span className="flex items-center justify-center space-x-[8px]">
          <span className="text-[13px] flex items-center justify-center space-x-[4px]">
            <span className="text-white">
              {formatAmount(tokenBalances.readableCallToken, 5)}
            </span>
            <span className="text-stieglitz">
              {tokenBalances.callTokenSymbol}
            </span>
          </span>{' '}
          <span className="text-[13px] flex items-center justify-center space-x-[4px]">
            <span className="text-white">
              {formatAmount(tokenBalances.readablePutToken, 5)}
            </span>
            <span className="text-stieglitz">
              {tokenBalances.putTokenSymbol}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default StrikesSection;
