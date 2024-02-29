import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';

import useStore, { rdpxV2Actions, RdpxV2State } from 'hooks/rdpx/useStore';

import PageLayout from 'components/common/PageLayout';
import BondPanel from 'components/rdpx-v2/AsidePanel/BondPanel';
import StakePanel from 'components/rdpx-v2/AsidePanel/StakePanel';
import StrategyVaultPanel from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel';
import BondsBody from 'components/rdpx-v2/Body/BondsBody';
import Farm from 'components/rdpx-v2/Body/Farm';
import StakingBody from 'components/rdpx-v2/Body/StakingBody';
import StrategyVaultBody from 'components/rdpx-v2/Body/StrategyVault';
import QuickLink from 'components/rdpx-v2/QuickLink';
import TitleBar from 'components/rdpx-v2/TitleBar';
import Banner from 'components/rdpx-v2/TitleBar/Banner';

import { quickLinks } from 'constants/rdpx';
import seo from 'constants/seo';

const Main = () => {
  const router = useRouter();
  const rdpxPageState = useStore((vault) => vault.state);
  const updateRdpxPageState = useStore((vault) => vault.update);

  const renderContent = useMemo(() => {
    switch (rdpxPageState) {
      case 'bond':
        return {
          asidePanel: null,
          body: <BondsBody />,
          blockscannerContent: quickLinks.arbiscanV2Core,
        };
      case 'lp':
        return {
          asidePanel: <StrategyVaultPanel />,
          body: <StrategyVaultBody />,
          blockscannerContent: quickLinks.arbiscanPerpVault,
        };
      case 'stake':
        return {
          asidePanel: <StakePanel />,
          body: <StakingBody />,
          blockscannerContent: quickLinks.arbiscanStaking,
        };
      default:
        return {
          asidePanel: <BondPanel />,
          body: <BondsBody />,
          blockscannerContent: quickLinks.arbiscanV2Core,
        };
      case 'farm':
        return {
          asidePanel: null,
          body: <Farm />,
          blockscannerContent: null,
        };
    }
  }, [rdpxPageState]);

  // reroute to default page state if slug is empty
  useEffect(() => {
    if (!router || !router.query || !router.query.index) return;

    let page = router.query.index[0] as RdpxV2State;

    if (rdpxV2Actions.includes(page)) {
      updateRdpxPageState(page);
    } else {
      updateRdpxPageState('bond');
    }
  }, [router, updateRdpxPageState]);

  return (
    <div className="bg-contain min-h-screen">
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
        <Banner />
        <div className="mb-6 lg:max-w-xl md:max-w-md sm:max-w-sm max-w-md mx-auto lg:px-0">
          <TitleBar />
        </div>
        <div className="flex lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row justify-center space-y-3 lg:space-y-0">
          <div className="flex flex-col w-full sm:w-full lg:w-[720px] h-full">
            {renderContent.body}
          </div>
          {renderContent.asidePanel ? (
            <div className="flex flex-col w-full lg:w-[390px] h-full space-y-3">
              {renderContent.asidePanel}
              <div className="flex flex-col space-y-3">
                <QuickLink {...renderContent.blockscannerContent} />
              </div>
            </div>
          ) : null}
        </div>
      </PageLayout>
    </div>
  );
};

export default Main;
