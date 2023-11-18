import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BaseError, encodeFunctionData, Hex, parseAbi } from 'viem';

import { Button } from '@dopex-io/ui';
import toast, { LoaderIcon } from 'react-hot-toast';
import {
  Address,
  erc20ABI,
  useAccount,
  useNetwork,
  useWalletClient,
} from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useLoadingStates, {
  ASIDE_PANEL_BUTTON_KEY,
} from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import getTokenAllowance from 'utils/clamm/varrock/getTokenAllowance';

import { MULTI_CALL_FN_SIG } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

type Props = {
  updateTokenBalances: () => Promise<void>;
};

type ApprovedRequiredInfo = {
  tokenSymbol: string;
  tokenAddress: Address;
  amount: bigint;
  txData: Hex;
};
const InfoPanel = ({ updateTokenBalances }: Props) => {
  const { isLoading, setLoading } = useLoadingStates();
  const { isTrade, tokenBalances, selectedOptionsPool, addresses } =
    useClammStore();
  const { deposits, purchases, resetDeposits, resetPurchases } =
    useClammTransactionsStore();
  const { updateStrikes, reset } = useStrikesChainStore();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();

  const [approvalsRequired, setApprovalsRequired] = useState<
    ApprovedRequiredInfo[]
  >([]);

  const checkApproved = useCallback(async () => {
    if (!chain || !userAddress || !selectedOptionsPool || !addresses) return;
    const symbolToAmounts = new Map<string, bigint>();
    const symbolToAddress = new Map<string, Address>();
    if (!isTrade) {
      deposits.forEach(({ tokenSymbol, amount, tokenAddress }) => {
        symbolToAddress.set(tokenSymbol, tokenAddress);
        const curr = symbolToAmounts.get(tokenSymbol);
        if (!curr) {
          symbolToAmounts.set(tokenSymbol, amount);
        } else {
          symbolToAmounts.set(tokenSymbol, amount + curr);
        }
      });
    } else {
      purchases.forEach(({ premium, tokenSymbol, tokenAddress, error }) => {
        symbolToAddress.set(tokenSymbol, tokenAddress);
        const curr = symbolToAmounts.get(tokenSymbol);
        if (!curr) {
          if (!error) {
            symbolToAmounts.set(tokenSymbol, (premium * 134n) / 100n);
          }
        } else {
          if (!error) {
            symbolToAmounts.set(tokenSymbol, (premium * 134n) / 100n + curr);
          }
        }
      });
    }

    const spender = isTrade
      ? selectedOptionsPool.optionsPoolAddress
      : addresses.positionManager;

    const _approvals: ApprovedRequiredInfo[] = [];
    for await (const [k, v] of symbolToAmounts) {
      const tokenAddress = symbolToAddress.get(k)!;
      const allowance = await getTokenAllowance(
        chain.id,
        tokenAddress,
        userAddress,
        spender,
      );

      if (allowance < v) {
        _approvals.push({
          amount: v,
          tokenSymbol: k,
          tokenAddress: tokenAddress,
          txData: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'approve',
            args: [spender, (v * 10500n) / 10000n],
          }),
        });
      }
    }
    setApprovalsRequired(_approvals);
  }, [
    deposits,
    isTrade,
    chain,
    userAddress,
    purchases,
    selectedOptionsPool,
    addresses,
  ]);

  const handleDeposit = useCallback(async () => {
    if (!userAddress || !walletClient || isTrade) return;
    const { publicClient } = wagmiConfig;

    const depositsArray = Array.from(deposits);
    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    const loadingToastId = toast.loading('Opening wallet');
    try {
      if (depositsArray.length > 1) {
        if (depositsArray[0]) {
          const pm = depositsArray[0][1].positionManager;
          const encodedTxData = encodeFunctionData({
            abi: parseAbi([MULTI_CALL_FN_SIG]),
            functionName: 'multicall',
            args: [depositsArray.map(([_, v]) => v.txData)],
          });
          const request = await walletClient.prepareTransactionRequest({
            account: walletClient.account,
            to: pm,
            data: encodedTxData,
            type: 'legacy',
          });
          const hash = await walletClient.sendTransaction(request);
          const reciept = await publicClient.waitForTransactionReceipt({
            hash,
          });
        }
      } else {
        if (depositsArray[0]) {
          const pm = depositsArray[0][1].positionManager;
          const [_, v] = depositsArray[0];
          const request = await walletClient.prepareTransactionRequest({
            account: walletClient.account,
            to: pm,
            data: v.txData,
            type: 'legacy',
          });

          const hash = await walletClient.sendTransaction(request);
          const reciept = await publicClient.waitForTransactionReceipt({
            hash,
          });
        }
      }
      reset();
      resetDeposits();
      toast.success('Transaction sent');
    } catch (err) {
      const error = err as BaseError;
      toast.error(error.shortMessage);
      console.error(err);
    }
    toast.remove(loadingToastId);
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);

    await checkApproved();
    await updateTokenBalances();
    updateStrikes();
  }, [
    resetDeposits,
    reset,
    updateStrikes,
    userAddress,
    walletClient,
    deposits,
    isTrade,
    checkApproved,
    setLoading,
    updateTokenBalances,
  ]);

  const handlePurchase = useCallback(async () => {
    if (!userAddress || !walletClient || !isTrade) return;
    const { publicClient } = wagmiConfig;
    const purchasesArray = Array.from(purchases);
    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    const loadingToastId = toast.loading('Opening wallet');
    try {
      if (purchasesArray.length > 1 && purchasesArray[0]) {
        const optionsPool = purchasesArray[0][1].optionsPool;
        const encodedTxData = encodeFunctionData({
          abi: parseAbi([MULTI_CALL_FN_SIG]),
          functionName: 'multicall',
          args: [purchasesArray.map(([_, v]) => v.txData)],
        });
        const request = await walletClient.prepareTransactionRequest({
          account: walletClient.account,
          to: optionsPool,
          data: encodedTxData,
          type: 'legacy',
        });
        const hash = await walletClient.sendTransaction(request);
        const reciept = await publicClient.waitForTransactionReceipt({
          hash,
        });
        toast.success('Transaction Sent');
      } else {
        if (purchasesArray[0]) {
          const optionsPool = purchasesArray[0][1].optionsPool;
          const [_, v] = purchasesArray[0];
          const request = await walletClient.prepareTransactionRequest({
            account: walletClient.account,
            to: optionsPool,
            data: v.txData,
            type: 'legacy',
          });
          const hash = await walletClient.sendTransaction(request);
          const reciept = await publicClient.waitForTransactionReceipt({
            hash,
          });
          toast.success('Transaction Sent');
        }
      }
      resetPurchases();
      reset();
    } catch (err) {
      const error = err as BaseError;
      console.error(err);
      toast.error(error.shortMessage);
    }
    toast.remove(loadingToastId);
    await checkApproved();
    await updateTokenBalances();

    updateStrikes();
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  }, [
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
  ]);

  const handleApprove = useCallback(async () => {
    if (!userAddress || !walletClient) return;
    const { publicClient } = wagmiConfig;

    let nonce = await publicClient.getTransactionCount({
      address: userAddress,
    });

    const loadingToastId = toast.loading('Opening wallet');
    try {
      setLoading(ASIDE_PANEL_BUTTON_KEY, true);
      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: approvalsRequired[0].tokenAddress,
        data: approvalsRequired[0].txData,
        type: 'legacy',
      });
      const hash = await walletClient.sendTransaction(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      nonce++;

      toast.success('Transaction sent');
      setLoading(ASIDE_PANEL_BUTTON_KEY, false);
    } catch (err) {
      const error = err as BaseError;
      console.error(err);
      toast.error(error.shortMessage);
      setLoading(ASIDE_PANEL_BUTTON_KEY, false);
    }

    toast.remove(loadingToastId);
    await checkApproved();
  }, [userAddress, walletClient, approvalsRequired, checkApproved, setLoading]);

  const buttonProps = useMemo(() => {
    for (const approval of approvalsRequired) {
      if (
        approval.tokenSymbol.toLowerCase() ===
          tokenBalances.callTokenSymbol.toLowerCase() &&
        approval.amount > tokenBalances.callToken
      ) {
        return {
          disabled: true,
          text: `${approval.tokenSymbol} amount exceeds balance`,
        };
      }
      if (
        approval.tokenSymbol.toLowerCase() ===
          tokenBalances.putTokenSymbol.toLowerCase() &&
        approval.amount > tokenBalances.putToken
      ) {
        return {
          disabled: true,
          text: `${approval.tokenSymbol} amount exceeds balance`,
        };
      }
    }

    if (approvalsRequired.length > 0) {
      return {
        text: `Approve ${approvalsRequired[0].tokenSymbol}`,
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
    tokenBalances.putToken,
    tokenBalances.putTokenSymbol,
    tokenBalances.callToken,
    tokenBalances.callTokenSymbol,
    approvalsRequired,
    isTrade,
    handleApprove,
    handleDeposit,
    handlePurchase,
  ]);

  useEffect(() => {
    checkApproved();
  }, [checkApproved, deposits]);

  return (
    <div className="flex flex-col bg-umbra p-[12px] rounded-b-lg w-full space-y-[12px]">
      <Button
        onClick={buttonProps?.onClick}
        className="flex items-center justify-center"
        disabled={isLoading(ASIDE_PANEL_BUTTON_KEY) || buttonProps.disabled}
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
