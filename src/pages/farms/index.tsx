import { useContext, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import AppBar from 'components/common/AppBar';
import FarmingMigrationBanner from 'components/common/Banners/FarmingMigrationBanner';
import FarmCard from 'components/farms/FarmCard';
import ManageDialog, {
  BasicManageDialogProps,
} from 'components/farms/ManageDialog';

import { WalletContext } from 'contexts/Wallet';
import { FarmingContext, FarmingProvider, FARMS } from 'contexts/Farming';
import Typography from 'components/UI/Typography';
import ClaimCard from 'components/farms/ClaimCard';

const initialDialogData: BasicManageDialogProps = {
  data: {
    userStakingRewardsBalance: BigNumber.from(0),
    userStakingTokenBalance: BigNumber.from(0),
  },
  open: false,
  status: 'ACTIVE',
  stakingTokenSymbol: '',
  stakingRewardsAddress: '',
  stakingTokenAddress: '',
};

const Farms = () => {
  const { chainId, accountAddress } = useContext(WalletContext);

  const data = useContext(FarmingContext);

  console.log(data);

  const [dialog, setDialog] =
    useState<BasicManageDialogProps>(initialDialogData);

  const handleClose = () => {
    setDialog((prevState) => {
      return { ...prevState, open: false };
    });
  };

  return (
    <Box className="overflow-x-hidden bg-black text-white min-h-screen">
      <Head>
        <title>Farms | Dopex</title>
      </Head>
      {chainId !== 42161 ? <FarmingMigrationBanner /> : null}
      <AppBar active="farms" />
      <Box className="flex mt-44 justify-center mx-auto space-x-4 mb-32">
        <Box className="w-84 flex flex-col space-y-4">
          <Typography variant="h5" className="mb-3">
            Claimable
          </Typography>

          {accountAddress
            ? data.userData.map((item, index) => {
                if (!item) return null;
                if (
                  !item.userRewardsEarned[0]?.isZero() ||
                  !item.userRewardsEarned[1]?.isZero()
                ) {
                  let _farm: any = FARMS[chainId];

                  _farm = _farm[index];
                  return (
                    <ClaimCard
                      key={index}
                      stakingTokenSymbol={_farm.stakingToken}
                      stakingRewardsAddress={_farm.stakingRewardsAddress}
                      userRewardsEarned={item.userRewardsEarned}
                      rewardTokens={_farm.rewardTokens}
                    />
                  );
                }
                return null;
              })
            : 'Please connect your wallet'}
        </Box>
        <Box>
          <Typography variant="h5" className="mb-6">
            Farms
          </Typography>
          <Box className="grid grid-cols-3 gap-6">
            {FARMS[chainId]?.map((farm, index) => {
              return (
                <FarmCard
                  key={index}
                  farmsDataLoading={data.farmsDataLoading}
                  userDataLoading={data.userDataLoading}
                  TVL={data.farmsData[index]?.TVL || 0}
                  APR={data.farmsData[index]?.APR || 0}
                  stakingTokenSymbol={farm.stakingToken}
                  userDeposit={
                    data.userData[index]?.userStakingRewardsBalance ||
                    BigNumber.from(0)
                  }
                  userBalance={
                    data.userData[index]?.userStakingTokenBalance ||
                    BigNumber.from(0)
                  }
                  stakingRewardsAddress={farm.stakingRewardsAddress}
                  stakingTokenAddress={farm.stakingTokenAddress}
                  type={farm.type}
                  status={farm.status}
                  setDialog={setDialog}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
      <ManageDialog {...dialog} handleClose={handleClose} />
    </Box>
  );
};

export const FarmsPage = () => {
  return (
    <FarmingProvider>
      <Farms />
    </FarmingProvider>
  );
};

export default FarmsPage;
