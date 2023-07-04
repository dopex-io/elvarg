import { useCallback, useEffect, useState } from 'react';

import { NextSeo } from 'next-seo';
import { GmxCandleStick } from 'types';

import useVaultState, { Vault } from 'hooks/vaults/state';

import TVChart, { Period } from 'components/atlantics/InsuredPerps/TVChart';
import PageLayout from 'components/common/PageLayout';
import AsidePanel from 'components/vaults/AsidePanel';
import Positions from 'components/vaults/Tables/Positions';
import StrikesChain from 'components/vaults/Tables/StrikesChain';
import TitleBar from 'components/vaults/TitleBar';

import seo from 'constants/seo';

const Vaults = () => {
  const update = useVaultState((vault) => vault.update);
  const vault = useVaultState((vault) => vault.vault);

  const [selectedToken, setSelectedToken] = useState<string>('stETH');

  const handleSelectToken = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedToken(e.target.innerText);
      update({
        ...vault,
        base: e.target.innerText,
      } as Vault);
    },
    [update, vault]
  );

  const [gmxChartData, setGmxChartData] = useState<GmxCandleStick[]>([]);
  const [period, setPeriod] = useState<Period>('1D');

  const updatePriceData = useCallback(async () => {
    const res: Response = await new Promise(async (resolve, reject) => {
      let done = false;
      setTimeout(() => {
        done = true;
        reject(new Error(`Request timeout`));
      }, 10000);

      let lastEx;
      for (let i = 0; i < 3; i++) {
        if (done) return;
        try {
          const res = await fetch(
            `https://stats.gmx.io/api/candles/${'ETH'}?preferableChainId=42161&period=${period}&from=${
              Math.ceil(Number(new Date()) / 1000) - 86400 * 100
            }&preferableSource=fast`
          );
          resolve(res);
          return;
        } catch (ex) {
          lastEx = ex;
        }
      }
      reject(lastEx);
    });
    if (!res.ok) throw new Error('request failed');
    const json = await res.json();
    let prices: GmxCandleStick[] = json?.prices.map(
      (candleStickData: {
        h: number;
        l: number;
        o: number;
        c: number;
        t: number;
      }) => ({
        high: candleStickData.h,
        low: candleStickData.l,
        open: candleStickData.o,
        close: candleStickData.c,
        time: candleStickData.t,
      })
    );

    setGmxChartData(prices);
  }, [period]);

  useEffect(() => {
    updatePriceData();
  }, [updatePriceData]);

  return (
    <>
      <NextSeo
        title={seo.vaults.title}
        description={seo.vaults.description}
        canonical={seo.vaults.url}
        openGraph={{
          url: seo.vaults.url,
          title: seo.vaults.title,
          description: seo.vaults.description,
          images: [
            {
              url: seo.vaults.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.vaults.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <PageLayout>
        <TitleBar
          selectedToken={selectedToken}
          handleSelectToken={handleSelectToken}
        />
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            <div className="h-[420px] rounded-lg text-center flex flex-col justify-center text-stieglitz">
              <TVChart
                data={gmxChartData}
                triggerMarker={'0'}
                period={period}
                setPeriod={setPeriod}
                colors={{
                  backgroundColor: 'rgb(21, 21, 21)',
                  lineColor: '#2962FF',
                  textColor: 'white',
                  areaTopColor: 'rgba(109, 255, 185, 0.2)',
                  areaBottomColor: 'rgba(41, 98, 255, 0.1)',
                }}
              />
            </div>
            <div className="space-y-4">
              <StrikesChain selectedToken={selectedToken} />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/4 h-full">
            <AsidePanel />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Vaults;
