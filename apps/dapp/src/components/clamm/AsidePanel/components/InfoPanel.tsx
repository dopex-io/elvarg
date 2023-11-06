import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { encodeFunctionData, Hex, parseAbi } from 'viem';

import { Button } from '@dopex-io/ui';
import { LoaderIcon } from 'react-hot-toast';
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
import { formatAmount } from 'utils/general';

import { MULTI_CALL_FN_SIG } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

type Props = {
  updateTokenBalances: () => Promise<void>;
};

type ApprovedRequiredInfo = {
  tokenSymbol: string;
  tokenAddress: Address;
  txData: Hex;
};
const InfoPanel = ({ updateTokenBalances }: Props) => {
  const { isLoading, setLoading } = useLoadingStates();
  const { isTrade, tokenBalances } = useClammStore();
  const { deposits, purchases } = useClammTransactionsStore();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();

  const [approvalsRequired, setApprovalsRequired] = useState<
    ApprovedRequiredInfo[]
  >([]);

  const checkApproved = useCallback(async () => {
    if (!chain || !userAddress) return;
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
      purchases.forEach(({ premium, tokenSymbol, tokenAddress }) => {
        symbolToAddress.set(tokenSymbol, tokenAddress);
        const curr = symbolToAmounts.get(tokenSymbol);
        if (!curr) {
          symbolToAmounts.set(tokenSymbol, premium);
        } else {
          symbolToAmounts.set(tokenSymbol, premium + curr);
        }
      });
    }

    const spender = isTrade
      ? '0x7d6BA9528A1449Fa944D81Ea16089D0db01F2A20'
      : '0x1e3d4725dB1062b88962bFAb8B2D31eAa8f63e45';

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
          tokenSymbol: k,
          tokenAddress: tokenAddress,
          txData: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'approve',
            args: [spender, v],
          }),
        });
      }
    }
    setApprovalsRequired(_approvals);
  }, [deposits, isTrade, chain, userAddress, purchases]);

  const handleDeposit = useCallback(async () => {
    if (!userAddress || !walletClient || isTrade) return;
    const { publicClient } = wagmiConfig;

    const depositsArray = Array.from(deposits);
    setLoading(ASIDE_PANEL_BUTTON_KEY, true);

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

    setLoading(ASIDE_PANEL_BUTTON_KEY, false);

    await checkApproved();
    await updateTokenBalances();
  }, [
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
      }
    }
    await checkApproved();
    await updateTokenBalances();
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  }, [
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
    for await (const approval of approvalsRequired) {
      try {
        setLoading(ASIDE_PANEL_BUTTON_KEY, true);
        const request = await walletClient.prepareTransactionRequest({
          account: walletClient.account,
          to: approval.tokenAddress,
          data: approval.txData,
          type: 'legacy',
        });
        const hash = await walletClient.sendTransaction(request);
        await publicClient.waitForTransactionReceipt({
          hash,
        });
        nonce++;
        setLoading(ASIDE_PANEL_BUTTON_KEY, false);
      } catch (err) {
        console.error(err);
        setLoading(ASIDE_PANEL_BUTTON_KEY, false);
      }
      await checkApproved();
    }
  }, [userAddress, walletClient, approvalsRequired, checkApproved, setLoading]);

  const buttonProps = useMemo(() => {
    if (approvalsRequired.length > 0) {
      return {
        text: `Approve ${approvalsRequired[0].tokenSymbol}`,
        onClick: handleApprove,
      };
    }
    return {
      text: isTrade ? 'Purchase' : 'Deposit',
      onClick: isTrade ? handlePurchase : handleDeposit,
    };
  }, [
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
      <div className="text-[13px] font-medium flex items-center justify-between">
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

      <Button
        onClick={buttonProps?.onClick}
        className="flex items-center justify-center"
        disabled={isLoading(ASIDE_PANEL_BUTTON_KEY)}
      >
        {isLoading(ASIDE_PANEL_BUTTON_KEY) ? (
          <LoaderIcon className="w-[18px] h-[18px] bg-primary text-white border border-white" />
        ) : (
          buttonProps?.text
        )}
      </Button>
    </div>
  );
};

export default InfoPanel;
