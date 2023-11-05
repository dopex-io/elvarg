// todo: D.R.Y strategy vault panel
import { useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';

import Alert from 'components/common/Alert';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import alerts from 'components/rdpx-v2/AsidePanel/StakePanel/alerts';
import { AlertType } from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/alerts';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const Unstake = () => {
  const { address: _user = '0x' } = useAccount();
  const [amount, setAmount] = useState<string>('');

  const { write: withdraw, isSuccess: stakeSuccess } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.multirewards,
    functionName: 'withdraw',
    args: [parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { data: stakedAmount = 0n } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.multirewards,
    functionName: 'balanceOf',
    args: [_user],
  });
  const { balance, updateBalance } = useTokenData({
    spender: addresses.multirewards || '0x',
    token: addresses.receiptToken,
    amount,
  });

  const onChange = (e: any) => {
    setAmount(Number(e.target.value) < 0 ? '' : e.target.value);
  };

  const panelState: AlertType & { handler: () => void | null } = useMemo(() => {
    const doNothing = () => null;
    if (parseUnits(amount, DECIMALS_TOKEN) > balance)
      return {
        ...alerts.insufficientBalance,
        handler: doNothing,
      };
    else if (Number(amount) === 0) {
      return {
        ...alerts.zeroAmount,
        handler: doNothing,
      };
    } else {
      return {
        label: 'Withdraw',
        header: 'Withdraw',
        disabled: false,
        severity: null,
        body: null,
        handler: () => {
          withdraw();
        },
      };
    }
  }, [amount, balance, withdraw]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, stakeSuccess]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit divide-y-2 divide-cod-gray">
        <PanelInput
          amount={amount}
          handleChange={onChange}
          maxAmount={stakedAmount}
          iconPath="/images/tokens/dpxeth.svg"
          label="Stake Amount"
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
      <div className="flex flex-col rounded-xl p-3 w-full bg-umbra space-y-3">
        <InfoRow
          label="Staked rtETH"
          value={
            <Typography2 variant="caption">
              {formatBigint(stakedAmount, DECIMALS_TOKEN)} rtETH
            </Typography2>
          }
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

export default Unstake;
