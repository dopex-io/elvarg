import { useCallback, useContext, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { StakingRewards__factory } from '@dopex-io/sdk';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import BalanceItem from 'components/BalanceItem';

import { WalletContext } from 'contexts/Wallet';
import { FarmingContext } from 'contexts/Farming';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { newEthersTransaction } from 'utils/contracts/transactions';

import dpxIcon from 'assets/tokens/dpx.svg';
import rdpxIcon from 'assets/tokens/rdpx.svg';

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
        signer
      );

      await newEthersTransaction(stakingRewardsContract.getReward(2));

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
  ]);

  return accountAddress ? (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h4" className="mb-6">
        Claim Rewards
      </Typography>
      <Box className="flex flex-col justify-left mb-8 space-y-4">
        <BalanceItem
          token="DPX"
          balance={userRewardDPX}
          iconSrc={dpxIcon}
          iconAlt="DPX"
        />
        <BalanceItem
          token="RDPX"
          balance={userRewardRDPX}
          iconSrc={rdpxIcon}
          iconAlt="rDPX"
        />
      </Box>
      <Box className="flex flex-row">
        <Button
          onClick={handleClaim}
          color="primary"
          variant="contained"
          fullWidth
          className="h-10 mr-3"
        >
          Claim
        </Button>
        <Button
          onClick={handleClose}
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
