import { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
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

  const MenuBtn = ({
    text,
    icon,
    link,
  }: {
    text: string;
    icon: ReactNode;
    link?: boolean;
  }) => {
    return (
      <>
        <Box
          className={`pl-5 p-2 hover:bg-mineshaft rounded flex ${
            active == text && 'bg-mineshaft text-white'
          } `}
          onClick={() => handleClick(text)}
        >
          <Box className="flex-1">
            {icon}
            {text}
          </Box>
          {link && <LaunchIcon className="h-[12px] mt-2" />}
        </Box>
      </>
    );
  };

  return (
    <Box className="md:w-[240px] text-[#8E8E8E] cursor-pointer">
      <Box
        className="flex md:hidden border-b border-umbra mb-2"
        onClick={handleOpen}
      >
        <Box className="text-[#777777] mb-2 flex-1">More</Box>
        {open ? (
          <KeyboardArrowUpIcon className="mt-2" />
        ) : (
          <KeyboardArrowDownIcon className="mt-2" />
        )}
      </Box>
      <Box className={`${!open && 'hidden'} md:inline`}>
        <Box className="text-[#3E3E3E] mb-2">Governance</Box>
        <MenuBtn
          text="veDPX"
          icon={
            <AutoAwesomeIcon
              className={`mr-2 h-[16px] mb-1 ${
                active == 'veDPX' && 'text-[#FFE94D]'
              }`}
            />
          }
        />
        <Box className="text-[#3E3E3E] mb-2 mt-2">NFTs</Box>
        <Link href="/nfts/community">
          <Box>
            <MenuBtn
              text="NFTs"
              icon={
                <HexagonIcon
                  className={`mr-2 h-[16px] mb-1 ${
                    active == 'NFTs' && 'text-[#7B61FF]'
                  }`}
                />
              }
              link={true}
            />
          </Box>
        </Link>
        <Link href="/nfts/diamondpepes">
          <Box>
            <MenuBtn
              text="Duel Pepes"
              icon={
                <SportsMmaOutlinedIcon
                  className={`mr-2 h-[16px] mb-1 ${
                    active == 'Duel Pepes' && 'text-[#FF617D]'
                  }`}
                />
              }
              link={true}
            />
          </Box>
        </Link>
        <Box className="text-[#3E3E3E] mb-2 mt-2">Misc</Box>
        <MenuBtn
          text="Bond"
          icon={
            <LoyaltyIcon
              className={`mr-2 h-[16px] mb-1  ${
                active == 'Bond' && 'text-[#6DFFB9]'
              }`}
            />
          }
        />
        <MenuBtn
          text="Oracles"
          icon={
            <HexagonOutlinedIcon
              className={`mr-2 h-[16px] mb-1  ${
                active == 'Oracles' && 'text-[#22E1FF]'
              }`}
            />
          }
        />
        <MenuBtn
          text="Tzwap"
          icon={
            <SwapVerticalCircleIcon
              className={`mr-2 h-[16px] mb-1  ${
                active == 'Tzwap' && 'text-[#C3F8FF]'
              }`}
            />
          }
        />
      </Box>
    </Box>
  );
};
