import React, { useMemo } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useBoundStore } from 'store';
import { TokenData } from 'types';

import { WritePositionInterface } from 'store/Vault/ssov';

import NumberDisplay from 'components/UI/NumberDisplay';
import SplitButton from 'components/UI/SplitButton';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SSOV_SUPPORTS_STAKING_REWARDS } from 'constants/index';

interface Props extends WritePositionInterface {
  collateralSymbol: string;
  rewardTokens: TokenData[];
  openTransfer: () => void;
  openWithdraw: () => void;
  openClaim: () => void;
  epochExpired: boolean;
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
    openClaim,
    rewardTokens,
    utilization,
    // estimatedPnl,
    epochExpired,
    stakeRewardAmounts,
    stakeRewardTokens,
  } = props;

  const { ssovSigner } = useBoundStore();

  const options = useMemo(() => {
    let _options = ['Transfer', 'Withdraw'];

    if (
      ssovSigner.ssovContractWithSigner &&
      SSOV_SUPPORTS_STAKING_REWARDS.includes(
        ssovSigner.ssovContractWithSigner.address
      ) &&
      stakeRewardAmounts.length > 0
    ) {
      _options.push('Claim');
    }
    return _options;
  }, [ssovSigner.ssovContractWithSigner, stakeRewardAmounts.length]);

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
      <TableCell>
        {accruedRewards.map((rewards, index) => {
          return rewards.gt(0) ||
            rewardTokens[index]?.symbol === collateralSymbol ? (
            <Typography variant="h6" key={index}>
              <NumberDisplay n={rewards} decimals={18} />{' '}
              {rewardTokens[index]?.symbol}
            </Typography>
          ) : null;
        })}
        {stakeRewardAmounts.map((rewardAmount, index) => {
          return (
            rewardAmount.gt(0) && (
              <Typography variant="h6" key={index}>
                <NumberDisplay n={rewardAmount} decimals={18} />{' '}
                {stakeRewardTokens[index]?.symbol}
              </Typography>
            )
          );
        })}
      </TableCell>
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
            if (index === 2) openClaim();
          }}
          disableButtons={[false, !epochExpired]}
        />
      </TableCell>
    </TableRow>
  );
};

export default WritePositionTableData;
