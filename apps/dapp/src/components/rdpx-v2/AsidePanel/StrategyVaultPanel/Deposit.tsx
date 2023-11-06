import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button, Input } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import Alert from 'components/common/Alert';
import alerts, { AlertType } from 'components/rdpx-v2/AsidePanel/alerts';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import PerpVaultLp from 'constants/rdpx/abis/PerpVaultLp';
import addresses from 'constants/rdpx/addresses';

const Deposit = () => {
  const [amount, setAmount] = useState<string>('');

  const { address: user = '0x' } = useAccount();
  const { updateUserPerpetualVaultData } = usePerpPoolData({
    user,
  });
  const { write: deposit, isSuccess: isDepositSuccess } = useContractWrite({
    abi: PerpVaultLp,
    address: addresses.perpPoolLp,
    functionName: 'deposit',
    args: [parseUnits(amount, DECIMALS_TOKEN), user],
  });
  const { write: approve, isSuccess: isApproveSuccess } = useContractWrite({
    abi: erc20ABI,
    address: addresses.weth,
    functionName: 'approve',
    args: [addresses.perpPoolLp, parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { data: sharesReceived = 0n } = useContractRead({
    abi: PerpVaultLp,
    address: addresses.perpPoolLp,
    functionName: 'previewDeposit',
    args: [parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { updateAllowance, approved, balance, updateBalance } = useTokenData({
    amount,
    spender: addresses.perpPoolLp || '0x',
    token: addresses.weth,
  });

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
        label: 'Deposit',
        header: 'Deposit',
        disabled: false,
        severity: null,
        body: null,
        handler: () => {
          deposit();
          updateUserPerpetualVaultData();
        },
      };
    }
  }, [
    amount,
    approve,
    approved,
    balance,
    deposit,
    updateAllowance,
    updateUserPerpetualVaultData,
  ]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value) < 0 ? '' : e.target.value);
  };

  const onClickMax = useCallback(() => {
    setAmount(formatUnits(balance, DECIMALS_TOKEN));
  }, [balance]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, isDepositSuccess]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, isApproveSuccess]);

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit">
        <Input
          type="number"
          variant="xl"
          value={amount}
          onChange={onChange}
          placeholder="0.0"
          leftElement={
            <div className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/weth.svg`}
                alt="weth"
                className="w-9 h-9 border border-mineshaft rounded-full"
              />
            </div>
          }
        />
        <div className="flex justify-between px-3 pb-3">
          <Typography2 variant="caption" weight="500" color="stieglitz">
            Deposit Amount
          </Typography2>
          <div className="flex space-x-1">
            <img
              src="/assets/max.svg"
              className="hover:bg-silver rounded-[4px] mr-1"
              alt="max"
              onClick={onClickMax}
            />
            <Typography2 variant="caption" weight="500">
              {formatBigint(balance, DECIMALS_TOKEN)}
            </Typography2>
            <Typography2 variant="caption" weight="500" color="stieglitz">
              WETH
            </Typography2>
          </div>
        </div>
      </div>
      {panelState.severity !== null ? (
        <Alert
          header={panelState.header}
          body={panelState.body || undefined}
          severity={panelState.severity}
        />
      ) : null}
      <div className="flex flex-col rounded-xl p-3 space-y-3 w-full bg-umbra">
        <InfoRow
          label="Shares Received"
          value={
            <Typography2 variant="caption">
              {formatBigint(sharesReceived)}{' '}
              <Typography2 variant="caption" color="stieglitz">
                LP
              </Typography2>
            </Typography2>
          }
        />
        <Button
          size="small"
          color={panelState.disabled ? 'mineshaft' : 'primary'}
          className="w-full"
          disabled={panelState.disabled}
          onClick={panelState.handler}
        >
          {panelState.label}
        </Button>
      </div>
    </div>
  );
};

export default Deposit;
