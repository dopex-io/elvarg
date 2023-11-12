import React, { useCallback, useEffect, useState } from 'react';
import { Address, BaseError, ContractFunctionExecutionError, Hex } from 'viem';

import { Button, Disclosure, Transition } from '@dopex-io/ui';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import cx from 'classnames';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammStore from 'hooks/clamm/useClammStore';

import getAutoExercisers, {
  Delegators,
} from 'utils/clamm/varrock/getAutoExercisers';

import { DEFAULT_CHAIN_ID } from 'constants/env';

const AutoExercisers = () => {
  const { selectedOptionsPool } = useClammStore();
  const [exercisers, setAutoExercisers] = useState<Delegators[]>([]);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });

  const updateDelegators = useCallback(async () => {
    if (!selectedOptionsPool || !address) return;
    const { optionsPoolAddress } = selectedOptionsPool;
    setLoading(true);
    getAutoExercisers({
      account: address,
      optionMarket: optionsPoolAddress,
    }).then((exercisers) => setAutoExercisers(exercisers));
    setLoading(false);
  }, [address, selectedOptionsPool]);

  useEffect(() => {
    updateDelegators();
  }, [updateDelegators]);

  const handleClick = useCallback(
    async ({ txData, to }: { txData: Hex; to: Address }) => {
      if (!address || !walletClient) return;
      const { publicClient } = wagmiConfig;
      let toastLoadingId = toast.loading('Opening wallet');
      try {
        const request = await walletClient.prepareTransactionRequest({
          account: walletClient.account,
          to: to,
          data: txData,
          type: 'legacy',
        });
        const hash = await walletClient.sendTransaction(request);
        const reciept = await publicClient.waitForTransactionReceipt({
          hash,
        });
        await updateDelegators();

        toast.success('Transaction submitted');
        toast.remove(toastLoadingId);
      } catch (err) {
        const error = err as BaseError;
        toast.remove(toastLoadingId);
        toast.error(error.shortMessage);
      }
    },
    [address, walletClient, updateDelegators],
  );

  return (
    <div className="w-full h-fit bg-umbra p-[12px] space-y-[10px]">
      <div className="text-stieglitz font-medium text-[13px] w-full flex items-center justify-between">
        <span>Auto Exercisers</span>
        {loading ? <LoaderIcon className="w-[18px] h-[18px]" /> : null}
      </div>
      <div className="text-stieglitz font-medium text-[13px] ">
        {exercisers.map(
          ({ approveTxData, approved, name, revokeApproveTxData }, index) => (
            <div
              key={index}
              className="w-full flex items-center justify-between"
            >
              <div className="flex flex-col space-y-[4px] flex-1">
                <span className="text-white">
                  {name.charAt(0) +
                    name.slice(1).replaceAll('-', ' ').toLowerCase()}
                </span>
                <span className="text-[10px]">
                  Options are automatically exercised 5 minutes before expiry.
                </span>
              </div>
              <div className="flex-[0.35] flex items-center justify-end">
                <Button
                  size="xsmall"
                  variant={!approved ? 'contained' : 'text'}
                  disabled={approved}
                  onClick={() => handleClick(approveTxData)}
                >
                  <span
                    className={cx(
                      'text-[13px]',
                      approved ? 'text-stieglitz' : 'text-white',
                    )}
                  >
                    {!approved ? 'Enable' : 'Enabled'}
                  </span>
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default AutoExercisers;
