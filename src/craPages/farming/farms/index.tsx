import { StakingRewards__factory } from '@dopex-io/sdk';
import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

import formatAmount from 'utils/general/formatAmount';
import sendTx from 'utils/contracts/sendTx';

import Pool from '../components/Pool';
import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import CustomButton from 'components/UI/CustomButton';
import FarmingMigrationBanner from 'components/Banners/FarmingMigrationBanner';

import { FarmingContext } from 'contexts/Farming';
import { WalletContext } from 'contexts/Wallet';

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
  } = useContext(FarmingContext);

  const { accountAddress, signer, chainId } = useContext(WalletContext);

  const [yourDeposit, setYourDeposit] = useState(0);

  const [totalTVL, setTotalTVL] = useState(0);

  const showBanner = useMemo(() => {
    return chainId !== 42161 ? true : false;
  }, [chainId]);

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
        DPXPool.TVL.add(DPX_WETHPool.TVL)
          .add(rDPX_WETHPool.TVL)
          .add(RDPXPool.TVL)
          .toNumber()
      );
    })();
  }, [DPXPool.TVL, DPX_WETHPool.TVL, rDPX_WETHPool.TVL, RDPXPool.TVL]);

  const handleClaimAll = useCallback(async () => {
    if (DPX.rewards[0] > 0 || DPX.rewards[1] > 0) {
      try {
        const stakingRewardsContract = StakingRewards__factory.connect(
          DPX.stakingRewardsContractAddress,
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
          signer
        );
        await sendTx(stakingRewardsContract.getReward(2));
        setStakingAsset('rDPX-WETH');
      } catch (err) {
        console.log(err);
      }
    }
  }, [DPX, DPX_WETH, rDPX_WETH, setStakingAsset, signer]);

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
      {showBanner && <FarmingMigrationBanner />}
      <AppBar active="farms" />
      <Box
        className={`px-2 ${showBanner ? 'py-10' : 'py-40'} max-w-5xl mx-auto`}
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
                variant="rect"
                width={272}
                height={313}
                animation="wave"
                className="lg:mr-3 mb-3"
              />
              <Skeleton
                variant="rect"
                width={272}
                height={313}
                animation="wave"
                className="lg:mr-3 mb-3"
              />
              <Skeleton
                variant="rect"
                width={272}
                height={313}
                animation="wave"
                className="lg:mr-3 mb-3"
              />
              <Skeleton
                variant="rect"
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
                  <Box className="flex flex-col lg:flex-row lg:space-x-4 h-full">
                    {DPX.userStakedBalance.gt(0) ? (
                      <Pool
                        token={DPX}
                        Icon={'/assets/dpx.svg'}
                        poolInfo={DPXPool}
                      />
                    ) : null}
                    {DPX_WETH.userStakedBalance.gt(0) ? (
                      <Pool
                        token={DPX_WETH}
                        Icon={'/assets/dpx_weth.svg'}
                        poolInfo={DPX_WETHPool}
                      />
                    ) : null}
                    {rDPX_WETH.userStakedBalance.gt(0) ? (
                      <Pool
                        token={rDPX_WETH}
                        Icon={'/assets/rdpx_weth.svg'}
                        poolInfo={rDPX_WETHPool}
                      />
                    ) : null}
                    {RDPX.userStakedBalance.gt(0) ? (
                      <Pool
                        token={RDPX}
                        Icon={'/assets/rdpx.svg'}
                        poolInfo={RDPXPool}
                      />
                    ) : null}
                  </Box>
                </Box>
              ) : null}
              {yourDeposit < 4 ? (
                <Box className="flex flex-col bg-cod-gray p-4 rounded-xl items-center">
                  <Typography variant="h6" className="text-center mb-4">
                    Available Farms ({4 - yourDeposit})
                  </Typography>
                  {accountAddress ? (
                    <Box className="flex flex-col lg:flex-row lg:space-x-4">
                      {DPX.userStakedBalance.eq(0) ? (
                        <Pool
                          token={DPX}
                          Icon={'/assets/dpx.svg'}
                          poolInfo={DPXPool}
                        />
                      ) : null}
                      {DPX_WETH.userStakedBalance.eq(0) ? (
                        <Pool
                          token={DPX_WETH}
                          Icon={'/assets/dpx_weth.svg'}
                          poolInfo={DPX_WETHPool}
                        />
                      ) : null}
                      {rDPX_WETH.userStakedBalance.eq(0) ? (
                        <Pool
                          token={rDPX_WETH}
                          Icon={'/assets/rdpx_weth.svg'}
                          poolInfo={rDPX_WETHPool}
                        />
                      ) : null}
                      {RDPX.userStakedBalance.eq(0) ? (
                        <Pool
                          token={RDPX}
                          Icon={'/assets/rdpx.svg'}
                          poolInfo={RDPXPool}
                        />
                      ) : null}
                    </Box>
                  ) : (
                    <Box className="flex flex-col lg:flex-row lg:space-x-4">
                      <Pool
                        token={DPX}
                        Icon={'/assets/dpx.svg'}
                        poolInfo={DPXPool}
                      />
                      <Pool
                        token={DPX_WETH}
                        Icon={'/assets/dpx_weth.svg'}
                        poolInfo={DPX_WETHPool}
                      />
                      <Pool
                        token={rDPX_WETH}
                        Icon={'/assets/rdpx_weth.svg'}
                        poolInfo={rDPX_WETHPool}
                      />
                      <Pool
                        token={RDPX}
                        Icon={'/assets/rdpx.svg'}
                        poolInfo={RDPXPool}
                      />
                    </Box>
                  )}
                </Box>
              ) : null}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Farms;
