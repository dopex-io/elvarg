import { useCallback } from 'react';
import { useRouter } from 'next/router';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useBoundStore } from 'store';

import Stats from '../Stats';

const TopBar = () => {
  const {
    optionScalpData,
    setSelectedPoolName,
    updateOptionScalpUserData,
    updateOptionScalp,
    selectedPoolName,
  } = useBoundStore();
  const router = useRouter();

  const handleSelectChange = useCallback(
    async (e: any) => {
      setSelectedPoolName(e.target.value.toString());
      router.push(
        {
          pathname: '/scalps/' + e.target.value.toString(),
          query: {},
        },
        undefined,
        { shallow: true }
      );
      await updateOptionScalp();
      await updateOptionScalpUserData();
    },
    [router, setSelectedPoolName, updateOptionScalp, updateOptionScalpUserData]
  );

  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center">
        <h5 className="bg-primary rounded-md px-2 font-bold text-[0.5rem] sm:text-[0.8rem] mr-2">
          BETA
        </h5>
        <div className="hidden md:flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${optionScalpData?.baseSymbol!.toLowerCase()}.svg`}
            alt={optionScalpData?.baseSymbol!}
          />
          <img
            className="w-9 h-9 z-0"
            src={`/images/tokens/${optionScalpData?.quoteSymbol!.toLowerCase()}.svg`}
            alt={optionScalpData?.quoteSymbol!}
          />
        </div>
        <div className="flex flex-col mr-2">
          <span className="text-[0.5rem] sm:text-[0.8rem]">Option Scalps</span>
          <Select
            className="text-white h-5 lg:h-8 text-[0.4rem] sm:text-[0.8rem] sm:mt-1 border-2 border-mineshaft"
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
            value={selectedPoolName}
            onChange={handleSelectChange}
          >
            <MenuItem
              value={'ETH'}
              key={'ETH'}
              className="text-white text-[0.5rem] sm:text-[0.8rem] py-1 m-0"
            >
              ETH/USDC
            </MenuItem>
          </Select>
        </div>
      </div>
      <Stats />
    </div>
  );
};

export default TopBar;
