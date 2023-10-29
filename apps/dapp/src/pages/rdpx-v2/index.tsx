import { useMemo } from 'react';
import Head from 'next/head';

import { NextSeo } from 'next-seo';

import useStore from 'hooks/rdpx/useStore';

import PageLayout from 'components/common/PageLayout';
import BondPanel from 'components/rdpx-v2/AsidePanel/BondPanel';
import StrategyVaultPanel from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel';
import BondsBody from 'components/rdpx-v2/Body/BondsBody';
import StrategyVaultBody from 'components/rdpx-v2/Body/StrategyVault';
import QuickLink from 'components/rdpx-v2/QuickLink';
import TitleBar from 'components/rdpx-v2/TitleBar';

import { quickLinks } from 'constants/rdpx';
import seo from 'constants/seo';

const Main = () => {
  const rdpxPageState = useStore((vault) => vault.state);

  const renderContent = useMemo(() => {
    switch (rdpxPageState) {
      case 'bond':
        return {
          asidePanel: <BondPanel />,
          body: <BondsBody />,
        };
      case 'lp':
        return {
          asidePanel: <StrategyVaultPanel />,
          body: <StrategyVaultBody />,
        };
      case 'stake':
        return { asidePanel: null, body: null };
    }
  }, [rdpxPageState]);

  return (
    <div className="bg-contain min-h-screen">
      <Head>
        <title>Mint | Dopex</title>
      </Head>
      <NextSeo
        title={seo.rdpxV2.title}
        description={seo.rdpxV2.description}
        canonical={seo.rdpxV2.url}
        openGraph={{
          url: seo.rdpxV2.url,
          title: seo.rdpxV2.title,
          description: seo.rdpxV2.description,
          images: [
            {
              url: seo.rdpxV2.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.rdpxV2.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <PageLayout>
        <div className="mb-6 lg:max-w-lg md:max-w-md sm:max-w-sm max-w-md mx-auto px-4 lg:px-0">
          <TitleBar />
        </div>
        <div className="flex lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row justify-center">
          <div className="flex flex-col w-full sm:w-full lg:w-[646px] h-full">
            {renderContent.body}
          </div>
          <div className="flex flex-col w-full sm:w-full lg:w-[390px] h-full lg:mt-0 space-y-3">
            {renderContent.asidePanel}
            <div className="flex flex-col space-y-3">
              <QuickLink {...quickLinks.etherscan} />
              <QuickLink {...quickLinks.dune} />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Main;
