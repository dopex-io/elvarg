// todo: D.R.Y alerts across panels
import { AlertSeverity } from 'components/common/Alert';
import { AlertType } from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/alerts';

const alerts: Record<string, AlertType> = {
  insufficientBalance: {
    label: 'Stake',
    header: 'Insufficient Balance',
    body: 'You have insufficient balance to perform this transaction.',
    severity: AlertSeverity.error,
    disabled: true,
  },
  insufficientAllowance: {
    label: 'Approve',
    header: 'Insufficient Allowance',
    body: 'You need to provide allowance to the contract to spend your tokens for this transaction.',
    severity: AlertSeverity.info,
    disabled: false,
  },
  zeroAmount: {
    label: 'Stake',
    header: 'Enter an amount',
    body: null,
    severity: AlertSeverity.info,
    disabled: true,
  },
  default: {
    label: 'Stake',
    header: 'What does staking do?',
    body: `Accrue rewards from the MultiRewards contract by staking 
          your rtETH.`,
    severity: AlertSeverity.info,
    disabled: true,
  },
};

export default alerts;
