import { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import RateVaultCard from 'components/ir/VaultCard';

const NetworkHeader = ({ chainId }: { chainId: number }) => {
  return (
    <Box className="flex space-x-4 mb-8">
      <img
        className="w-8 h-8"
        // @ts-ignore TODO: FIX
        src={CHAIN_ID_TO_NETWORK_DATA[chainId].icon}
        // @ts-ignore TODO: FIX
        alt={CHAIN_ID_TO_NETWORK_DATA[chainId].name}
      />
      <Typography variant="h4">
        {
          // @ts-ignore TODO: FIX
          CHAIN_ID_TO_NETWORK_DATA[chainId].name
        }
      </Typography>
    </Box>
  );
};

const selectedVaultStates = 'Active';

const Vaults = () => {
  const { chainId, provider } = useContext(WalletContext);
  const { tokenPrices } = useContext(AssetsContext);

  const [vaults, setVaults] = useState(null);

  const keys = useMemo(() => {
    if (!vaults) return [];
    else if (chainId === 56) return [56, 42161, 43114, 1088];
    else if (chainId === 43114) return [43114, 42161, 56, 1088];
    else if (chainId === 1088) return [1088, 42161, 56, 43114];
    else return [42161, 56, 43114, 1088];
  }, [vaults, chainId]);

  useEffect(() => {
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`https://dopex-gfs27gdua-dopex-io.vercel.app/api/v2/rateVaults`)
        .then((payload) => payload.data);

      setVaults(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Rate Vaults | Dopex</title>
      </Head>
      <AppBar active="Rate Vaults" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1 mb-4">
            Rate Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards simultaneously.
          </Typography>
        </Box>
        {vaults
          ? keys.map((key) => {
              return (
                <Box key={key} className="mb-12">
                  <NetworkHeader chainId={Number(key)} />
                  <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
                    {/* @ts-ignore TODO: FIX */}
                    {vaults[key]?.map((vault, index) => {
                      let visible: boolean = false;
                      if (
                        (selectedVaultStates.includes('Active') &&
                          !vault.retired) ||
                        (selectedVaultStates.includes('Retired') &&
                          vault.retired)
                      )
                        visible = true;
                      return visible ? (
                        <RateVaultCard key={index} data={{ ...vault }} />
                      ) : null;
                    })}
                  </Box>
                </Box>
              );
            })
          : null}
      </Box>
    </Box>
  );
};

export default Vaults;
