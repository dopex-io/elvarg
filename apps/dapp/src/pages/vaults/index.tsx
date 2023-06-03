import { useCallback, useState } from 'react';

import Head from 'next/head';

import useVaultState, { Vault } from 'hooks/vaults/state';

import AppBar from 'components/common/AppBar';
import AsidePanel from 'components/vaults/AsidePanel';
import Positions from 'components/vaults/Tables/Positions';
import StrikesChain from 'components/vaults/Tables/StrikesChain';
import TitleBar from 'components/vaults/TitleBar';

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
    <div className="bg-black bg-contain min-h-screen">
      <Head>
        <title>Vaults | Dopex</title>
      </Head>
      <AppBar active="Vaults" />
      <div className="py-8 w-full px-[8vw] lg:px-[18vw] mx-auto">
        <div className="flex mt-20 space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row">
          <div className="flex flex-col space-y-4 w-full sm:w-full lg:w-3/4 h-full">
            <div>
              <TitleBar
                selectedToken={selectedToken}
                handleSelectToken={handleSelectToken}
              />
            </div>
            <div className="w-full space-y-4 flex flex-col">
              {/* Placeholder */}
              <div className="h-[420px] bg-cod-gray rounded-lg text-center flex flex-col justify-center text-stieglitz">
                TV Chart
              </div>
            </div>
            <div className="w-full space-y-4">
              <StrikesChain selectedToken={selectedToken} />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
            <AsidePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaults;
