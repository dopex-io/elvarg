import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useTokenData from 'hooks/helpers/useTokenData';
import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import Alert from 'components/common/Alert';
import alerts, { AlertType } from 'components/rdpx-v2/AsidePanel/alerts';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import PerpVault from 'constants/rdpx/abis/PerpVault';
import addresses from 'constants/rdpx/addresses';

const Redeem = () => {
  const [amount, setAmount] = useState<string>('');

  const { address: user = '0x' } = useAccount();
  const {
    userPerpetualVaultData,
    updateUserPerpetualVaultData,
    updatePerpetualVaultState,
  } = usePerpPoolData({
    user,
  });
  const { updateAllowance, approved } = useTokenData({
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
      await write()
        .then(async () => await updateUserPerpetualVaultData())
        .catch((e) => console.error(e));
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
        ...alerts.defaultRedeem,
        handler: doNothing,
      };
    } else {
      return {
        label: 'Request Redeem',
        header: 'Request Redeem',
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

  const onClickMax = () => {
    setAmount(
      formatUnits(userPerpetualVaultData.totalUserShares, DECIMALS_TOKEN),
    );
  };

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
      <PanelInput
        amount={amount}
        handleChange={onChange}
        maxAmount={userPerpetualVaultData.totalUserShares}
        handleMax={onClickMax}
        iconPath="/images/tokens/weth.svg"
        label="Redeem Amount"
        symbol="LP"
      />
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
                {formatBigint(
                  userPerpetualVaultData.shareComposition[0],
                  DECIMALS_TOKEN,
                )}
              </Typography2>
              <Typography2 variant="caption" color="stieglitz">
                ETH
              </Typography2>
              <Typography2 variant="caption">
                {formatBigint(
                  userPerpetualVaultData.shareComposition[1],
                  DECIMALS_TOKEN,
                )}{' '}
              </Typography2>
              <Typography2 variant="caption" color="stieglitz">
                rDPX
              </Typography2>{' '}
            </div>
          }
        />
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
  );
};

export default Redeem;
