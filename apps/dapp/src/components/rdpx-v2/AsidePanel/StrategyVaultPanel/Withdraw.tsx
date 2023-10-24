import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import { MockToken__factory, RdpxV2Treasury__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Error from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/Error';
import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

// const STEP = 0.1;
// const MIN_VAL = 0.1;
// const MAX_VAL = 100;

// const customSliderStyle = {
//   '.MuiSlider-markLabel': {
//     color: 'white',
//   },
//   '.MuiSlider-rail': {
//     color: '#3E3E3E',
//   },
//   '.MuiSlider-mark': {
//     color: 'white',
//   },
//   '.MuiSlider-thumb': {
//     color: 'white',
//   },
//   '.MuiSlider-track': {
//     color: '#22E1FF',
//   },
// };

const Withdraw = () => {
  const {
    accountAddress,
    provider,
    chainId,
    treasuryContractState,
    treasuryData,
    updateTreasuryData,
    signer,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [value, setValue] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<string>('0');
  const [approved, setApproved] = useState<boolean>();
  const [fee, setFee] = useState<number>(0);

  const errorMsg = useMemo(() => {
    if (getContractReadableAmount(value, 18).gt(userBalance))
      return 'Insufficient Balance.';
    else if (fee > 100 || fee < 0) return 'Fee must be 0-100%';
    return false;
  }, [value, userBalance, fee]);

  const handleChange = useCallback((e: any) => {
    setValue(Number(e.target.value) < 0 ? '' : e.target.value);
  }, []);

  const handleChangeFee = (_: Event, newValue: number | number[]) => {
    setFee(newValue as number);
  };

  const handleApprove = useCallback(async () => {
    if (
      !signer ||
      !accountAddress ||
      !treasuryData ||
      !treasuryContractState.contracts
    )
      return;

    const _token = MockToken__factory.connect(
      treasuryData.tokenB.address,
      signer,
    );

    try {
      await sendTx(_token, 'approve', [
        treasuryContractState.contracts.treasury.address,
        getContractReadableAmount(value, 18),
      ]).then(() => {
        setApproved(true);
      });
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    sendTx,
    signer,
    treasuryContractState.contracts,
    treasuryData,
    value,
  ]);

  const updateBalance = useCallback(async () => {
    if (!provider || !accountAddress || !treasuryData.tokenB.address) return;

    const token = MockToken__factory.connect(
      treasuryData.tokenB.address,
      provider,
    );

    const _balance = await token.balanceOf(accountAddress);

    setUserBalance(_balance.toString());
  }, [treasuryData, provider, accountAddress]);

  const handleDelegate = useCallback(async () => {
    if (
      !treasuryContractState.contracts ||
      !treasuryContractState.contracts.treasury ||
      !signer
    )
      return;

    const treasury = RdpxV2Treasury__factory.connect(
      treasuryContractState.contracts.treasury.address,
      signer,
    );

    try {
      await sendTx(treasury, 'addToDelegate', [
        getContractReadableAmount(value, 18),
        getContractReadableAmount(fee, 8),
      ]).then(() => {
        updateTreasuryData();
        updateBalance();
      });
    } catch (e) {
      console.log(e);
    }
  }, [
    treasuryContractState.contracts,
    signer,
    sendTx,
    value,
    fee,
    updateTreasuryData,
    updateBalance,
  ]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  useEffect(() => {
    (async () => {
      if (
        !provider ||
        !accountAddress ||
        !treasuryData ||
        !treasuryContractState.contracts
      )
        return;

      const _token = MockToken__factory.connect(
        treasuryData.tokenB.address,
        provider,
      );

      const _allowance = await _token.allowance(
        accountAddress,
        treasuryContractState.contracts.treasury.address,
      );

      setApproved(_allowance.gte(getContractReadableAmount(value, 18)));
    })();
  }, [accountAddress, provider, treasuryData, treasuryContractState, value]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit">
        <Input
          type="number"
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          leftElement={
            <div className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/${
                  treasuryData.tokenB.symbol.toLowerCase() || 'weth'
                }.svg`}
                alt={treasuryData.tokenB.symbol.toLowerCase()}
                className="w-9 h-9 border border-mineshaft rounded-full"
              />
            </div>
          }
          className="py-1"
        />
        <div className="flex justify-between px-3 pb-3">
          <span className="text-stieglitz text-sm">Withdrawal Amount</span>
          <div className="flex space-x-1">
            <img
              src="/assets/max.svg"
              className="hover:bg-silver rounded-[4px] mr-1"
              alt="max"
            />
            <span className="text-sm">
              {formatAmount(
                getUserReadableAmount(BigNumber.from(userBalance), 18),
                3,
              )}
            </span>
            <span className="text-sm text-stieglitz">ESV</span>
          </div>
        </div>
      </div>
      <div className="bg-umbra rounded-xl p-3">
        <span className="text-sm mb-1">Withdrawals</span>
        <p className="text-xs text-stieglitz text-justify">
          Explanation of withdrawals
        </p>
      </div>
      {errorMsg ? <Error errorMsg={errorMsg} /> : null}
      <div className="rounded-xl p-4 w-full bg-umbra">
        <div className="bg-umbra rounded-2xl">
          <div className="flex flex-col p-0 w-full">
            <div className="flex mb-2">
              <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
                Balance
              </h6>
              <div className="text-right">
                <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                  13.11 <span className="text-stieglitz">ESV</span>
                </h6>
              </div>
            </div>

            <div className={'flex mb-2'}>
              <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
                You will receive
              </h6>
              <div className={'text-right'}>
                <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                  6 <span className="text-stieglitz">rDPX</span> 2.5{' '}
                  <span className="text-stieglitz">ETH</span>{' '}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md flex flex-col p-4 pt-2 mt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </div>
        <CustomButton
          size="medium"
          className="w-full mt-2 rounded-md"
          color="primary"
          onClick={approved ? handleDelegate : handleApprove}
          disabled={!Number(value) || Boolean(errorMsg)}
        >
          {approved ? 'Delegate' : 'Approve'}
        </CustomButton>
      </div>
    </div>
  );
};

export default Withdraw;
