import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BaseError,
  ContractFunctionExecutionError,
  encodeAbiParameters,
  encodeFunctionData,
  Hex,
  hexToBigInt,
  parseAbi,
  zeroAddress,
} from 'viem';

import { Button } from '@dopex-io/ui';
import { DopexV2PositionManager } from 'pages/clamm-v2/abi/DopexV2PositionManager';
import {
  getHandler,
  getHandlerPool,
  getHook,
  getPositionManagerAddress,
} from 'pages/clamm-v2/constants';
import toast, { LoaderIcon } from 'react-hot-toast';
import {
  Address,
  erc20ABI,
  useAccount,
  useConfig,
  useContractReads,
  useContractWrite,
  useNetwork,
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
import useUserBalance from 'hooks/useUserBalance';

import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import getTokenAllowance from 'utils/clamm/varrock/getTokenAllowance';

import { MULTI_CALL_FN_SIG } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

type Props = {
  updateTokenBalances: (...args: any) => Promise<any>;
};

type ApprovedRequiredInfo = {
  tokenSymbol: string;
  tokenAddress: Address;
  amount: bigint;
  txData: Hex;
};

const InfoPanel = ({ updateTokenBalances }: Props) => {
  const { publicClient } = useConfig();
  const { isLoading, setLoading } = useLoadingStates();
  const {
    tick,
    isTrade,
    tokenBalances,
    selectedOptionsMarket,
    addresses,
    markPrice,
  } = useClammStore();
  const { updateBuyPositions, updateLPPositions } = useClammPositions();
  const { deposits, purchases, resetDeposits, resetPurchases } =
    useClammTransactionsStore();
  const { updateStrikes, reset } = useStrikesChainStore();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();

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
          call: 0n,
          put: 0n,
        }
      : {
          call: Array.from(deposits).reduce(
            (prev, [_, { strike, amount }]) =>
              strike > markPrice ? amount : 0n + prev,
            0n,
          ),
          put: Array.from(deposits).reduce(
            (prev, [_, { strike, amount }]) =>
              strike < markPrice ? amount : 0n + prev,
            0n,
          ),
        };
  }, [deposits, isTrade, markPrice]);

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

  const checkApproved = useCallback(async () => {
    // if (!chain || !userAddress || !selectedOptionsMarket || !addresses) return;
    // const symbolToAmounts = new Map<string, bigint>();
    // const symbolToAddress = new Map<string, Address>();
    // if (!isTrade) {
    //   deposits.forEach(({ tokenSymbol, amount, tokenAddress }) => {
    //     symbolToAddress.set(tokenSymbol, tokenAddress);
    //     const curr = symbolToAmounts.get(tokenSymbol);
    //     if (!curr) {
    //       symbolToAmounts.set(tokenSymbol, amount);
    //     } else {
    //       symbolToAmounts.set(tokenSymbol, amount + curr);
    //     }
    //   });
    // } else {
    //   purchases.forEach(({ premium, tokenSymbol, tokenAddress, error }) => {
    //     symbolToAddress.set(tokenSymbol, tokenAddress);
    //     const curr = symbolToAmounts.get(tokenSymbol);
    //     if (!curr) {
    //       if (!error) {
    //         symbolToAmounts.set(tokenSymbol, (premium * 134n) / 100n);
    //       }
    //     } else {
    //       if (!error) {
    //         symbolToAmounts.set(tokenSymbol, (premium * 134n) / 100n + curr);
    //       }
    //     }
    //   });
    // }
    // const spender = isTrade
    //   ? selectedOptionsMarket?.address
    //   : addresses.positionManager;
    // const _approvals: ApprovedRequiredInfo[] = [];
    // for await (const [k, v] of symbolToAmounts) {
    //   const tokenAddress = symbolToAddress.get(k)!;
    //   const allowance = await getTokenAllowance(
    //     chain.id,
    //     tokenAddress,
    //     userAddress,
    //     spender,
    //   );
    //   if (allowance < v) {
    //     _approvals.push({
    //       amount: v,
    //       tokenSymbol: k,
    //       tokenAddress: tokenAddress,
    //       txData: encodeFunctionData({
    //         abi: erc20ABI,
    //         functionName: 'approve',
    //         args: [spender, (v * 10500n) / 10000n],
    //       }),
    //     });
    //   }
    // }
    // setApprovalsRequired(_approvals);
  }, [
    deposits,
    isTrade,
    chain,
    userAddress,
    purchases,
    selectedOptionsMarket,
    addresses,
  ]);

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
    const handlerAddress = getHandler('uniswap', chain.id);
    const pool = getHandlerPool(
      'uniswap',
      chain.id,
      selectedOptionsMarket.callToken.address,
      selectedOptionsMarket.putToken.address,
      500,
    );
    const hook = getHook(chain.id, '24HTTL');
    const { publicClient } = wagmiConfig;

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

      console.log(pool, hook, tickLower, tickUpper, liquidity);

      if (liquidity > 0n) {
        depositTxs.push(
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
                [pool, hook, tickLower, tickUpper, liquidity],
              ),
            ],
          }),
        );
      }
    });

    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    const loadingId = toast.loading('Opening wallet');
    await publicClient
      .simulateContract({
        account: walletClient.account.address,
        abi: DopexV2PositionManager,
        address: positionManagerAddress,
        functionName: 'multicall',
        args: [depositTxs],
      })
      .then(async ({ request }) => {
        await walletClient
          .writeContract(request)
          .then((hash) => {
            return hash;
          })
          .catch((err) => {
            if (err instanceof BaseError) {
              toast.error(err['shortMessage']);
            } else {
              toast.error(
                'Failed to deposit. Check console for more details on error',
              );
              console.error(err);
            }
          })
          .then(async (hash) => {
            if (hash) {
              await publicClient.waitForTransactionReceipt({
                hash,
              });
              updateTokenBalances();
              updateStrikes();
              updateLPPositions?.();
              resetDeposits();
              reset();
            }
            refetchAllowance();
          });
      })
      .catch((err) => {
        if (err instanceof BaseError) {
          toast.error(err['shortMessage']);
        } else {
          toast.error(
            'Failed to deposit. Check console for more details on error',
          );
        }
        console.error(err);
      });

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
    // checkEthBalance,
  ]);

  const handlePurchase = useCallback(async () => {
    // if (!userAddress || !walletClient || !isTrade) return;
    // const { publicClient } = wagmiConfig;
    // const purchasesArray = Array.from(purchases);
    // setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    // const loadingToastId = toast.loading('Opening wallet');
    // try {
    //   if (purchasesArray.length > 1 && purchasesArray[0]) {
    //     const optionsPool = purchasesArray[0][1].optionsPool;
    //     const encodedTxData = encodeFunctionData({
    //       abi: parseAbi([MULTI_CALL_FN_SIG]),
    //       functionName: 'multicall',
    //       args: [purchasesArray.map(([_, v]) => v.txData)],
    //     });
    //     const request = await walletClient.prepareTransactionRequest({
    //       account: walletClient.account,
    //       to: optionsPool,
    //       data: encodedTxData,
    //       type: 'legacy',
    //     });
    //     checkEthBalance(request);
    //     const hash = await walletClient.sendTransaction(request);
    //     const reciept = await publicClient.waitForTransactionReceipt({
    //       hash,
    //     });
    //     toast.success('Transaction Sent');
    //   } else {
    //     if (purchasesArray[0]) {
    //       const optionsPool = purchasesArray[0][1].optionsPool;
    //       const [_, v] = purchasesArray[0];
    //       const request = await walletClient.prepareTransactionRequest({
    //         account: walletClient.account,
    //         to: optionsPool,
    //         data: v.txData,
    //         type: 'legacy',
    //       });
    //       checkEthBalance(request);
    //       const hash = await walletClient.sendTransaction(request);
    //       const reciept = await publicClient.waitForTransactionReceipt({
    //         hash,
    //       });
    //       toast.success('Transaction Sent');
    //     }
    //   }
    //   resetPurchases();
    //   reset();
    // } catch (err) {
    //   const error = err as BaseError;
    //   console.error(err);
    //   toast.error(error.shortMessage);
    // }
    // toast.remove(loadingToastId);
    // await checkApproved();
    // await updateTokenBalances();
    // await updateBuyPositions?.();
    // updateStrikes();
    // setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  }, [
    updateBuyPositions,
    resetPurchases,
    reset,
    updateStrikes,
    isTrade,
    purchases,
    userAddress,
    walletClient,
    checkApproved,
    setLoading,
    updateTokenBalances,
    // checkEthBalance,
  ]);

  // const handleApprove = useCallback(async () => {
  //   if (!userAddress || !walletClient) return;
  //   const { publicClient } = wagmiConfig;

  //   let nonce = await publicClient.getTransactionCount({
  //     address: userAddress,
  //   });

  //   const loadingToastId = toast.loading('Opening wallet');
  //   try {
  //     setLoading(ASIDE_PANEL_BUTTON_KEY, true);
  //     const request = await walletClient.prepareTransactionRequest({
  //       account: walletClient.account,
  //       to: approvalsRequired[0].tokenAddress,
  //       data: approvalsRequired[0].txData,
  //       type: 'legacy',
  //     });

  //     checkEthBalance(request);

  //     const hash = await walletClient.sendTransaction(request);
  //     await publicClient.waitForTransactionReceipt({
  //       hash,
  //     });
  //     nonce++;

  //     toast.success('Transaction sent');
  //     setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  //   } catch (err) {
  //     const error = err as BaseError;
  //     console.error(err);
  //     toast.error(error.shortMessage);
  //     setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  //   }

  //   toast.remove(loadingToastId);
  //   await checkApproved();
  // }, [
  //   userAddress,
  //   walletClient,
  //   approvalsRequired,
  //   checkApproved,
  //   setLoading,
  //   checkEthBalance,
  // ]);

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
    if (totalTokensCost.call + totalTokensCost.put === 0n) {
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
          approvePutTokenLoading
        }
      >
        {isLoading(ASIDE_PANEL_BUTTON_KEY) ? (
          <LoaderIcon className="w-[18px] h-[18px] bg-primary" />
        ) : (
          buttonProps?.text
        )}
      </Button>
    </div>
  );
};

export default InfoPanel;
