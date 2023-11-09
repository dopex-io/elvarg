import { useEffect, useState } from 'react';
import Head from 'next/head';

import { Button } from '@dopex-io/ui';
import axios from 'axios';

import AppBar from 'components/common/AppBar';
import ClammCard from 'components/home/ClammCard';
import RdpxV2Card from 'components/home/RdpxV2Card';
import SsovCard from 'components/home/SsovCard';

import { formatAmount } from 'utils/general';

import { DOPEX_API_BASE_URL } from 'constants/env';

const Home = () => {
  const [tvl, setTvl] = useState('0');

  useEffect(() => {
    async function getTvl() {
      let tvl = '--';
      try {
        const res = await axios.get(`${DOPEX_API_BASE_URL}/v2/tvl`);

        console.log(res);

        tvl = res.data.tvl;
      } catch (err) {
        console.log(err);
      }

      setTvl(tvl);
    }
    getTvl();
  }, []);

  return (
    <div className="min-h-screen bg-[url('https://tailwindcss.com/_next/static/media/hero-dark@90.dba36cdf.jpg')]">
      <Head>
        <title>Home | Dopex</title>
      </Head>
      <AppBar />
      <div className="pb-28 pt-32 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <div className="mb-16">
          <div className="flex mb-4">
            <img
              src="/images/brand/logo.svg"
              alt="logo"
              className="md:w-14 md:h-14 w-20 h-20 mr-6"
            />
            <h1 className="md:text-6xl text-5xl font-mono font-bold">DOPEX</h1>
          </div>
          <div className="text-lg w-2/3 mb-4">
            Arbitrum STIP Incentives are LIVE on Dopex now! Bond on rDPX V2 or
            Deposit on CLAMM now to earn up to <b>182% APY!</b>
          </div>
          <div>
            {/* <Button
              variant="outlined"
              className=" border-wave-blue !text-wave-blue"
            >
              rDPX V2 Bond
            </Button>
            <span className="text-stieglitz mx-4">or</span>
            <Button
              variant="outlined"
              className=" border-wave-blue !text-wave-blue"
            >
              Deposit CLAMM
            </Button> */}
            <Button className="  bg-green-500 shadow-2xl !d-black">
              rDPX V2 Bond
            </Button>
            <span className="text-stieglitz mx-4">or</span>
            <Button
              // variant="outlined"
              className="shadow-2xl"
            >
              Deposit CLAMM
            </Button>
            {/* <Button className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500 via-red-500 to-yellow-500 shadow-2xl">
              Deposit CLAMM
            </Button> */}
          </div>
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
          <div className="mb-8 font-bold text-3xl">Our Products</div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
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
