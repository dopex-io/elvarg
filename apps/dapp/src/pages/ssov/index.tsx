import { useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useQuery } from '@tanstack/react-query';
import graphSdk from 'graphql/graphSdk';
import isEmpty from 'lodash/isEmpty';
import { NextSeo } from 'next-seo';
import queryClient from 'queryClient';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import SsovCard from 'components/ssov/SsovCard';
import SsovFilter from 'components/ssov/SsovFilter';
import SsovStat from 'components/ssov/Stats/SsovStat';

import { getUserReadableAmount } from 'utils/contracts';
import formatAmount from 'utils/general/formatAmount';

import { CHAINS } from 'constants/chains';
import { DOPEX_API_BASE_URL } from 'constants/env';
import { DECIMALS_TOKEN } from 'constants/index';
import seo from 'constants/seo';

const ssovStrategies: string[] = ['CALL', 'PUT'];
const sortOptions: string[] = ['TVL', 'APY'];

const NetworkHeader = ({ chainId }: { chainId: number }) => {
  return (
    <Box className="flex space-x-4 mb-8">
      <img
        className="w-8 h-auto"
        src={CHAINS[chainId]!.icon}
        alt={CHAINS[chainId]!.name}
      />
      <Typography variant="h4">{CHAINS[chainId]!.name}</Typography>
    </Box>
  );
};

export async function getVolume(payload: any, wantContract: string) {
  if (!payload.ssov_ssovoptionPurchases) return BigNumber.from(0);

  const _twentyFourHourVolume: BigNumber =
    payload.ssov_ssovoptionPurchases.reduce((acc: BigNumber, trade: any) => {
      const address = trade.ssov;
      if (address.id.toLowerCase() === wantContract.toLowerCase()) {
        return acc.add(BigNumber.from(trade.amount));
      } else {
        return acc;
      }
    }, BigNumber.from(0));
  return _twentyFourHourVolume;
}

const SsovData = () => {
  const { isLoading, error, data } = useQuery(['ssovData'], () =>
    fetch(`${DOPEX_API_BASE_URL}/v2/ssov`).then((res) => res.json())
  );

  const { data: tradesData } = useQuery(
    ['getSsovPurchasesFromTimestamp'],
    async () =>
      queryClient.fetchQuery({
        queryKey: ['getSsovPurchasesFromTimestamp'],
        queryFn: () =>
          graphSdk.getSsovPurchasesFromTimestamp({
            fromTimestamp: (new Date().getTime() / 1000 - 86400).toFixed(0),
          }),
      })
  );

  let ssovs: any;
  if (!isLoading || !error) {
    ssovs = data;
  }

  const [selectedSsovTokens, setSelectedSsovTokens] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [total24hVol, setTotal24hVol] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('TVL');
  const [ssovsWithVol, setSsovsWithVol] = useState<any>({});

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

  const openInterest = useMemo(() => {
    let total = 0;
    if (isEmpty(ssovs)) return total;

    total = Object.keys(ssovs).reduce((acc, key) => {
      return (
        acc +
        ssovs[key]?.reduce(
          (
            _acc: number,
            ssov: { totalEpochPurchases: string; underlyingPrice: string }
          ) =>
            (_acc +=
              parseFloat(ssov.totalEpochPurchases) *
              parseFloat(ssov.underlyingPrice)),
          0
        )
      );
    }, 0);

    return total;
  }, [ssovs]);

  const keys = useMemo(() => {
    if (!ssovs) return [];
    else return [42161, 137];
  }, [ssovs]);

  useEffect(() => {
    async function getVolumes() {
      if (!ssovs || !tradesData) return [];
      let ssovsVol: any = {};
      let totalVol = 0;
      for (const key of Object.keys(ssovs)) {
        for (const so of ssovs[key]) {
          const volume = await getVolume(tradesData, so.address);
          if (!ssovsVol[key]) ssovsVol[key] = [];
          const volumeInUSD =
            getUserReadableAmount(volume, DECIMALS_TOKEN) * so.underlyingPrice;
          totalVol += volumeInUSD;
          ssovsVol[key].push({
            ...so,
            volume: volumeInUSD,
          });
        }
      }
      setSsovsWithVol(ssovsVol);
      setTotal24hVol(totalVol);
    }
    getVolumes();
  }, [ssovs, tradesData]);

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

  if (isLoading) {
    return (
      <Box className="absolute left-[49%] top-[49%]">
        <CircularProgress />
      </Box>
    );
  } else if (error === undefined || error)
    return (
      <Box className="mt-4">
        <Alert severity="error">Error. Refresh and try again.</Alert>
      </Box>
    );

  return (
    <Box className="min-h-screen">
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1">
            Single Staking Option Vaults
          </Typography>
          <Box
            className={
              'flex mb-6 mt-5 rounded-md justify-center items-center mx-auto'
            }
          >
            <SsovStat
              title="Total Value Locked"
              value={'$' + formatAmount(tvl, 0)}
            />
            <SsovStat
              title="24h Volume"
              value={'$' + formatAmount(total24hVol, 0, true)}
            />
            <SsovStat
              title="Open Interest"
              value={'$' + formatAmount(openInterest, 0, true)}
            />
          </Box>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards simultaneously.
          </Typography>
        </Box>
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
        {!isEmpty(ssovsWithVol)
          ? keys.map((key) => {
              return (
                <Box key={key} className="mb-12">
                  <NetworkHeader chainId={Number(key)} />
                  <Box className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 place-items-center gap-y-10">
                    {ssovsWithVol[key]
                      ? ssovsWithVol[key]
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
                                volume: number;
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

export default function Ssov() {
  return (
    <>
      <NextSeo
        title={seo.ssov.title}
        description={seo.ssov.description}
        canonical={seo.ssov.url}
        openGraph={{
          url: seo.ssov.url,
          title: seo.ssov.title,
          description: seo.ssov.description,
          images: [
            {
              url: seo.ssov.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.ssov.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <SsovData />
    </>
  );
}
