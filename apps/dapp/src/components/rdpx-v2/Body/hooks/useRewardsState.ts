import { useCallback, useEffect, useMemo } from 'react';

import { Address, erc20ABI, useContractRead, useContractWrite } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useTokenData from 'hooks/helpers/useTokenData';

import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const multiRewardsConfig = {
  abi: CurveMultiRewards,
  address: addresses.perpVaultStaking,
};

interface Props {
  user: Address;
  stakeAmount: bigint;
}

const useRewardsState = (props: Props) => {
  const { user = '0x', stakeAmount = 0n } = props;

  const { data: staked = 0n } = useContractRead({
    ...multiRewardsConfig,
    functionName: 'earned',
    args: [user, addresses.arb],
  });
  const { data: earned = 0n } = useContractRead({
    ...multiRewardsConfig,
    functionName: 'earned',
    args: [user, addresses.arb],
  });
  const { data: stakedBalance = 0n } = useContractRead({
    ...multiRewardsConfig,
    functionName: 'balanceOf',
    args: [user],
  });
  const { updateBalance, updateAllowance, allowance } = useTokenData({
    spender: addresses.perpVaultStaking,
    token: addresses.perpPoolLp,
    amount: stakeAmount,
  });
  const { write: claim, isSuccess: claimSuccess } = useContractWrite({
    ...multiRewardsConfig,
    functionName: 'getReward',
  });
  const { write: unstake, isSuccess: unstakeSuccess } = useContractWrite({
    ...multiRewardsConfig,
    functionName: 'exit',
  });
  const { write: stake } = useContractWrite({
    ...multiRewardsConfig,
    functionName: 'stake',
    args: [allowance < stakeAmount ? allowance : stakeAmount],
  });

  // single-click approve & stake
  const handleStake = useCallback(async () => {
    const approve = async () => {
      return await writeContract({
        abi: erc20ABI,
        address: addresses.perpPoolLp,
        functionName: 'approve',
        args: [addresses.perpVaultStaking, stakeAmount],
      });
    };
    if (allowance < stakeAmount)
      // strictly enforce this sequence of actions
      approve()
        .then(() => stake())
        .catch((e) => console.error(e));
    else stake();
  }, [allowance, stakeAmount, stake]);

  const buttonState = useMemo(() => {
    const defaultState = {
      label: 'Stake',
      handler: () => stake(),
    };
    if (staked || earned) {
      return {
        label: 'Claim',
        handler: () => {
          claim();
        },
      };
    } else
      return {
        ...defaultState,
      };
  }, [claim, earned, stake, staked]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, claimSuccess, unstakeSuccess]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance]);

  return {
    buttonState,
    unstake,
    earned,
    stake: handleStake,
    claim,
    stakedBalance,
  };
};

export default useRewardsState;
