import { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { BigNumber, utils } from 'ethers';
import {
  ERC20__factory,
  StakingRewards__factory,
  StakingRewardsV3__factory,
} from '@dopex-io/sdk';
import { useDebounce } from 'use-debounce';
import Box from '@mui/material/Box';

import useSendTx from 'hooks/useSendTx';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import CustomButton from 'components/UI/CustomButton';
import Tab from 'components/UI/Tab';

import ArrowRightIcon from 'svgs/icons/ArrowRightIcon';

import { useWalletStore } from 'store/Wallet';
import { FarmingContext } from 'contexts/Farming';

import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

import { FarmStatus } from 'types/farms';

export interface BasicManageDialogProps {
  data: {
    userStakingRewardsBalance: BigNumber;
    userStakingTokenBalance: BigNumber;
    status: FarmStatus;
    stakingTokenSymbol: string;
    stakingRewardsAddress: string;
    stakingTokenAddress: string;
    version?: number;
  };
  open: boolean;
}

interface Props extends BasicManageDialogProps {
  handleClose: any;
}

const ManageDialog = (props: Props) => {
  const { data, open, handleClose } = props;

  const [activeTab, setActiveTab] = useState(1);
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
  const [allowance, setAllowance] = useState(BigNumber.from(0));

  const [amount] = useDebounce(value, 1000);

  const { signer, accountAddress } = useWalletStore();
  const { getUserData } = useContext(FarmingContext);

  const sendTx = useSendTx();

  const handleChange = useCallback((e: { target: { value: string } }) => {
    setValue(e.target.value);
  }, []);

  const handleMax = useCallback(() => {
    setValue(
      activeTab === 0
        ? utils.formatEther(data.userStakingTokenBalance)
        : utils.formatEther(data.userStakingRewardsBalance)
    );
  }, [activeTab, data]);

  useEffect(() => {
    if (!value) {
      setError('');
    } else if (isNaN(Number(value))) {
      setError('Please only enter numbers');
    } else if (
      activeTab === 0 &&
      utils.parseEther(value).gt(data.userStakingTokenBalance)
    ) {
      setError('Cannot deposit more than wallet balance');
    } else if (
      activeTab === 1 &&
      utils.parseEther(value).gt(data.userStakingRewardsBalance)
    ) {
      setError('Cannot withdraw more than farm balance');
    } else {
      setError('');
    }
  }, [value, data, activeTab]);

  useEffect(() => {
    (async function () {
      if (!signer || !data.stakingRewardsAddress || !data.stakingTokenAddress)
        return;
      const _accountAddress = await signer?.getAddress();
      let _allowance = await ERC20__factory.connect(
        data.stakingTokenAddress,
        signer
      ).allowance(_accountAddress, data.stakingRewardsAddress);

      setAllowance(_allowance);
    })();
  }, [signer, data]);

  const handleDeposit = useCallback(async () => {
    if (!signer) return;
    try {
      await sendTx(
        StakingRewards__factory.connect(
          data.stakingRewardsAddress,
          signer
        ).stake(utils.parseEther(amount))
      );
      await getUserData();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, amount, data, getUserData, handleClose]);

  const handleApprove = useCallback(async () => {
    if (!signer) return;
    try {
      await sendTx(
        ERC20__factory.connect(data.stakingTokenAddress, signer).approve(
          data.stakingRewardsAddress,
          MAX_VALUE
        )
      );
      setAllowance(BigNumber.from(MAX_VALUE));
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, data]);

  const handleWithdraw = useCallback(async () => {
    if (!signer || !accountAddress) return;
    try {
      if (data.version === 3) {
        await StakingRewardsV3__factory.connect(
          data.stakingRewardsAddress,
          signer
        ).unstake(utils.parseEther(amount));
        await getUserData();
        handleClose();
      } else {
        await sendTx(
          StakingRewards__factory.connect(
            data.stakingRewardsAddress,
            signer
          ).withdraw(utils.parseEther(amount))
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [signer, accountAddress, data, amount, getUserData, handleClose, sendTx]);

  const approved = useMemo(() => {
    return allowance.gte(utils.parseEther(value || '0'));
  }, [allowance, value]);

  return (
    <Dialog open={open} showCloseIcon handleClose={handleClose}>
      <Box className="flex flex-col space-y-3">
        <Typography variant="h5">Manage</Typography>
        <Box className="flex flex-row justify-between p-1 border-[1px] border-umbra rounded-md">
          <Tab
            active={activeTab === 0}
            onClick={() => setActiveTab(0)}
            disabled={data.status !== 'ACTIVE'}
            title="Deposit"
          />
          <Tab
            active={activeTab === 1}
            onClick={() => setActiveTab(1)}
            title="Withdraw"
          />
        </Box>
        <Input
          leftElement={
            <Box className="mr-2 flex space-x-2">
              <img
                src={`/images/tokens/${data.stakingTokenSymbol?.toLowerCase()}.svg`}
                alt={data.stakingTokenSymbol}
                className="w-8 h-8"
              />
              <CustomButton
                size="small"
                color="secondary"
                className="bg-mineshaft px-5 min-w-0"
                onClick={handleMax}
              >
                MAX
              </CustomButton>
            </Box>
          }
          bottomElement={
            <Typography variant="caption" color="stieglitz">
              Balance:{' '}
              {activeTab === 0
                ? utils.formatEther(data.userStakingTokenBalance)
                : utils.formatEther(data.userStakingRewardsBalance)}
            </Typography>
          }
          onChange={handleChange}
          value={value}
          placeholder="0.0"
        />
        <Box className="border-umbra border rounded-lg p-3">
          <Box className="mb-1 flex space-x-1 items-center">
            <Typography variant="h5" color="stieglitz">
              {formatAmount(
                utils.formatEther(data.userStakingRewardsBalance),
                2
              )}
            </Typography>
            <ArrowRightIcon />
            <Typography variant="h5" color="wave-blue">
              {activeTab === 0
                ? formatAmount(
                    Number(utils.formatEther(data.userStakingRewardsBalance)) +
                      Number(value),
                    2
                  )
                : formatAmount(
                    Number(utils.formatEther(data.userStakingRewardsBalance)) -
                      Number(value),
                    2
                  )}
            </Typography>
          </Box>
          <Typography variant="caption" color="stieglitz">
            {activeTab === 0 ? 'Deposit' : 'Withdraw'} Preview
          </Typography>
        </Box>
        {error ? (
          <Typography
            variant="h5"
            color="black"
            className="mb-1 font-medium bg-down-bad rounded-lg p-3"
          >
            {error}
          </Typography>
        ) : null}
        <CustomButton
          size="medium"
          fullWidth
          disabled={!!error || !value}
          onClick={
            activeTab === 0
              ? approved
                ? handleDeposit
                : handleApprove
              : handleWithdraw
          }
        >
          {activeTab === 0 ? (approved ? 'Deposit' : 'Approve') : 'Withdraw'}
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default ManageDialog;
