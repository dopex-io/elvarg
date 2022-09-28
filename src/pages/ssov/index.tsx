import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { isEmpty } from 'lodash';

import { useBoundStore } from 'store';

import { CHAIN_ID_TO_NETWORK_DATA, DOPEX_API_BASE_URL } from 'constants/index';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import LegacyEpochsDropDown from 'components/ssov/LegacyEpochsDropDown/LegacyEpochsDropDown';
import SsovCard from 'components/ssov/SsovCard';
import SsovFilter from 'components/ssov/SsovFilter';

import formatAmount from 'utils/general/formatAmount';

const ssovStrategies: string[] = ['CALL', 'PUT'];
const sortOptions: string[] = ['TVL', 'APY'];

const NetworkHeader = ({ chainId }: { chainId: number }) => {
  return (
    <Box className="flex space-x-4 mb-8">
      <img
        className="w-8 h-8"
        src={CHAIN_ID_TO_NETWORK_DATA[chainId]!.icon}
        alt={CHAIN_ID_TO_NETWORK_DATA[chainId]!.name}
      />
      <Typography variant="h4">
        {CHAIN_ID_TO_NETWORK_DATA[chainId]!.name}
      </Typography>
    </Box>
  );
};

const Ssov = () => {
  const { chainId, provider, tokenPrices } = useBoundStore();

  const [ssovs, setSsovs] = useState<{ [key: string]: any }>({});
  const [selectedSsovTokens, setSelectedSsovTokens] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('TVL');

  const tvl = useMemo(() => {
    let total = 0;
    if (isEmpty(ssovs)) return total;

    total = Object.keys(ssovs).reduce((acc, key) => {
      return (
        acc +
        ssovs[key]?.reduce(
          (_acc: number, ssov: { tvl: string }) =>
            (_acc += parseFloat(ssov.tvl)),
          0
        )
      );
    }, 0);

    return total;
  }, [ssovs]);

  const keys = useMemo(() => {
    if (!ssovs) return [];
    else if (chainId === 56) return [56, 42161, 43114];
    else if (chainId === 43114) return [43114, 42161, 56];
    // else if (chainId === 1088) return [1088, 42161, 56, 43114];
    else return [42161, 56, 43114];
  }, [ssovs, chainId]);

  const ssovsTokens = useMemo(() => {
    if (!ssovs) return [];

    const tokensSet = new Set<string>();

    Object.keys(ssovs).forEach((key) => {
      ssovs[key].forEach((so: { underlyingSymbol: string }) =>
        tokensSet.add(so.underlyingSymbol)
      );
    });

    const tokens = Array.from(tokensSet);

    return tokens.sort((a, b) => (a > b ? 1 : -1));
  }, [ssovs]);

  useEffect(() => {
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`${DOPEX_API_BASE_URL}/v2/ssov`)
        .then((payload) => payload.data);

      setSsovs(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1">
            Single Staking Option Vaults
          </Typography>
          <Box
            className={
              'mb-6 mt-5 opacity-90 bg-white ml-auto mr-auto w-[5rem] rounded-md p-[0.3px]'
            }
          >
            <Typography variant="h6" className="text-umbra text-[0.7rem]">
              TVL ${formatAmount(tvl, 0)}
            </Typography>
          </Box>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards simultaneously.
          </Typography>
        </Box>
        <LegacyEpochsDropDown />
        <Box className="mb-4 flex flex-wrap justify-center">
          <SsovFilter
            activeFilters={selectedSsovTokens}
            setActiveFilters={setSelectedSsovTokens}
            text="Tokens"
            options={ssovsTokens}
            multiple={true}
            showImages={true}
          />
          <SsovFilter
            activeFilters={selectedTypes}
            setActiveFilters={setSelectedTypes}
            text="Type"
            options={ssovStrategies}
            multiple={true}
            showImages={false}
          />
          <SsovFilter
            activeFilters={sortBy}
            setActiveFilters={setSortBy}
            text="Sort by"
            options={sortOptions}
            multiple={false}
            showImages={false}
          />
        </Box>
        {!isEmpty(ssovs)
          ? keys.map((key) => {
              return (
                <Box key={key} className="mb-12">
                  <NetworkHeader chainId={Number(key)} />
                  <Box className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 place-items-center gap-y-10">
                    {ssovs
                      ? ssovs[key]
                          .sort(
                            (
                              a: { [x: string]: string },
                              b: { [x: string]: string }
                            ) =>
                              parseFloat(a[sortBy.toLowerCase()]!) <
                              parseFloat(b[sortBy.toLowerCase()]!)
                                ? 1
                                : -1
                          )
                          .map(
                            (
                              ssov: {
                                underlyingSymbol: any;
                                type: string;
                                retired: any;
                              },
                              index: number
                            ) => {
                              let visible: boolean = false;
                              if (
                                (selectedSsovTokens.length === 0 ||
                                  selectedSsovTokens.includes(
                                    ssov.underlyingSymbol
                                  )) &&
                                (selectedTypes.length === 0 ||
                                  selectedTypes.includes(
                                    ssov.type.toUpperCase()
                                  ))
                              )
                                visible = true;
                              return visible ? (
                                <SsovCard key={index} data={{ ...ssov }} />
                              ) : null;
                            }
                          )
                      : null}
                  </Box>
                </Box>
              );
            })
          : null}
      </Box>
    </Box>
  );
};

export default Ssov;
