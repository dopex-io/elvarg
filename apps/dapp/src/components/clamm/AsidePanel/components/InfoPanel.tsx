import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { encodeFunctionData, Hex, parseAbi } from 'viem';

import { Button } from '@dopex-io/ui';
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
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import getTokenAllowance from 'utils/clamm/varrock/getTokenAllowance';

import { MULTI_CALL_FN_SIG } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

type Props = {
  updateTokenBalances: () => Promise<void>;
};
const InfoPanel = ({ updateTokenBalances }: Props) => {
  const { isTrade, selectedOptionsPool } = useClammStore();
  const { selectedStrikes, setSelectedStrikesError } = useStrikesChainStore();
  const { deposits, purchases } = useClammTransactionsStore();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  type ApprovedRequiredInfo = {
    tokenSymbol: string;
    tokenAddress: Address;
    txData: Hex;
  };
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
      ? '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
      : '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

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

    await checkApproved();
  }, [userAddress, walletClient, deposits, isTrade, checkApproved]);

  const handlePurchase = useCallback(async () => {
    if (!userAddress || !walletClient || !isTrade) return;
    const { publicClient } = wagmiConfig;
    const purchasesArray = Array.from(purchases);
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
  }, [isTrade, purchases, userAddress, walletClient, checkApproved]);

  const handleApprove = useCallback(async () => {
    if (!userAddress || !walletClient) return;
    const { publicClient } = wagmiConfig;

    for await (const approval of approvalsRequired) {
      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: approval.tokenAddress,
        data: approval.txData,
        type: 'legacy',
      });
      const hash = await walletClient.sendTransaction(request);
      const reciept = await publicClient.waitForTransactionReceipt({
        hash,
      });
      await checkApproved();
    }
  }, [userAddress, walletClient, approvalsRequired, checkApproved]);

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
    <div className="flex flex-col bg-umbra p-[12px] rounded-lg w-full space-y-[12px]">
      <div className="text-sm font-medium flex items-center justify-between">
        <span className="text-stieglitz">
          {isTrade ? 'Total Cost' : 'Total Deposit'}
        </span>{' '}
        <span>20m</span>
      </div>
      <div className="text-sm font-medium flex items-center justify-between">
        <span className="text-stieglitz">Balance</span> <span>20m</span>
      </div>
      <Button
        onClick={buttonProps?.onClick}
        className="animte-pulse animate-bg"
        // disabled={}
      >
        {buttonProps?.text}
      </Button>
    </div>
  );
};

export default InfoPanel;
