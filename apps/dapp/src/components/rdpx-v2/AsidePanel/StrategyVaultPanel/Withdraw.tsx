import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button, Input } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite, useNetwork } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useTokenData from 'hooks/helpers/useTokenData';
import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import Alert from 'components/common/Alert';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import alerts, {
  AlertType,
} from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/alerts';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';
import Typography2 from 'components/UI/Typography2';

import formatAmount from 'utils/general/formatAmount';
import formatBigint from 'utils/general/formatBigint';

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
    spender: addresses.perpPool || '0x',
    token: addresses.perpPoolLp,
  });
  const { write: approve, isSuccess: isApproveSuccess } = useContractWrite({
    abi: erc20ABI,
    address: addresses.perpPoolLp,
    functionName: 'approve',
    args: [addresses.perpPool, parseUnits(amount, DECIMALS_TOKEN)],
  });

  const onChange = useCallback((e: any) => {
    setAmount(Number(e.target.value) < 0 ? '' : e.target.value);
  }, []);

  const handleRedeemRequest = useCallback(
    async (_amount: bigint) => {
      const write = async () =>
        await writeContract({
          abi: PerpVault,
          address: addresses.perpPool,
          functionName: 'redeemRequest',
          args: [_amount],
        });
      await write().then(async () => await updateUserPerpetualVaultData());
    },
    [updateUserPerpetualVaultData],
  );

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
        },
      };
    } else if (Number(amount) === 0) {
      return {
        ...alerts.zeroAmount,
        handler: doNothing,
      };
    } else {
      return {
        label: 'Request Withdrawal',
        header: 'Request Withdrawal',
        disabled: false,
        severity: null,
        body: null,
        handler: () => handleRedeemRequest(parseUnits(amount, DECIMALS_TOKEN)),
      };
    }
  }, [
    amount,
    approve,
    approved,
    handleRedeemRequest,
    userPerpetualVaultData.totalUserShares,
  ]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

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
          variant="xl"
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
        />
        <div className="flex justify-between px-3 pb-3">
          <Typography2 variant="caption" color="stieglitz">
            Withdrawal Amount
          </Typography2>
          <div className="flex space-x-1">
            <img
              src="/assets/max.svg"
              className="hover:bg-silver rounded-[4px]"
              alt="max"
            />
            <Typography2 variant="caption">
              {formatBigint(balance, DECIMALS_TOKEN)}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              LP
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
          label="Balance"
          value={
            <Typography2 variant="caption">
              {formatBigint(
                userPerpetualVaultData.totalUserShares,
                DECIMALS_TOKEN,
              )}
              <span className="text-stieglitz"> LP</span>
            </Typography2>
          }
        />
        <InfoRow
          label="Current composition"
          value={
            <div className="flex space-x-1">
              <Typography2 variant="caption">
                {formatAmount(
                  Number(
                    formatUnits(
                      userPerpetualVaultData.shareComposition[0],
                      DECIMALS_TOKEN,
                    ),
                  ),
                )}
              </Typography2>
              <Typography2 variant="caption" color="stieglitz">
                ETH
              </Typography2>
              <Typography2 variant="caption">
                {formatAmount(
                  formatUnits(
                    userPerpetualVaultData.shareComposition[1],
                    DECIMALS_TOKEN,
                  ),
                )}{' '}
              </Typography2>
              <Typography2 variant="caption" color="stieglitz">
                rDPX
              </Typography2>{' '}
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
