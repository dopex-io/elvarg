import { AlertSeverity } from 'components/common/Alert';

import { AlertType } from '../StrategyVaultPanel/alerts';

const alerts: Record<string, AlertType> = {
  insufficientBalance: {
    label: 'Delegate',
    header: 'Insufficient Balance',
    body: 'You have insufficient balance to perform this transaction.',
    severity: AlertSeverity.error,
    disabled: true,
  },
  insufficientAllowance: {
    label: 'Approve',
    header: 'Insufficient Allowance',
    body: 'You need to provide allowance to the contract to spend your tokens for this transaction.',
    severity: AlertSeverity.warning,
    disabled: false,
  },
  zeroAmount: {
    label: 'Delegate',
    header: 'Enter an amount',
    body: null,
    severity: AlertSeverity.info,
    disabled: true,
  },
  default: {
    label: 'Delegate',
    header: 'What does delegating do?',
    body: `Receive 75% share of the Receipt Tokens minted using your collateral plus 
          an additional fee from the delegatee’s bonding discount.`,
    severity: AlertSeverity.info,
    disabled: true,
  },
};

export default alerts;
