import React, { useCallback, useMemo } from 'react';
import {
  BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  getAddress,
  Hex,
  hexToBigInt,
  maxUint256,
  zeroAddress,
} from 'viem';

import { Button } from '@dopex-io/ui';
import { DopexV2OptionMarket } from 'abis/clamm/DopexV2OptionMarket';
import DopexV2OptionMarketV2 from 'abis/clamm/DopexV2OptionMarketV2';
import DopexV2PositionManager from 'abis/clamm/DopexV2PositionManager';
import toast, { LoaderIcon } from 'react-hot-toast';
import {
  Address,
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useLoadingStates, {
  ASIDE_PANEL_BUTTON_KEY,
} from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

// import useUserBalance from 'hooks/useUserBalance';

import getHandler from 'utils/clamm/getHandler';
import getHandlerPool from 'utils/clamm/getHandlerPool';
import getHook from 'utils/clamm/getHook';
import getOptionMarketPairPools from 'utils/clamm/getOptionMarketPairPools';
import getPositionManagerAddress from 'utils/clamm/getPositionManagerAddress';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import { DEFAULT_CHAIN_ID } from 'constants/env';

type Props = {
  updateTokenBalances: (...args: any) => Promise<any>;
};

const InfoPanel = ({ updateTokenBalances }: Props) => {
  const { isLoading, setLoading } = useLoadingStates();
  const {
    isTrade,
    tokenBalances,
    selectedOptionsMarket,
    markPrice,
    selectedTTL,
    selectedAMM,
  } = useClammStore();
  const { updateBuyPositions, updateLPPositions } = useClammPositions();
  const { deposits, purchases, resetDeposits, resetPurchases } =
    useClammTransactionsStore();
  const { updateStrikes, reset, getCollateralAvailable } =
    useStrikesChainStore();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();

  // const { checkEthBalance } = useUserBalance();

  const positionManagerAddress = useMemo(() => {
    return getPositionManagerAddress(chain?.id ?? DEFAULT_CHAIN_ID) as Address;
  }, [chain?.id]);

  const spender = useMemo(() => {
    return isTrade
      ? selectedOptionsMarket?.address ?? zeroAddress
      : positionManagerAddress;
  }, [isTrade, positionManagerAddress, selectedOptionsMarket?.address]);

  const totalTokensCost = useMemo(() => {
    return isTrade
      ? {
          call: Array.from(purchases).reduce(
            (prev, [_, { premium, fees, strike }]) =>
              (strike > markPrice ? premium + fees : 0n) + prev,
            0n,
          ),
          put: Array.from(purchases).reduce(
            (prev, [_, { premium, fees, strike }]) =>
              (strike < markPrice ? premium + fees : 0n) + prev,
            0n,
          ),
        }
      : {
          call: Array.from(deposits).reduce(
            (prev, [_, { strike, amount }]) =>
              (strike > markPrice ? amount : 0n) + prev,
            0n,
          ),
          put: Array.from(deposits).reduce(
            (prev, [_, { strike, amount }]) =>
              (strike < markPrice ? amount : 0n) + prev,
            0n,
          ),
        };
  }, [deposits, isTrade, markPrice, purchases]);

  const { writeAsync: approveCallToken, isLoading: approveCallTokenLoading } =
    useContractWrite({
      abi: erc20ABI,
      address: selectedOptionsMarket?.callToken.address,
      functionName: 'approve',
      args: [spender, (totalTokensCost.call * 1001n) / 1000n],
    });

  const { writeAsync: approvePutToken, isLoading: approvePutTokenLoading } =
    useContractWrite({
      abi: erc20ABI,
      address: selectedOptionsMarket?.putToken.address,
      functionName: 'approve',
      args: [spender, (totalTokensCost.put * 1001n) / 1000n],
    });

  const {
    data: tokenAllowances,
    isLoading: allowancesLoading,
    refetch: refetchAllowance,
  } = useContractReads({
    contracts: [
      {
        abi: erc20ABI,
        address: selectedOptionsMarket?.callToken.address,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, spender ?? zeroAddress],
      },
      {
        abi: erc20ABI,
        address: selectedOptionsMarket?.putToken.address,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, spender ?? zeroAddress],
      },
    ],
  });

  const allowances = useMemo(() => {
    if (!tokenAllowances) {
      return {
        call: 0n,
        put: 0n,
      };
    }
    return {
      call: tokenAllowances[0].result
        ? (tokenAllowances[0].result as bigint)
        : 0n,
      put: tokenAllowances[1].result
        ? (tokenAllowances[1].result as bigint)
        : 0n,
    };
  }, [tokenAllowances]);

  const handleDeposit = useCallback(async () => {
    if (
      !userAddress ||
      !walletClient ||
      isTrade ||
      !selectedOptionsMarket ||
      !chain ||
      !walletClient
    )
      return;
    const depositTxs: Hex[] = [];
    const depositsArray = Array.from(deposits);
    const handlerAddress = selectedOptionsMarket.deprecated
      ? '0xe11d346757d052214686bcbc860c94363afb4a9a'
      : getHandler(selectedAMM, chain.id);
    const pool = getHandlerPool({
      callSymbol: selectedOptionsMarket.callToken.symbol,
      chainId: chain.id,
      name: selectedAMM.toLowerCase(),
      putSymbol: selectedOptionsMarket.putToken.symbol,
    });
    const hook = getHook(chain.id, '24HTTL');

    if (!handlerAddress || !pool || !hook) return;

    depositsArray.forEach(([_, { amount, strike, tickLower, tickUpper }]) => {
      let isCall = strike > markPrice;

      let token0IsCallToken =
        hexToBigInt(selectedOptionsMarket.callToken.address) <
        hexToBigInt(selectedOptionsMarket.putToken.address);

      let token0 = token0IsCallToken
        ? selectedOptionsMarket.callToken.address
        : selectedOptionsMarket.putToken.address;

      let tokenInContext = isCall
        ? selectedOptionsMarket.callToken.address
        : selectedOptionsMarket.putToken.address;

      const getLiquidity =
        hexToBigInt(tokenInContext) === hexToBigInt(token0)
          ? getLiquidityForAmount0
          : getLiquidityForAmount1;

      let liquidity = getLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        amount,
      );

      if (liquidity > 0n) {
        depositTxs.push(
          encodeFunctionData({
            abi: DopexV2PositionManager,
            functionName: 'mintPosition',
            args: [
              handlerAddress,
              selectedOptionsMarket.deprecated
                ? encodeAbiParameters(
                    [
                      { type: 'address' },
                      { type: 'int24' },
                      { type: 'int24' },
                      { type: 'uint128' },
                    ],
                    [pool, tickLower, tickUpper, liquidity],
                  )
                : encodeAbiParameters(
                    [
                      { type: 'address' },
                      { type: 'address' },
                      { type: 'int24' },
                      { type: 'int24' },
                      { type: 'uint128' },
                    ],
                    [pool, hook, tickLower, tickUpper, liquidity],
                  ),
            ],
          }),
        );
      }
    });

    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    const loadingId = toast.loading('Opening wallet');

    try {
      const { request } = await publicClient.simulateContract({
        account: walletClient.account.address,
        abi: DopexV2PositionManager,
        address: positionManagerAddress,
        functionName: 'multicall',
        args: [depositTxs],
      });

      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({ hash });

      updateTokenBalances();
      updateStrikes();
      updateLPPositions?.();
      resetDeposits();
      reset();
      refetchAllowance();
    } catch (err) {
      if (err instanceof BaseError) {
        toast.error(err['shortMessage']);
      } else {
        toast.error(
          'Failed to deposit. Check console for more details on error',
        );
      }
      console.error(err);
    }

    toast.remove(loadingId);
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  }, [
    markPrice,
    chain,
    positionManagerAddress,
    refetchAllowance,
    selectedOptionsMarket,
    updateLPPositions,
    resetDeposits,
    reset,
    updateStrikes,
    userAddress,
    walletClient,
    deposits,
    isTrade,
    setLoading,
    updateTokenBalances,
    selectedAMM,
    publicClient,
    // checkEthBalance,
  ]);

  const handlePurchase = useCallback(async () => {
    if (
      !userAddress ||
      !walletClient ||
      !isTrade ||
      !selectedOptionsMarket ||
      !chain ||
      !walletClient
    )
      return;

    setLoading(ASIDE_PANEL_BUTTON_KEY, true);

    const purchasesTx: Hex[] = [];
    const purchasesArray = Array.from(purchases);
    const { publicClient } = wagmiConfig;

    purchasesArray.forEach(
      ([_, { collateralRequired, strike, tickLower, tickUpper }]) => {
        const liquidityData = getCollateralAvailable(strike.toString());
        const opTicks = [];
        let isCall = strike > markPrice;
        let token0IsCallToken =
          hexToBigInt(selectedOptionsMarket.callToken.address) <
          hexToBigInt(selectedOptionsMarket.putToken.address);

        let token0 = token0IsCallToken
          ? selectedOptionsMarket.callToken.address
          : selectedOptionsMarket.putToken.address;

        let tokenInContext = isCall
          ? selectedOptionsMarket.callToken.address
          : selectedOptionsMarket.putToken.address;

        const getLiquidity =
          hexToBigInt(tokenInContext) === hexToBigInt(token0)
            ? getLiquidityForAmount0
            : getLiquidityForAmount1;

        let liquidityRequired =
          getLiquidity(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            collateralRequired,
          ) - 1n;

        let indexOfHandlerWithEnough = -1;
        liquidityData.forEach(({ availableLiquidity }, index) => {
          if (availableLiquidity >= liquidityRequired) {
            indexOfHandlerWithEnough = index;
          }
        });

        let liquidityCumulative = 0n;

        if (indexOfHandlerWithEnough === -1) {
          for (let i = 0; i < liquidityData.length; i++) {
            const { availableLiquidity, pool, handler, hook } =
              liquidityData[i];
            const currentLiqRequired = liquidityRequired - liquidityCumulative;
            if (availableLiquidity === 0n) continue;
            if (liquidityCumulative === liquidityRequired) break;
            if (availableLiquidity >= currentLiqRequired) {
              opTicks.push({
                _handler: getAddress(handler),
                pool: getAddress(pool),
                hook: getAddress(hook),
                tickLower,
                tickUpper,
                liquidityToUse: currentLiqRequired,
              });
            } else {
              opTicks.push({
                _handler: getAddress(handler),
                pool: getAddress(pool),
                hook: getAddress(hook),
                tickLower,
                tickUpper,
                liquidityToUse: availableLiquidity,
              });
              liquidityCumulative += availableLiquidity;
            }
          }
        } else {
          const { hook } = liquidityData[indexOfHandlerWithEnough];

          selectedOptionsMarket.deprecated
            ? opTicks.push({
                _handler: getAddress(
                  liquidityData[indexOfHandlerWithEnough].handler,
                ),
                pool: getAddress(liquidityData[indexOfHandlerWithEnough].pool),
                tickLower,
                tickUpper,
                liquidityToUse: liquidityRequired,
              })
            : opTicks.push({
                _handler: getAddress(
                  liquidityData[indexOfHandlerWithEnough].handler,
                ),
                pool: getAddress(liquidityData[indexOfHandlerWithEnough].pool),
                hook: getAddress(hook),
                tickLower,
                tickUpper,
                liquidityToUse: liquidityRequired,
              });
        }

        purchasesTx.push(
          encodeFunctionData({
            abi: selectedOptionsMarket.deprecated
              ? DopexV2OptionMarket
              : DopexV2OptionMarketV2,
            functionName: 'mintOption',
            args: [
              {
                optionTicks: opTicks,
                tickLower,
                tickUpper,
                ttl: BigInt(selectedTTL),
                isCall,
                maxCostAllowance: maxUint256,
              },
            ],
          }),
        );
      },
    );

    const loadingId = toast.loading('Opening wallet');

    try {
      const { request } = await publicClient.simulateContract({
        account: walletClient.account,
        abi: DopexV2OptionMarketV2,
        functionName: 'multicall',
        address: selectedOptionsMarket.address,
        args: [purchasesTx],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      resetPurchases();
      reset();
    } catch (err) {
      if (err instanceof BaseError) {
        toast.error(err['shortMessage']);
      } else {
        toast.error(
          'Failed to deposit. Check console for more details on error',
        );
      }
      console.error(err);
    }

    await updateTokenBalances();
    await updateBuyPositions?.();
    await updateStrikes();
    await refetchAllowance();

    toast.remove(loadingId);
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  }, [
    getCollateralAvailable,
    markPrice,
    selectedTTL,
    refetchAllowance,
    updateBuyPositions,
    resetPurchases,
    reset,
    updateStrikes,
    isTrade,
    purchases,
    userAddress,
    walletClient,
    setLoading,
    updateTokenBalances,
    chain,
    selectedOptionsMarket,
    // checkEthBalance,
  ]);

  const handleApprove = useCallback(async () => {
    if (allowances.call < totalTokensCost.call) {
      await approveCallToken()
        .then(() => refetchAllowance())
        .catch((err) => {
          if (err instanceof BaseError) {
            toast.error(err['shortMessage']);
          } else {
            toast.error('Failed to approve');
            console.error(err);
          }
        });
    }
    if (allowances.put < totalTokensCost.put) {
      await approvePutToken()
        .then(() => refetchAllowance())
        .catch((err) => {
          if (err instanceof BaseError) {
            toast.error(err['shortMessage']);
          } else {
            toast.error('Failed to approve');
            console.error(err);
          }
        });
    }
  }, [
    allowances.call,
    allowances.put,
    approveCallToken,
    approvePutToken,
    refetchAllowance,
    totalTokensCost.call,
    totalTokensCost.put,
  ]);

  const buttonProps = useMemo(() => {
    if (!isTrade && totalTokensCost.call + totalTokensCost.put === 0n) {
      return {
        text: `Enter deposit amounts`,
        disabled: true,
        onClick: () => {},
      };
    }

    if (totalTokensCost.call > tokenBalances.callToken) {
      return {
        text: `Insufficient ${selectedOptionsMarket?.callToken.symbol}`,
        disabled: true,
        onClick: () => {},
      };
    }

    if (totalTokensCost.put > tokenBalances.putToken) {
      return {
        text: `Insufficient ${selectedOptionsMarket?.putToken.symbol}`,
        disabled: true,
        onClick: () => {},
      };
    }

    if (allowances.call < totalTokensCost.call) {
      return {
        text: `Approve ${selectedOptionsMarket?.callToken.symbol}`,
        disabled: false,
        onClick: handleApprove,
      };
    }

    if (allowances.put < totalTokensCost.put) {
      return {
        text: `Approve ${selectedOptionsMarket?.putToken.symbol}`,
        disabled: false,
        onClick: handleApprove,
      };
    }

    return {
      text: isTrade ? 'Purchase' : 'Deposit',
      disabled: false,
      onClick: isTrade ? handlePurchase : handleDeposit,
    };
  }, [
    allowances.call,
    allowances.put,
    selectedOptionsMarket?.callToken.symbol,
    selectedOptionsMarket?.putToken.symbol,
    totalTokensCost.put,
    totalTokensCost.call,
    tokenBalances.putToken,
    tokenBalances.callToken,
    isTrade,
    handleApprove,
    handleDeposit,
    handlePurchase,
  ]);

  return (
    <div className="flex flex-col bg-umbra p-[12px] rounded-b-lg w-full space-y-[12px]">
      <Button
        onClick={buttonProps?.onClick}
        className="flex items-center justify-center"
        disabled={
          isLoading(ASIDE_PANEL_BUTTON_KEY) ||
          buttonProps.disabled ||
          allowancesLoading ||
          approveCallTokenLoading ||
          approvePutTokenLoading ||
          selectedOptionsMarket?.deprecated ||
          isTrade
            ? purchases.size === 0
            : deposits.size === 0
        }
      >
        {selectedOptionsMarket?.deprecated ? (
          'Option Market Deprecated'
        ) : isLoading(ASIDE_PANEL_BUTTON_KEY) ? (
          <LoaderIcon className="w-[18px] h-[18px] bg-primary" />
        ) : (
          buttonProps?.text
        )}
      </Button>
    </div>
  );
};

export default InfoPanel;
