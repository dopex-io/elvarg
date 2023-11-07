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
    body: 'You need to provide allowance to the contract to spend your tokens for this transaction.',
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
  defaultDelegate: {
    label: 'Delegate',
    header: 'What does delegating do?',
    body: `Receive 75% share of rtETH minted using your collateral plus 
          an additional fee from the delegatee’s bonding discount.`,
    severity: AlertSeverity.info,
    disabled: false,
  },
  defaultBond: {
    label: 'Bond',
    header: 'Bond rDPX & WETH',
    body: null,
    severity: AlertSeverity.info,
    disabled: false,
  },
  defaultStake: {
    label: 'Stake',
    header: 'What does staking do?',
    body: `Accrue rewards from the MultiRewards contract by staking 
          your rtETH.`,
    severity: AlertSeverity.info,
    disabled: false,
  },
};

export default alerts;
