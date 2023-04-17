import { useRouter } from 'next/router';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import cx from 'classnames';
import { useBoundStore } from 'store';

import Loading from 'components/zdte/Loading';
import Stats from 'components/zdte/Stats';

import { formatAmount } from 'utils/general';

const TopBar = () => {
  const {
    setSelectedPoolName,
    updateZdteData,
    updateStaticZdteData,
    updateUserZdtePurchaseData,
    selectedPoolName,
    tokenPrices,
    staticZdteData,
    zdteData,
  } = useBoundStore();
  const router = useRouter();

  const item = tokenPrices.find(
    (token) => token.name.toLowerCase() === selectedPoolName.toLowerCase()
  );
  const priceChange = Number(formatAmount(item?.change24h || 0, 2));

  const tokenSymbol = staticZdteData?.baseTokenSymbol.toUpperCase();
  const quoteTokenSymbol = staticZdteData?.quoteTokenSymbol.toUpperCase();

  const handleSelectChange = useCallback(
    async (e: any) => {
      setSelectedPoolName(e.target.value.toString());
      router.push(
        {
          pathname: '/zdte/' + e.target.value.toString(),
          query: {},
        },
        undefined,
        { shallow: true }
      );
      await updateStaticZdteData();
      await updateZdteData();
      await updateUserZdtePurchaseData();
    },
    [
      router,
      setSelectedPoolName,
      updateZdteData,
      updateStaticZdteData,
      updateUserZdtePurchaseData,
    ]
  );

  if (!zdteData || !tokenSymbol || !quoteTokenSymbol || !priceChange) {
    return <Loading />;
  }

  return (
    <>
      <Box className="flex">
        <span className="lg:ml-2 bg-primary rounded-lg p-2 font-bold h-[fit-content] mt-1">
          BETA
        </span>
        <Box sx={{ p: 1 }} className="flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${tokenSymbol?.toLowerCase()}.svg`}
            alt={tokenSymbol}
          />
          <img
            className="w-9 h-9 z-0"
            src={`/images/tokens/${quoteTokenSymbol?.toLowerCase()}.svg`}
            alt={quoteTokenSymbol}
          />
        </Box>
        <Box className="ml-2 flex flex-col">
          <span className="h5 capitalize">zero day to expiry options</span>
          <span
            className={cx(
              Number(priceChange) < 0 ? 'text-down-bad' : 'text-up-only'
            )}
          >{`$${formatAmount(
            zdteData?.tokenPrice,
            2
          )} (${priceChange}%)`}</span>
        </Box>
      </Box>
      <Box className="flex flex-col md:flex-row">
        <div className="mt-2">
          <Select
            className="text-white h-8 border-2 border-mineshaft"
            MenuProps={{
              sx: {
                '.MuiMenu-paper': {
                  background: '#151515',
                  color: 'white',
                  fill: 'white',
                },
              },
            }}
            classes={{
              icon: 'text-white',
            }}
            displayEmpty
            value={selectedPoolName.toUpperCase()}
            onChange={handleSelectChange}
          >
            <MenuItem value={'ETH'} key={'ETH'} className="text-white py-1 m-0">
              ETH/USDC
            </MenuItem>
          </Select>
        </div>
        <Stats />
      </Box>
    </>
  );
};

export default TopBar;