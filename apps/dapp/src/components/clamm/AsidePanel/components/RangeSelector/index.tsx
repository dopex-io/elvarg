import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Address,
  BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  Hex,
  hexToBigInt,
  parseUnits,
  zeroAddress,
} from 'viem';

import { Button } from '@dopex-io/ui';
import { DopexV2PositionManager } from 'pages/clamm-v2/abi/DopexV2PositionManager';
import toast from 'react-hot-toast';
import { Bar, BarChart, Cell, Rectangle } from 'recharts';
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  useWalletClient,
} from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import RangeSelectorSlider from 'components/clamm/StrikesChain/components/FilterSettings/components/RangeSelector/components/Slider';

import generateStrikes from 'utils/clamm/generateStrikes';
import getHandler from 'utils/clamm/getHandler';
import getHook from 'utils/clamm/getHook';
import getPositionManagerAddress from 'utils/clamm/getPositionManagerAddress';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { cn, formatAmount } from 'utils/general';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import RangeDepositInput from './RangeDepositInput';
import StrikeInput from './StrikeInput';

const LPRangeSelector = () => {
  const { selectedOptionsMarket, tick, markPrice, tokenBalances } =
    useClammStore();
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const { strikesChain, updateStrikes } = useStrikesChainStore();
  const [lowerLimitInputStrike, setLowerLimitInputStrike] = useState('');
  const [upperLimitInputStrike, setUpperLimitInputStrike] = useState('');
  const [putAmount, setPutAmount] = useState('');
  const [callAmount, setCallAmount] = useState('');
  const [selection, setSelection] = useState<number[]>([]);

  const positionManagerAddress = useMemo(() => {
    return getPositionManagerAddress(chain?.id ?? DEFAULT_CHAIN_ID) as Address;
  }, [chain?.id]);

  const {
    data: allowances,
    isLoading: allowancesLoading,
    refetch: refetchAllowance,
  } = useContractReads({
    contracts: [
      {
        abi: erc20ABI,
        address: selectedOptionsMarket?.callToken.address,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, positionManagerAddress],
      },
      {
        abi: erc20ABI,
        address: selectedOptionsMarket?.putToken.address,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, positionManagerAddress],
      },
    ],
  });

  const callDepositAmountBigInt = useMemo(() => {
    return parseUnits(
      Boolean(callAmount) ? callAmount : '0',
      selectedOptionsMarket?.callToken.decimals ?? 18,
    );
  }, [callAmount, selectedOptionsMarket?.callToken.decimals]);

  const putDepositAmountBigInt = useMemo(() => {
    return parseUnits(
      Boolean(putAmount) ? putAmount : '0',
      selectedOptionsMarket?.putToken.decimals ?? 18,
    );
  }, [putAmount, selectedOptionsMarket?.putToken.decimals]);

  const { writeAsync: approveCallToken, isLoading: approveCallTokenLoading } =
    useContractWrite({
      abi: erc20ABI,
      address: selectedOptionsMarket?.callToken.address,
      functionName: 'approve',
      args: [positionManagerAddress, (callDepositAmountBigInt * 1001n) / 1000n],
    });

  const { writeAsync: approvePutToken, isLoading: approvePutTokenLoading } =
    useContractWrite({
      abi: erc20ABI,
      address: selectedOptionsMarket?.putToken.address,
      functionName: 'approve',
      args: [positionManagerAddress, (putDepositAmountBigInt * 1001n) / 1000n],
    });

  const allowanceExceeded = useMemo(() => {
    if (!allowances)
      return {
        call: false,
        put: true,
      };

    return {
      call: callDepositAmountBigInt > ((allowances[0].result as bigint) ?? 0n),
      put: putDepositAmountBigInt > ((allowances[1].result as bigint) ?? 0n),
    };
  }, [allowances, putDepositAmountBigInt, callDepositAmountBigInt]);

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
      50,
    ).reverse();
  }, [tick, selectedOptionsMarket]);

  const isLoading = useMemo(() => {
    return (
      approveCallTokenLoading ||
      approvePutTokenLoading ||
      allowancesLoading ||
      loading
    );
  }, [
    approveCallTokenLoading,
    approvePutTokenLoading,
    allowancesLoading,
    loading,
  ]);

  const currentStrikes = useMemo(() => {
    return generatedStrikes.map(({ strike, tickLower, tickUpper }) => {
      const existingStrike = strikesChain.get(strike.toString());
      let totalLiquidityUsd = 0;
      let liquidityAvailableUsd = 0;
      let totalusedLiquidity = 0;

      if (existingStrike) {
        const totalLiquidity = existingStrike.reduce(
          (prev, curr) => prev + Number(curr.totalLiquidity),
          0,
        );
        const liquidityAvailable = existingStrike.reduce(
          (prev, curr) => prev + Number(curr.availableLiquidity),
          0,
        );

        const isPut = strike < markPrice;
        totalLiquidityUsd = isPut ? totalLiquidity : totalLiquidity * markPrice;
        liquidityAvailableUsd = isPut
          ? liquidityAvailable
          : liquidityAvailable * markPrice;
        totalusedLiquidity = totalLiquidityUsd - liquidityAvailableUsd;
      }

      return {
        tickLower,
        tickUpper,
        strike,
        liquidity: totalLiquidityUsd,
        availableLiquidity: liquidityAvailableUsd,
        availableLiquidityBarHeight: liquidityAvailableUsd,
        liquidityBarHeight: totalusedLiquidity,
      };
    });
  }, [strikesChain, markPrice, generatedStrikes]);

  const lowerLimitStrike = useMemo(() => {
    const index = selection[0];
    if (!generatedStrikes[index]) return 0;
    return generatedStrikes[index].strike;
  }, [selection, generatedStrikes]);

  const upperLimitStrike = useMemo(() => {
    const index = selection[1];
    if (!generatedStrikes[index]) return 0;
    return generatedStrikes[index].strike;
  }, [selection, generatedStrikes]);

  const setSelectedStrikes = useCallback((value: number[]) => {
    setSelection(value);
  }, []);

  const lowerLimitStrikes = useMemo(() => {
    return currentStrikes
      .filter(({ strike }) => strike > markPrice)
      .sort((a, b) => a.strike - b.strike);
  }, [markPrice, currentStrikes]);

  const upperLimitStrikes = useMemo(() => {
    return currentStrikes
      .filter(({ strike }) => strike > markPrice)
      .sort((a, b) => a.strike - b.strike);
  }, [markPrice, currentStrikes]);

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
    return closestNumber;
  }, [lowerLimitInputStrike, lowerLimitStrikes]);

  useEffect(() => {
    if (generatedStrikes.length > 0) {
      setSelection([0, generatedStrikes.length - 1]);
    }
  }, [generatedStrikes.length]);

  const confirmDeposit = useCallback(async () => {
    if (
      !chain ||
      !allowances ||
      !selectedOptionsMarket ||
      callDepositAmountBigInt === 0n ||
      putDepositAmountBigInt === 0n ||
      !walletClient
    ) {
      return [];
    }

    const handlerAddress = getHandler('uniswap', chain?.id ?? DEFAULT_CHAIN_ID);
    if (!handlerAddress) {
      return [];
    }
    const uniswapV3Hook = getHook(chain.id, '24HTTL');
    if (!uniswapV3Hook) return;
    const selectedStrikes = currentStrikes.filter(({ strike }) => {
      return strike > lowerLimitStrike && strike < upperLimitStrike;
    });

    const callStrikesLen = selectedStrikes.filter(
      ({ strike }) => strike > markPrice,
    ).length;
    const putStrikesLen = selectedStrikes.filter(
      ({ strike }) => strike < markPrice,
    ).length;

    const callTokenAmountPerStrike =
      callStrikesLen === 0
        ? 0n
        : callDepositAmountBigInt / BigInt(callStrikesLen.toFixed(0));

    const putTokenTokenAmountPerStrike =
      putStrikesLen === 0
        ? 0n
        : putDepositAmountBigInt / BigInt(putStrikesLen.toFixed(0));

    const _depositsTx: Hex[] = [];

    for (const { tickLower, tickUpper, strike } of selectedStrikes) {
      let isCall = strike > markPrice;

      const token0 =
        hexToBigInt(selectedOptionsMarket.callToken.address) <
        hexToBigInt(selectedOptionsMarket.putToken.address)
          ? selectedOptionsMarket.callToken.address
          : selectedOptionsMarket.putToken.address;

      const tokenInContext = isCall
        ? selectedOptionsMarket.callToken.address
        : selectedOptionsMarket.putToken.address;

      const getLiquidity =
        hexToBigInt(tokenInContext) === hexToBigInt(token0)
          ? getLiquidityForAmount0
          : getLiquidityForAmount1;

      const amount =
        hexToBigInt(tokenInContext) === hexToBigInt(token0)
          ? callTokenAmountPerStrike
          : putTokenTokenAmountPerStrike;

      let liquidity = getLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        amount,
      );

      if (liquidity > 0n) {
        _depositsTx.push(
          encodeFunctionData({
            abi: DopexV2PositionManager,
            functionName: 'mintPosition',
            args: [
              handlerAddress,
              encodeAbiParameters(
                [
                  { type: 'address' },
                  { type: 'address' },
                  { type: 'int24' },
                  { type: 'int24' },
                  { type: 'uint128' },
                ],
                [
                  selectedOptionsMarket.primePool,
                  uniswapV3Hook,
                  tickLower,
                  tickUpper,
                  liquidity,
                ],
              ),
            ],
          }),
        );
      }
    }

    if (_depositsTx.length > 0) {
      setLoading(true);
      await walletClient
        .writeContract({
          abi: DopexV2PositionManager,
          address: positionManagerAddress,
          functionName: 'multicall',
          args: [_depositsTx],
        })
        .then((data) => {
          updateStrikes();
          toast.success('Sucess');
          console.log('Transaction Hash: ' + data);
        })
        .catch((err: any) => {
          if (err instanceof BaseError) {
            toast.error(err['shortMessage']);
          } else {
            toast.error(
              'Failed to deposit. Check console for more detail on error',
            );
          }
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [
    chain,
    markPrice,
    positionManagerAddress,
    walletClient,
    updateStrikes,
    currentStrikes,
    lowerLimitStrike,
    upperLimitStrike,
    allowances,
    callDepositAmountBigInt,
    putDepositAmountBigInt,
    selectedOptionsMarket,
  ]);

  const approve = useCallback(async () => {
    const _approve = allowanceExceeded.call
      ? approveCallToken
      : approvePutToken;
    _approve().finally(() => refetchAllowance());
  }, [
    allowanceExceeded.call,
    approvePutToken,
    approveCallToken,
    refetchAllowance,
  ]);

  const buttonProps = useMemo(() => {
    let onClick = confirmDeposit;
    let text = 'Deposit';
    let disabled = false;

    if (!userAddress) {
      return {
        onClick: () => {},
        text: 'Wallet not connected',
        disabled: true,
      };
    }

    if (lowerLimitStrike < markPrice && putDepositAmountBigInt === 0n) {
      return {
        onClick: () => {},
        text: `Enter ${tokenBalances.putTokenSymbol} amount`,
        disabled: true,
      };
    }

    if (upperLimitStrike > markPrice && callDepositAmountBigInt === 0n) {
      return {
        onClick: () => {},
        text: `Enter ${tokenBalances.callTokenSymbol} amount`,
        disabled: true,
      };
    }

    if (tokenBalances.callToken < callDepositAmountBigInt) {
      return {
        onClick,
        text: `Insufficient ${tokenBalances.callTokenSymbol}`,
        disabled: true,
      };
    }
    if (tokenBalances.putToken < putDepositAmountBigInt) {
      return {
        onClick,
        text: `Insufficient ${tokenBalances.putTokenSymbol}`,
        disabled: true,
      };
    }

    if (allowanceExceeded.call) {
      return {
        onClick: approve,
        text: `Approve ${tokenBalances.callTokenSymbol}`,
        disabled: false,
      };
    }
    if (allowanceExceeded.put) {
      return {
        onClick: approve,
        text: `Approve ${tokenBalances.putTokenSymbol}`,
        disabled: false,
      };
    }

    return {
      onClick,
      text,
      disabled,
    };
  }, [
    approve,
    confirmDeposit,
    userAddress,
    upperLimitStrike,
    lowerLimitStrike,
    markPrice,
    allowanceExceeded.put,
    allowanceExceeded.call,
    callDepositAmountBigInt,
    tokenBalances.callToken,
    tokenBalances.callTokenSymbol,
    putDepositAmountBigInt,
    tokenBalances.putToken,
    tokenBalances.putTokenSymbol,
  ]);

  return (
    <div className="flex items-center flex-col p-[12px] bg-umbra space-y-[12px]">
      <div className="flex items-center justify-between text-[13px] w-full">
        <span className="text-stieglitz">AMM</span>
        <p className="flex items-center space-x-[4px] bg-mineshaft px-[4px] py-[2px] rounded-md">
          <span>Uniswap V3</span>
          <img
            src={`/images/exchanges/uniswap.svg`}
            alt={'uniswap'}
            className="w-[24px] h-[24px]"
          />
        </p>
      </div>
      {generatedStrikes.length !== 0 && (
        <div className="bg-carbon bg-opacity-35">
          <BarChart width={338} height={100} data={currentStrikes}>
            <Bar
              dataKey="availableLiquidityBarHeight"
              stackId={'a'}
              shape={<Rectangle />}
            >
              {currentStrikes.map(({ strike }, index) => {
                const isCall = strike > markPrice;
                const isOutOfRange =
                  strike < lowerLimitStrike || strike > upperLimitStrike;
                return (
                  <Cell
                    width={2}
                    key={`cell-${index}`}
                    className={cn(
                      isCall ? 'fill-up-only' : 'fill-down-bad',
                      isOutOfRange && 'fill-mineshaft',
                    )}
                  />
                );
              })}
            </Bar>
            <Bar
              className="bg-up-only"
              dataKey="liquidityBarHeight"
              stackId={'a'}
              shape={<Rectangle />}
            >
              {currentStrikes.map(({ strike }, index) => {
                const isCall = strike > markPrice;
                const isOutOfRange =
                  strike < lowerLimitStrike || strike > upperLimitStrike;
                return (
                  <Cell
                    width={2}
                    key={`cell-${index}`}
                    className={cn(
                      'opacity-30',
                      isCall ? 'fill-up-only' : 'fill-down-bad',
                      isOutOfRange && 'fill-mineshaft',
                    )}
                  />
                );
              })}
            </Bar>
          </BarChart>
          <RangeSelectorSlider
            max={generatedStrikes.length - 1}
            onChange={(value) => {
              setSelectedStrikes(value);
            }}
            lowerLimitStrike={lowerLimitStrike}
            upperLimitStrike={upperLimitStrike}
            value={selection}
          />
        </div>
      )}
      <div className="flex items-center space-x-[4px]">
        <div className="w-full flex flex-col space-y-[4px]">
          <StrikeInput
            inputAmount={lowerLimitInputStrike}
            onBlurCallback={(e) => {
              console.log('SETTING');
              const strike = checkLowerLimitStrike();
              const found = currentStrikes.find((s) => s.strike === strike);
              if (found) {
                const index = currentStrikes.indexOf(found);
                setSelectedStrikes([index, selection[1]]);
                setLowerLimitInputStrike(found.strike.toFixed(4));
              }
            }}
            onSubmitCallback={(e) => {
              if (e.key === 'Enter') {
                const strike = checkLowerLimitStrike();
                const found = currentStrikes.find((s) => s.strike === strike);
                if (found) {
                  const index = currentStrikes.indexOf(found);
                  setSelectedStrikes([index, selection[1]]);
                  setLowerLimitInputStrike(found.strike.toFixed(4));
                }
              }
            }}
            placeHolder="0"
            onChangeInput={(e) => {
              setLowerLimitInputStrike(e.target.value);
            }}
            label="Lower Strike"
          />
        </div>
        <div className="w-full flex space-y-[4px]">
          <StrikeInput
            inputAmount={upperLimitInputStrike}
            onBlurCallback={(e) => {
              const strike = checkUpperLimitStrike();
              const found = currentStrikes.find((s) => s.strike === strike);
              if (found) {
                const index = currentStrikes.indexOf(found);
                setSelectedStrikes([selection[0], index]);
                setUpperLimitInputStrike(found.strike.toFixed(4));
              }
            }}
            onSubmitCallback={(e) => {
              if (e.key === 'Enter') {
                const strike = checkUpperLimitStrike();
                const found = currentStrikes.find((s) => s.strike === strike);
                if (found) {
                  const index = currentStrikes.indexOf(found);
                  setSelectedStrikes([selection[0], index]);
                  setUpperLimitInputStrike(found.strike.toFixed(4));
                }
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
      {lowerLimitStrike < markPrice && (
        <RangeDepositInput
          isCall={false}
          lowerStrike={formatAmount(lowerLimitStrike.toString(), 4)}
          upperStrike={formatAmount(Math.min(markPrice, upperLimitStrike), 4)}
          inputValue={putAmount}
          onChangeInput={(v) => {
            setPutAmount(v.target.value);
          }}
          placeHolder={`0.0 ${selectedOptionsMarket?.putToken.symbol}`}
        />
      )}
      {upperLimitStrike > markPrice && (
        <RangeDepositInput
          isCall={true}
          upperStrike={formatAmount(upperLimitStrike.toString(), 4)}
          lowerStrike={formatAmount(Math.max(markPrice, lowerLimitStrike), 4)}
          inputValue={callAmount}
          onChangeInput={(v) => {
            setCallAmount(v.target.value);
          }}
          placeHolder={`0.0 ${selectedOptionsMarket?.callToken.symbol}`}
        />
      )}
      <div className="text-[13px] flex items-center justify-between w-full">
        <span className="text-stieglitz">Total</span>
        <div className="flex items-center space-x-[8px]">
          <div className="flex items-center space-x-[4px]">
            <span>{formatAmount(callAmount, 4)}</span>
            <span className="text-stieglitz">
              {selectedOptionsMarket?.callToken.symbol}
            </span>
          </div>
          <div className="flex items-center space-x-[4px]">
            <span>{formatAmount(putAmount, 4)}</span>
            <span className="text-stieglitz">
              {selectedOptionsMarket?.putToken.symbol}
            </span>
          </div>
        </div>
      </div>
      <div className="text-[13px] flex items-center justify-between w-full">
        <span className="text-stieglitz">Balance</span>
        <div className="flex items-center space-x-[8px]">
          <div className="flex items-center space-x-[4px]">
            <span>{formatAmount(tokenBalances.readableCallToken, 4)}</span>
            <span className="text-stieglitz">
              {selectedOptionsMarket?.callToken.symbol}
            </span>
          </div>
          <div className="flex items-center space-x-[4px]">
            <span>{formatAmount(tokenBalances.readablePutToken, 4)}</span>
            <span className="text-stieglitz">
              {selectedOptionsMarket?.putToken.symbol}
            </span>
          </div>
        </div>
      </div>
      <Button
        size="small"
        className="w-full"
        onClick={buttonProps.onClick}
        disabled={buttonProps?.disabled || isLoading || allowancesLoading}
      >
        {buttonProps?.text}
      </Button>
    </div>
  );
};

export default LPRangeSelector;
