import Head from 'next/head';
import Box from '@mui/material/Box';
import Link from 'next/link';

import PieChartIcon from '@mui/icons-material/PieChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import GavelIcon from '@mui/icons-material/Gavel';

import AppBar from 'components/common/AppBar';
import { Typography } from 'components/UI';

interface CardProps {
  name: string;
  description: string;
  href: string;
  Icon: any;
}

const Card = ({ name, description, href, Icon }: CardProps) => {
  return (
    <Link href={href}>
      <Box className="bg-cod-gray shadow-2xl p-4 rounded-md flex space-x-4 items-center hover:-translate-y-1 transition ease-in hover:bg-gradient-to-l from-stone-900 to-transparent cursor-pointer">
        <Icon className="w-8 h-8" />
        <Box>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="h6" color="stieglitz">
            {description}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

const Home = () => {
  return (
    <Box
      className="bg-black min-h-screen"
      sx={{
        background: 'linear-gradient(219deg, #001a37, #101010, #003451)',
        backgroundSize: '600% 600%',
      }}
    >
      <Head>
        <title>Home | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pb-28 pt-40 lg:max-w-4xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 to-">
        <Box className="flex justify-between mb-24">
          <Box className="flex flex-col max-w-fit">
            <h1 className="text-9xl font-mono font-bold">400M+</h1>
            <span className="text-2xl text-stieglitz self-end font-bold font-mono">
              Open Interest{' '}
              <span className="text-2xl text-stieglitz">(All Time)</span>
            </span>
          </Box>
          <Box className="flex flex-col max-w-fit">
            <h1 className="text-9xl font-mono font-bold">21.6M</h1>
            <span className="text-2xl text-stieglitz self-end font-bold font-mono">
              Total Value Locked
            </span>
          </Box>
        </Box>

        <Box className="">
          <Typography variant="h2" className="mb-8">
            Our Products
          </Typography>
          <Box className="grid grid-cols-2 gap-8">
            <Card
              name="Single Staking Option Vaults"
              description="Sell covered options to earn yields"
              href="/ssov"
              Icon={PieChartIcon}
            />
            <Card
              name="Farms"
              description="Earn rewards for liquidity staking"
              href="/ssov"
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
              href="/ssov"
              Icon={GavelIcon}
            />
            <Card
              name="Option Liquidity Pools"
              description="Purchase SSOV options at a discounted IV"
              href="/ssov"
              Icon={AccountTreeIcon}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
