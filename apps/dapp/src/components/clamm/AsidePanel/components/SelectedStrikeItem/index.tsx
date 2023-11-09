import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Address,
  encodeFunctionData,
  formatUnits,
  hexToBigInt,
  maxUint256,
  parseUnits,
} from 'viem';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useLoadingStates, {
  ASIDE_PANEL_BUTTON_KEY,
} from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore, {
  SelectedStrike,
} from 'hooks/clamm/useStrikesChainStore';

import getPriceFromTick from 'utils/clamm/getPriceFromTick';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import getPremium from 'utils/clamm/varrock/getPremium';

import { optionPoolsAbi } from 'constants/clamm';
import { VARROCK_BASE_API_URL } from 'constants/env';

type Props = {
  key: number;
  strikeIndex: number;
  strikeData: SelectedStrike;
};
const SelectedStrikeItem = ({ strikeData, strikeIndex }: Props) => {
  const { deselectStrike } = useStrikesChainStore();
  const { isTrade, selectedOptionsPool, selectedTTL, tokenBalances } =
    useClammStore();
  const { setDeposit, unsetDeposit, setPurchase, unsetPurchase } =
    useClammTransactionsStore();
  const [premium, setPremium] = useState(0n);
  const { chain } = useNetwork();
  const [inputAmount, setInputAmount] = useState<number | string>(0);
  const [amountDebounced] = useDebounce(inputAmount, 1500);
  const { setLoading, isLoading } = useLoadingStates();

  const tokenDecimals = useMemo(() => {
    if (!selectedOptionsPool)
      return {
        callToken: 18,
        putToken: 18,
      };

    return {
      callToken: selectedOptionsPool.callToken.decimals,
      putToken: selectedOptionsPool.putToken.decimals,
    };
  }, [selectedOptionsPool]);

  const updatePremium = useCallback(async () => {
    if (!selectedOptionsPool || !chain || !isTrade) return;
    const { isCall, meta } = strikeData;
    const { callToken, putToken } = selectedOptionsPool;

    if (Number(amountDebounced) === 0) return;

    const tick = isCall ? meta.tickUpper : meta.tickLower;
    const ttl = selectedTTL;
    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    const { amountInToken } = await getPremium(
      callToken.address,
      putToken.address,
      tick,
      ttl,
      Number(amountDebounced),
      isCall,
      chain.id,
    );
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);
    if (!amountInToken) return;

    const totalPremium = amountInToken;

    setPremium(BigInt(totalPremium));
  }, [
    setLoading,
    chain,
    isTrade,
    selectedOptionsPool,
    strikeData,
    selectedTTL,
    amountDebounced,
  ]);

  const updateDepositTransaction = useCallback(async () => {
    if (isTrade || !chain || !selectedOptionsPool) return;

    const { callToken, putToken } = selectedOptionsPool;
    const { isCall, meta } = strikeData;
    const depositAmount = parseUnits(
      Number(amountDebounced).toString(),
      isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
    );
    if (depositAmount === 0n) return;
    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    axios
      .get(`${VARROCK_BASE_API_URL}/clamm/deposit`, {
        params: {
          chainId: chain.id,
          callToken: callToken.address,
          putToken: putToken.address,
          pool: '0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443' as Address,
          handler: '0xBdAd87fFcB972E55A94C0aDca42E2c21441070A1' as Address,
          amount: depositAmount,
          tickLower: meta.tickLower,
          tickUpper: meta.tickUpper,
        },
      })
      .then(({ data }) => {
        if (data) {
          setDeposit(strikeIndex, {
            strike: strikeData.strike,
            amount: depositAmount,
            tokenSymbol: data.tokenSymbol,
            tokenAddress: data.tokenAddress,
            positionManager: '0x1e3d4725dB1062b88962bFAb8B2D31eAa8f63e45',
            txData: data.txData,
            tokenDecimals: isCall
              ? tokenDecimals.callToken
              : tokenDecimals.putToken,
          });
        }
      })
      .catch((err) => {
        setLoading(ASIDE_PANEL_BUTTON_KEY, false);
      });
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  }, [
    setLoading,
    amountDebounced,
    tokenDecimals,
    setDeposit,
    strikeIndex,
    chain,
    isTrade,
    selectedOptionsPool,
    strikeData,
  ]);

  const updatePurchases = useCallback(() => {
    if (!isTrade || !chain || !selectedOptionsPool) return;

    // if (Number(amountDebounced) > strikeData.amount1) {
    //   return;
    // }

    const { callToken, putToken, optionsPoolAddress } = selectedOptionsPool;
    const { isCall, meta } = strikeData;
    const { tickLower, tickUpper } = meta;
    const token0IsCallToken =
      hexToBigInt(callToken.address) < hexToBigInt(putToken.address);

    const strike = parseUnits(
      getPriceFromTick(
        isCall ? tickUpper : tickLower,
        10 ** (token0IsCallToken ? callToken.decimals : putToken.decimals),
        10 ** (token0IsCallToken ? putToken.decimals : callToken.decimals),
        !token0IsCallToken,
      ).toString(),
      8,
    );

    const decimalsInContext = isCall ? callToken.decimals : putToken.decimals;
    const symbolInContext = isCall ? callToken.symbol : putToken.symbol;
    const tokenAddressInContext = isCall ? callToken.address : putToken.address;

    const optionsAmount = parseUnits(
      Number(amountDebounced).toString(),
      decimalsInContext,
    );

    const tokenAmountToUse = isCall
      ? optionsAmount
      : (optionsAmount * strike) / parseUnits('1', 8);

    const getLiquidityForCall = token0IsCallToken
      ? getLiquidityForAmount0
      : getLiquidityForAmount1;
    const getLiquidityForPut = token0IsCallToken
      ? getLiquidityForAmount1
      : getLiquidityForAmount0;

    const liquidityToUse = isCall
      ? getLiquidityForCall(
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          tokenAmountToUse,
        )
      : getLiquidityForPut(
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          tokenAmountToUse,
        );

    const optTicks = [
      {
        _handler: '0xBdAd87fFcB972E55A94C0aDca42E2c21441070A1' as Address,
        pool: '0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443' as Address,
        tickLower: tickLower,
        tickUpper: tickUpper,
        liquidityToUse,
      },
    ];

    const txData = encodeFunctionData({
      abi: optionPoolsAbi,
      functionName: 'mintOption',
      args: [
        {
          optionTicks: optTicks,
          tickLower,
          tickUpper,
          ttl: BigInt(selectedTTL),
          isCall,
          maxFeeAllowed: maxUint256,
        },
      ],
    });

    setPurchase(strikeIndex, {
      strike: strikeData.strike,
      premium: premium,
      optionsPool: optionsPoolAddress,
      txData,
      tokenSymbol: symbolInContext,
      tokenAddress: tokenAddressInContext,
      tokenDecimals: decimalsInContext,
    });
  }, [
    setPurchase,
    strikeIndex,
    chain,
    amountDebounced,
    isTrade,
    selectedOptionsPool,
    strikeData,
    premium,
    selectedTTL,
  ]);

  const handleMax = useCallback(() => {
    if (isTrade) {
      setInputAmount(strikeData.amount1 * 0.9999);
    } else {
      const balance = strikeData.isCall
        ? tokenBalances.callToken
        : tokenBalances.putToken;
      setInputAmount(
        formatUnits(
          balance,
          strikeData.isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
        ),
      );
    }
  }, [
    isTrade,
    strikeData.isCall,
    strikeData.amount1,
    tokenBalances.callToken,
    tokenBalances.putToken,
    tokenDecimals.callToken,
    tokenDecimals.putToken,
  ]);

  useEffect(() => {
    updatePremium();
  }, [updatePremium]);

  useEffect(() => {
    updateDepositTransaction();
  }, [updateDepositTransaction]);

  useEffect(() => {
    updatePurchases();
  }, [updatePurchases]);

  return (
    <div className="w-full flex items-center h-[30px] space-x-[10px]">
      <XMarkIcon
        onClick={() => {
          deselectStrike(strikeIndex);
          unsetDeposit(strikeIndex);
          unsetPurchase(strikeIndex);
        }}
        role="button"
        className="text-stieglitz hover:text-white rounded-full w-[18px] h-[18px] flex-[0.075]"
      />
      <div className="w-[34px] h-[30px] flex items-center justify-center bg-carbon rounded-md flex-[0.125]">
        {strikeData.isCall ? (
          <ArrowUpRightIcon
            className={'h-[18px] w-[18px] p-[2px] text-up-only'}
          />
        ) : (
          <ArrowDownRightIcon
            className={'h-[18px] w-[18px] p-[2px] text-down-bad'}
          />
        )}
      </div>
      <div className="flex items-center justify-center space-x-[4px] bg-mineshaft h-[30px] w-[100px] rounded-md flex-[0.375]">
        <span className="text-stieglitz text-[13px]">$</span>
        <span className="text-[13px]">
          {Number(strikeData.strike ?? 0).toFixed(4)}
        </span>
      </div>
      <div className="h-[30px] w-[160px] p-[8px] flex items-center justfiy-center border border-mineshaft rounded-md flex-[0.425]">
        <input
          onChange={(event: any) => {
            setInputAmount(event.target.value);
          }}
          value={inputAmount}
          type="number"
          min="0"
          placeholder="0.0"
          className="w-full text-[13px] text-left text-white bg-umbra focus:outline-none focus:border-mineshaft rounded-md"
        />
        <img
          onClick={handleMax}
          role="button"
          src="/assets/max.svg"
          className="hover:bg-silver rounded-[4px] h-[14px]"
          alt="max"
        />
      </div>
    </div>
  );
};

export default SelectedStrikeItem;
