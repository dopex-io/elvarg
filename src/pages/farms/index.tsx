import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { StakingRewards__factory } from '@dopex-io/sdk';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

import Pool from 'components/farms/Pool';
import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import CustomButton from 'components/UI/CustomButton';
import FarmingMigrationBanner from 'components/common/Banners/FarmingMigrationBanner';
import LegacyFarmBanner from 'components/common/Banners/LegacyFarmBanner';

import { FarmingContext } from 'contexts/Farming';
import { WalletContext } from 'contexts/Wallet';
import { FarmingProvider } from 'contexts/Farming';

const Farms = () => {
  const {
    setStakingAsset,
    DPX,
    RDPX,
    DPX_WETH,
    rDPX_WETH,
    setPool,
    DPXPool,
    RDPXPool,
    DPX_WETHPool,
    rDPX_WETHPool,
    legacyFarmBalance,
    checkLegacyFarmBalance,
  } = useContext(FarmingContext);

  const sendTx = useSendTx();

  const { accountAddress, signer, chainId } = useContext(WalletContext);

  const [yourDeposit, setYourDeposit] = useState(0);

  const [totalTVL, setTotalTVL] = useState(0);

  const showBanner = useMemo(() => {
    return chainId !== 42161 ? true : false;
  }, [chainId]);

  const showLegacyFarmBanner = useMemo(() => {
    return chainId == 42161 ? (legacyFarmBalance.gt(0) ? true : false) : false;
  }, [chainId, legacyFarmBalance]);

  useEffect(() => {
    (async function () {
      await Promise.all([
        setPool('DPX'),
        setPool('RDPX'),
        setPool('DPX-WETH'),
        setPool('rDPX-WETH'),
      ]);
    })();
  }, [setPool, chainId]);

  useEffect(() => {
    (async function () {
      if (!accountAddress) return;
      await checkLegacyFarmBalance();
    })();
  }, [accountAddress, checkLegacyFarmBalance]);

  useEffect(() => {
    (async function () {
      if (!accountAddress) return;
      await Promise.all([
        setStakingAsset('DPX'),
        setStakingAsset('RDPX'),
        setStakingAsset('DPX-WETH'),
        setStakingAsset('rDPX-WETH'),
      ]);
    })();
  }, [accountAddress, setStakingAsset]);

  useEffect(() => {
    (function () {
      if (
        !accountAddress ||
        !DPX.userStakedBalance ||
        !DPX_WETH.userStakedBalance ||
        !rDPX_WETH.userStakedBalance ||
        !RDPX.userStakedBalance
      )
        return;
      let numberOfDeposits = 0;
      if (DPX.userStakedBalance > 0) {
        numberOfDeposits++;
      }
      if (DPX_WETH.userStakedBalance > 0) {
        numberOfDeposits++;
      }
      if (rDPX_WETH.userStakedBalance > 0) {
        numberOfDeposits++;
      }
      if (RDPX.userStakedBalance > 0) {
        numberOfDeposits++;
      }
      setYourDeposit(numberOfDeposits);
    })();
  }, [
    accountAddress,
    DPX.userStakedBalance,
    DPX_WETH.userStakedBalance,
    rDPX_WETH.userStakedBalance,
    RDPX.userStakedBalance,
  ]);

  useEffect(() => {
    (function () {
      if (!DPXPool.TVL || !DPX_WETHPool.TVL || !rDPX_WETHPool.TVL) return;
      setTotalTVL(
        DPXPool.TVL.add(DPX_WETHPool.TVL).add(rDPX_WETHPool.TVL).toNumber()
      );
    })();
  }, [DPXPool.TVL, DPX_WETHPool.TVL, rDPX_WETHPool.TVL]);

  const handleClaimAll = useCallback(async () => {
    if (DPX.rewards[0] > 0 || DPX.rewards[1] > 0) {
      try {
        const stakingRewardsContract = StakingRewards__factory.connect(
          DPX.stakingRewardsContractAddress,
          // @ts-ignore TODO: FIX
          signer
        );
        await sendTx(stakingRewardsContract.getReward(2));
        setStakingAsset('DPX');
      } catch (err) {
        console.log(err);
      }
    }

    if (DPX_WETH.rewards[0] > 0 || DPX_WETH.rewards[1] > 0) {
      try {
        const stakingRewardsContract = StakingRewards__factory.connect(
          DPX_WETH.stakingRewardsContractAddress,
          // @ts-ignore TODO: FIX
          signer
        );
        await sendTx(stakingRewardsContract.getReward(2));
        setStakingAsset('DPX-WETH');
      } catch (err) {
        console.log(err);
      }
    }
    if (rDPX_WETH.rewards[0] > 0 || rDPX_WETH.rewards[1] > 0) {
      try {
        const stakingRewardsContract = StakingRewards__factory.connect(
          rDPX_WETH.stakingRewardsContractAddress,
          // @ts-ignore TODO: FIX
          signer
        );
        await sendTx(stakingRewardsContract.getReward(2));
        setStakingAsset('rDPX-WETH');
      } catch (err) {
        console.log(err);
      }
    }
    if (RDPX.rewards[0] > 0 || RDPX.rewards[1] > 0) {
      try {
        const stakingRewardsContract = StakingRewards__factory.connect(
          RDPX.stakingRewardsContractAddress,
          // @ts-ignore TODO: FIX
          signer
        );
        await sendTx(stakingRewardsContract.getReward(2));
        setStakingAsset('RDPX');
      } catch (err) {
        console.log(err);
      }
    }
  }, [DPX, DPX_WETH, rDPX_WETH, RDPX, setStakingAsset, signer, sendTx]);

  const isLoading = useMemo(() => {
    if (accountAddress) {
      if (DPX.loading || DPX_WETH.loading || rDPX_WETH.loading) return true;
      else return false;
    } else {
      if (DPXPool.APR > 0 && DPX_WETHPool.APR > 0 && rDPX_WETHPool.APR > 0)
        return false;
      else return true;
    }
  }, [
    DPXPool.APR,
    DPX_WETHPool.APR,
    rDPX_WETHPool.APR,
    DPX,
    DPX_WETH,
    rDPX_WETH,
    accountAddress,
  ]);

  return (
    <Box className="overflow-x-hidden bg-black text-white min-h-screen">
      <Head>
        <title>Farms | Dopex</title>
      </Head>
      {showBanner && <FarmingMigrationBanner />}
      {showLegacyFarmBanner && <LegacyFarmBanner amount={legacyFarmBalance} />}
      <AppBar active="farms" />
      <Box
        className={`px-2 ${
          showBanner ? 'py-10' : showLegacyFarmBanner ? 'py-10' : 'py-40'
        } max-w-5xl mx-auto`}
      >
        <Box className="text-center flex flex-col mb-14">
          <Typography variant="h1" className="mb-2 text-white">
            Earn Yield on Dopex
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply DPX, DPX-WETH and rDPX-WETH liquidity. Earn DPX {'&'} rDPX.
          </Typography>
        </Box>
        <Box className="flex flex-col">
          <Box className="flex flex-row mb-3 w-full justify-center">
            <Box className="py-2 px-4 bg-cod-gray rounded-xl mb-2 lg:mb-0">
              <Typography variant="h5">
                Total Value Locked:{' '}
                <span className="text-white">${formatAmount(totalTVL)}</span>
              </Typography>
            </Box>
            <Box className="hidden lg:block place-self-end ml-2">
              <CustomButton
                size="medium"
                onClick={handleClaimAll}
                {...(!accountAddress
                  ? { disabled: true }
                  : { disabled: false })}
                className="rounded-md h-10"
              >
                Claim All
              </CustomButton>
            </Box>
          </Box>
          {isLoading ? (
            <Box className="flex flex-col lg:flex-row bg-cod-gray p-4 rounded-xl pt-8 mb-8 items-center lg:w-full mx-auto">
              <Skeleton
                variant="rectangular"
                width={272}
                height={313}
                animation="wave"
                className="lg:mr-3 mb-3"
              />
              <Skeleton
                variant="rectangular"
                width={272}
                height={313}
                animation="wave"
                className="lg:mr-3 mb-3"
              />
              <Skeleton
                variant="rectangular"
                width={272}
                height={313}
                animation="wave"
                className="lg:mr-3 mb-3"
              />
              <Skeleton
                variant="rectangular"
                width={272}
                height={313}
                animation="wave"
                className="mb-3"
              />
            </Box>
          ) : (
            <Box className="flex flex-col lg:flex-row justify-center w-full max-w-xs lg:max-w-6xl mx-auto">
              {yourDeposit > 0 ? (
                <Box className="flex flex-col bg-cod-gray p-4 lg:pl-4 rounded-xl lg:mr-4 mb-8 lg:mb-0 items-center ">
                  <Typography variant="h6" className="text-center mb-4">
                    Your Deposits ({yourDeposit})
                  </Typography>
                  <Box
                    className="flex flex-col lg:flex-row lg:space-x-4 h-full"
                    style={{ height: '-webkit-fill-available' }}
                  >
                    {DPX.userStakedBalance.gt(0) ? (
                      <Pool
                        token={DPX}
                        Icon={'/images/tokens/dpx.svg'}
                        poolInfo={DPXPool}
                      />
                    ) : null}
                    {DPX_WETH.userStakedBalance.gt(0) ? (
                      <Pool
                        token={DPX_WETH}
                        Icon={'/images/tokens/dpx_weth.svg'}
                        poolInfo={DPX_WETHPool}
                      />
                    ) : null}
                    {rDPX_WETH.userStakedBalance.gt(0) ? (
                      <Pool
                        token={rDPX_WETH}
                        Icon={'/images/tokens/rdpx_weth.svg'}
                        poolInfo={rDPX_WETHPool}
                      />
                    ) : null}
                  </Box>
                </Box>
              ) : null}
              {yourDeposit < 3 ? (
                <Box className="flex flex-col bg-cod-gray p-4 rounded-xl lg:mr-4 mb-8 lg:mb-0  items-center">
                  <Box className="grid">
                    <Typography variant="h6" className="text-center mb-4">
                      Available Farms ({3 - yourDeposit})
                    </Typography>
                  </Box>

                  {accountAddress ? (
                    <Box
                      className="flex flex-col lg:flex-row lg:space-x-4"
                      style={{ height: '-webkit-fill-available' }}
                    >
                      {DPX.userStakedBalance.eq(0) ? (
                        <Pool
                          token={DPX}
                          Icon={'/images/tokens/dpx.svg'}
                          poolInfo={DPXPool}
                        />
                      ) : null}
                      {DPX_WETH.userStakedBalance.eq(0) ? (
                        <Pool
                          token={DPX_WETH}
                          Icon={'/images/tokens/dpx_weth.svg'}
                          poolInfo={DPX_WETHPool}
                        />
                      ) : null}
                      {rDPX_WETH.userStakedBalance.eq(0) ? (
                        <Pool
                          token={rDPX_WETH}
                          Icon={'/images/tokens/rdpx_weth.svg'}
                          poolInfo={rDPX_WETHPool}
                        />
                      ) : null}
                    </Box>
                  ) : (
                    <Box
                      className="flex flex-col lg:flex-row lg:space-x-4"
                      style={{ height: '-webkit-fill-available' }}
                    >
                      <Pool
                        token={DPX}
                        Icon={'/images/tokens/dpx.svg'}
                        poolInfo={DPXPool}
                      />
                      <Pool
                        token={DPX_WETH}
                        Icon={'/images/tokens/dpx_weth.svg'}
                        poolInfo={DPX_WETHPool}
                      />
                      <Pool
                        token={rDPX_WETH}
                        Icon={'/images/tokens/rdpx_weth.svg'}
                        poolInfo={rDPX_WETHPool}
                      />
                    </Box>
                  )}
                </Box>
              ) : null}
              {yourDeposit <= 3 ? (
                <Box className="flex flex-col bg-cod-gray p-4 rounded-xl items-center">
                  <Box className="grid">
                    <Typography variant="h6" className="text-center mb-4">
                      Retired Farms (1)
                    </Typography>
                  </Box>

                  <Box
                    className="flex flex-col lg:flex-row lg:space-x-4"
                    style={{ height: '-webkit-fill-available' }}
                  >
                    <Pool
                      token={RDPX}
                      Icon={'/images/tokens/rdpx.svg'}
                      poolInfo={RDPXPool}
                    />
                  </Box>
                </Box>
              ) : null}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const FarmsPage = () => {
  return (
    <>
      <FarmingProvider>
        <Farms />
      </FarmingProvider>
    </>
  );
};
export default FarmsPage;
