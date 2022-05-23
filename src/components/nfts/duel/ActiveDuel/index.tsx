import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import Typography from 'components/UI/Typography';
import styles from '../styles.module.scss';

const ActiveDuel = () => {
  return (
    <Box className="w-full flex p-5 bg-[#181C24] relative">
      <img
        src="/images/nfts/pepes/gen2-pepe-1.png"
        className="rounded-md w-16 h-16"
      />
      <Box>
        <Typography
          variant="h4"
          className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
        >
          <span>#1327</span>
        </Typography>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
        >
          <span>Diamond Pepe</span>
        </Typography>
      </Box>
      <Box className="ml-8">
        <Typography
          variant="h4"
          className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
        >
          <span>#865</span>
        </Typography>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
        >
          <span>Duel ID</span>
        </Typography>
      </Box>
      <Box className="ml-10 mt-2">
        <Box className="flex">
          <img src="/images/nfts/pepes/move-0.png" className="w-4 h-4 mr-1" />
          <img src="/images/nfts/pepes/move-1.png" className="w-4 h-4 mr-1" />
          <img src="/images/nfts/pepes/move-2.png" className="w-4 h-4 mr-1" />
          <img src="/images/nfts/pepes/move-3.png" className="w-4 h-4 mr-1" />
          <img src="/images/nfts/pepes/move-4.png" className="w-4 h-4" />
        </Box>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-3 ml-1 text-left"
        >
          <span>Moves</span>
        </Typography>
      </Box>

      <Box className="ml-auto mr-auto mt-2.5">
        <button className={styles['pepeButton']}>REVEAL MOVE</button>
      </Box>

      <Box className="ml-auto mt-2">
        <Box className="flex">
          <img
            src="/images/nfts/pepes/help-center.png"
            className="w-4 h-4 mr-1"
          />
          <img
            src="/images/nfts/pepes/help-center.png"
            className="w-4 h-4 mr-1"
          />
          <img
            src="/images/nfts/pepes/help-center.png"
            className="w-4 h-4 mr-1"
          />
          <img
            src="/images/nfts/pepes/help-center.png"
            className="w-4 h-4 mr-1"
          />
          <img src="/images/nfts/pepes/help-center.png" className="w-4 h-4" />
        </Box>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-3 ml-1 text-right"
        >
          <span>Moves</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default ActiveDuel;
