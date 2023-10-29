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
  const {
    userPerpetualVaultData,
    updateUserPerpetualVaultData,
    updatePerpetualVaultState,
  } = usePerpPoolData({
    user,
  });
  const { updateAllowance, approved, balance, updateBalance } = useTokenData({
    amount,
    spender: addresses.perpPoolLp,
    token: addresses.perpPoolLp,
  });
  const { write: redeemRequest, isSuccess: isDepositSuccess } =
    useContractWrite({
      abi: PerpVault,
      address: addresses.perpPool,
      functionName: 'redeemRequest',
      args: [parseUnits(amount, DECIMALS_TOKEN)],
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
    if (
      parseUnits(amount, DECIMALS_TOKEN) >
      userPerpetualVaultData.totalUserShares
    ) {
      return {
        ...alerts.insufficientBalance,
        handler: doNothing,
      };
    } else if (!approved) {
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
        label: 'Request Redeem',
        header: 'Request Redeem',
        disabled: false,
        severity: null,
        body: null,
        handler: () => {
          redeemRequest();
          updateUserPerpetualVaultData();
        },
      };
    }
  }, [
    amount,
    approve,
    approved,
    redeemRequest,
    updateAllowance,
    updateUserPerpetualVaultData,
    userPerpetualVaultData.totalUserShares,
  ]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, isDepositSuccess]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, isApproveSuccess]);

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);
  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData]);

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
          label="Current composition"
          value={
            <div className="flex text-white text-xs space-x-1">
              <p>
                {formatAmount(
                  Number(
                    formatUnits(
                      userPerpetualVaultData.shareComposition[0],
                      DECIMALS_TOKEN
                    )
                  )
                )}
              </p>
              <p className="text-stieglitz">ETH</p>
              <p>
                {formatAmount(
                  formatUnits(
                    userPerpetualVaultData.shareComposition[1],
                    DECIMALS_TOKEN
                  )
                )}{' '}
              </p>
              <p className="text-stieglitz">rDPX</p>{' '}
            </div>
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
