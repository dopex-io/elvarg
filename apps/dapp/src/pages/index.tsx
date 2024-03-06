import Head from 'next/head';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import AppBar from 'components/common/AppBar';
import Footer from 'components/common/Footer';
import PageLoader from 'components/common/PageLoader';
import ClammCard from 'components/home/Card/ClammCard';

const Home = () => {
  const query = useQuery({
    queryKey: ['tvl_eth_market'],
    queryFn: () => {
      return axios.get(
        'https://varrock.dopex.io/clamm/stats/tvl?chainId=42161&optionMarket=0x501B03BdB431154b8Df17BF1c00756E3a8F21744',
      );
    },
  });

  if (query.isLoading) {
    return <PageLoader />;
  }

  // Calc for ETH since its allocated the highest amount of rewards
  const clammAPY = (2800 / (query.data?.data || 1)) * 100 * 365;

  return (
    <div>
      <div className="min-h-screen bg-[url('/images/backgrounds/darkness.jpg')]">
        <Head>
          <title>Home | Dopex</title>
        </Head>
        <AppBar />
        <div className="lg:max-w-5xl mx-auto lg:px-0 px-4 pb-28 pt-32">
          <div className="flex items-start justify-between">
            <div className="mb-16 lg:mx-0 lg:max-w-xl mx-auto max-w-lg">
              <div className="flex mb-4 items-center">
                <img
                  src="/images/brand/logo.svg"
                  alt="logo"
                  className="md:w-14 md:h-14 w-12 h-12 md:mr-4 mr-2"
                />
                <h1 className="md:text-6xl text-5xl font-mono font-bold">
                  DOPEX
                  <span className="ml-1 font-light text-3xl gradientText">
                    V2
                  </span>
                </h1>
              </div>
              <div className="text-lg mb-4">
                Arbitrum STIP Incentives are LIVE on Dopex now! Deposit on CLAMM
                now to earn up to{' '}
                <b className="gradientText">{clammAPY.toFixed()}% APY!</b>
              </div>
              <a
                href="/clamm/WETH-USDC"
                rel="noopener noreferer"
                target="_blank"
                className="absolute z-20 bg-[#0b1121] rounded-md p-2"
              >
                Deposit CLAMM
              </a>
              <div className="gradient-bg-effect" />
            </div>
            <img
              className="w-80 h-auto hidden lg:block"
              src="/images/brand/rdpx-v2.svg"
              alt="rdpx-v2"
            />
          </div>
          <div className="mb-24">
            <div className="mb-8 font-bold text-3xl lg:block flex justify-center">
              <span>Our Products</span>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 justify-items-center">
              <ClammCard apy={clammAPY} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
