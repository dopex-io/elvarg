import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import HexagonIcon from '@mui/icons-material/Hexagon';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import SportsMmaOutlinedIcon from '@mui/icons-material/SportsMmaOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LaunchIcon from '@mui/icons-material/Launch';
import Link from 'next/link';

interface SideBarMenuProps {
  setActive: Function;
  active: string;
}

export const SideBarMenu = ({ active, setActive }: SideBarMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClick = (active: string) => {
    setOpen(false);
    setActive(active);
  };

  return (
    <Box className="w-[240px] text-[#8E8E8E] lg:ml-[200px] cursor-pointer margin-auto mb-5 md:mr-10">
      <Box
        className="flex md:hidden border-b border-umbra mb-2"
        onClick={handleOpen}
      >
        <Typography variant="h4" className="text-[#3E3E3E] mb-2 flex-1">
          More
        </Typography>
        {open ? (
          <KeyboardArrowUpIcon className="mt-2" />
        ) : (
          <KeyboardArrowDownIcon className="mt-2" />
        )}
      </Box>
      <Box className={`${!open && 'hidden'} md:inline`}>
        <Typography variant="h5" className="text-[#3E3E3E] mb-2">
          Governance
        </Typography>
        <Box
          className={`pl-5 p-2 hover:bg-mineshaft ${
            active == 'veDPX' && 'bg-mineshaft text-white'
          }`}
          onClick={() => handleClick('veDPX')}
        >
          <AutoAwesomeIcon
            className={`mr-2 h-[16px] mb-1 ${
              active == 'veDPX' && 'text-[#FFE94D]'
            }`}
          />
          veDPX
        </Box>
        <Typography variant="h5" className="text-[#3E3E3E] mb-2 mt-2">
          NFTs
        </Typography>
        <Link href="/nfts/community">
          <Box
            className={`pl-5 p-2 flex hover:bg-mineshaft ${
              active == 'nft' && 'bg-mineshaft text-white'
            }`}
            onClick={() => handleClick('nft')}
          >
            <Box className="flex-1">
              <HexagonIcon
                className={`mr-2 h-[16px] mb-1  ${
                  active == 'nft' && 'text-[#7B61FF]'
                }`}
              />
              NFTs
            </Box>

            <LaunchIcon className="h-[12px] mt-2" />
          </Box>
        </Link>
        <Link href="/nfts/diamondpepes">
          <Box
            className={`pl-5 p-2 flex hover:bg-mineshaft ${
              active == 'dualpepe' && 'bg-mineshaft text-white'
            }`}
            onClick={() => handleClick('dualpepe')}
          >
            <Box className="flex-1">
              <SportsMmaOutlinedIcon
                className={`mr-2 h-[16px] mb-1  ${
                  active == 'dualpepe' && 'text-[#FF617D]'
                }`}
              />
              Dual Pepe
            </Box>
            <LaunchIcon className="h-[12px] mt-2" />
          </Box>
        </Link>
        <Typography variant="h5" className="text-[#3E3E3E] mb-2 mt-2">
          Misc
        </Typography>
        <Box
          className={`pl-5 p-2 hover:bg-mineshaft ${
            active == 'bond' && 'bg-mineshaft text-white'
          }`}
          onClick={() => handleClick('bond')}
        >
          <LoyaltyIcon
            className={`mr-2 h-[16px] mb-1  ${
              active == 'bond' && 'text-[#6DFFB9]'
            }`}
          />
          Bond
        </Box>
        <Box
          className={`pl-5 p-2 hover:bg-mineshaft ${
            active == 'oracles' && 'bg-mineshaft text-white'
          }`}
          onClick={() => handleClick('oracles')}
        >
          <HexagonOutlinedIcon
            className={`mr-2 h-[16px] mb-1  ${
              active == 'oracles' && 'text-[#22E1FF]'
            }`}
          />
          Oracles
        </Box>
        <Box
          className={`pl-5 p-2 flex hover:bg-mineshaft ${
            active == 'tzwap' && 'bg-mineshaft text-white'
          }`}
          onClick={() => handleClick('tzwap')}
        >
          <Box className="flex-1">
            <SwapVerticalCircleIcon
              className={`mr-2 h-[16px] mb-1  ${
                active == 'tzwap' && 'text-[#C3F8FF]'
              }`}
            />
            Tzwap
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
