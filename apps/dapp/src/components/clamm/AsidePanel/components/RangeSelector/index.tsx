import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  Hex,
  hexToBigInt,
  parseUnits,
  zeroAddress,
} from 'viem';

import { Button } from '@dopex-io/ui';
import { DopexV2PositionManager } from 'pages/clamm-v2/abi/DopexV2PositionManager';
import { UniswapV3Pool } from 'pages/clamm-v2/abi/UniswapV3Pool';
import {
  getHandler,
  getPositionManagerAddress,
} from 'pages/clamm-v2/constants';
import { Bar, BarChart, Cell, Rectangle, Tooltip } from 'recharts';
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
} from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import RangeSelectorSlider from 'components/clamm/StrikesChain/components/FilterSettings/components/RangeSelector/components/Slider';

import generateStrikes from 'utils/clamm/generateStrikes';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
  getLiquidityForAmounts,
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
  const { strikesChain, updateStrikes } = useStrikesChainStore();
  const [lowerLimitInputStrike, setLowerLimitInputStrike] = useState('');
  const [upperLimitInputStrike, setUpperLimitInputStrike] = useState('');
  const [putAmount, setPutAmount] = useState('');
  const [callAmount, setCallAmount] = useState('');
  const [selection, setSelection] = useState<number[]>([]);
  const [depositTxs, setDepositTxs] = useState<Hex[]>([]);

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
      callAmount,
      selectedOptionsMarket?.callToken.decimals ?? 18,
    );
  }, [callAmount, selectedOptionsMarket?.callToken.decimals]);

  const putDepositAmountBigInt = useMemo(() => {
    return parseUnits(
      putAmount,
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
      approveCallTokenLoading || approvePutTokenLoading || allowancesLoading
    );
  }, [approveCallTokenLoading, approvePutTokenLoading, allowancesLoading]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const strike = payload[0].payload.strike;
      const totalLiquidity = payload[0].payload.liquidity;
      const availableLiquidity = payload[1].payload.availableLiquidity;

      return (
        <div className="custom-tooltip flex flex-col text-[10px] border border-carbon w-full h-full bg-umbra p-[4px]">
          <p className="flex items-center space-x-[4px]">
            <span className="text-stieglitz">Strike:</span>
            <span>{formatAmount(strike, 4)}</span>
          </p>
          <p className="flex items-center space-x-[4px]">
            <span className="text-stieglitz">Total Liquidity:</span>
            <span>{formatAmount(totalLiquidity, 4)}</span>
          </p>
          <p className="flex items-center space-x-[4px]">
            <span className="text-stieglitz">Available Liquidity:</span>
            <span>{formatAmount(availableLiquidity, 4)}</span>
          </p>
        </div>
      );
    }

    return null;
  };

  const existingStrikes = useMemo(() => {
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

  const putStrikesSelected = useMemo(() => {
    return existingStrikes.filter(
      ({ strike }) =>
        strike < markPrice && strike > Number(lowerLimitInputStrike),
    );
  }, [existingStrikes, lowerLimitInputStrike, markPrice]);

  const calltrikesSelected = useMemo(() => {
    return existingStrikes.filter(
      ({ strike }) => strike > markPrice && strike < Number(upperLimitStrike),
    );
  }, [existingStrikes, upperLimitStrike, markPrice]);

  const setSelectedStrikes = (value: number[]) => {
    setSelection(value);
    setLowerLimitInputStrike(lowerLimitStrike.toString());
    setUpperLimitInputStrike(upperLimitStrike.toString());
  };

  const lowerLimitStrikes = useMemo(() => {
    return existingStrikes
      .filter(({ strike }) => strike < markPrice)
      .sort((a, b) => a.strike - b.strike);
  }, [markPrice, existingStrikes]);

  const upperLimitStrikes = useMemo(() => {
    return existingStrikes
      .filter(({ strike }) => strike > markPrice)
      .sort((a, b) => a.strike - b.strike);
  }, [markPrice, existingStrikes]);

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
    // const strike = Number(lowerLimitInputStrike);
    // if (lowerLimitStrikes.length === 0) {
    //   return;
    // }
    // let closestNumber = lowerLimitStrikes[0].strike;
    // let closestDifference = Math.abs(strike - closestNumber);
    // for (let i = 1; i < lowerLimitStrikes.length; i++) {
    //   const currentDifference = Math.abs(strike - lowerLimitStrikes[i].strike);
    //   if (currentDifference < closestDifference) {
    //     closestNumber = lowerLimitStrikes[i].strike;
    //     closestDifference = currentDifference;
    //   }
    // }
    // setLowerLimitInputStrike(closestNumber.toFixed(4));
    // return closestNumber;
  }, [lowerLimitInputStrike, lowerLimitStrikes]);

  useEffect(() => {
    if (generatedStrikes.length > 0) {
      setSelection([0, generatedStrikes.length - 1]);
    }
  }, [generatedStrikes.length]);

  const { writeAsync: deposit } = useContractWrite({
    abi: DopexV2PositionManager,
    address: positionManagerAddress,
    functionName: 'multicall',
    args: [depositTxs],
  });

  const generateDepositTx = useCallback(
    () => {
      // if (
      //   !allowances ||
      //   !selectedOptionsMarket ||
      //   callDepositAmountBigInt === 0n ||
      //   putDepositAmountBigInt === 0n
      // ) {
      //   console.log('RETURNED 1');
      //   return [];
      // }
      // const handlerAddress = getHandler('uniswap', chain?.id ?? DEFAULT_CHAIN_ID);
      // if (!handlerAddress) {
      //   console.log('RETURN 2');
      //   return [];
      // }
      // const uniswapV3Hook: Address = '0x8c30c7F03421D2C9A0354e93c23014BF6C465a79';
      // const selectedStrikes = existingStrikes.filter(({ strike }) => {
      //   return strike > lowerLimitStrike && strike < upperLimitStrike;
      // });
      // const token0Len =
      //   hexToBigInt(selectedOptionsMarket?.callToken.address) >
      //   hexToBigInt(selectedOptionsMarket?.putToken.address)
      //     ? BigInt(calltrikesSelected.length.toFixed(0))
      //     : BigInt(putStrikesSelected.length.toFixed(0));
      // const token1Len =
      //   hexToBigInt(selectedOptionsMarket?.callToken.address) >
      //   hexToBigInt(selectedOptionsMarket?.putToken.address)
      //     ? BigInt(calltrikesSelected.length.toFixed(0))
      //     : BigInt(putStrikesSelected.length.toFixed(0));
      // const amount0 =
      //   token0Len === 0n
      //     ? 0n
      //     : (hexToBigInt(selectedOptionsMarket?.callToken.address) <
      //       hexToBigInt(selectedOptionsMarket?.putToken.address)
      //         ? callDepositAmountBigInt
      //         : putDepositAmountBigInt) / token0Len;
      // const amount1 =
      //   token1Len === 0n
      //     ? 0n
      //     : (hexToBigInt(selectedOptionsMarket?.callToken.address) >
      //       hexToBigInt(selectedOptionsMarket?.putToken.address)
      //         ? callDepositAmountBigInt
      //         : putDepositAmountBigInt) / token1Len;
      // const _depositsTx: Hex[] = [];
      // console.log('PRIME POOL', selectedOptionsMarket.primePool);
      // console.log('AMOUNT OF STRIKES TOKEN 0 AND TOKEN 1', token0Len, token1Len);
      // for (const { tickLower, tickUpper } of selectedStrikes) {
      //   let liquidity = 0n;
      //   if (tickLower < tick && tickUpper < tick) {
      //     console.log('AMOUNT 0', amount0);
      //     liquidity = getLiquidityForAmount0(
      //       getSqrtRatioAtTick(BigInt(tickLower)),
      //       getSqrtRatioAtTick(BigInt(tickUpper)),
      //       amount0,
      //     );
      //   }
      //   if (tickUpper > tick && tickLower > tick) {
      //     console.log('AMOUNT 1', amount1);
      //     liquidity = getLiquidityForAmount1(
      //       getSqrtRatioAtTick(BigInt(tickLower)),
      //       getSqrtRatioAtTick(BigInt(tickUpper)),
      //       amount1,
      //     );
      //   }
      //   if (liquidity > 0n) {
      //     _depositsTx.push(
      //       encodeFunctionData({
      //         abi: DopexV2PositionManager,
      //         functionName: 'mintPosition',
      //         args: [
      //           handlerAddress,
      //           encodeAbiParameters(
      //             [
      //               { type: 'address' },
      //               { type: 'address' },
      //               { type: 'int24' },
      //               { type: 'int24' },
      //               { type: 'uint128' },
      //             ],
      //             [
      //               selectedOptionsMarket.primePool,
      //               uniswapV3Hook,
      //               tickLower,
      //               tickUpper,
      //               liquidity,
      //             ],
      //           ),
      //         ],
      //       }),
      //     );
      //   }
      // }
      // deposit({
      //   args: [_depositsTx],
      // });
    },
    [
      // deposit,
      // tick,
      // chain?.id,
      // existingStrikes,
      // lowerLimitStrike,
      // upperLimitStrike,
      // allowances,
      // callDepositAmountBigInt,
      // putDepositAmountBigInt,
      // selectedOptionsMarket,
      // calltrikesSelected.length,
      // putStrikesSelected.length,
    ],
  );

  const buttonProps = useMemo(() => {
    console.log('UNLIMITED LOADINGS!');
    let onClick = deposit;
    let text = 'Deposit';
    let disabled = false;

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
        onClick: approveCallToken,
        text: `Approve ${tokenBalances.callTokenSymbol}`,
        disabled: false,
      };
    }
    if (allowanceExceeded.put) {
      return {
        onClick: approvePutToken,
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
    upperLimitStrike,
    lowerLimitStrike,
    markPrice,
    deposit,
    approvePutToken,
    allowanceExceeded.put,
    allowanceExceeded.call,
    approveCallToken,
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
        <span className="text-stieglitz">Range Selector</span>
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
          <BarChart width={338} height={100} data={existingStrikes}>
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="availableLiquidityBarHeight"
              stackId={'a'}
              shape={<Rectangle />}
            >
              {existingStrikes.map(({ strike }, index) => {
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
              {existingStrikes.map(({ strike }, index) => {
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
              const strike = checkLowerLimitStrike();
              console.log('LOWER STRIKE', strike);
              // setSelectedStrikeIndicies((prev) => [
              //   getStrikesBarGroupindex(strike ?? 0),
              //   prev[1],
              // ]);
            }}
            onSubmitCallback={(e) => {
              if (e.code === 'Enter') {
                const strike = checkLowerLimitStrike();
                console.log('LOWER STRIKE', strike);

                // setSelectedStrikeIndicies((prev) => [
                //   getStrikesBarGroupindex(strike ?? 0),
                //   prev[1],
                // ]);
              }
            }}
            placeHolder="0"
            onChangeInput={(e) => {
              setLowerLimitInputStrike(e.target.value);
            }}
            label="Lower limit Strike"
          />
        </div>
        <div className="w-full flex space-y-[4px]">
          <StrikeInput
            inputAmount={upperLimitInputStrike}
            onBlurCallback={(e) => {
              const strike = checkUpperLimitStrike();
              console.log('UPPER STRIKE', strike);
              // setSelectedStrikeIndicies((prev) => [
              //   prev[0],
              //   getStrikesBarGroupindex(strike ?? 0),
              // ]);
            }}
            onSubmitCallback={(e) => {
              if (e.code === 'Enter') {
                const strike = checkUpperLimitStrike();
                console.log('UPPER STRIKE', strike);

                // setSelectedStrikeIndicies((prev) => [
                //   prev[0],
                //   getStrikesBarGroupindex(strike ?? 0),
                // ]);
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
        // @ts-ignore
        onClick={() => {
          if (buttonProps.text === 'Deposit') {
            generateDepositTx();
            updateStrikes();
          } else {
            buttonProps.onClick();
            refetchAllowance();
          }
        }}
        disabled={buttonProps?.disabled || isLoading}
      >
        {buttonProps?.text}
      </Button>
    </div>
  );
};

export default LPRangeSelector;
