import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/common/WalletButton';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

export default function Balances() {
  const {
    accountAddress,
    userAssetBalances,
    isLoadingBalances,
    chainId,
    provider,
    updateAssetBalances,
  } = useBoundStore();

  const loadingState = useMemo(() => {
    if (!accountAddress) return 2;
    else if (isLoadingBalances) return 1;
    else return 0;
  }, [accountAddress, isLoadingBalances]);

  useEffect(() => {
    updateAssetBalances();
  }, [provider, updateAssetBalances]);

  return (
    <Box className="mb-4">
      <Typography variant="h5">
        <span className="text-stieglitz">Balances</span>
      </Typography>
      <Box className="bg-cod-gray py-0.5 px-3.5 mt-3 rounded-md text-center">
        {loadingState > 0 ? (
          loadingState === 1 ? (
            <Box className="flex">
              <CircularProgress className="text-stieglitz p-2 my-8 mx-auto" />
            </Box>
          ) : (
            <WalletButton className="my-4">Connect Wallet</WalletButton>
          )
        ) : (
          Object.keys(userAssetBalances)
            .filter(function (asset) {
              return Number(userAssetBalances[asset]) > 0;
            })
            .map((asset, i) => (
              <Box key={i} className={`flex my-5`}>
                <img
                  alt={asset}
                  src={`/images/tokens/${asset.toLowerCase()}.svg`}
                  className="w-7 h-7 object-cover"
                />
                <Typography variant="h5" className="ml-3 mt-0.5">
                  <span className="text-white">
                    {formatAmount(
                      getUserReadableAmount(
                        String(userAssetBalances[asset]),
                        getTokenDecimals(asset, chainId)
                      ),
                      6
                    )}
                  </span>
                </Typography>

                <Box className="bg-umbra p-1 px-3.5 ml-auto mr-2 rounded-md text-center">
                  <Typography variant="h6">
                    <span className="text-stieglitz">{asset}</span>
                  </Typography>
                </Box>
              </Box>
            ))
        )}
      </Box>
    </Box>
  );
}
