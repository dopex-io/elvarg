import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';

import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { Button } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite, useNetwork } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import useBondingData from 'hooks/rdpx/useBondingData';

import Alert from 'components/common/Alert';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CollateralInputPanel from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/CollateralInputPanel';
import useBondBreakdownCalculator from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/hooks/useBondBreakdownCalculator';
import useBondPanelState from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/hooks/useBondPanelState';
import InfoBox from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/InfoBox';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';

import { DEFAULT_CHAIN_ID } from 'constants/env';
import { DECIMALS_TOKEN } from 'constants/index';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

export type Delegate = {
  _id: number | string;
  delegate: string;
  amount: number | string;
  fee: number | string;
  activeCollateral: number | string;
};

export const DEFAULT_DELEGATE: Delegate = {
  _id: '',
  delegate: '',
  amount: '',
  fee: '',
  activeCollateral: '',
};

export enum BondType {
  Default,
  Delegate,
}

const Bond = () => {
  const [bondType, setBondType] = useState<BondType>(BondType.Default);
  const [amount, setAmount] = useState<string>('');
  const [delegated, setDelegated] = useState<boolean>(false);

  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const { updateRdpxV2CoreState, rdpxV2CoreState } = useBondingData({
    user: account || '0x',
  });
  const inputAmountBreakdown = useBondBreakdownCalculator({
    inputAmount: amount,
    oneBondComposition: rdpxV2CoreState.bondComposition,
  });
  const {
    approved: isRdpxApproved,
    balance: rdpxBalance,
    updateAllowance: updateAllowanceRdpx,
    updateBalance: updateBalanceRdpx,
  } = useTokenData({
    amount: inputAmountBreakdown[0],
    spender: addresses.v2core,
    token: addresses.rdpx,
  });
  const {
    approved: isWethApproved,
    updateAllowance: updateAllowanceWeth,
    balance: wethBalance,
    updateBalance: updateBalanceWeth,
  } = useTokenData({
    amount: inputAmountBreakdown[1],
    spender: addresses.v2core,
    token: addresses.weth,
  });
  const { write: approveRdpx, isSuccess: approveRdpxSuccess } =
    useContractWrite({
      abi: erc20ABI,
      address: addresses.rdpx,
      functionName: 'approve',
      args: [addresses.v2core, inputAmountBreakdown[0]],
    });
  const { write: approveWeth, isSuccess: approveWethSuccess } =
    useContractWrite({
      abi: erc20ABI,
      address: addresses.weth,
      functionName: 'approve',
      args: [addresses.v2core, inputAmountBreakdown[1]],
    });
  const { write: bond, isSuccess: bondSuccess } = useContractWrite({
    abi: RdpxV2Core,
    address: addresses.v2core,
    functionName: 'bond',
    args: [parseUnits(amount, DECIMALS_TOKEN), 0n, account || '0x'],
  });
  const panelState = useBondPanelState({
    amount,
    isRdpxApproved,
    isWethApproved,
    delegated,
    isTotalBondCostBreakdownLessThanUserBalance:
      wethBalance < inputAmountBreakdown[1] ||
      rdpxBalance < inputAmountBreakdown[0],
    approveRdpx,
    approveWeth,
    bond,
  });

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmount(Number(e.target.value) < 0 ? '' : e.target.value);
  };

  useEffect(() => {
    updateBalanceWeth();
  }, [updateBalanceWeth]);

  useEffect(() => {
    updateBalanceRdpx();
  }, [updateBalanceRdpx]);

  useEffect(() => {
    updateAllowanceRdpx();
  }, [updateAllowanceRdpx, approveRdpxSuccess]);

  useEffect(() => {
    updateAllowanceWeth();
  }, [updateAllowanceWeth, approveWethSuccess]);

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState, bondSuccess]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit divide-y-2 divide-cod-gray">
        <PanelInput
          amount={amount}
          handleChange={handleChange}
          maxAmount={rdpxV2CoreState.maxMintableBonds}
          iconPath="/images/tokens/dpxeth.svg"
          label="Max Bonds"
          symbol="Bonds"
        />
        <div className="p-2 justify-between h-fit space-y-1">
          <p className="text-xs my-auto text-stieglitz">Bonding Method</p>
          <ButtonGroup className="flex justify-between border border-mineshaft bg-mineshaft rounded-md p-0.5">
            {[BondType.Default, BondType.Delegate].map((label, index) => (
              <Button
                key={index}
                size="xsmall"
                className="text-white border-0 w-1/2 hover:text-white"
                color={label === bondType ? 'carbon' : 'mineshaft'}
                onClick={() => {
                  setBondType(
                    label === BondType.Delegate
                      ? BondType.Delegate
                      : BondType.Default
                  );
                  setDelegated(label === BondType.Delegate);
                }}
              >
                {label === BondType.Default ? 'rDPX + WETH' : 'rDPX'}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <CollateralInputPanel
          inputAmount={amount}
          setInputAmount={setAmount}
          delegated={delegated}
          bondingMethod={bondType}
        />
      </div>
      {panelState.header ? (
        <Alert
          header={panelState.header}
          severity={panelState.severity}
          body={panelState.body || undefined}
        />
      ) : null}
      <InfoBox value={amount} delegated={delegated} />
      <div className="flex flex-col rounded-xl p-3 w-full bg-umbra space-y-2">
        <InfoRow label="Balance" value={13.11} />
        <InfoRow label="Fees" value={1.1} />
        <InfoRow label="Receipt tokens to be received" value={13.13} />
        <div className="rounded-md p-3 bg-carbon">
          <EstimatedGasCostButton
            gas={500000}
            chainId={chain?.id || DEFAULT_CHAIN_ID}
          />
        </div>
        <Button
          size="medium"
          className="w-full rounded-md"
          color="primary"
          disabled={panelState.disabled}
          onClick={panelState.handler}
        >
          {panelState.label}
        </Button>
      </div>
    </div>
  );
};

export default Bond;
