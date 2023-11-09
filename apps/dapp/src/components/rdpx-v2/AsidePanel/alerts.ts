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
    body: `Provide only WETH as collateral to receive 75% share of the bonds minted by another user who bonds with only rDPX. You can 
          charge a fee that is slashed from their bonding discount. Delegated collateral with lower fee is utilized first.`,
    severity: AlertSeverity.info,
    disabled: true,
  },
  defaultBondWithDelegate: {
    label: 'Bond',
    header: 'Bond rDPX',
    body: `You can bond only using rDPX by utilizing delegated WETH. You receive 25% of the bond's share for committing 25% of the bond's 
          value, while the remaining is received by the delegate. Note that a percentage of the discount on this bond is sent to the 
          delegate(s).`,
    severity: AlertSeverity.info,
    disabled: true,
  },
  defaultBond: {
    label: 'Bond',
    header: 'Bond rDPX & WETH',
    body: `Bond rDPX + WETH and redeem rtETH at maturity. You can stake the received rtETH to accrue rewards or 
          optionally unwrap it to recover rDPX and WETH at the ratio of pool's reserves at the time of unwrapping.`,
    severity: AlertSeverity.info,
    disabled: true,
  },
  defaultStake: {
    label: 'Stake',
    header: 'What does staking do?',
    body: `Accrue rewards from the MultiRewards contract by staking 
          your rtETH.`,
    severity: AlertSeverity.info,
    disabled: false,
  },
  defaultLp: {
    label: 'Deposit',
    header: 'What does depositing into this strategy do?',
    body: `Deposit into this strategy for either a chance buy rDPX 25% below market price with your locked WETH, 
          or passively accrue rewards.`,
    severity: AlertSeverity.info,
    disabled: true,
  },
  defaultRedeem: {
    label: 'Redeem',
    header: 'Redeem your assets',
    body: `Queue your redemptions now to be able to retrieve your locked assets at the end of the current period.`,
    severity: AlertSeverity.info,
    disabled: true,
  },
};

export default alerts;
