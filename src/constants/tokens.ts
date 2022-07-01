import { TokenData } from 'types';

// Note: all token addresses are lower cased
export const TOKEN_ADDRESS_TO_DATA: { [key: string]: TokenData } = {
  '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55': {
    symbol: 'DPX',
    imgSrc: '/images/tokens/dpx.svg',
  },
  '0x32eb7902d4134bf98a28b963d26de779af92a212': {
    symbol: 'rDPX',
    imgSrc: '/images/tokens/rdpx.svg',
  },
  '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978': {
    symbol: 'CRV',
    imgSrc: '/images/tokens/crv.svg',
  },
};

export const TOKENS = [
  {
    tokenSymbol: 'DPX',
    type: 'dopex',
    contractUrl:
      'https://arbiscan.io/address/0x252c07e0356d3b1a8ce273e39885b094053137b9',
    imgSrc: '/images/tokens/dpx.svg',
    imgAlt: 'DPX',
  },
  {
    tokenSymbol: 'rDPX',
    type: 'dopex',
    contractUrl:
      'https://arbiscan.io/address/0xC0cdD1176aA1624b89B7476142b41C04414afaa0',
    imgSrc: '/images/tokens/rdpx.svg',
    imgAlt: 'rDPX',
  },
  {
    tokenSymbol: 'gOHM',
    type: 'chainlink',
    contractUrl:
      'https://arbiscan.io/address/0x6cb7d5bd21664e0201347bd93d66ce18bc48a807',
    imgSrc: '/images/tokens/gohm.svg',
    imgAlt: 'gOHM',
  },
  {
    tokenSymbol: 'GMX',
    type: 'uniswapV3',
    contractUrl:
      'https://arbiscan.io/address/0x60E07B25Ba79bf8D40831cdbDA60CF49571c7Ee0',
    imgSrc: '/images/tokens/gmx.svg',
    imgAlt: 'GMX',
  },
  {
    tokenSymbol: 'BNB',
    type: 'chainlink',
    contractUrl:
      'https://bscscan.com/address/0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
    imgSrc: '/images/tokens/bnb.svg',
    imgAlt: 'BNB',
  },
  {
    tokenSymbol: 'AVAX',
    type: 'chainlink',
    contractUrl:
      'https://snowtrace.io/address/0x0A77230d17318075983913bC2145DB16C7366156',
    imgSrc: '/images/tokens/avax.svg',
    imgAlt: 'AVAX',
  },
];
