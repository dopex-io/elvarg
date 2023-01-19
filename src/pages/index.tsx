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
//hover:bg-gradient-to-l from-wave-blue
const Card = ({ name, description, href, Icon }: CardProps) => {
  return (
    <Link href={href}>
      <Box className="bg-umbra shadow-2xl p-4 rounded-2xl flex space-x-4 items-center hover:-translate-y-1 transition ease-in hover:backdrop-blur-md hover:bg-transparent cursor-pointer">
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
  return (
    <Box
      // className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen"
      className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen"
      // sx={{
      //   background: 'linear-gradient(219deg, #001a37, #101010, #003451)',
      //   backgroundSize: '600% 600%',
      // }}
    >
      <Head>
        <title>Home | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pb-28 pt-40 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 to-">
        <Box className="flex space-x-8">
          <img
            src="/images/brand/logo.svg"
            alt="logo"
            className="md:w-28 md:h-28 w-20 h-20"
          />
          <h1 className="md:text-8xl text-7xl font-mono font-bold mb-24">
            DOPEX
          </h1>
        </Box>
        <Box className="flex md:flex-row md:space-y-0 space-y-8 flex-col justify-between mb-24">
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
              $32M+
            </h1>
            <span className="text-2xl text-white self-end font-bold font-mono">
              Total Value Locked
            </span>
          </Box>
        </Box>

        <Box className="">
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
              href="/olp/DPX-MONTHLY"
              Icon={AccountTreeIcon}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
