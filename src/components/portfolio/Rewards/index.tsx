import { useContext, useEffect, useState, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { FarmingContext } from 'contexts/Farming';
import { WalletContext } from 'contexts/Wallet';
import { FarmingProvider } from 'contexts/Farming';
import Claimable from '../Claimable';

const Widget = () => {
  const {
    setStakingAsset,
    DPX,
    RDPX,
    DPX_WETH,
    rDPX_WETH,
    setPool,
    DPXPool,
    DPX_WETHPool,
    rDPX_WETHPool,
  } = useContext(FarmingContext);

  const { accountAddress, chainId } = useContext(WalletContext);

  const [yourDeposit, setYourDeposit] = useState(0);

  useEffect(() => {
    (async function () {
      if (!setPool) return;

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
      if (!accountAddress || !setStakingAsset) return;
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
        !DPX?.userStakedBalance ||
        !DPX_WETH?.userStakedBalance ||
        !rDPX_WETH?.userStakedBalance ||
        !RDPX?.userStakedBalance
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
  }, [accountAddress, DPX, DPX_WETH, rDPX_WETH, RDPX]);

  const isLoading = useMemo(() => {
    if (accountAddress) {
      if (DPX?.loading || DPX_WETH?.loading || rDPX_WETH?.loading) return true;
      else return false;
    } else {
      if (DPXPool?.APR > 0 && DPX_WETHPool?.APR > 0 && rDPX_WETHPool?.APR > 0)
        return false;
      else return true;
    }
  }, [
    DPXPool,
    DPX_WETHPool,
    rDPX_WETHPool,
    DPX,
    DPX_WETH,
    rDPX_WETH,
    accountAddress,
  ]);

  return (
    <Box className="mb-2">
      <Typography variant="h5">
        <span className="text-stieglitz">Claimable</span>
      </Typography>
      <Box className="bg-cod-gray py-3 px-3 mt-3 rounded-md text-center">
        <Box>
          {' '}
          {isLoading ? (
            <Box className="flex">
              <CircularProgress className="text-stieglitz p-2 my-8 mx-auto" />
            </Box>
          ) : null}
          {yourDeposit > 0 ? (
            <Box className="w-full pt-1">
              {DPX ? (
                <Claimable
                  token={DPX}
                  Icon={'/assets/dpx.svg'}
                  className="mb-3"
                  poolName="DPX Staking"
                />
              ) : null}
              {DPX_WETH?.userStakedBalance?.gt(0) ? (
                <Claimable
                  token={DPX_WETH}
                  Icon={'/assets/dpx_weth.svg'}
                  className="mb-3"
                  poolName="DPX-ETH LP"
                />
              ) : null}
              {rDPX_WETH?.userStakedBalance?.gt(0) ? (
                <Claimable
                  token={rDPX_WETH}
                  Icon={'/assets/rdpx_weth.svg'}
                  className="mb-3"
                  poolName="rDPX-ETH LP"
                />
              ) : null}
            </Box>
          ) : isLoading ? null : (
            <Box>Nothing to claim</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const Claim = () => {
  return (
    <>
      <FarmingProvider>
        <Widget />
      </FarmingProvider>
    </>
  );
};
export default Claim;
