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
  '0x10393c20975cf177a3513071bc110f7962cd67da': {
    symbol: 'JONES',
    imgSrc: '/images/tokens/jones.svg',
  },
};

export const TOKEN_DATA: {
  [key: string]: {
    cgId?: string;
    name: string;
  };
} = {
  ETH: { cgId: 'ethereum', name: 'Ethereum' },
  WETH: { cgId: 'weth', name: 'Wrapped Ethereum' },
  WBTC: { cgId: 'bitcoin', name: 'Wrapped Bitcoin' },
  PLS: { cgId: 'plutusdao', name: 'Plutus DAO' },
  BNB: { cgId: 'binancecoin', name: 'Binance Coin' },
  USDT: { cgId: 'tether', name: 'Tether USD' },
  USDC: { cgId: 'usd-coin', name: 'Circle USD' },
  GMX: { cgId: 'gmx', name: 'GMX' },
  CVX: { cgId: 'convex-finance', name: 'Convex' },
  CRV: { cgId: 'curve-dao-token', name: 'Curve' },
  DAI: { cgId: 'dai', name: 'DAI' },
  LINK: { cgId: 'chainlink', name: 'Chainlink' },
  SPELL: { cgId: 'spell-token', name: 'SPELL' },
  JONES: { cgId: 'jones-dao', name: 'JONES' },
  MIM: { cgId: 'magic-internet-money', name: 'Magic Internet Money' },
  FRAX: { cgId: 'frax', name: 'Frax USD' },
  DPX: { cgId: 'dopex', name: 'Dopex Governance' },
  RDPX: { cgId: 'dopex-rebate-token', name: 'Dopex Rebate' },
  GOHM: { cgId: 'governance-ohm', name: 'OHM Governance' },
  AVAX: { cgId: 'avalanche-2', name: 'Avalanche' },
  MAGIC: { cgId: 'magic', name: 'Magic' },
  '2CRV': { name: 'Curve 2Pool Token' },
  VBNB: { name: 'Venus BNB' },
  METIS: { cgId: 'metis', name: 'Metis DAO' },
};

export const TOKENS = Object.keys(TOKEN_DATA);
