import { zeroAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import DopexV2OptionMarket from 'abis/clamm/DopexV2OptionMarket';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { cn } from 'utils/general';

import { AUTO_EXERCISER_TIME_BASED } from 'constants/clamm';

const AutoExercisers = () => {
  const { selectedOptionsPool } = useClammStore();
  const { address } = useAccount();

  const { data: isDelegatorApproved, refetch } = useContractRead({
    abi: DopexV2OptionMarket,
    functionName: 'exerciseDelegator',
    address: selectedOptionsPool?.optionsPoolAddress,
    args: [address || zeroAddress, AUTO_EXERCISER_TIME_BASED],
  });

  const { writeAsync: approveDelegate, isLoading: approveLoading } =
    useContractWrite({
      abi: DopexV2OptionMarket,
      functionName: 'updateExerciseDelegate',
      address: selectedOptionsPool?.optionsPoolAddress,
      args: [AUTO_EXERCISER_TIME_BASED, true],
    });
  const { writeAsync: disapproveDelegate, isLoading: dissapproveLoading } =
    useContractWrite({
      abi: DopexV2OptionMarket,
      functionName: 'updateExerciseDelegate',
      address: selectedOptionsPool?.optionsPoolAddress,
      args: [AUTO_EXERCISER_TIME_BASED, false],
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
