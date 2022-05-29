import { useEffect, useState, useCallback, useContext } from 'react';
import Box from '@mui/material/Box';
import { BigNumber, utils } from 'ethers';
import { ERC20__factory, StakingRewards__factory } from '@dopex-io/sdk';
import { useDebounce } from 'use-debounce';

import useSendTx from 'hooks/useSendTx';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import CustomButton from 'components/UI/CustomButton';
import Tab from 'components/UI/Tab';

import ArrowRightIcon from 'svgs/icons/ArrowRightIcon';

import { WalletContext } from 'contexts/Wallet';

import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

export interface BasicManageDialogProps {
  data: {
    userStakingRewardsBalance: BigNumber;
    userStakingTokenBalance: BigNumber;
    status: 'RETIRED' | 'ACTIVE';
    stakingTokenSymbol: string;
    stakingRewardsAddress: string;
    stakingTokenAddress: string;
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
  const [text, setText] = useState('');
  const [approved, setApproved] = useState(false);

  const [value] = useDebounce(text, 1000);

  const { signer } = useContext(WalletContext);

  const sendTx = useSendTx();

  const handleChange = (e: { target: { value: string } }) => {
    setText(e.target.value);
  };

  const handleMax = () => {
    setText(
      activeTab === 0
        ? utils.formatEther(data.userStakingTokenBalance)
        : utils.formatEther(data.userStakingRewardsBalance)
    );
  };

  useEffect(() => {
    if (!text) {
      return;
    } else if (isNaN(Number(text))) {
      setError('Please only enter numbers');
    } else if (
      activeTab === 0 &&
      utils.parseEther(text).gt(data.userStakingTokenBalance)
    ) {
      setError('Cannot deposit more than wallet balance');
    } else if (
      activeTab === 1 &&
      utils.parseEther(text).gt(data.userStakingRewardsBalance)
    ) {
      setError('Cannot withdraw more than farm balance');
    } else {
      setError('');
    }
  }, [text, data, activeTab]);

  useEffect(() => {
    (async function () {
      if (
        !!error ||
        !signer ||
        !data.stakingRewardsAddress ||
        !data.stakingTokenAddress ||
        !value
      )
        return;

      const _accountAddress = await signer?.getAddress();
      let allowance = await ERC20__factory.connect(
        data.stakingTokenAddress,
        signer
      ).allowance(_accountAddress, data.stakingRewardsAddress);

      if (
        utils.parseEther(value).lte(allowance) &&
        allowance.toString() !== '0'
      ) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [signer, data, value, error]);

  const handleDeposit = useCallback(async () => {
    if (!signer) return;
    try {
      await sendTx(
        StakingRewards__factory.connect(
          data.stakingRewardsAddress,
          signer
        ).stake(utils.parseEther(value))
      );
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, value, data]);

  const handleApprove = useCallback(async () => {
    if (!signer) return;
    try {
      await sendTx(
        ERC20__factory.connect(data.stakingTokenAddress, signer).approve(
          data.stakingRewardsAddress,
          MAX_VALUE
        )
      );
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, data]);

  const handleWithdraw = useCallback(async () => {
    if (!signer) return;
    try {
      await sendTx(
        StakingRewards__factory.connect(
          data.stakingRewardsAddress,
          signer
        ).withdraw(utils.parseEther(value))
      );
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, value, data]);

  return (
    <Dialog open={open} showCloseIcon handleClose={handleClose}>
      <Box className="flex flex-col space-y-3">
        <Typography variant="h5">Manage</Typography>
        <Box className="flex flex-row justify-between p-1 border-[1px] border-umbra rounded-md">
          <Tab
            active={activeTab === 0}
            onClick={() => setActiveTab(0)}
            disabled={data.status === 'RETIRED'}
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
          value={text}
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
