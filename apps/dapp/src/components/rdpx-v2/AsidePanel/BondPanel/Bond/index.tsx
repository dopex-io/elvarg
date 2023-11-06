import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';

import ButtonGroup from '@mui/material/ButtonGroup';

import { Button } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite, useNetwork } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';
import useSqueezeDelegatedWeth from 'hooks/rdpx/useSqueezeDelegatedWeth';

import Alert from 'components/common/Alert';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CollateralInputPanel from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/CollateralInputPanel';
import InfoBox from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/InfoBox';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import useBondBreakdownCalculator from 'components/rdpx-v2/AsidePanel/hooks/useBondBreakdownCalculator';
import useBondPanelState from 'components/rdpx-v2/AsidePanel/hooks/useBondPanelState';
import InfoRow from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/InfoRow';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

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
  const { updateRdpxV2CoreState, rdpxV2CoreState } = useRdpxV2CoreData({
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
    spender: addresses.v2core || '0x',
    token: addresses.rdpx,
  });
  const {
    approved: isWethApproved,
    updateAllowance: updateAllowanceWeth,
    balance: wethBalance,
    updateBalance: updateBalanceWeth,
  } = useTokenData({
    amount: inputAmountBreakdown[1],
    spender: addresses.v2core || '0x',
    token: addresses.weth,
  });
  const { squeezeDelegatesResult } = useSqueezeDelegatedWeth({
    user: account || '0x',
    collateralRequired: inputAmountBreakdown[1],
    bondsToMint: amount,
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
  const { write: delegateBond, isSuccess: delegateBondSuccess } =
    useContractWrite({
      abi: RdpxV2Core,
      address: addresses.v2core,
      functionName: 'bondWithDelegate',
      args: [
        account || '0x',
        squeezeDelegatesResult.amounts,
        squeezeDelegatesResult.ids,
        0n,
      ],
    });
  const panelState = useBondPanelState({
    amount,
    isRdpxApproved,
    isWethApproved,
    delegated,
    isInsufficientWeth:
      squeezeDelegatesResult.wethToBeUsed >=
      squeezeDelegatesResult.totalWethAvailable,
    isTotalBondCostBreakdownLessThanUserBalance:
      wethBalance < inputAmountBreakdown[1] ||
      rdpxBalance < inputAmountBreakdown[0],
    approveRdpx,
    approveWeth,
    bond,
    bondWithDelegate: delegateBond,
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
  }, [updateRdpxV2CoreState, bondSuccess, delegateBondSuccess]);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit divide-y-2 divide-cod-gray">
        <PanelInput
          amount={amount}
          handleChange={handleChange}
          maxAmount={rdpxV2CoreState.maxMintableBonds}
          iconPath="/images/tokens/dpxeth.svg"
          label="Bond Amount"
          symbol="rtETH"
        />
        <div className="p-3 justify-between h-fit space-y-2">
          <Typography2 variant="caption" color="stieglitz">
            Bonding Method
          </Typography2>
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
                      : BondType.Default,
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
      {panelState.severity ? (
        <Alert
          header={panelState.header}
          severity={panelState.severity}
          body={panelState.body || undefined}
        />
      ) : null}
      <InfoBox />
      <div className="flex flex-col rounded-xl p-3 w-full bg-umbra space-y-3">
        <InfoRow
          label="rDPX Balance"
          value={
            <Typography2 variant="caption">
              {formatBigint(rdpxBalance, DECIMALS_TOKEN)} rDPX
            </Typography2>
          }
        />
        <InfoRow
          label="WETH Balance"
          value={
            <Typography2 variant="caption">
              {formatBigint(wethBalance, DECIMALS_TOKEN)} WETH
            </Typography2>
          }
        />
        <InfoRow
          label="Fees"
          value={<Typography2 variant="caption">-</Typography2>}
        />
        <InfoRow
          label="rtETH to be received"
          value={<Typography2 variant="caption">-</Typography2>}
        />
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
