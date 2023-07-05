import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';

import useVaultState from 'hooks/vaults/state';

import PageLayout from 'components/common/PageLayout';
import AsidePanel from 'components/vaults/AsidePanel';
import Positions from 'components/vaults/Tables/Positions';
import StrikesChain from 'components/vaults/Tables/StrikesChain';
import TitleBar from 'components/vaults/TitleBar';

import seo from 'constants/seo';

const Vaults = () => {
  const router = useRouter();

  const updateBase = useVaultState((state) => state.updateBase);

  const [selectedToken, setSelectedToken] = useState<string>('stETH');

  const handleSelectToken = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      router.push(`/vaults/${e.target.innerText}`);
    },
    [router]
  );

  useEffect(() => {
    const market = router.query['market'] as string;

    setSelectedToken(market);
    updateBase(market);
  }, [router, updateBase]);

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
            <div className="h-[520px] bg-carbon rounded-lg text-center flex flex-col justify-center text-stieglitz"></div>
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
