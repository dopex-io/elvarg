import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';

import InfoOutlined from '@mui/icons-material/InfoOutlined';

import { Button, Input } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import Alert, { AlertSeverity } from 'components/common/Alert';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import customSliderStyle, {
  MARKS,
  MAX_VAL,
  MIN_VAL,
  STEP,
} from 'components/rdpx-v2/AsidePanel/BondPanel/Delegate/customSlider';
import useDelegatePanelState from 'components/rdpx-v2/AsidePanel/hooks/useDelegatePanelState';
import Typography2 from 'components/UI/Typography2';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import DelegateBonds from 'constants/rdpx/abis/DelegateBonds';
import addresses from 'constants/rdpx/addresses';

const Delegate = () => {
  const [amount, setAmount] = useState<string>('');
  const [fee, setFee] = useState<string>('1');

  const { address: user = '0x' } = useAccount();
  const { balance, updateBalance, approved, updateAllowance } = useTokenData({
    token: addresses.weth,
    spender: addresses.delegateBondsV2,
    amount,
  });
  const { updateUserBonds, updateUserDelegatePositions } = useRdpxV2CoreData({
    user,
  });
  const { write: approve, isSuccess: approveSuccess } = useContractWrite({
    abi: erc20ABI,
    address: addresses.weth,
    functionName: 'approve',
    args: [addresses.delegateBondsV2, parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { write: delegate, isSuccess: delegateSuccess } = useContractWrite({
    abi: DelegateBonds,
    address: addresses.delegateBondsV2,
    functionName: 'addToDelegate',
    args: [
      parseUnits(amount, DECIMALS_TOKEN),
      parseUnits(fee, DECIMALS_STRIKE),
      user,
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
    fee,
  });

  const handleChange = useCallback((e: any) => {
    setAmount(Number(e.target.value) < 0 ? '0' : e.target.value);
  }, []);

  const handleChangeFee = (_: Event, newValue: number | number[]) => {
    setFee(newValue.toString());
  };

  const onClickMax = useCallback(() => {
    setAmount(formatUnits(balance, DECIMALS_TOKEN));
  }, [balance]);

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
          handleMax={onClickMax}
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
          <div className="flex w-full">
            <Slider
              sx={customSliderStyle}
              value={Number(fee)}
              onChange={handleChangeFee}
              className="w-full mx-2"
              aria-label="steps"
              defaultValue={0.1}
              step={STEP}
              min={MIN_VAL}
              max={MAX_VAL}
              valueLabelDisplay="auto"
              marks={MARKS}
            />
          </div>
        </div>
      </div>
      {panelState.header ? (
        <Alert
          header={panelState.header}
          body={panelState.body || ''}
          severity={panelState.severity || AlertSeverity.info}
        />
      ) : null}
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
  );
};

export default Delegate;
