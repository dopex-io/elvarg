// todo: D.R.Y perpetual vault panel
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { format } from 'date-fns';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';

import Alert from 'components/common/Alert';
import alerts, { AlertType } from 'components/rdpx-v2/AsidePanel/alerts';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

const Stake = () => {
  const { address: _user } = useAccount();
  const [amount, setAmount] = useState<string>('');

  const { data: rewardPerToken = 0n } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'rewardPerToken',
    args: [addresses.arb],
  });
  const { data: rewardData = [] } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'rewardData',
    args: [addresses.arb],
  });
  const { write: approve, isSuccess: isApproveSuccess } = useContractWrite({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'approve',
    args: [addresses.receiptTokenStaking, parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { write: stake, isSuccess: stakeSuccess } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'stake',
    args: [parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { balance, updateBalance, approved, updateAllowance } = useTokenData({
    spender: addresses.receiptTokenStaking || '0x',
    token: addresses.receiptToken,
    amount,
  });

  const onChange = (e: any) => {
    setAmount(Number(e.target.value) < 0 ? '' : e.target.value);
  };

  const onClickMax = useCallback(() => {
    setAmount(formatUnits(balance, DECIMALS_TOKEN));
  }, [balance]);

  const panelState: AlertType & { handler: () => void | null } = useMemo(() => {
    const doNothing = () => null;
    if (parseUnits(amount, DECIMALS_TOKEN) > balance)
      return {
        ...alerts.insufficientBalance,
        handler: doNothing,
      };
    else if (!approved) {
      return {
        ...alerts.insufficientAllowance,
        handler: () => {
          approve();
          updateAllowance();
        },
      };
    } else if (Number(amount) === 0) {
      return {
        ...alerts.zeroAmount,
        handler: doNothing,
      };
    } else {
      return {
        ...alerts.defaultStake,
        handler: () => stake(),
      };
    }
  }, [amount, approve, approved, balance, stake, updateAllowance]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, isApproveSuccess]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, stakeSuccess]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit divide-y-2 divide-cod-gray">
        <PanelInput
          amount={amount}
          handleChange={onChange}
          handleMax={onClickMax}
          maxAmount={balance}
          iconPath="/images/tokens/rteth.svg"
          label="Balance"
          symbol="rtETH"
        />
      </div>
      {panelState.severity !== null ? (
        <Alert
          header={panelState.header}
          severity={panelState.severity}
          body={panelState.body || undefined}
        />
      ) : null}
      <div className="bg-umbra p-3 rounded-lg space-y-3">
        <InfoRow
          label="Reward End"
          value={format(new Date().setTime(1706659200000), 'd LLL yyyy')}
        />
        <Button
          size="medium"
          className="w-full rounded-md"
          color="primary"
          disabled={panelState.disabled}
          onClick={panelState.handler}
        >
          {panelState.label}
        </Button>
      </div>
    </div>
  );
};

export default Stake;
