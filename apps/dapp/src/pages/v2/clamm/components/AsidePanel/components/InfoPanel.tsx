import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  encodeFunctionData,
  getAddress,
  Hex,
  parseAbi,
  parseUnits,
} from 'viem';

import { Button } from '@dopex-io/ui';
import axios from 'axios';
import {
  MULTI_CALL_FN_SIG,
  VARROCK_BASE_API_URL,
} from 'pages/v2/clamm/constants';
import { Address, useAccount, useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { DEFAULT_CHAIN_ID } from 'constants/env';

type ApprovalRequired = {
  address: Address;
  symbol: string;
  approvalTx: string;
};

type DepositTransaction = {
  to: Address;
  tokenAddress: Address;
  tokenAmount: string;
  tokenDecimals: number;
  tokenSymbol: string;
  txData: Hex;
};

type Props = {
  updateTokenBalances: () => Promise<void>;
};
const InfoPanel = ({ updateTokenBalances }: Props) => {
  const { isTrade, selectedOptionsPool } = useClammStore();
  const { selectedStrikes, setSelectedStrikesError } = useStrikesChainStore();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [transactions, setTransactions] = useState<
    Map<number, DepositTransaction>
  >(new Map());
  const [approvalsRequired, setApprovalsRequired] = useState<
    ApprovalRequired[]
  >([]);

  useEffect(() => {
    if (!selectedOptionsPool || !chain) return;
    const { callToken, putToken } = selectedOptionsPool;
    // if (!isTrade) {
    //   Array.from(selectedStrikes).forEach(([k, v]) => {
    //     const { strike, amount0 } = v;
    //     if (amount0 > 0) {
    //       axios
    //         .get(`${VARROCK_BASE_API_URL}/clamm/deposit`, {
    //           params: {
    //             chainId: chain.id,
    //             callToken: callToken.address,
    //             putToken: putToken.address,
    //             pool: '0x53b27D62963064134D60D095a526e1E72b74A5C4' as Address,
    //             handler:
    //               '0x0165878A594ca255338adfa4d48449f69242Eb8F' as Address,
    //             amount: amount0,
    //             tickLower: v.meta.tickLower,
    //             tickUpper: v.meta.tickUpper,
    //           },
    //         })
    //         .then(({ data }) => {
    //           if (data) {
    //             setTransactions((prev) => {
    //               const newMap = new Map(prev).set(k, data);
    //               return newMap;
    //             });
    //           }
    //         });
    //     }
    //   });
    // }
  }, [selectedStrikes, chain, isTrade, selectedOptionsPool]);

  const checkApprovals = useCallback(
    async () => {
      // if (!selectedOptionsPool || !chain || !userAddress) return;
      // setButtonLoading(true);
      // try {
      //   const { callToken, putToken } = selectedOptionsPool;
      //   const totalTokensAmountMapping = new Map<
      //     string,
      //     {
      //       key: number;
      //       amount: bigint;
      //       isCall: boolean;
      //       address: Address;
      //       approvalTx: Hex;
      //     }
      //   >();
      //   Array.from(selectedStrikes).forEach(([k, v]) => {
      //     const { tokenSymbol, isCall } = v;
      //     const current = totalTokensAmountMapping.get(tokenSymbol);
      //     if (!current) {
      //       totalTokensAmountMapping.set(tokenSymbol, {
      //         key: k,
      //         isCall,
      //         amount: parseUnits(
      //           v.amount0.toString(),
      //           isCall ? callToken.decimals : putToken.decimals,
      //         ),
      //         address: getAddress(isCall ? callToken.address : putToken.address),
      //         approvalTx: `0x${0}`,
      //       });
      //     } else {
      //       totalTokensAmountMapping.set(tokenSymbol, {
      //         ...current,
      //         amount:
      //           BigInt(current.amount) +
      //           parseUnits(
      //             v.amount0.toString(),
      //             isCall ? callToken.decimals : putToken.decimals,
      //           ),w
      //       });
      //     }
      //   });
      //   for await (const [k, v] of totalTokensAmountMapping) {
      //     const allowance = await axios
      //       .get(`${VARROCK_BASE_API_URL}/token/allowance`, {
      //         params: {
      //           // chainId: chain.id,
      //           token: v.address,
      //           account: userAddress,
      //           spender: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      //         },
      //       })
      //       .then(({ data }) => (data ? data.allowance : 0n));
      //     const allowanceBI = BigInt(allowance as string);
      //     console.log('KEY', v.key);
      //     if (v.amount === 0n) {
      //       setButtonDisabled(true);
      //       setSelectedStrikesError(v.key, {
      //         isError: true,
      //         message: 'Amount is required.',
      //       });
      //     }
      //     if (v.amount > allowanceBI) {
      //       const strike = selectedStrikes.get(v.key);
      //       if (strike) {
      //         setSelectedStrikesError(v.key, {
      //           isError: true,
      //           message: 'Approval is required.',
      //         });
      //       }
      //       const approvalTx = await axios
      //         .get(`${VARROCK_BASE_API_URL}/token/approve`, {
      //           params: {
      //             token: v.address,
      //             spender: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      //             amount: v.amount.toString(),
      //           },
      //         })
      //         .then(({ data }) => data.txData);
      //       const current = totalTokensAmountMapping.get(k);
      //       if (current) {
      //         totalTokensAmountMapping.set(k, {
      //           ...current,
      //           approvalTx: approvalTx,
      //         });
      //       }
      //     }
      //     // if(v.amount < allowanceBI ){
      //     //   setButtonDisabled(false);
      //     //   setSelectedStrikesError(v.key, {
      //     //     isError: false,
      //     //     message: '',
      //     //   });
      //     // }
      //   }
      //   setApprovalsRequired(
      //     Array.from(totalTokensAmountMapping)
      //       .map(([k, v]) => ({
      //         address: v.address,
      //         approvalTx: v.approvalTx,
      //         symbol: k,
      //       }))
      //       .filter(({ approvalTx }) => approvalTx !== '0x0'),
      //   );
      // } catch (err) {
      //   console.error(err);
      // }
      // setButtonLoading(false);
    },
    [
      // chain,
      // selectedOptionsPool,
      // selectedStrikes,
      // userAddress,
      // setSelectedStrikesError,
    ],
  );

  const handleApprove = useCallback(async () => {
    if (!userAddress || !walletClient) return;
    if (approvalsRequired.length > 0) {
      const { address, approvalTx } = approvalsRequired[0];
      const { publicClient } = wagmiConfig;

      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: address,
        data: approvalTx as Hex,
        type: 'legacy',
      });

      const hash = await walletClient.sendTransaction(request);
      const reciept = await publicClient.waitForTransactionReceipt({
        hash,
      });

      await checkApprovals();
    }
  }, [approvalsRequired, userAddress, walletClient, checkApprovals]);

  // For Approvals
  useEffect(() => {
    checkApprovals();
  }, [checkApprovals]);

  const handleDepositOrPurchase = useCallback(async () => {
    if (!userAddress || !walletClient) return;
    if (transactions.size === 0) return;

    const { publicClient } = wagmiConfig;

    const transactionsArray = Array.from(transactions);
    if (transactions.size > 1) {
      const to = transactionsArray[0][1].to;
      const encodedTxData = encodeFunctionData({
        abi: parseAbi(MULTI_CALL_FN_SIG),
        functionName: 'multicall',
        args: [transactionsArray.map(([_, v]) => v.txData)],
      });
      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: to,
        data: encodedTxData,
        type: 'legacy',
      });
      const hash = await walletClient.sendTransaction(request);
      const reciept = await publicClient.waitForTransactionReceipt({
        hash,
      });
    } else {
      const [_, v] = transactionsArray[0];
      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: v.to,
        data: v.txData,
        type: 'legacy',
      });
      const hash = await walletClient.sendTransaction(request);
      const reciept = await publicClient.waitForTransactionReceipt({
        hash,
      });
    }

    await checkApprovals();
  }, [userAddress, walletClient, transactions, checkApprovals]);

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
        onClick={
          approvalsRequired.length > 0 ? handleApprove : handleDepositOrPurchase
        }
        className=""
        // disabled={}
      >
        {approvalsRequired.length > 0
          ? `Approve ${approvalsRequired[0].symbol}`
          : isTrade
          ? 'Purchase'
          : 'Deposit'}
      </Button>
    </div>
  );
};

export default InfoPanel;
