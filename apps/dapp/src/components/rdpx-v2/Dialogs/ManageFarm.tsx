import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { CircularProgress } from '@mui/material';

import { Button, Dialog } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import useRewardAPR from 'hooks/rdpx/useRewardAPR';

import RowItem from 'components/common/RowItem';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import addresses from 'constants/rdpx/addresses';

interface Props {
  open: boolean;
  handleClose: () => void;
  data: any;
}

export enum PanelState {
  Unstake,
}

const ManageFarm = ({ open, handleClose, data }: Props) => {
  const [amount, setAmount] = useState<string>('');
  const [panelState, setPanelState] = useState<PanelState>(PanelState.Unstake);

  const { address: user = '0x' } = useAccount();
  const {
    allowance: stakingAllowance,
    updateAllowance: updateStakingAllowance,
    approved: approvedStaking,
  } = useTokenData({
    amount: '0',
    spender: addresses.rtethEthStaking,
    token: addresses.rtethEthLp,
  });
  const { writeAsync: approveStaking } = useContractWrite({
    abi: erc20ABI,
    address: addresses.rtethEthLp,
    functionName: 'approve',
    args: [addresses.rtethEthStaking, parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { data: walletBalance = 0n, refetch: refetchWalletBalance } =
    useContractRead({
      abi: erc20ABI,
      address: addresses.rtethEthLp,
      functionName: 'balanceOf',
      args: [user],
    });
  const { data: stakedBalance = 0n, refetch: refetchStakedBalance } =
    useContractRead({
      abi: CurveMultiRewards,
      address: addresses.rtethEthStaking,
      functionName: 'balanceOf',
      args: [user],
    });
  const {
    writeAsync: unstake,
    isLoading: unstaking,
    reset: resetUnstakeHook,
  } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.rtethEthStaking,
    functionName: 'withdraw',
    args: [parseUnits(amount, DECIMALS_TOKEN)],
  });
  const { rtethEthRewardAPR } = useRewardAPR();

  const onChange = useCallback((e: any) => {
    setAmount(e.target.value);
  }, []);

  const onClickMax = useCallback(() => {
    setAmount(formatUnits(stakedBalance, DECIMALS_TOKEN));
  }, [stakedBalance]);

  const loading = useMemo(() => unstaking, [unstaking]);

  const resetState = useCallback(async () => {
    await Promise.all([refetchWalletBalance(), refetchStakedBalance()]);
    setAmount('');
  }, [refetchStakedBalance, refetchWalletBalance]);

  const transact = useCallback(() => {
    try {
      if (panelState === PanelState.Unstake) {
        unstake().then(() => resetState());
      }
    } catch (e) {
      console.error(e);
    }
  }, [panelState, resetState, unstake]);

  useEffect(() => {
    updateStakingAllowance();
  }, [updateStakingAllowance]);

  return (
    <Dialog
      title="Manage LP"
      isOpen={open}
      handleClose={() => {
        handleClose();
        resetUnstakeHook();
      }}
      showCloseIcon
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between bg-umbra rounded-md p-0.5">
          {[PanelState.Unstake].map((label, index) => (
            <Button
              key={index}
              size="xsmall"
              className="text-white border-0 w-full hover:text-white"
              color={label === panelState ? 'carbon' : 'umbra'}
              onClick={() => {
                setPanelState(PanelState.Unstake);
              }}
            >
              Unstake
            </Button>
          ))}
        </div>
        <PanelInput
          amount={amount}
          handleChange={onChange}
          maxAmount={stakedBalance}
          handleMax={onClickMax}
          iconPath="/images/tokens/rteth.svg"
          label="Balance"
          symbol="LP"
        />
        <div className="flex flex-col space-y-2 border border-carbon p-2 rounded-md">
          <RowItem
            label="Staked"
            content={`${Number(
              formatUnits(stakedBalance, DECIMALS_TOKEN),
            ).toFixed(3)} rtETH-WETH LP`}
          />
          <RowItem label="APR" content={`${rtethEthRewardAPR} %`} />
        </div>
        <Button size="small" onClick={transact} disabled={loading}>
          {loading ? <CircularProgress size={16} /> : null}
          Unstake
        </Button>
      </div>
    </Dialog>
  );
};

export default ManageFarm;
