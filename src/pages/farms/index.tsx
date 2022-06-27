/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { useContext, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';
import { css } from '@emotion/react';

import AppBar from 'components/common/AppBar';
import FarmingMigrationBanner from 'components/common/Banners/FarmingMigrationBanner';
import FarmCard from 'components/farms/FarmCard';
import ManageDialog, {
  BasicManageDialogProps,
} from 'components/farms/ManageDialog';
import Typography from 'components/UI/Typography';
import ClaimCard from 'components/farms/ClaimCard';
import QuickLinks from 'components/farms/QuickLinks';

import { WalletContext } from 'contexts/Wallet';
import { FarmingContext, FarmingProvider } from 'contexts/Farming';

import { FARMS } from 'constants/farms';

const initialDialogData: BasicManageDialogProps = {
  data: {
    userStakingRewardsBalance: BigNumber.from(0),
    userStakingTokenBalance: BigNumber.from(0),
    status: 'ACTIVE',
    stakingTokenSymbol: '',
    stakingRewardsAddress: '',
    stakingTokenAddress: '',
  },
  open: false,
};

const Farms = () => {
  const { chainId, accountAddress } = useContext(WalletContext);

  const data = useContext(FarmingContext);

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
      <Box className="flex mt-32 justify-end lg:mx-6 lg:space-x-reverse mb-32 lg:flex-row-reverse flex-col">
        <Box className="mb-4 xl:mb-0 mx-4">
          <Typography variant="h5" className="mb-6">
            Farms
          </Typography>
          {FARMS[chainId]?.filter((farm, index) => {
            if (
              data.userData[index]?.userStakingRewardsBalance.isZero() &&
              farm.status === 'RETIRED'
            )
              return false;
            return true;
          }).length === 0
            ? 'Nothing to show here'
            : null}
          <Box
            className="grid grid-cols-1 gap-6"
            css={css`
              @media (min-width: 1100px) {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
              @media (min-width: 1536px) {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              }
            `}
          >
            {FARMS[chainId]?.map((farm, index) => {
              return (
                <FarmCard
                  key={index}
                  setDialog={setDialog}
                  farmsDataLoading={data.farmsDataLoading}
                  userDataLoading={data.userDataLoading}
                  stakingTokenSymbol={farm.stakingTokenSymbol}
                  stakingRewardsAddress={farm.stakingRewardsAddress}
                  newStakingRewardsAddress={farm?.newStakingRewardsAddress}
                  stakingTokenAddress={farm.stakingTokenAddress}
                  type={farm.type}
                  status={farm.status}
                  version={farm.version}
                  lpData={data.lpData}
                  TVL={data.farmsData[index]?.TVL || 0}
                  APR={data.farmsData[index]?.APR || 0}
                  farmTotalSupply={
                    data.farmsData[index]?.farmTotalSupply || BigNumber.from(1)
                  }
                  userStakingRewardsBalance={
                    data.userData[index]?.userStakingRewardsBalance ||
                    BigNumber.from(0)
                  }
                  userStakingTokenBalance={
                    data.userData[index]?.userStakingTokenBalance ||
                    BigNumber.from(0)
                  }
                />
              );
            })}
          </Box>
        </Box>
        <Box className="lg:w-80 flex flex-col mx-4 space-y-4">
          <Typography variant="h5" className="mb-2">
            Claimable
          </Typography>
          {data.userData.filter((item, index) => {
            if (!item) {
              return false;
            } else if (checkBNZero(item.userRewardsEarned)) {
              let _farms = FARMS[chainId];

              if (!_farms) return false;

              let _farm = _farms[index];

              if (!_farm) return false;

              return true;
            }
            return false;
          }).length === 0
            ? 'Nothing to show here. '
            : null}
          {accountAddress
            ? data.userData.map((item, index) => {
                if (!item) return null;
                if (checkBNZero(item.userRewardsEarned)) {
                  let _farms = FARMS[chainId];

                  if (!_farms) return null;

                  let _farm = _farms[index];

                  if (!_farm) return null;

                  return (
                    <ClaimCard
                      key={index}
                      stakingTokenSymbol={_farm.stakingTokenSymbol}
                      stakingRewardsAddress={_farm.stakingRewardsAddress}
                      userRewardsEarned={item.userRewardsEarned}
                      rewardTokens={_farm.rewardTokens}
                    />
                  );
                }
                return null;
              })
            : 'Please connect your wallet'}
          <QuickLinks />
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

function checkBNZero(arr: BigNumber[]) {
  if (arr.length === 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if ((arr[i] as BigNumber).isZero()) return false;
  }

  return true;
}
