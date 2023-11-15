export const TOKEN_DATA: {
  [key: string]: {
    cgId?: string;
    name: string;
  };
} = {
  ETH: { cgId: 'ethereum', name: 'Ethereum' },
  WETH: { cgId: 'weth', name: 'Wrapped Ethereum' },
  STETH: { cgId: 'weth', name: 'Lido Staked Ether ' },
  WBTC: { cgId: 'bitcoin', name: 'Wrapped Bitcoin' },
  BTC: { cgId: 'bitcoin', name: 'Bitcoin' },
  PLS: { cgId: 'plutusdao', name: 'Plutus DAO' },
  BNB: { cgId: 'binancecoin', name: 'Binance Coin' },
  ARB: { cgId: 'arbitrum', name: 'Arbitrum' },
  MATIC: { cgId: 'matic-network', name: 'Polygon' },
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
