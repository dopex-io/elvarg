import Head from 'next/head';

import AppBar from 'components/common/AppBar';
import Footer from 'components/common/Footer';
import ClammCard from 'components/home/Card/ClammCard';
import RdpxV2Card from 'components/home/Card/RdpxV2Card';
import SsovCard from 'components/home/Card/SsovCard';

const Home = () => {
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
                now to earn up to <b>182% APY!</b>
              </div>
              <div className="absolute z-20 bg-[#0b1121] rounded-md p-2">
                Deposit CLAMM
              </div>
              <div className="gradient-bg-effect" />
            </div>
            <img
              className="w-64 h-auto hidden lg:block"
              src="/images/brand/rdpx-v2.svg"
              alt="rdpx-v2"
            />
          </div>
          <div className="mb-24">
            <div className="mb-8 font-bold text-3xl lg:block flex justify-center">
              <span>Our Products</span>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 justify-items-center">
              <ClammCard />
              <SsovCard />
              <RdpxV2Card />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
