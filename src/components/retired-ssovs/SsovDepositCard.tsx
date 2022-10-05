import SsovV2Deposit from './SsovV2Deposit';
import SsovV3Deposit from './SsovV3Deposit';

const SsovDepositCard = (props: any) => {
  const { deposit } = props;

  if (deposit.version === 2) {
    return <SsovV2Deposit deposit={deposit} />;
  } else {
    return <SsovV3Deposit id={deposit.id} ssovAddress={deposit.ssovAddress} />;
  }
};

export default SsovDepositCard;
