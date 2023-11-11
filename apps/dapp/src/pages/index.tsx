import Head from 'next/head';

import { Button } from '@dopex-io/ui';

import AppBar from 'components/common/AppBar';
import ClammCard from 'components/home/ClammCard';
import RdpxV2Card from 'components/home/RdpxV2Card';
import SsovCard from 'components/home/SsovCard';

const Home = () => {
  return (
    <div className="min-h-screen bg-[url('https://tailwindcss.com/_next/static/media/hero-dark@90.dba36cdf.jpg')]">
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
              </h1>
            </div>
            <div className="text-lg mb-4">
              Arbitrum STIP Incentives are LIVE on Dopex now! Bond on rDPX V2 or
              Deposit on CLAMM now to earn up to <b>182% APY!</b>
            </div>
            <div>
              <Button>rDPX V2 Bond</Button>
              <span className="text-stieglitz mx-4">or</span>
              <Button>Deposit CLAMM</Button>
            </div>
          </div>
          <img
            className="w-64 h-auto"
            src="/images/brand/rdpx-v2.svg"
            alt="rdpx-v2"
          />
        </div>
        {/* <div className="flex md:flex-row md:space-y-0 space-y-12 flex-col justify-between mb-16 w-2/3">
          <div className="flex flex-col max-w-fit">
            <h1 className="md:text-5xl text-6xl font-mono font-bold text-transparent text-wave-blue">
              $400M+
            </h1>
            <span className="text-base text-white self-end font-mono">
              All Time Open Interest
            </span>
          </div>
          <div className="flex flex-col max-w-fit">
            <h1 className="md:text-5xl text-6xl font-mono font-bold text-transparent  text-wave-blue">
              {tvl === '--' ? tvl : `${formatAmount(tvl)}`}
            </h1>
            <span className="text-base text-white self-end font-mono">
              Total Value Locked
            </span>
          </div>
        </div> */}
        <div>
          <div className="mb-8 font-bold text-3xl lg:block flex justify-center">
            <span>Our Products</span>
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <ClammCard />
            <RdpxV2Card />
            <SsovCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
