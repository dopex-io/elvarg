import Head from 'next/head';
import Box from '@mui/material/Box';
import AppBar from 'components/common/AppBar';
import Sidebar from 'components/portfolio/Sidebar';
import Positions from 'components/portfolio/Positions';
import Deposits from 'components/portfolio/Deposits';
import { PortfolioProvider } from 'contexts/Portfolio';
import React from 'react';

const Portfolio = () => {
  return (
    <PortfolioProvider>
      <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
        <Head>
          <title>Portfolio | Dopex</title>
        </Head>
        <AppBar active="portfolio" />
        <Box
          className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 lg:grid lg:grid-cols-12"
          gap={0}
        >
          <Box className="ml-10 mt-20 hidden lg:block md:col-span-3">
            <Sidebar />
          </Box>

          <Box gridColumn="span 9" className="mt-10 lg:mb-20 lg:pl-5 lg:pr-5">
            <Box>
              <Positions />
            </Box>
            <Box className="mt-3">
              <Deposits />
            </Box>
          </Box>
        </Box>
      </Box>
    </PortfolioProvider>
  );
};

export default Portfolio;
