import { useCallback, useEffect, useState } from 'react';
import { MockToken, MockToken__factory } from '@dopex-io/sdk';

import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import PoolStats from 'components/perpetual-pools/DepositPanel/PoolStats';
import LockerIcon from 'svgs/icons/LockerIcon';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import { getContractReadableAmount } from 'utils/contracts';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

import { TOKEN_DECIMALS } from 'constants/index';

const DepositPanel = () => {
  const sendTx = useSendTx();

  const {
    signer,
    chainId,
    accountAddress,
    userAssetBalances,
    updateAssetBalances,
    appContractData,
    updateAPPUserData,
  } = useBoundStore();

  const [value, setValue] = useState<number | string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>(false);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setValue(e.target.value);
    },
    []
  );

  const handleMax = useCallback(() => {
    if (!appContractData.contract) return;
    const { collateralToken } = appContractData;
    if (!collateralToken) return;
    setValue(
      getUserReadableAmount(
        userAssetBalances[appContractData.underlyingSymbol.toUpperCase()] ||
          '0',
        getTokenDecimals(
          appContractData.underlyingSymbol.toUpperCase(),
          chainId
        )
      )
    );
  }, [appContractData, chainId, userAssetBalances]);

  const handleDeposit = useCallback(async () => {
    if (!appContractData.contract || !accountAddress) return;
    const _contract = appContractData.contract;
    const _collateralToken = appContractData.collateralSymbol;
    const decimals = getTokenDecimals(_collateralToken, chainId);
    const inputAmount = getContractReadableAmount(value, decimals);
    try {
      await sendTx(_contract, 'deposit', [inputAmount, accountAddress]).then(
        () => updateAPPUserData().then(() => updateAssetBalances())
      );
    } catch (e) {
      console.log(e);
    }
  }, [
    chainId,
    appContractData.contract,
    appContractData.collateralSymbol,
    accountAddress,
    updateAPPUserData,
    updateAssetBalances,
    value,
    sendTx,
  ]);

  const handleApprove = useCallback(async () => {
    if (
      !appContractData.contract ||
      !appContractData.collateralToken ||
      !accountAddress ||
      !signer
    )
      return;

    const _perpetualVault = appContractData.contract;
    const collateralToken: MockToken = MockToken__factory.connect(
      appContractData.collateralToken.address,
      signer
    );
    try {
      await sendTx(collateralToken, 'approve', [
        _perpetualVault.address,
        getContractReadableAmount(value, 18),
      ]).then(() => {
        setApproved(true);
      });
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    appContractData.collateralToken,
    appContractData.contract,
    sendTx,
    signer,
    value,
  ]);

  useEffect(() => {
    (async () => {
      if (!appContractData.contract) return;
      const contractIsPaused = await appContractData.contract.paused();
      setDisabled(contractIsPaused);
    })();
  }, [appContractData.contract, value]);

  useEffect(() => {
    (async () => {
      if (
        !appContractData.contract ||
        !appContractData.collateralToken ||
        !accountAddress
      )
        return;
      const _contract = appContractData.contract;
      const _usdc = appContractData.collateralToken;
      const allowance = await _usdc.allowance(
        accountAddress,
        _contract.address
      );
      const decimals = getTokenDecimals(
        appContractData.underlyingSymbol,
        chainId
      );
      const inputAmount = getContractReadableAmount(value, decimals);

      setApproved(allowance.gte(inputAmount));
    })();
  }, [accountAddress, appContractData, chainId, value]);

  return (
    <div className="p-3 bg-cod-gray rounded-xl space-y-3">
      <p className="text-sm">Deposit</p>
      <div className="bg-umbra rounded-xl w-full">
        <Input
          size="small"
          type="number"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          className="flex w-full"
          leftElement={
            <div className="flex my-auto space-x-2">
              <div className="flex bg-cod-gray rounded-full p-1 relative">
                <img
                  src={`/images/tokens/${
                    appContractData.underlyingSymbol?.toLowerCase() || 'USDC'
                  }.svg`}
                  alt={appContractData.underlyingSymbol.toUpperCase()}
                  className="w-[2.2rem] mr-1"
                />
                <p className="text-base my-auto w-[5.2rem]">
                  {appContractData.underlyingSymbol.toUpperCase()}
                </p>
              </div>
              <div
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                role="button"
                onClick={handleMax}
              >
                <p className="text-xs text-stieglitz">MAX</p>
              </div>
            </div>
          }
        />
        <div className="flex justify-between px-3 pb-3">
          <p className="text-sm text-stieglitz">Balance</p>
          <p className="text-sm">
            {formatAmount(
              getUserReadableAmount(
                userAssetBalances[
                  appContractData.underlyingSymbol.toUpperCase()
                ] ?? '0',
                TOKEN_DECIMALS[chainId]?.[
                  appContractData.underlyingSymbol.toUpperCase()
                ]
              ),
              3
            )}{' '}
            {appContractData.underlyingSymbol.toUpperCase()}
          </p>
        </div>
      </div>
      <PoolStats poolType="PUTS" />
      <div className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra">
        <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </div>
        <div className="flex justify-between">
          <LockerIcon className="w-1/6" />
          <p className="text-sm text-stieglitz break-words">
            Withdrawals are disabled till settlement
          </p>
        </div>
        <CustomButton
          size="medium"
          className="w-full mt-4 !rounded-md"
          color="primary"
          disabled={disabled || value === '' || Number(value) <= 0}
          onClick={approved ? handleDeposit : handleApprove}
        >
          {approved ? 'Deposit' : 'Approve'}
        </CustomButton>
      </div>
    </div>
  );
};

export default DepositPanel;
