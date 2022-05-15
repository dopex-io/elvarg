import { useContext, useMemo } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import cx from 'classnames';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';
import Typography from 'components/UI/Typography';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import Button from '@mui/material/Button';

export default function Sidebar({ className }: { className?: string }) {
  const { userAssetBalances } = useContext(AssetsContext);
  const { chainId } = useContext(WalletContext);

  const readableUserAssetsBalances = useMemo(() => {
    const balances: { [asset: string]: number } = {};
    Object.keys(userAssetBalances).map((asset) => {
      if (Number(userAssetBalances[asset]) > 0)
        balances[asset] = getUserReadableAmount(
          String(userAssetBalances[asset]),
          getTokenDecimals(asset, chainId)
        );
    });

    return balances;
  }, [userAssetBalances]);

  return (
    <Box className={cx('', className)}>
      <Box className="mb-6">
        <Typography variant="h5">
          <span className="text-stieglitz">Balances</span>
        </Typography>
        <Box className="bg-cod-gray py-3 px-3 mt-3 rounded-md text-center">
          {Object.keys(readableUserAssetsBalances).map((asset, i) => (
            <Box
              key={i}
              className={`flex ${
                i === Object.keys(readableUserAssetsBalances).length - 1
                  ? 'mb-0'
                  : 'mb-4'
              }`}
            >
              <img
                src={`/assets/${asset.toLowerCase()}.svg`}
                className="w-8 h-8"
              />
              <Typography variant="h5" className="ml-3 mt-0.5">
                <span className="text-white">
                  {readableUserAssetsBalances[asset]}
                </span>
              </Typography>

              <Box className="bg-umbra p-1 px-3.5 ml-auto mr-2 rounded-md text-center">
                <Typography variant="h6">
                  <span className="text-stieglitz">{asset}</span>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="mb-2">
        <Typography variant="h5">
          <span className="text-stieglitz">Claimable</span>
        </Typography>
        <Box className="bg-cod-gray py-3 px-3 mt-3 rounded-md text-center">
          <Box>
            {' '}
            <Box className="flex">
              <img src={`/assets/dpx.svg`} className="w-8 h-8" />
              <Typography variant="h5" className="ml-3 mt-0.5">
                <span className="text-white">~$3,143</span>
              </Typography>

              <Box className="ml-auto mr-3 mt-1 rounded-md text-center">
                <Typography variant="h6">
                  <span className="text-wave-blue">Details</span>
                </Typography>
              </Box>
            </Box>
            <Button className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 text-white mt-3 w-full">
              Claim
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
