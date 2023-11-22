import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';

import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import StraddleClosedBanner from 'components/common/Banners/StraddlesClosedBanner';
import Deposits from 'components/straddles/Deposits';
import Positions from 'components/straddles/Positions';
import Stats from 'components/straddles/Stats';
import TopBar from 'components/straddles/TopBar';

import seo from 'constants/seo';

const Straddles = ({ poolName }: { poolName: string }) => {
  const {
    setSelectedPoolName,
    updateStraddles,
    updateStraddlesUserData,
    updateStraddlesEpochData,
    setIsLoading,
    chainId,
  } = useBoundStore();

  useEffect(() => {
    if (poolName && setSelectedPoolName) {
      setSelectedPoolName(poolName);
      setIsLoading(true);
      updateStraddles().then(() =>
        updateStraddlesEpochData().then(() => {
          updateStraddlesUserData().then(() => {
            setIsLoading(false);
          });
        }),
      );
    }
  }, [
    chainId,
    setIsLoading,
    updateStraddles,
    updateStraddlesEpochData,
    updateStraddlesUserData,
    poolName,
    setSelectedPoolName,
  ]);

  return (
    <div className="bg-black min-h-screen">
      <AppBar />
      <div className="mx-auto lg:w-[45%]">
        <StraddleClosedBanner />
        <div className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
          <TopBar />
        </div>
        <div className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
          <Stats />
        </div>
        <div className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
          <div className="-ml-1 text-sm">Deposits</div>
        </div>
        <div className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
          <Deposits />
        </div>
        <div className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0">
          <div className="-ml-1 text-sm">Positions</div>
        </div>
        <div className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
          <Positions />
          {chainId === 137 ? (
            <img
              className="mt-10"
              src="/images/misc/powered-by-polygon.svg"
              alt="Powered by Polygon"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ManagePage = () => {
  const router = useRouter();
  const poolName = router.query['poolName'] as string;

  return (
    <>
      <NextSeo
        title={seo.straddles.title}
        description={seo.straddles.description}
        canonical={seo.straddles.url}
        openGraph={{
          url: seo.straddles.url,
          title: seo.straddles.title,
          description: seo.straddles.description,
          images: [
            {
              url: seo.straddles.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.straddles.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <Straddles poolName={poolName} />
    </>
  );
};

export default ManagePage;
