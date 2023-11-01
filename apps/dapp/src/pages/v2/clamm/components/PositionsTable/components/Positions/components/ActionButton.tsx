import React, { useCallback, useMemo } from 'react';
import { encodeFunctionData, parseAbi } from 'viem';

import { Button } from '@dopex-io/ui';
import { MULTI_CALL_FN_SIG } from 'pages/v2/clamm/constants';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import { DEFAULT_CHAIN_ID } from 'constants/env';

type Props = {
  selectedPositions: Map<number, any | null>;
  positionsTypeIndex: number;
};
const ActionButton = (props: Props) => {
  const { positionsTypeIndex, selectedPositions } = props;

  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();

  const handleAction = useCallback(async () => {
    if (!userAddress || !chain || !walletClient) return;
    const { publicClient } = wagmiConfig;

    const positionsArray = Array.from(selectedPositions);
    const positionManager = positionsArray[0][1].withdrawTx.to;

    const encodedTxData = encodeFunctionData({
      abi: parseAbi([MULTI_CALL_FN_SIG]),
      functionName: 'multicall',
      args: [positionsArray.map(([_, v]) => v.withdrawTx.txData)],
    });

    const request = await walletClient.prepareTransactionRequest({
      account: walletClient.account,
      to: positionManager,
      data: encodedTxData,
      type: 'legacy',
    });
    const hash = await walletClient.sendTransaction(request);
    const reciept = await publicClient.waitForTransactionReceipt({
      hash,
    });
  }, [chain, selectedPositions, userAddress, walletClient]);

  const buttonProps = useMemo(() => {
    const isBuyPositions = positionsTypeIndex === 0;
    const action = isBuyPositions ? 'Multi Exercise' : 'Multi Withdraw';
    return {
      buttonText: action,
      disabled: selectedPositions.size < 2,
    };
  }, [positionsTypeIndex, selectedPositions]);
  return (
    <Button
      size="small"
      variant={buttonProps.disabled ? 'text' : 'contained'}
      disabled={buttonProps.disabled}
      className="w-[200px] bg-carbon"
      onClick={handleAction}
    >
      {buttonProps.buttonText}
    </Button>
  );
};

export default ActionButton;
