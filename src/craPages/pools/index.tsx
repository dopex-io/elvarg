import { useEffect, useContext, useState } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import format from 'date-fns/format';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import EpochSelector from 'craPages/pools/components/EpochSelector';
import PoolCard from './components/PoolCard';
import PoolSelectorButton from './components/PoolSelectorButton';
import VolumeCard from './components/VolumeCard';
import LendingCard from './components/LendingCard';

import { PoolsContext, PoolsProvider } from 'contexts/Pools';

import getNextFriday from 'utils/date/getNextFriday';

import styles from './styles.module.scss';

enum SelectedPool {
  POOLS,
  VOLUME_POOLS,
  LENDING_POOLS,
}

function Pools() {
  const {
    baseAssetsOptionPoolSdks,
    baseAssetsOptionPoolData,
    selectedEpoch,
    epochInitTime,
  } = useContext(PoolsContext);
  const [selectedPool, setSelectedPool] = useState<SelectedPool>(
    SelectedPool.POOLS
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className="overflow-x-hidden bg-black text-white min-h-screen">
      <Head>
        <title>Pools | Dopex</title>
      </Head>
      <AppBar active="pools" />
      <Box
        className={cx(
          'xl:max-w-6xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto py-16 lg:px-0 px-4',
          styles.containerStyle
        )}
      >
        <Typography variant="h1" className="mb-2 text-white">
          Pools
        </Typography>
        <Typography variant="h5" className="text-stieglitz" maxWidth={600}>
          Supply liquidity to Dopex pools. Collect premiums and earn rDPX as a
          liquidity provider.
        </Typography>
        <EpochSelector className="mt-5" />
        <Box className="flex mt-5">
          <PoolSelectorButton
            title={'Pools'}
            isSelected={selectedPool === SelectedPool.POOLS}
            startIcon={
              <Box className="h-10 w-10 rounded-full flex items-center bg-stieglitz">
                <Typography variant="h5" className="ml-4 mb-1">
                  {baseAssetsOptionPoolSdks.length}
                </Typography>
              </Box>
            }
            subtitle={
              baseAssetsOptionPoolSdks.length > 2
                ? `WETH, WBTC + ${baseAssetsOptionPoolSdks.length - 2} More`
                : `WETH, WBTC`
            }
            onClick={() => setSelectedPool(SelectedPool.POOLS)}
          />
          <PoolSelectorButton
            startIcon={<img src={'/assets/usdt.svg'} alt="USDT" />}
            title={'Volume Pools'}
            subtitle={'USDT'}
            isSelected={selectedPool === SelectedPool.VOLUME_POOLS}
            onClick={() => setSelectedPool(SelectedPool.VOLUME_POOLS)}
          />
          <PoolSelectorButton
            startIcon={<img src={'/assets/usdtlending.svg'} alt="USDT" />}
            title={'Lending Pools'}
            subtitle={'USDT'}
            isSelected={selectedPool === SelectedPool.LENDING_POOLS}
            onClick={() => setSelectedPool(SelectedPool.LENDING_POOLS)}
          />
        </Box>
        {/* <TimePeriodSelector className="mt-1.5" /> */}
        <Box className="flex space-x-4 mt-5">
          <Typography variant="h5" component="div">
            Start:{' '}
            {selectedEpoch === 1
              ? format(new Date(epochInitTime * 1000), 'LLLL d')
              : format(
                  getNextFriday(
                    selectedEpoch - 2,
                    new Date(epochInitTime * 1000)
                  ),
                  'LLLL d'
                )}
          </Typography>
          <Typography variant="h5" component="div">
            End:{' '}
            {format(
              getNextFriday(selectedEpoch - 1, new Date(epochInitTime * 1000)),
              'LLLL d'
            )}
          </Typography>
        </Box>
        <Box className="mt-5 flex-1 flex overflow-auto">
          <Box className="flex min-h-0 space-x-6">
            {selectedPool === SelectedPool.VOLUME_POOLS ? (
              <VolumeCard />
            ) : selectedPool === SelectedPool.LENDING_POOLS ? (
              <LendingCard />
            ) : (
              baseAssetsOptionPoolSdks.map((baseAssetsOptionPoolSdk, index) => (
                <PoolCard
                  key={baseAssetsOptionPoolSdk.baseAsset}
                  baseAssetOptionPoolSdk={baseAssetsOptionPoolSdk}
                  baseAssetOptionPoolData={baseAssetsOptionPoolData[index]}
                  className="inline"
                />
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function PoolsPage() {
  return (
    <PoolsProvider>
      <Pools />
    </PoolsProvider>
  );
}
