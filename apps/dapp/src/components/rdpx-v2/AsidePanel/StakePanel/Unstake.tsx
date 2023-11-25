// todo: D.R.Y perpetual vault panel
import { useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { noop } from 'lodash';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import Alert from 'components/common/Alert';
import alerts, { AlertType } from 'components/rdpx-v2/AsidePanel/alerts';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

const Unstake = () => {
  const { address: _user = '0x' } = useAccount();
  const [amount, setAmount] = useState<string>('');

  const { writeAsync: withdraw } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'withdraw',
    args: [parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { data: stakedAmount = 0n, refetch: refetchBalance } = useContractRead({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'balanceOf',
    args: [_user],
  });

  const onChange = (e: any) => {
    setAmount(Number(e.target.value) < 0 ? '' : e.target.value);
  };

  const panelState: AlertType & { handler: () => void | null } = useMemo(() => {
    if (parseUnits(amount, DECIMALS_TOKEN) > stakedAmount)
      return {
        ...alerts.insufficientBalance,
        handler: noop,
      };
    else if (Number(amount) === 0) {
      return {
        ...alerts.zeroAmount,
        handler: noop,
      };
    } else {
      return {
        label: 'Withdraw',
        header: 'Withdraw',
        disabled: false,
        severity: null,
        body: null,
        handler: () => {
          withdraw()
            .then(() => refetchBalance())
            .catch((e) => console.error(e));
        },
      };
    }
  }, [amount, stakedAmount, refetchBalance, withdraw]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit divide-y-2 divide-cod-gray">
        <PanelInput
          amount={amount}
          handleChange={onChange}
          maxAmount={stakedAmount}
          handleMax={() => {
            setAmount(formatUnits(stakedAmount, DECIMALS_TOKEN));
          }}
          iconPath="/images/tokens/rteth.svg"
          label="Staked Amount"
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
