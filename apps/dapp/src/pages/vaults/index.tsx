import { useCallback, useState } from 'react';

import useVaultState, { Vault } from 'hooks/vaults/state';
import { NextSeo } from 'next-seo';

import PageLayout from 'components/common/PageLayout';
import AsidePanel from 'components/vaults/AsidePanel';
import Positions from 'components/vaults/Tables/Positions';
import StrikesChain from 'components/vaults/Tables/StrikesChain';
import TitleBar from 'components/vaults/TitleBar';

import seo from 'constants/seo';

const Vaults = () => {
  const update = useVaultState((vault) => vault.update);
  const vault = useVaultState((vault) => vault.vault);
  const [selectedToken, setSelectedToken] = useState<string>('ETH');

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
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0">
          <div className="flex flex-col space-y-4 sm:w-full lg:w-3/4 h-full">
            <div className="space-y-4 flex flex-col">
              <div className="h-[420px] bg-cod-gray rounded-lg text-center flex flex-col justify-center text-stieglitz">
                TV Chart
              </div>
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
