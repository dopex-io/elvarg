import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';

import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';

import InfoOutlined from '@mui/icons-material/InfoOutlined';

import { Button, Input } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite, useNetwork } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import Alert, { AlertSeverity } from 'components/common/Alert';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography2 from 'components/UI/Typography2';

import { DEFAULT_CHAIN_ID } from 'constants/env';
import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

import useDelegatePanelState from '../../hooks/useDelegatePanelState';
import PanelInput from '../Bond/PanelInput';
import customSliderStyle, { MAX_VAL, MIN_VAL, STEP } from './customSlider';

const Delegate = () => {
  const [amount, setAmount] = useState<string>('');
  const [fee, setFee] = useState<string>('0');

  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const { balance, updateBalance, approved, updateAllowance } = useTokenData({
    token: addresses.weth,
    spender: addresses.v2core || '0x',
    amount,
  });
  const { updateUserBonds, updateUserDelegatePositions } = useRdpxV2CoreData({
    user: account || '0x',
  });
  const { write: approve, isSuccess: approveSuccess } = useContractWrite({
    abi: erc20ABI,
    address: addresses.weth,
    functionName: 'approve',
    args: [addresses.v2core, parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { write: delegate, isSuccess: delegateSuccess } = useContractWrite({
    abi: RdpxV2Core,
    address: addresses.v2core,
    functionName: 'addToDelegate',
    args: [
      parseUnits(amount, DECIMALS_TOKEN),
      parseUnits(fee, DECIMALS_STRIKE),
    ],
  });

  const panelState = useDelegatePanelState({
    balance,
    approved,
    amount,
    approve,
    updateAllowance,
    delegate,
    updateUserDelegatePositions,
  });

  const handleChange = useCallback((e: any) => {
    setAmount(Number(e.target.value) < 0 ? '0' : e.target.value);
  }, []);

  const handleChangeFee = (_: Event, newValue: number | number[]) => {
    setFee(newValue.toString());
  };

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, approveSuccess]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, delegateSuccess]);

  useEffect(() => {
    updateUserBonds();
  }, [updateUserBonds]);

  useEffect(() => {
    updateUserDelegatePositions();
  }, [updateUserDelegatePositions, delegateSuccess]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit divide-y-2 divide-cod-gray">
        <PanelInput
          amount={amount}
          handleChange={handleChange}
          maxAmount={balance}
          iconPath="/images/tokens/weth.svg"
          label="Balance"
          symbol="WETH"
        />
        <div className="flex flex-col bg-umbra p-3 rounded-b-xl space-y-2">
          <div>
            <Typography2 variant="subtitle2" color="stieglitz">
              Delegate Fee
            </Typography2>
            <Tooltip
              title="Fee % to charge the spender of your WETH as bonus to your 75% share of the bond."
              enterTouchDelay={0}
              leaveTouchDelay={1000}
            >
              <InfoOutlined className="fill-current text-stieglitz my-auto p-1" />
            </Tooltip>
          </div>
          <Input
            variant="small"
            type="number"
            outline="mineshaft"
            value={fee}
            onChange={(e: any) =>
              setFee(Number(e.target.value) < 0 ? '0' : e.target.value)
            }
            rightElement={<p className="text-stieglitz pl-2">%</p>}
          />
          <Slider
            sx={customSliderStyle}
            value={Number(fee)}
            onChange={handleChangeFee}
            className="w-auto my-auto mx-2"
            aria-label="steps"
            defaultValue={0.1}
            step={STEP}
            min={MIN_VAL}
            max={MAX_VAL}
            valueLabelDisplay="off"
          />
        </div>
      </div>
      {panelState.header ? (
        <Alert
          header={panelState.header}
          body={panelState.body || ''}
          severity={panelState.severity || AlertSeverity.info}
        />
      ) : null}
      <div className="rounded-xl p-3 w-full bg-umbra">
        <div className="rounded-md flex flex-col p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton
            gas={500000}
            chainId={chain?.id || DEFAULT_CHAIN_ID}
          />
        </div>
        <Button
          size="medium"
          className="w-full mt-2 rounded-md"
          color="primary"
          onClick={panelState.handler}
          disabled={panelState.disabled}
        >
          {panelState.label}
        </Button>
      </div>
    </div>
  );
};

export default Delegate;
