import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { NextSeo } from 'next-seo';
import { useBoundStore } from 'store';
import { Farm, FarmData, UserData } from 'types/farms';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import FarmingMigrationBanner from 'components/common/Banners/FarmingMigrationBanner';
import SushiMigrationBanner from 'components/common/Banners/SushiMigrationBanner';
import ClaimCard from 'components/farms/ClaimCard';
import FarmCard from 'components/farms/FarmCard';
import ManageDialog, {
  BasicManageDialogProps,
} from 'components/farms/ManageDialog';
import QuickLinks from 'components/farms/QuickLinks';

import { FARMS } from 'constants/farms';
import seo from 'constants/seo';

const CustomBox = styled(Box)`
  @media (min-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  @media (min-width: 1536px) {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }
`;

const initialDialogData: BasicManageDialogProps = {
  data: {
    userStakingRewardsBalance: BigNumber.from(0),
    userStakingTokenBalance: BigNumber.from(0),
    status: 'ACTIVE',
    stakingTokenSymbol: '',
    stakingRewardsAddress: '',
    stakingTokenAddress: '',
    version: 0,
  },
  open: false,
};

const Farms = () => {
  const {
    chainId,
    provider,
    accountAddress,
    lpData,
    getFarmData,
    getUserData,
    updateLpData,
  } = useBoundStore();

  const [dialog, setDialog] =
    useState<BasicManageDialogProps>(initialDialogData);
  const [farmsDataLoading, setFarmsDataLoading] = useState<boolean>(false);
  const [farmsData, setFarmsData] = useState<FarmData[]>([]);
  const [userDataLoading, setUserDataLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData[]>([]);

  const handleClose = () => {
    setDialog((prevState) => {
      return { ...prevState, open: false };
    });
  };

  useEffect(() => {
    updateLpData();
  }, [updateLpData, chainId]);

  useEffect(() => {
    async function getAllFarmData() {
      setFarmsDataLoading(true);
      if (!lpData) return;
      const _farms = FARMS[chainId] as Farm[];
      if (_farms) {
        const p = await Promise.all(
          _farms.map((farm) => getFarmData(farm, lpData))
        );
        setFarmsDataLoading(false);
        setFarmsData(p);
      }
    }
    getAllFarmData();
  }, [chainId, getFarmData, lpData]);

  useEffect(() => {
    if (!provider) return;
    (async () => {
      setUserDataLoading(true);
      const p = await Promise.all(
        FARMS[chainId]?.map((farm) => getUserData(farm)) || []
      );

      setUserData(p as UserData[]);
      setUserDataLoading(false);
    })();
  }, [chainId, getUserData, provider]);

  return (
    <Box className="overflow-x-hidden bg-black text-white min-h-screen">
      <NextSeo
        title="Dopex Yield Farms"
        description="Earn rewards for liquidity staking"
        canonical="https://dopex.io/farms"
        openGraph={{
          url: 'https://dopex.io/farms',
          title: 'Dopex Yield Farms',
          description: 'Earn rewards for liquidity staking',
          images: [
            {
              url: seo.farms,
              width: 800,
              height: 500,
              alt: 'veDPX',
              type: 'image/png',
            },
          ],
        }}
      />
      {chainId !== 42161 ? <FarmingMigrationBanner /> : null}
      <AppBar active="Stake" />
      <SushiMigrationBanner />
      <Box className="flex mb-32 justify-end lg:mx-6 lg:space-x-reverse lg:flex-row-reverse flex-col">
        <Box className="mb-4 xl:mb-0 mx-4">
          <Typography variant="h5" className="mb-6">
            Farms
          </Typography>
          {FARMS[chainId]?.filter((farm, index) => {
            if (
              userData[index]?.userStakingRewardsBalance.isZero() &&
              farm.status !== 'ACTIVE'
            )
              return false;
            return true;
          }).length === 0
            ? 'Nothing to show here'
            : null}
          <CustomBox className="grid grid-cols-1 gap-6">
            {FARMS[chainId]?.map((farm, index) => {
              return (
                <FarmCard
                  key={index}
                  setDialog={setDialog}
                  farmsDataLoading={farmsDataLoading}
                  userDataLoading={userDataLoading}
                  stakingTokenSymbol={farm.stakingTokenSymbol}
                  stakingRewardsAddress={farm.stakingRewardsAddress}
                  stakingTokenAddress={farm.stakingTokenAddress}
                  type={farm.type}
                  status={farm.status}
                  version={farm.version}
                  lpData={lpData}
                  TVL={farmsData[index]?.TVL || 0}
                  APR={farmsData[index]?.APR || 0}
                  farmTotalSupply={
                    farmsData[index]?.farmTotalSupply || BigNumber.from(1)
                  }
                  userStakingRewardsBalance={
                    userData[index]?.userStakingRewardsBalance ||
                    BigNumber.from(0)
                  }
                  userStakingTokenBalance={
                    userData[index]?.userStakingTokenBalance ||
                    BigNumber.from(0)
                  }
                />
              );
            })}
          </CustomBox>
        </Box>
        <Box className="lg:w-80 flex flex-col mx-4 space-y-4 justify-between">
          <Box>
            <Typography variant="h5" className="mb-2">
              Claimable
            </Typography>
            {userData.filter((item, index) => {
              if (!item) {
                return false;
              } else if (checkBNZero(item.userRewardsEarned)) {
                let _farms = FARMS[chainId];

                if (!_farms) return false;

                let _farm = _farms[index];

                if (!_farm) return false;

                if (_farm.status === 'CLOSED') return false;

                return true;
              }
              return false;
            }).length === 0
              ? 'Nothing to show here. '
              : null}
            {accountAddress
              ? userData.map((item, index) => {
                  if (!item) return null;
                  if (checkBNZero(item.userRewardsEarned)) {
                    let _farms = FARMS[chainId];

                    if (!_farms) return null;

                    let _farm = _farms[index];

                    if (!_farm) return null;

                    if (_farm.status === 'CLOSED') return null;

                    return (
                      <ClaimCard
                        key={index}
                        farm={_farm}
                        userRewardsEarned={item.userRewardsEarned}
                      />
                    );
                  }
                  return null;
                })
              : 'Please connect your wallet'}
          </Box>
        </Box>
        <QuickLinks />
      </Box>
      <ManageDialog {...dialog} handleClose={handleClose} />
    </Box>
  );
};

export const FarmsPage = () => {
  return <Farms />;
};

export default FarmsPage;

function checkBNZero(arr: BigNumber[]) {
  if (arr.length === 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if ((arr[i] as BigNumber).isZero()) return false;
  }

  return true;
}
