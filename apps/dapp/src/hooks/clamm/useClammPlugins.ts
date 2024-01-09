import { useMemo } from 'react';
import { BaseError } from 'viem';

import DopexV2OptionMarket from 'abis/clamm/DopexV2OptionMarket';
import toast from 'react-hot-toast';
import { Address, useContractReads, useContractWrite } from 'wagmi';

import { EXERCISE_PLUGINS } from 'constants/clamm';

type Props = {
  optionMarket: Address;
  account: Address;
};

const useClammPlugins = ({ optionMarket, account }: Props) => {
  console.log(optionMarket, account);
  const { data: pluginApprovals, refetch } = useContractReads({
    contracts: [
      {
        address: optionMarket,
        abi: DopexV2OptionMarket,
        functionName: 'exerciseDelegator',
        args: [account, EXERCISE_PLUGINS['AUTO-EXERCISE'].contract],
      },
      {
        address: optionMarket,
        abi: DopexV2OptionMarket,
        functionName: 'exerciseDelegator',
        args: [account, EXERCISE_PLUGINS['LIMIT-EXERCISE'].contract],
      },
    ],
  });

  const { writeAsync: enableLimitExercise } = useContractWrite({
    abi: DopexV2OptionMarket,
    functionName: 'updateExerciseDelegate',
    address: optionMarket,
    args: [EXERCISE_PLUGINS['LIMIT-EXERCISE'].contract, true],
    onSuccess: () => {
      toast.success('Limit exercise plugin enabled!');
    },
    onError: (err) => {
      let _error = err as BaseError;
      toast.error(_error['shortMessage']);
    },
  });

  const { writeAsync: enableAutoExercise } = useContractWrite({
    abi: DopexV2OptionMarket,
    functionName: 'updateExerciseDelegate',
    address: optionMarket,
    args: [EXERCISE_PLUGINS['AUTO-EXERCISE'].contract, true],
    onSuccess: () => {
      toast.success('Auto exercise plugin enabled!');
    },
    onError: (err) => {
      let _error = err as BaseError;
      toast.error(_error['shortMessage']);
    },
  });
  const { writeAsync: disableLimitExercise } = useContractWrite({
    abi: DopexV2OptionMarket,
    address: optionMarket,
    functionName: 'updateExerciseDelegate',
    args: [EXERCISE_PLUGINS['LIMIT-EXERCISE'].contract, false],
    onSuccess: () => {
      toast.success('Limit exercise plugin disabled!');
    },
    onError: (err) => {
      let _error = err as BaseError;
      toast.error(_error['shortMessage']);
    },
  });

  const { writeAsync: disableAutoExercise } = useContractWrite({
    abi: DopexV2OptionMarket,
    address: optionMarket,
    functionName: 'updateExerciseDelegate',
    args: [EXERCISE_PLUGINS['AUTO-EXERCISE'].contract, false],
    onSuccess: () => {
      toast.success('Auto exercise plugin disabled!');
    },
    onError: (err) => {
      let _error = err as BaseError;
      toast.error(_error['shortMessage']);
    },
  });

  const plugins = useMemo(() => {
    if (!pluginApprovals) return [];

    return [
      {
        ...EXERCISE_PLUGINS['AUTO-EXERCISE'],
        enabled: pluginApprovals[0].result ?? false,
        enable: enableAutoExercise,
        disable: disableAutoExercise,
      },
      {
        ...EXERCISE_PLUGINS['LIMIT-EXERCISE'],
        enabled: pluginApprovals[1].result ?? false,
        enable: enableLimitExercise,
        disable: disableLimitExercise,
      },
    ];
  }, [
    pluginApprovals,
    enableLimitExercise,
    enableAutoExercise,
    disableAutoExercise,
    disableLimitExercise,
  ]);
  return {
    plugins,
    refetch,
  };
};

export default useClammPlugins;
