import React, { ReactNode, useCallback, useMemo } from 'react';
import { BigNumber } from 'ethers';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { TokenData } from 'types';

import { useBoundStore } from 'store';
import { WritePositionInterface } from 'store/Vault/ssov';

import NumberDisplay from 'components/UI/NumberDisplay';
import SplitButton from 'components/UI/SplitButton';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

interface Props extends WritePositionInterface {
  collateralSymbol: string;
  rewardTokens: TokenData[];
  openTransfer: () => void;
  openWithdraw: () => void;
  handleStakedPosition: () => void;
  epochExpired: boolean;
  ssovAddress: string | undefined;
}

const WritePositionTableData = (props: Props) => {
  const {
    strike,
    collateralAmount,
    epoch,
    accruedPremiums,
    accruedRewards,
    collateralSymbol,
    openTransfer,
    openWithdraw,
    handleStakedPosition,
    rewardTokens,
    utilization,
    // estimatedPnl,
    epochExpired,
    stakeRewardAmounts,
    stakeRewardTokens,
    stakingRewardsPosition,
  } = props;

  const { ssovSigner } = useBoundStore();

  const rewardsInformation = useMemo(() => {
    const nilRewardsComponent = <span className="text-white">-</span>;
    let component: ReactNode = nilRewardsComponent;

    let totalRewards = BigNumber.from(0);

    // If supports staking rewards, show rewards from staking rewards contract
    if (ssovSigner.ssovStakingRewardsWithSigner) {
      component = stakeRewardAmounts.map((rewardAmount, index) => {
        totalRewards = totalRewards.add(rewardAmount);

        return rewardAmount.gt(0) ? (
          <Typography variant="h6" key={index}>
            <NumberDisplay n={rewardAmount} decimals={18} />{' '}
            {stakeRewardTokens[index]?.symbol}
          </Typography>
        ) : (
          <span className="text-white">-</span>
        );
      });
    }
    // Else show rewards from current staking strategy of the ssov
    else {
      component = accruedRewards.map((rewards, index) => {
        totalRewards = totalRewards.add(rewards);

        return rewards.gt(0) ||
          rewardTokens[index]?.symbol === collateralSymbol ? (
          <Typography variant="h6" key={index}>
            <NumberDisplay n={rewards} decimals={18} />{' '}
            {rewardTokens[index]?.symbol}
          </Typography>
        ) : (
          <span className="text-white">-</span>
        );
      });
    }

    // Incase there are absolutely no rewards
    if (totalRewards.eq(0)) return nilRewardsComponent;
    return component;
  }, [
    accruedRewards,
    collateralSymbol,
    rewardTokens,
    stakeRewardAmounts,
    stakeRewardTokens,
    ssovSigner.ssovStakingRewardsWithSigner,
  ]);

  const options = useMemo(() => {
    let _options = ['Transfer', 'Withdraw'];

    if (ssovSigner.ssovContractWithSigner) {
      if (stakingRewardsPosition?.staked) {
        _options.push('Claim');
      } else {
        _options.push('Stake');
      }
    }

    return _options;
  }, [ssovSigner.ssovContractWithSigner, stakingRewardsPosition]);

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">
          ${formatAmount(getUserReadableAmount(strike, 8), 5)}
        </Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{epoch}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(collateralAmount, 18), 5)}{' '}
          {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h6">
          <NumberDisplay n={accruedPremiums} decimals={18} minNumber={0.01} />{' '}
          {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell>{rewardsInformation}</TableCell>
      <TableCell>
        <Typography variant="h6">
          {formatAmount(utilization.toNumber(), 2)}%
        </Typography>
      </TableCell>
      {/* <TableCell>
        <Typography variant="h6">
          <NumberDisplay n={estimatedPnl} decimals={18} minNumber={0.01} />{' '}
          {collateralSymbol}
        </Typography>
      </TableCell> */}
      <TableCell align="left" className="pt-2 flex space-x-2">
        <SplitButton
          options={options}
          handleClick={(index: number) => {
            if (index === 0) openTransfer();
            if (index === 1) openWithdraw();
            if (index === 2) handleStakedPosition();
          }}
          disableButtons={[false, !epochExpired]}
        />
      </TableCell>
    </TableRow>
  );
};

export default WritePositionTableData;
