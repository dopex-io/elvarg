import { useEffect, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Link from 'next/link';
import axios from 'axios';

import PieChartIcon from '@mui/icons-material/PieChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import GavelIcon from '@mui/icons-material/Gavel';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

import ShareDialog from 'components/common/ShareDialog/ShareDialog';

import AppBar from 'components/common/AppBar';
import { Typography } from 'components/UI';

import { formatAmount } from 'utils/general';

import { DOPEX_API_BASE_URL } from 'constants/env';
import { Button } from '@dopex-io/ui';

interface CardProps {
  name: string;
  description: string;
  href: string;
  Icon: any;
}

const Card = ({ name, description, href, Icon }: CardProps) => {
  return (
    <Link href={href}>
      <Box className="bg-umbra shadow-2xl p-4 rounded-2xl flex space-x-4 items-center hover:-translate-y-1 transition ease-in hover:backdrop-blur-sm hover:bg-opacity-60 cursor-pointer hover:border-wave-blue border-2 border-transparent">
        <Icon className="w-8 h-8" />
        <Box>
          <Typography variant="h5" className="font-bold">
            {name}
          </Typography>
          <Typography variant="h6" color="stieglitz" className="font-bold">
            {description}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

const Home = () => {
  const [tvl, setTvl] = useState('0');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function getTvl() {
      const res = await axios.get(`${DOPEX_API_BASE_URL}/v2/tvl`);

      setTvl(res.data.tvl);
    }
    getTvl();
  }, []);

  return (
    <Box className="min-h-screen">
      <Head>
        <title>Home | Dopex</title>
      </Head>
      <AppBar />
      <ShareDialog
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        shareImageProps={{
          title: (
            <Typography variant="h4" className="font-bold shadow-2xl">
              ETH Straddles
            </Typography>
          ),
          pnlPercentage: 23.2,
          stats: [
            { name: 'Entry Price', value: '$1512.12' },
            { name: 'Current Price', value: '$1688.12' },
          ],
        }}
      />
      <Box className="pb-28 pt-40 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 to-">
        <Button onClick={() => setOpen(true)}>Open</Button>

        <Box className="flex space-x-8 mb-24">
          <img
            src="/images/brand/logo.svg"
            alt="logo"
            className="md:w-24 md:h-24 w-20 h-20"
          />
          <h1 className="md:text-8xl text-7xl font-mono font-bold">DOPEX</h1>
        </Box>
        <Box className="flex md:flex-row md:space-y-0 space-y-12 flex-col justify-between mb-24">
          <Box className="flex flex-col max-w-fit">
            <h1 className="md:text-7xl text-6xl  font-mono font-bold text-wave-blue">
              $300M+
            </h1>
            <span className="text-2xl text-white self-end font-bold font-mono">
              All Time Open Interest
            </span>
          </Box>
          <Box className="flex flex-col max-w-fit">
            <h1 className="md:text-7xl text-6xl  font-mono font-bold text-wave-blue">
              ${formatAmount(tvl)}
            </h1>
            <span className="text-2xl text-white self-end font-bold font-mono">
              Total Value Locked
            </span>
          </Box>
        </Box>
        <Box>
          <Typography variant="h2" className="mb-8 font-bold">
            Our Products
          </Typography>
          <Box className="grid md:grid-cols-2 grid-cols-1 gap-8">
            <Card
              name="Single Staking Option Vaults"
              description="Sell covered options to earn yields"
              href="/ssov"
              Icon={PieChartIcon}
            />
            <Card
              name="Farms"
              description="Earn rewards for liquidity staking"
              href="/farms"
              Icon={AgricultureIcon}
            />
            <Card
              name="Atlantic Straddles"
              description="Apply a straddle strategy on ETH, DPX and rDPX"
              href="/straddles"
              Icon={SsidChartIcon}
            />
            <Card
              name="Governance"
              description="Lock DPX to earn protocol fees and rewards"
              href="/governance/vedpx"
              Icon={GavelIcon}
            />
            <Card
              name="Option Liquidity Pools"
              description="Purchase SSOV options at a discounted IV"
              href="/olp"
              Icon={AccountTreeIcon}
            />
            <Card
              name="Atlantic Pools"
              description="Write atlantic options, earn funding & premiums"
              href="/atlantics/manage/WETH-PUTS-WEEKLY"
              Icon={GraphicEqIcon}
            />
            <Card
              name="Insured Long futures"
              description="Open insured longs on GMX"
              href="/atlantics/manage/insured-perps/WETH-USDC"
              Icon={ShowChartIcon}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
