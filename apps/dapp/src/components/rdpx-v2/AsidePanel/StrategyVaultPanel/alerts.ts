import { AlertSeverity } from 'components/common/Alert';

export type AlertType = {
  label: string | null;
  header: string;
  body: string | null;
  severity: AlertSeverity | null;
  disabled: boolean;
};

const alerts: Record<string, AlertType> = {
  insufficientBalance: {
    label: 'Insufficient Balance',
    header: 'Insufficient Balance',
    body: 'You have insufficient balance to perform this transaction.',
    severity: AlertSeverity.error,
    disabled: true,
  },
  insufficientAllowance: {
    label: 'Approve',
    header: 'Insufficient Allowance',
    body: 'You need to approve spending of your tokens in order to perform this transaction.',
    severity: AlertSeverity.info,
    disabled: false,
  },
  zeroAmount: {
    label: 'Enter an amount',
    header: 'Enter an amount',
    body: null,
    severity: AlertSeverity.info,
    disabled: true,
  },
};

export default alerts;
