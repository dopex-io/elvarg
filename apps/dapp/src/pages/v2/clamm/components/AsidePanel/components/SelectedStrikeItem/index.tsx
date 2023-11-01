import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Address,
  encodeFunctionData,
  formatUnits,
  hexToBigInt,
  parseEther,
  parseUnits,
} from 'viem';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CalculatorIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { VARROCK_BASE_API_URL } from 'pages/v2/clamm/constants';
import optionPoolsAbi from 'pages/v2/clamm/constants/optionPoolsAbi';
import getPremium from 'pages/v2/clamm/utils/varrock/getPremium';
import getTokenAllowance from 'pages/v2/clamm/utils/varrock/getTokenAllowance';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useStrikesChainStore, {
  SelectedStrike,
} from 'hooks/clamm/useStrikesChainStore';

import getPriceFromTick from 'utils/clamm/getPriceFromTick';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { formatAmount } from 'utils/general';

type Props = {
  key: number;
  strikeIndex: number;
  strikeData: SelectedStrike;
};
const SelectedStrikeItem = ({ strikeData, strikeIndex }: Props) => {
  const { deselectStrike } = useStrikesChainStore();
  const { isTrade, selectedOptionsPool, tokenBalances, selectedTTL } =
    useClammStore();
  const { setDeposit, unsetDeposit, setPurchase, unsetPurchase } =
    useClammTransactionsStore();
  const [premium, setPremium] = useState(0n);
  const { chain } = useNetwork();
  const [inputAmount, setInputAmount] = useState<number | string>('');
  const { address: userAddress } = useAccount();

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
    const tick = isCall ? meta.tickUpper : meta.tickLower;
    const ttl = selectedTTL;
    const { amountInToken } = await getPremium(
      callToken.address,
      putToken.address,
      tick,
      ttl,
      isCall,
      chain.id,
    );
    if (!amountInToken) return;
    const decimalsInContext = isCall ? callToken.decimals : putToken.decimals;
    const totalPremium =
      (BigInt(amountInToken) *
        parseUnits(Number(inputAmount).toString(), decimalsInContext)) /
      parseUnits('1', decimalsInContext);

    setPremium(BigInt(totalPremium));
  }, [
    chain,
    isTrade,
    selectedOptionsPool,
    strikeData,
    selectedTTL,
    inputAmount,
  ]);

  const updateDepositTransaction = useCallback(async () => {
    if (isTrade || !chain || !selectedOptionsPool) return;
    const { callToken, putToken } = selectedOptionsPool;
    const { isCall, meta } = strikeData;
    const depositAmount = parseUnits(
      Number(inputAmount).toString(),
      isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
    );
    if (depositAmount === 0n) return;
    axios
      .get(`${VARROCK_BASE_API_URL}/clamm/deposit`, {
        params: {
          chainId: chain.id,
          callToken: callToken.address,
          putToken: putToken.address,
          pool: '0x53b27D62963064134D60D095a526e1E72b74A5C4' as Address,
          handler: '0x0165878A594ca255338adfa4d48449f69242Eb8F' as Address,
          amount: depositAmount,
          tickLower: meta.tickLower,
          tickUpper: meta.tickUpper,
        },
      })
      .then(({ data }) => {
        if (data) {
          setDeposit(strikeIndex, {
            amount: depositAmount,
            tokenSymbol: data.tokenSymbol,
            tokenAddress: data.tokenAddress,
            positionManager: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            txData: data.txData,
          });
        }
      });
  }, [
    setDeposit,
    strikeIndex,
    chain,
    inputAmount,
    isTrade,
    selectedOptionsPool,
    strikeData,
    tokenDecimals.callToken,
    tokenDecimals.putToken,
  ]);

  const statusMessage = useMemo(() => {
    if (isTrade && premium === 0n) {
      return 'Premium is zero. Try a later expiry';
    }

    return '';
  }, [premium, isTrade]);

  const updatePurchases = useCallback(() => {
    if (!isTrade || !chain || !selectedOptionsPool) return;
    const { callToken, putToken, optionsPoolAddress } = selectedOptionsPool;
    const { isCall, meta } = strikeData;
    const { tickLower, tickUpper } = meta;
    const token0IsCallToken =
      hexToBigInt(callToken.address) < hexToBigInt(putToken.address);

    const strike = parseUnits(
      getPriceFromTick(
        isCall ? tickUpper : tickLower,
        token0IsCallToken ? callToken.decimals * 10 : putToken.decimals,
        token0IsCallToken ? putToken.decimals * 10 : callToken.decimals,
        !token0IsCallToken,
      ).toString(),
      8,
    );

    const decimalsInContext = isCall ? callToken.decimals : putToken.decimals;
    const symbolInContext = isCall ? callToken.symbol : putToken.symbol;
    const tokenAddressInContext = isCall ? callToken.address : putToken.address;

    const optionsAmount = parseUnits(
      Number(inputAmount).toString(),
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
        _handler: '0x0165878A594ca255338adfa4d48449f69242Eb8F' as Address,
        pool: '0x53b27D62963064134D60D095a526e1E72b74A5C4' as Address,
        tickLower: tickLower,
        tickUpper: tickUpper,
        liquidityToUse,
      },
    ];

    let premiumWithBuffer = (premium * 10005n) / 10000n;
    const totalPremium =
      (premiumWithBuffer * optionsAmount) / parseUnits('1', decimalsInContext);

    const txData = encodeFunctionData({
      abi: optionPoolsAbi,
      functionName: 'mintOptionRoll',
      args: [
        {
          optionTicks: optTicks,
          tickLower,
          tickUpper,
          ttl: BigInt(selectedTTL),
          isCall,
          maxFeeAllowed: totalPremium,
        },
      ],
    });

    setPurchase(strikeIndex, {
      premium: totalPremium,
      optionsPool: optionsPoolAddress,
      txData,
      tokenSymbol: symbolInContext,
      tokenAddress: tokenAddressInContext,
    });
  }, [
    setPurchase,
    strikeIndex,
    chain,
    inputAmount,
    isTrade,
    selectedOptionsPool,
    strikeData,
    premium,
    selectedTTL,
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
    <div className="w-full h-full flex-col items-center justify-center">
      <div className="w-full relative space-y-[4px] px-[10px]">
        <div className="flex items-center justify-end space-x-[4px] p-[4px]">
          {/* <CalculatorIcon
            role="button"
            className="text-stieglitz ml-[2px]rounded-full w-[14px] h-[14px]"
          /> */}
          <XMarkIcon
            onClick={() => {
              deselectStrike(strikeIndex);
              unsetDeposit(strikeIndex);
              unsetPurchase(strikeIndex);
            }}
            role="button"
            className="text-stieglitz hover:text-white ml-[2px]rounded-full w-[14px] h-[14px]"
          />
        </div>
        <div className="w-full h-full flex items-center justify-center bg-cod-gray space-x-[4px] border border-umbra rounded-lg py-[4px]">
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-[6px]">
              <div className="flex flex-col bg-mineshaft w-[100px] rounded-md py-[4px] px-[8px]">
                <span className="text-xs text-stieglitz flex items-center justify-start space-x-[4px]">
                  <span className="font-medium">{`${
                    strikeData.isCall ? 'Call' : 'Put'
                  } Strike`}</span>
                  {strikeData.isCall ? (
                    <ArrowUpRightIcon
                      className={'h-[12px] w-[12px] text-up-only'}
                    />
                  ) : (
                    <ArrowDownRightIcon
                      className={'h-[12px] w-[12px] text-down-bad'}
                    />
                  )}
                </span>
                <div className="flex items-center justify-start space-x-[3px]">
                  <span className="text-stieglitz text-sm">$</span>
                  <span className="text-sm">
                    {Number(strikeData.strike ?? 0).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-end p-[4px]">
              <input
                onChange={(event: any) => {
                  setInputAmount(event.target.value);
                }}
                value={inputAmount}
                type="number"
                min="0"
                placeholder="0.0"
                className="w-full text-right text-white bg-cod-gray focus:outline-none focus:border-mineshaft rounded-md py-[4px] "
              />
              <div className="flex items-center justify-center space-x-[4px] ">
                <span className="text-[10px] text-stieglitz">
                  Balance: {'      '}
                  {!isTrade
                    ? formatAmount(
                        formatUnits(
                          strikeData.isCall
                            ? tokenBalances.callToken
                            : tokenBalances.putToken,
                          strikeData.isCall
                            ? tokenDecimals.callToken
                            : tokenDecimals.putToken,
                        ),
                        5,
                      )
                    : 0}
                </span>
                <img
                  onClick={() => {
                    const balance = strikeData.isCall
                      ? tokenBalances.callToken
                      : tokenBalances.putToken;
                    setInputAmount(
                      formatUnits(
                        balance,
                        strikeData.isCall
                          ? tokenDecimals.callToken
                          : tokenDecimals.putToken,
                      ),
                    );
                  }}
                  role="button"
                  src="/assets/max.svg"
                  className="hover:bg-silver rounded-[4px] h-[14px]"
                  alt="max"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full px-[6px] py-[4px] space-y-[4px]">
          {isTrade && (
            <div className="w-full flex items-center justify-between text-xs">
              <span className="text-stieglitz font-normal">Premium</span>
              <div className="flex space-x-[4px]">
                <span className="font-normal">
                  {formatAmount(
                    Number(
                      formatUnits(
                        premium,
                        strikeData.isCall
                          ? tokenDecimals.callToken
                          : tokenDecimals.putToken,
                      ),
                    ) * Number(inputAmount),
                    5,
                  )}
                </span>
                <span className="text-stieglitz font-normal">
                  {strikeData.tokenSymbol}
                </span>
              </div>
            </div>
          )}
          {/* {isTrade && (
            <div className="w-full flex items-center justify-between text-xs">
              <span className="text-stieglitz font-normal">Breakeven</span>
              <div className="flex space-x-[4px]">
                <span className="text-stieglitz font-normal">$</span>
                <span className="font-normal">{0}</span>
              </div>
            </div>
          )} */}
        </div>
      </div>
      <div className="w-full flex items-center justify-between px-[12px] py-[6px]">
        <div className="flex items-center justify-center space-x-[4px]">
          {Boolean(statusMessage) && (
            <ExclamationCircleIcon className="text-jaffa ml-[4px] rounded-full w-[14px] h-[14px]" />
          )}
          <span className="text-xs">{statusMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectedStrikeItem;
