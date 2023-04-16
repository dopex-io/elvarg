import { useCallback, useState, useEffect, useMemo } from 'react';
import { MockToken__factory, RdpxV2Treasury__factory } from '@dopex-io/sdk';
import Slider from '@mui/material/Slider';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';
import Error from 'components/rdpx-v2/BondPanel/Error';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import useSendTx from 'hooks/useSendTx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const STEP = 0.1;
const MIN_VAL = 0.1;
const MAX_VAL = 100;

const customSliderStyle = {
  '.MuiSlider-markLabel': {
    color: 'white',
  },
  '.MuiSlider-rail': {
    color: '#3E3E3E',
  },
  '.MuiSlider-mark': {
    color: 'white',
  },
  '.MuiSlider-thumb': {
    color: 'white',
  },
  '.MuiSlider-track': {
    color: '#22E1FF',
  },
};

const Delegate = () => {
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
  }, [fee, value, approved]);

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
      signer
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

  const handleDelegate = useCallback(async () => {
    if (
      !treasuryContractState.contracts ||
      !treasuryContractState.contracts.treasury ||
      !signer
    )
      return;

    const treasury = RdpxV2Treasury__factory.connect(
      treasuryContractState.contracts.treasury.address,
      signer
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
    sendTx,
    signer,
    treasuryContractState.contracts,
    fee,
    value,
    updateTreasuryData,
  ]);

  const updateBalance = useCallback(async () => {
    if (!provider || !accountAddress || !treasuryData.tokenB.address) return;

    const token = MockToken__factory.connect(
      treasuryData.tokenB.address,
      provider
    );

    const _balance = await token.balanceOf(accountAddress);

    setUserBalance(_balance.toString());
  }, [treasuryData, provider, accountAddress]);

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
        provider
      );

      const _allowance = await _token.allowance(
        accountAddress,
        treasuryContractState.contracts.treasury.address
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
                className="w-10 h-10 border border-mineshaft rounded-full"
              />
            </div>
          }
        />
        <div className="flex justify-between px-3 pb-3">
          <span className="text-stieglitz text-sm">Balance</span>
          <div className="flex space-x-1">
            <span className="text-sm">
              {formatAmount(getUserReadableAmount(userBalance, 18), 3)}
            </span>
            <span className="text-sm" color="stieglitz">
              {treasuryData.tokenB.symbol}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="mx-2">
          <span className="text-sm">Fee</span>
          <Tooltip
            title="Fee % to charge the spender of your WETH as bonus to your 75% share of the bond."
            enterTouchDelay={0}
            leaveTouchDelay={1000}
          >
            <InfoOutlined className="fill-current text-stieglitz p-1 my-auto" />
          </Tooltip>
        </div>
        <div className="flex space-x-4 mx-2">
          <Slider
            sx={customSliderStyle}
            value={fee}
            onChange={handleChangeFee}
            className="w-4/5 my-auto ml-2"
            aria-label="steps"
            defaultValue={0.1}
            step={STEP}
            min={MIN_VAL}
            max={MAX_VAL}
            valueLabelDisplay="off"
          />
          <div className="rounded-md bg-gradient-to-r from-primary to-wave-blue p-[1px] w-1/5">
            <div className="flex bg-umbra rounded-md px-1 py-1 w-full h-fit justify-center text-stieglitz">
              <input
                type="number"
                value={fee}
                onChange={(e: any) =>
                  setFee(Number(e.target.value) < 0 ? '0' : e.target.value)
                }
                className="text-sm text-white outline-none text-center bg-inherit w-full"
              />
              %
            </div>
          </div>
        </div>
      </div>
      <div className="mx-2">
        <p className="text-xs text-stieglitz text-justify">
          Receive 75% share of the bonds minted using your collateral plus an
          additional fee from the delegatee's bonding discount. WETH with the
          lowest fee will be used up first.
        </p>
      </div>
      {errorMsg ? <Error errorMsg={errorMsg} /> : null}
      <div className="rounded-xl p-4 w-full bg-umbra">
        <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </div>
        <CustomButton
          size="medium"
          className="w-full mt-4 rounded-md"
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

export default Delegate;
