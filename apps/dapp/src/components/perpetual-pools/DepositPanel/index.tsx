import { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import PoolStats from 'components/perpetual-pools/DepositPanel/PoolStats';
import Input from 'components/UI/Input';
import LockerIcon from 'svgs/icons/LockerIcon';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import { getContractReadableAmount } from 'utils/contracts';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';

const DepositPanel = () => {
  const sendTx = useSendTx();

  const { chainId, accountAddress, userAssetBalances, appContractData } =
    useBoundStore();

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
    const inputAmount = getContractReadableAmount(value, 6);

    try {
      await sendTx(_contract, 'deposit', [inputAmount, accountAddress]);
    } catch (e) {
      console.log(e);
    }
  }, [accountAddress, appContractData.contract, sendTx, value]);

  const handleApprove = useCallback(async () => {
    if (
      !appContractData.contract ||
      !appContractData.collateralToken ||
      !accountAddress
    )
      return;
    const _contract = appContractData.contract;
    const _usdc = appContractData.collateralToken;

    try {
      await sendTx(_usdc, 'approve', [MAX_VALUE, _contract]);
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    appContractData.collateralToken,
    appContractData.contract,
    sendTx,
  ]);

  useEffect(() => {
    if (!appContractData.contract) return;
    setDisabled(false);
  }, [appContractData.contract]);

  useEffect(() => {
    (async () => {
      if (
        !appContractData.contract ||
        !appContractData.underlyingSymbol ||
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
    <Box className="p-3 bg-cod-gray rounded-xl space-y-3">
      <Typography variant="h6">Deposit</Typography>
      <Box className="bg-umbra rounded-xl w-full">
        <Input
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          className="flex w-full"
          leftElement={
            <Box className="flex my-auto space-x-2">
              <Box className="flex bg-cod-gray rounded-full p-1 relative">
                <img
                  src={`/images/tokens/${
                    appContractData.underlyingSymbol?.toLowerCase() || 'USDC'
                  }.svg`}
                  alt={appContractData.underlyingSymbol.toUpperCase()}
                  className="w-[2.2rem] mr-1"
                />
                <Typography variant="h5" className="my-auto w-[5.2rem]">
                  {appContractData.underlyingSymbol.toUpperCase()}
                </Typography>
              </Box>
              <Box
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                role="button"
                onClick={handleMax}
              >
                <Typography variant="caption" color="stieglitz">
                  MAX
                </Typography>
              </Box>
            </Box>
          }
        />
        <Box className="flex justify-between px-3 pb-3">
          <Typography variant="h6" color="stieglitz">
            Balance
          </Typography>
          <Typography variant="h6">
            {formatAmount(
              getUserReadableAmount(
                userAssetBalances[
                  appContractData.underlyingSymbol.toUpperCase()
                ] ?? '0',
                TOKEN_DECIMALS[chainId]?.[
                  appContractData.underlyingSymbol.toUpperCase()
                ]
              ),
              3,
              true
            )}{' '}
            {appContractData.underlyingSymbol.toUpperCase()}
          </Typography>
        </Box>
      </Box>
      <PoolStats poolType="PUTS" />
      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </Box>
        <Box className="flex space-x-3">
          <LockerIcon />
          <Typography variant="h6" className="text-stieglitz">
            Withdrawals are {disabled ? 'disabled' : 'enabled'}
          </Typography>
        </Box>
        <CustomButton
          size="medium"
          className="w-full mt-4 !rounded-md"
          color={approved ? 'mineshaft' : 'primary'}
          disabled={disabled}
          onClick={approved ? handleDeposit : handleApprove}
        >
          {approved ? 'Deposit' : 'Approve'}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default DepositPanel;
