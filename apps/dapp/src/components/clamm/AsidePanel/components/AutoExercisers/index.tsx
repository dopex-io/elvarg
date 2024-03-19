import { useMemo } from 'react';
import { zeroAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import DopexV2OptionMarket from 'abis/clamm/DopexV2OptionMarketV2';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { cn } from 'utils/general';

import { AUTO_EXERCISER_TIME_BASED } from 'constants/clamm';

const AutoExercisers = () => {
  const { selectedOptionsMarket } = useClammStore();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const autoExerciserAddress = useMemo(() => {
    if (!chain) return zeroAddress;
    const autoExercise = AUTO_EXERCISER_TIME_BASED[chain.id];
    if (!autoExercise) return zeroAddress;
    return autoExercise;
  }, [chain]);

  const { data: isDelegatorApproved, refetch } = useContractRead({
    abi: DopexV2OptionMarket,
    functionName: 'exerciseDelegator',
    address: selectedOptionsMarket?.address,
    args: [address || zeroAddress, autoExerciserAddress],
  });

  const { writeAsync: approveDelegate, isLoading: approveLoading } =
    useContractWrite({
      abi: DopexV2OptionMarket,
      functionName: 'updateExerciseDelegate',
      address: selectedOptionsMarket?.address,
      args: [autoExerciserAddress, true],
    });
  const { writeAsync: disapproveDelegate, isLoading: dissapproveLoading } =
    useContractWrite({
      abi: DopexV2OptionMarket,
      functionName: 'updateExerciseDelegate',
      address: selectedOptionsMarket?.address,
      args: [autoExerciserAddress, false],
    });

  return (
    <div className="w-full h-fit bg-umbra p-[12px] space-y-[10px]">
      <div className="text-stieglitz font-medium text-[13px] w-full flex items-center justify-between">
        <span>Auto Exercisers</span>
      </div>
      <div className="text-stieglitz font-medium text-[13px] ">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col space-y-[4px] flex-1">
            <span className="text-white">Time Based</span>
            <span className="text-[10px]">
              Options are automatically exercised 5 minutes before expiry.
            </span>
          </div>
          <div className="flex-[0.35] flex items-center justify-end">
            <Button
              size="xsmall"
              onClick={() => {
                (isDelegatorApproved
                  ? disapproveDelegate
                  : approveDelegate)().then(() => refetch());
              }}
              disabled={approveLoading || dissapproveLoading}
            >
              <span className={cn('text-[13px]')}>
                {!isDelegatorApproved ? 'Enable' : 'Disable'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoExercisers;
