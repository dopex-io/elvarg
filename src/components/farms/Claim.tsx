import { useCallback, useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { StakingRewards__factory } from '@dopex-io/sdk';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import BalanceItem from 'components/BalanceItem';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { FarmingContext } from 'contexts/Farming';

import useSendTx from 'hooks/useSendTx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
export interface Props {
  open: boolean;
  handleClose: () => {};
  data: {
    token: any;
  };
}

const Claim = ({ open, handleClose, data }: Props) => {
  const { accountAddress, signer } = useContext(WalletContext);
  const { setStakingAsset } = useContext(FarmingContext);
  const sendTx = useSendTx();

  const userRewardDPX = useMemo(() => {
    if (!accountAddress || !data.token.rewards) return;
    return getUserReadableAmount(
      data.token.rewards[0],
      data.token.selectedBaseAssetDecimals
    ).toString();
  }, [
    data.token.rewards,
    data.token.selectedBaseAssetDecimals,
    accountAddress,
  ]);

  const userRewardRDPX = useMemo(() => {
    if (!accountAddress || !data.token.rewards) return;
    return getUserReadableAmount(
      data.token.rewards[1],
      data.token.selectedBaseAssetDecimals
    ).toString();
  }, [
    data.token.rewards,
    data.token.selectedBaseAssetDecimals,
    accountAddress,
  ]);

  const handleClaim = useCallback(async () => {
    try {
      const stakingRewardsContract = StakingRewards__factory.connect(
        data.token.stakingRewardsContractAddress,
        // @ts-ignore TODO: FIX
        signer
      );

      await sendTx(stakingRewardsContract.getReward(2));

      setStakingAsset(data.token.selectedBaseAsset);

      handleClose();
    } catch (err) {
      console.log(err);
    }
  }, [
    data.token.stakingRewardsContractAddress,
    signer,
    handleClose,
    data.token.selectedBaseAsset,
    setStakingAsset,
    sendTx,
  ]);

  return accountAddress ? (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h4" className="mb-6">
        Claim Rewards
      </Typography>
      <Box className="bg-umbra rounded-2xl border border-mineshaft border-opacity-50 p-2 flex flex-col space-y-4 mb-4">
        <BalanceItem
          token="DPX"
          // @ts-ignore TODO: FIX
          balance={userRewardDPX}
          iconSrc="/assets/dpx.svg"
          iconAlt="DPX"
        />
        <BalanceItem
          token="RDPX"
          // @ts-ignore TODO: FIX
          balance={userRewardRDPX}
          iconSrc="/assets/rdpx.svg"
          iconAlt="rDPX"
        />
      </Box>
      <Box className="flex flex-row">
        <CustomButton
          onClick={handleClaim}
          fullWidth
          size="medium"
          className="h-10 mr-3"
        >
          Claim
        </CustomButton>
        <Button
          onClick={handleClose}
          size="medium"
          color="primary"
          variant="outlined"
          fullWidth
          className="h-10"
        >
          Cancel
        </Button>
      </Box>
    </Dialog>
  ) : null;
};

export default Claim;
