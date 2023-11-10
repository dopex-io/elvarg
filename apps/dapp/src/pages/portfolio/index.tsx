import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { NextSeo } from 'next-seo';
import { useAccount } from 'wagmi';

import { useBoundStore } from 'store';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import AppBar from 'components/common/AppBar';
import Deposits from 'components/portfolio/Deposits';
import Positions from 'components/portfolio/Positions';
import Sidebar from 'components/portfolio/Sidebar';
import DelegatePositions from 'components/rdpx-v2/Tables/DelegatePositions';
import UserBonds from 'components/rdpx-v2/Tables/UserBonds';

import seo from 'constants/seo';

const Portfolio = () => {
  const { updatePortfolioData, accountAddress } = useBoundStore();
  const { address: user = '0x' } = useAccount();

  const { updateRdpxV2CoreState } = useRdpxV2CoreData({
    user,
  });

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState]);

  useEffect(() => {
    if (updatePortfolioData && accountAddress) updatePortfolioData();
  }, [updatePortfolioData, accountAddress]);

  return (
    <div className="min-h-screen">
      <NextSeo
        title={seo.portfolio.title}
        description={seo.portfolio.description}
        canonical={seo.portfolio.url}
        openGraph={{
          url: seo.portfolio.url,
          title: seo.portfolio.title,
          description: seo.portfolio.description,
          images: [
            {
              url: seo.portfolio.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.portfolio.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar />
      <div className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 lg:grid lg:grid-cols-12">
        <div className="ml-10 mt-20 hidden lg:block md:col-span-3">
          <Sidebar />
        </div>

        <div className="col-span-9 mt-10 lg:mb-20 lg:pl-5 lg:pr-5">
          <div>
            <Positions />
          </div>
          <div className="mt-3">
            <Deposits />
          </div>
          <div className="mt-3">
            <div className="mt-9 ml-5 mr-5">
              <h3 className="text-xl mb-3">RDPX V2 Delegate Positions</h3>
              <DelegatePositions />
            </div>
          </div>
          <div className="mt-3">
            <div className="mt-9 ml-5 mr-5">
              <h3 className="text-xl mb-3">RDPX V2 Bonds</h3>
              <UserBonds />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
