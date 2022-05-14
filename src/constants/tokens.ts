import { TokenData } from 'types';

// Note: all token addresses are lower cased
export const TOKEN_ADDRESS_TO_DATA: { [key: string]: TokenData } = {
  '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55': {
    symbol: 'DPX',
    imgSrc: '/assets/dpx.svg',
  },
  '0x32eb7902d4134bf98a28b963d26de779af92a212': {
    symbol: 'rDPX',
    imgSrc: '/assets/rdpx.svg',
  },
  '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978': {
    symbol: 'CRV',
    imgSrc: '/assets/crv.svg',
  },
};
