import { useEffect } from 'react';
import Head from 'next/head';

import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import NftCard from 'components/nfts/NftCard';

const Nfts = () => {
  const { provider, nftsData, updateUserNftsData, updateNftsData } =
    useBoundStore();

  useEffect(() => {
    if (!provider) return;
    updateUserNftsData();
  }, [updateUserNftsData, provider]);

  useEffect(() => {
    if (!provider) return;
    updateNftsData();
  }, [updateNftsData, provider]);

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>NFTs | Dopex</title>
      </Head>
      <AppBar />
      <div className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <div className="text-center mx-auto max-w-xl mb-12 mt-32">
          <div className="mb-1 text-4xl">Dopex NFTs</div>
          <div className="text-stieglitz mb-2">Dopex issued NFTs</div>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-16 justify-center items-stretch">
          {nftsData.map((nftData, index) => (
            <NftCard key={index} nftData={nftData} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const NftsPage = () => <Nfts />;

export default NftsPage;
