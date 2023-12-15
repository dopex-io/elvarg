import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  encodeAbiParameters,
  encodeFunctionData,
  hexToBigInt,
  parseUnits,
  zeroAddress,
} from 'viem';

import DopexV2PositionManager from 'abis/clamm/DopexV2PositionManager';
import { useDebounce } from 'use-debounce';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore, {
  DepositTransaction,
} from 'hooks/clamm/useClammTransactionsStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import generateStrikes from 'utils/clamm/generateStrikes';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { formatAmount } from 'utils/general';
import { parseInputChange } from 'utils/input';
import { getTokenSymbol } from 'utils/token';

import { ZERO_FEES_STRIKES } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

import StrikeInput from '../StrikesSection/components/StrikeSelector/components/StrikeInput';
import RangeDepositInput from './components/RangeDepositInput';
import RangeGraph from './components/RangeGraph';
import RangeSlider from './components/RangeSlider';

const RangeSelector = () => {
  const { chain } = useNetwork();
  const { tick, selectedOptionsPool, markPrice, addresses } = useClammStore();
  const { batchSetDeposits } = useClammTransactionsStore();
  const { strikesChain } = useStrikesChainStore();
  const [selectedStrikeIndices, setSelectedStrikeIndicies] = useState<number[]>(
    [],
  );
  const [lowerLimitInputStrike, setLowerLimitInputStrike] = useState('');
  const [upperLimitInputStrike, setUpperLimitInputStrike] = useState('');
  const [callDepositAmount, setCallDepositAmount] = useState('');
  const [putDepositAmount, setPutDepositAmount] = useState('');
  const [debouncedCallDepositAmount] = useDebounce(callDepositAmount, 500);
  const [debouncedPutDepositAmount] = useDebounce(putDepositAmount, 500);
  const [debouncedSelectedStrikeIndices] = useDebounce(
    selectedStrikeIndices,
    1000,
  );

  const _strikesBarGroup = useMemo(() => {
    if (!selectedOptionsPool) return [];
    const { callToken, putToken } = selectedOptionsPool;
    if (strikesChain.length === 0) return [];
    const MAX_BAR_HEIGHT = 100;
    const highestLiquidityUsd = strikesChain.reduce((prev, curr) => {
      return Math.max(prev, Number(curr.liquidityUsd));
    }, Number(strikesChain[0].liquidityUsd));

    return generateStrikes(
      tick,
      10 ** callToken.decimals,
      10 ** putToken.decimals,
      false,
      50,
    )
      .filter(({ strike }) => !ZERO_FEES_STRIKES.includes(strike))
      .sort((a, b) => a.strike - b.strike)
      .map(({ strike, meta, type }) => {
        const liquidityUsd =
          strikesChain.find(
            ({ meta: { tickLower, tickUpper } }) =>
              tickLower === meta.tickLower && tickUpper === meta.tickUpper,
          )?.liquidityUsd ?? 0;
        return {
          meta,
          strike,
          type,
          barHeight:
            (MAX_BAR_HEIGHT * Number(liquidityUsd)) / highestLiquidityUsd,
        };
      });
  }, [strikesChain, tick, selectedOptionsPool]);

  const lowerLimitStrikes = useMemo(() => {
    return _strikesBarGroup
      .filter(({ meta: { tickLower } }) => tickLower < tick)
      .sort((a, b) => a.strike - b.strike);
  }, [tick, _strikesBarGroup]);

  const upperLimitStrikes = useMemo(() => {
    return _strikesBarGroup
      .filter(({ meta: { tickUpper } }) => tickUpper > tick)
      .sort((a, b) => a.strike - b.strike);
  }, [tick, _strikesBarGroup]);

  const strikesInContext = useMemo(() => {
    return [...lowerLimitStrikes, ...upperLimitStrikes];
  }, [lowerLimitStrikes, upperLimitStrikes]);

  const checkUpperLimitStrike = useCallback(() => {
    const strike = Number(upperLimitInputStrike);
    if (upperLimitStrikes.length === 0) {
      return;
    }

    let closestNumber = upperLimitStrikes[0].strike;
    let closestDifference = Math.abs(strike - closestNumber);

    for (let i = 1; i < upperLimitStrikes.length; i++) {
      const currentDifference = Math.abs(strike - upperLimitStrikes[i].strike);

      if (currentDifference < closestDifference) {
        closestNumber = upperLimitStrikes[i].strike;
        closestDifference = currentDifference;
      }
    }
    setUpperLimitInputStrike(closestNumber.toFixed(4));
    return closestNumber;
  }, [upperLimitInputStrike, upperLimitStrikes]);

  const checkLowerLimitStrike = useCallback(() => {
    const strike = Number(lowerLimitInputStrike);
    if (lowerLimitStrikes.length === 0) {
      return;
    }

    let closestNumber = lowerLimitStrikes[0].strike;
    let closestDifference = Math.abs(strike - closestNumber);

    for (let i = 1; i < lowerLimitStrikes.length; i++) {
      const currentDifference = Math.abs(strike - lowerLimitStrikes[i].strike);

      if (currentDifference < closestDifference) {
        closestNumber = lowerLimitStrikes[i].strike;
        closestDifference = currentDifference;
      }
    }
    setLowerLimitInputStrike(closestNumber.toFixed(4));
    return closestNumber;
  }, [lowerLimitInputStrike, lowerLimitStrikes]);

  useEffect(() => {
    const length = strikesInContext.length - 1;
    if (selectedStrikeIndices.length === 0 && strikesInContext.length > 0) {
      setSelectedStrikeIndicies([
        Math.floor(length * 0.25),
        Math.floor(length * 0.75),
      ]);
    }
  }, [selectedStrikeIndices.length, strikesInContext.length]);

  const getStrikesBarGroupindex = useCallback(
    (strike: number) => {
      const index = strikesInContext.findIndex(({ strike: itemStrike }) => {
        return strike === itemStrike;
      });
      return index;
    },
    [strikesInContext],
  );

  useEffect(() => {
    const indices = selectedStrikeIndices;
    setUpperLimitInputStrike(
      (strikesInContext[indices[1]] ?? { strike: 0 }).strike.toFixed(4),
    );
    setLowerLimitInputStrike(
      (strikesInContext[indices[0]] ?? { strike: 0 }).strike.toFixed(4),
    );
  }, [selectedStrikeIndices, strikesInContext]);

  useEffect(() => {
    if (!selectedOptionsPool || !addresses) return;
    if (selectedStrikeIndices.length === 0) return;
    const { callToken, putToken, primePool } = selectedOptionsPool;
    const startIndex = debouncedSelectedStrikeIndices[0];
    const endIndex = debouncedSelectedStrikeIndices[1];
    const _strikesInContext = strikesInContext.filter(
      (_, index) => index >= startIndex && index <= endIndex,
    );

    const callStrikesCount = _strikesInContext.reduce((prev, { strike }) => {
      return strike > markPrice ? prev + 1 : prev;
    }, 0);
    const putStrikesCount = _strikesInContext.reduce((prev, { strike }) => {
      return strike < markPrice ? prev + 1 : prev;
    }, 0);

    let tokenPerPutStrike = 0n;
    let tokenPerCallStrike = 0n;
    if (putStrikesCount) {
      tokenPerPutStrike =
        parseUnits(debouncedPutDepositAmount, putToken.decimals) /
        BigInt(putStrikesCount);
    }

    if (callStrikesCount) {
      tokenPerCallStrike =
        parseUnits(debouncedCallDepositAmount, callToken.decimals) /
        BigInt(callStrikesCount);
    }

    const token0isCall =
      hexToBigInt(callToken.address) < hexToBigInt(putToken.address);

    const _deposits: (DepositTransaction | undefined)[] = _strikesInContext.map(
      ({ strike, meta: { tickLower, tickUpper } }) => {
        let liquidityToProvide = 0n;
        if (tickUpper > tick) {
          liquidityToProvide = token0isCall
            ? getLiquidityForAmount0(
                getSqrtRatioAtTick(BigInt(tickLower)),
                getSqrtRatioAtTick(BigInt(tickUpper)),
                tokenPerCallStrike,
              )
            : getLiquidityForAmount1(
                getSqrtRatioAtTick(BigInt(tickLower)),
                getSqrtRatioAtTick(BigInt(tickUpper)),
                tokenPerCallStrike,
              );
        } else if (tickLower < tick) {
          liquidityToProvide = token0isCall
            ? getLiquidityForAmount1(
                getSqrtRatioAtTick(BigInt(tickLower)),
                getSqrtRatioAtTick(BigInt(tickUpper)),
                tokenPerPutStrike,
              )
            : getLiquidityForAmount0(
                getSqrtRatioAtTick(BigInt(tickLower)),
                getSqrtRatioAtTick(BigInt(tickUpper)),
                tokenPerPutStrike,
              );
        } else {
          return;
        }

        const handlerDepositData = encodeAbiParameters(
          [
            { name: 'pool', type: 'address' },
            { name: 'tickLower', type: 'int24' },
            { name: 'tickUpper', type: 'int24' },
            { name: 'liquidity', type: 'uint128' },
          ],
          [primePool, tickLower, tickUpper, liquidityToProvide],
        );
        return {
          amount: tickUpper > tick ? tokenPerCallStrike : tokenPerPutStrike,
          positionManager: addresses.positionManager,
          strike,
          tokenAddress: tickUpper > tick ? callToken.address : putToken.address,
          tokenDecimals:
            tickUpper > tick ? callToken.decimals : putToken.decimals,
          tokenSymbol: tickUpper > tick ? callToken.symbol : putToken.symbol,
          txData: encodeFunctionData({
            abi: DopexV2PositionManager,
            functionName: 'mintPosition',
            args: [addresses.handler, handlerDepositData],
          }),
        };
      },
    );

    console.log(_deposits.filter((data) => data));

    batchSetDeposits(_deposits.filter((data) => data) as DepositTransaction[]);
  }, [
    tick,
    debouncedCallDepositAmount,
    debouncedPutDepositAmount,
    selectedStrikeIndices,
    batchSetDeposits,
    addresses,
    debouncedSelectedStrikeIndices,
    strikesInContext,
    markPrice,
    selectedOptionsPool,
  ]);

  return (
    <div className="w-full h-full flex flex-col bg-umbra space-y-[4px]">
      <RangeGraph
        strikes={strikesInContext}
        markPrice={markPrice}
        strikeIndices={selectedStrikeIndices}
      />
      <RangeSlider
        setLowerLimitStrike={setLowerLimitInputStrike}
        setUpperLimitStrike={setUpperLimitInputStrike}
        setStrikeIndicies={setSelectedStrikeIndicies}
        strikeIndicies={selectedStrikeIndices}
        strikes={strikesInContext}
      />
      <div className="flex items-center pt-[14px] space-x-[4px]">
        <div className="w-full flex flex-col space-y-[4px]">
          <StrikeInput
            inputAmount={lowerLimitInputStrike}
            onBlurCallback={(e) => {
              const strike = checkLowerLimitStrike();
              setSelectedStrikeIndicies((prev) => [
                getStrikesBarGroupindex(strike ?? 0),
                prev[1],
              ]);
            }}
            onSubmitCallback={(e) => {
              if (e.code === 'Enter') {
                const strike = checkLowerLimitStrike();
                setSelectedStrikeIndicies((prev) => [
                  getStrikesBarGroupindex(strike ?? 0),
                  prev[1],
                ]);
              }
            }}
            placeHolder="0"
            onChangeInput={(e) => {
              setLowerLimitInputStrike(e.target.value);
            }}
            label="Upper Strike"
          />
        </div>
        <div className="w-full flex space-y-[4px]">
          <StrikeInput
            inputAmount={upperLimitInputStrike}
            onBlurCallback={(e) => {
              const strike = checkUpperLimitStrike();
              setSelectedStrikeIndicies((prev) => [
                prev[0],
                getStrikesBarGroupindex(strike ?? 0),
              ]);
            }}
            onSubmitCallback={(e) => {
              if (e.code === 'Enter') {
                const strike = checkUpperLimitStrike();
                setSelectedStrikeIndicies((prev) => [
                  prev[0],
                  getStrikesBarGroupindex(strike ?? 0),
                ]);
              }
            }}
            placeHolder="0"
            onChangeInput={(e) => {
              setUpperLimitInputStrike(e.target.value);
            }}
            label="Upper Strike"
          />
        </div>
      </div>
      {Number(lowerLimitInputStrike) < markPrice && (
        <RangeDepositInput
          onChangeInput={(e) => {
            parseInputChange(e, (e) => setPutDepositAmount(e.target.value));
          }}
          inputValue={putDepositAmount}
          isCall={false}
          lowerStrike={lowerLimitInputStrike}
          upperStrike={formatAmount(
            Math.min(Number(upperLimitInputStrike), markPrice),
            4,
          )}
          placeHolder={getTokenSymbol({
            chainId: chain?.id ?? DEFAULT_CHAIN_ID,
            address: selectedOptionsPool?.putToken.address ?? zeroAddress,
          })}
        />
      )}
      {Number(upperLimitInputStrike) > markPrice && (
        <RangeDepositInput
          onChangeInput={(e) => {
            parseInputChange(e, (e) => setCallDepositAmount(e.target.value));
          }}
          inputValue={callDepositAmount}
          upperStrike={upperLimitInputStrike}
          isCall={true}
          lowerStrike={formatAmount(
            Math.max(Number(lowerLimitInputStrike), markPrice),
            4,
          )}
          placeHolder={getTokenSymbol({
            chainId: chain?.id ?? DEFAULT_CHAIN_ID,
            address: selectedOptionsPool?.callToken.address ?? zeroAddress,
          })}
        />
      )}
    </div>
  );
};

export default RangeSelector;
