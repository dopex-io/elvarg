import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite, useNetwork } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import Alert from 'components/common/Alert';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import alerts, {
  AlertType,
} from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/alerts';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';
import Input from 'components/UI/Input';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';
import PerpVault from 'constants/rdpx/abis/PerpVault';
import addresses from 'constants/rdpx/addresses';

const Withdraw = () => {
  const [amount, setAmount] = useState<string>('');

  const { address: user = '0x' } = useAccount();
  const { chain } = useNetwork();
  const { userPerpetualVaultData, updateUserPerpetualVaultData } =
    usePerpPoolData({
      user,
    });
  const { updateAllowance, approved, balance, updateBalance } = useTokenData({
    amount,
    spender: addresses.perpPoolLp,
    token: addresses.perpPoolLp,
  });
  const { write: redeem, isSuccess: isDepositSuccess } = useContractWrite({
    abi: PerpVault,
    address: addresses.perpPool,
    functionName: 'claim',
    args: [0n], // epoch where user deposited
  });
  const { write: approve, isSuccess: isApproveSuccess } = useContractWrite({
    abi: erc20ABI,
    address: addresses.perpPoolLp,
    functionName: 'approve',
    args: [addresses.perpPoolLp, parseUnits(amount, DECIMALS_TOKEN)],
  });

  const onChange = useCallback((e: any) => {
    setAmount(Number(e.target.value) < 0 ? '' : e.target.value);
  }, []);

  const panelState: AlertType & { handler: () => void | null } = useMemo(() => {
    const doNothing = () => null;
    if (parseUnits(amount, DECIMALS_TOKEN) > balance)
      return {
        ...alerts.insufficientBalance,
        handler: doNothing,
      };
    // before sending approve() transaction, check if user can withdraw in the first place
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
        label: 'Withdraw',
        header: 'Withdraw',
        disabled: false,
        severity: null,
        body: null,
        handler: () => {
          redeem();
          updateUserPerpetualVaultData();
        },
      };
    }
  }, [
    amount,
    approve,
    approved,
    balance,
    redeem,
    updateAllowance,
    updateUserPerpetualVaultData,
  ]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, isDepositSuccess]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, isApproveSuccess]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit">
        <Input
          type="number"
          size="small"
          value={amount}
          onChange={onChange}
          placeholder="0.0"
          leftElement={
            <div className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/${'weth'}.svg`}
                alt={'weth'}
                className="w-9 h-9 border border-mineshaft rounded-full"
              />
            </div>
          }
          className="py-1"
        />
        <div className="flex justify-between px-3 pb-3">
          <span className="text-stieglitz text-xs">Balance</span>
          <div className="flex space-x-1">
            <img
              src="/assets/max.svg"
              className="hover:bg-silver rounded-[4px] mr-1"
              alt="max"
            />
            <span className="text-xs">
              {formatAmount(formatUnits(balance, DECIMALS_TOKEN), 3)}
            </span>
            <span className="text-xs text-stieglitz">LP</span>
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
      <div className="flex flex-col rounded-xl p-3 space-y-2 w-full bg-umbra">
        <InfoRow
          label="Balance"
          value={
            <h6 className="text-white text-xs">
              {formatAmount(
                formatUnits(
                  userPerpetualVaultData.totalUserShares,
                  DECIMALS_TOKEN
                ),
                3
              )}
              <span className="text-stieglitz"> LP</span>
            </h6>
          }
        />
        <InfoRow
          label="You will receive"
          value={
            <h6 className="text-white text-xs">
              6 <span className="text-stieglitz">rDPX</span> 2.5{' '}
              <span className="text-stieglitz">ETH</span>{' '}
            </h6>
          }
        />
        <div className="rounded-md flex flex-col p-3 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chain?.id || 42161} />
          <Button
            size="medium"
            className="w-full"
            color={panelState.disabled ? 'mineshaft' : 'primary'}
            disabled={panelState.disabled}
            onClick={panelState.handler}
          >
            {panelState.label}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
