import React, { useCallback, useState } from 'react';
import { utils } from 'ethers';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import SearchIcon from '@mui/icons-material/Search';

import cx from 'classnames';
import { NextSeo } from 'next-seo';

import PageLayout from 'components/common/PageLayout';
import Filter from 'components/inu/Filter';

import { formatAmount } from 'utils/general';

import seo from 'constants/seo';

const sortOptions: string[] = [];
const tableHeadings: string[] = [
  'Pool',
  'Inu TVL',
  'Put TVL',
  'Volume',
  'Inu APY',
  'Put APY',
];
const poolKeys: string[] = [
  'pool',
  'inuTvl',
  'putTvl',
  'volume',
  'inuApy',
  'putApy',
];

const Inu = () => {
  const [sortBy, setSortBy] = useState<string>('TVL');
  const [searchText, setSearchText] = useState<string>('');
  const [pools, setPools] = useState([
    {
      pool: 'wstETH/ETH',
      inuTvl: 5400000000000,
      putTvl: 7700000000000,
      volume: 1000000000000,
      inuApy: 5000000,
      putApy: [2000000, 5000000],
    },
  ]);

  const getCellComponent = useCallback((key: string, position: any) => {
    // if (key === 'positions');
    let rightContent: string | null = null;
    let styles = '';
    let data = position[key];
    let dataStyle = '';
    let rightContentStyle = '';

    if (['inuTvl', 'putTvl', 'volume'].includes(key)) {
      data = '$' + formatAmount(Number(utils.formatUnits(data, 6)), 2);
    }

    if ('inuApy' === key) {
      data = formatAmount(Number(utils.formatUnits(data, 6)), 2) + '%';
    }

    if ('putApy' === key) {
      data = (
        <span>
          {formatAmount(Number(utils.formatUnits(data[0], 6)), 2) + '% '}{' '}
          <span className="text-wave-blue ml-2">
            + {formatAmount(Number(utils.formatUnits(data[1], 6)), 2) + '%'} DPX
          </span>
        </span>
      );
    }

    if ('pool' === key) {
      data = (
        <div className="flex">
          <img
            src={'/images/tokens/usdc.svg'}
            alt={'USDC'}
            className="w-7 mr-2"
          />
          {data}
        </div>
      );
    }

    return (
      <span className={cx(styles, 'text-xs md:text-sm text-left text-white')}>
        <span className={dataStyle}>{data}</span>
        <span className={rightContentStyle}>{rightContent}</span>
      </span>
    );
  }, []);

  return (
    <>
      <NextSeo
        title={seo.scalps.title}
        description={seo.scalps.description}
        canonical={seo.scalps.url}
        openGraph={{
          url: seo.scalps.url,
          title: seo.scalps.title,
          description: seo.scalps.description,
          images: [
            {
              url: seo.scalps.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.scalps.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <div className="bg-black flex w-screen">
        <PageLayout>
          <div className="w-full mt-32 h-full">
            <Box className="text-left max-w-xl mb-8 mt-32">
              <h2 className="z-1 mb-1">Inu20</h2>
              <h3 className="text-stieglitz">
                Purchase or write insured yield bearing pegged assets
              </h3>
            </Box>
            <div className="text-gray-400 min-w-[60vw] rounded-lg">
              <div className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
                <div className="flex ml-3">
                  <Filter
                    activeFilters={sortBy}
                    setActiveFilters={setSortBy}
                    text="Sort by"
                    options={sortOptions}
                    multiple={false}
                    showImages={false}
                  />

                  <div className="flex w-42 justify-between border border-umbra rounded-lg mb-3 ml-auto mr-4 mt-1">
                    <Input
                      value={searchText}
                      onChange={(e) => setSearchText(String(e.target.value))}
                      disableUnderline={true}
                      type="string"
                      className="bg-mineshaft text-stieglitz rounded-md px-3"
                      classes={{ input: 'text-right' }}
                      placeholder="Search"
                      startAdornment={
                        <Box className="mr-1.5 mt-1 opacity-80 w-28">
                          <SearchIcon />
                        </Box>
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
                <div className="w-full h-full mx-5 pb-4">
                  <div className="flex flex-col space-y-4 py-2">
                    <div className="grid grid-cols-6 gap-4">
                      {tableHeadings.map((heading, index) => (
                        <span key={index} className="text-xs md:text-sm w-full">
                          {heading}
                        </span>
                      ))}
                      <div className="w-full"></div>
                    </div>
                    {pools.map((pool: any, i: number) => (
                      <div key={i} className="grid grid-cols-6 gap-4">
                        {poolKeys.map((info) => getCellComponent(info, pool))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default Inu;
