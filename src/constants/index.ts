import { BigNumber } from 'ethers';

import { round100, round1, round1000 } from 'utils/math/rounding';

export const CURRENCIES_MAP = {
  '1': 'ETH',
  '42161': 'ETH',
  '56': 'BNB',
  '43114': 'AVAX',
  '1088': 'METIS',
};

export const BASE_ASSET_MAP = {
  WETH: {
    fullName: 'Ethereum',
    symbol: 'ETH',
    _symbol: 'WETH',
  },
  WBTC: {
    fullName: 'Bitcoin',
    symbol: 'BTC',
    _symbol: 'WBTC',
  },
  LINK: {
    fullName: 'Chainlink',
    symbol: 'LINK',
    _symbol: 'LINK',
  },
  GOHM: {
    fullName: 'Governance OHM',
    symbol: 'GOHM',
    _symbol: 'GOHM',
  },
  BNB: {
    fullName: 'Binance Coin',
    symbol: 'BNB',
    _symbol: 'BNB',
  },
  VBNB: {
    fullName: 'Venus BNB',
    symbol: 'VBNB',
    _symbol: 'VBNB',
  },
  YFI: {
    fullName: 'Yearn',
    symbol: 'YFI',
    _symbol: 'YFI',
  },
  AVAX: {
    fullName: 'AVAX',
    symbol: 'AVAX',
    _symbol: 'AVAX',
  },
  METIS: {
    fullName: 'Metis DAO',
    symbol: 'METIS',
    _symbol: 'METIS',
  },
  CRV: {
    fullName: 'CRV',
    symbol: 'CRV',
    _symbol: 'CRV',
  },
};

export const QUOTE_ASSET_MAP = {
  USDT: {
    fullName: 'Tether',
    symbol: 'USDT',
    _symbol: 'USDT',
    price: '1',
  },
};

export const PRICE_INCREMENTS: {
  [key: string]: { getBasePrice: Function; increment: number };
} = {
  WETH: {
    getBasePrice: round100,
    increment: 100,
  },
  WBTC: {
    getBasePrice: round1000,
    increment: 1000,
  },
  LINK: {
    getBasePrice: round1,
    increment: 1,
  },
  YFI: {
    getBasePrice: round100,
    increment: 250,
  },
};

export const STAT_NAMES = {
  transfer: {
    strike: 'Strike Price',
    expiry: 'Expiry',
    amount: 'Balance',
  },
  exercise: {
    strike: 'Strike Price',
    price: 'Asset Price',
    pnl: 'P&L',
    expiry: 'Expiry',
    amount: 'Amount',
  },
  swap: {
    strike: 'Strike Price',
    price: 'Asset Price',
    pnl: 'P&L',
    expiry: 'Expiry',
  },
  new_swap: {
    strike: 'New Strike Price',
    price: 'Asset Price',
    pnl: 'New P&L',
    expiry: 'New Expiry',
  },
};

export const SSOV_PUTS_MAP = {
  RDPX: {
    tokenSymbol: 'RDPX',
    imageSrc: '/assets/rdpx.svg',
    coinGeckoId: 'dopex-rebate-token',
    tokens: ['2CRV'],
  },
  GOHM: {
    tokenSymbol: 'GOHM',
    imageSrc: '/assets/gohm.svg',
    coinGeckoId: 'governance-ohm',
    tokens: ['2CRV'],
  },
  ETH: {
    tokenSymbol: 'DPX',
    imageSrc: '/assets/dpx.svg',
    coinGeckoId: 'dopex',
    tokens: ['2CRV'],
  },
  BTC: {
    tokenSymbol: 'BTC',
    imageSrc: '/assets/btc.svg',
    coiGeckoId: 'bitcoin',
    tokens: ['2CRV'],
  },
  GMX: {
    tokenSymbol: 'GMX',
    imageSrc: '/assets/gmx.svg',
    coinGeckoId: 'gmx',
    tokens: ['2CRV'],
  },
  METIS: {
    tokenSymbol: 'METIS',
    imageSrc: '/assets/metis.svg',
    coinGeckoId: 'metis',
    tokens: ['METIS'],
  },
};

export const SSOV_MAP = {
  DPX: {
    tokenSymbol: 'DPX',
    imageSrc: '/assets/dpx.svg',
    coinGeckoId: 'dopex',
    tokens: ['DPX'],
  },
  RDPX: {
    tokenSymbol: 'RDPX',
    imageSrc: '/assets/rdpx.svg',
    coinGeckoId: 'dopex-rebate-token',
    tokens: ['RDPX'],
  },
  ETH: {
    tokenSymbol: 'ETH',
    imageSrc: '/assets/eth.svg',
    coinGeckoId: 'ethereum',
    tokens: ['WETH'],
  },
  BNB: {
    tokenSymbol: 'BNB',
    imageSrc: '/assets/bnb.svg',
    coinGeckoId: 'binancecoin',
    tokens: ['WBNB', 'VBNB'],
  },
  GOHM: {
    tokenSymbol: 'GOHM',
    imageSrc: '/assets/gohm.svg',
    coinGeckoId: 'governance-ohm',
    tokens: ['GOHM'],
  },
  GMX: {
    tokenSymbol: 'GMX',
    imageSrc: '/assets/gmx.svg',
    coinGeckoId: 'gmx',
    tokens: ['GMX'],
  },
  AVAX: {
    tokenSymbol: 'AVAX',
    imageSrc: '/assets/avax.svg',
    coiGeckoId: 'avalanche-2',
    tokens: ['AVAX'],
  },
  BTC: {
    tokenSymbol: 'BTC',
    imageSrc: '/assets/btc.svg',
    coiGeckoId: 'bitcoin',
    tokens: ['BTC'],
  },
  CRV: {
    tokenSymbol: 'CRV',
    imageSrc: '/assets/curve.svg',
    coiGeckoId: 'curve-dao-token',
    tokens: ['CRV'],
  },
  LUNA: {
    tokenSymbol: 'LUNA',
    imageSrc: '/assets/luna.svg',
    coiGeckoId: 'terra-luna',
    tokens: ['LUNA'],
  },
  METIS: {
    tokenSymbol: 'METIS',
    imageSrc: '/assets/metis.svg',
    coinGeckoId: 'metis',
    tokens: ['METIS'],
  },
};

export const SHOWCASE_NFTS = [
  {
    src: '/showcase/dopexHideout.jpeg',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/61024412357358029745898008936110540827339189022866162497373623631431958790145',
    name: 'Dopex Hideout',
    horizontal: false,
  },
  {
    src: '/showcase/dopexTeam.jpg',
    uri: 'https://opensea.io/assets/0x803ef47f13a5edb8a7fa6e6705c63bba11dea6ff/1',
    name: 'Dopex Team',
    horizontal: true,
  },
  {
    src: '/showcase/theMemesterpiece.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/619411',
    name: 'The Memesterpiece',
    horizontal: false,
  },
  {
    src: '/showcase/dpxMafia.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/709255',
    name: 'DPX Mafia',
    horizontal: false,
  },
  {
    src: '/showcase/dpxMoon.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/660167',
    name: 'Dopex Moon',
    horizontal: true,
  },
  {
    src: '/showcase/rdpxMafia.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/709241',
    name: 'rDPX Mafia',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/7sks-Vyw2jZiwa9CV-e4-__J0A9zXKLSTIhuwrWoV-7M6rtj12C1v-aIg7560d_n-iACiZzpJeCEh-5nupazEYg5d_lrgg05QyY_mI0=s0',
    uri: 'https://opensea.io/assets/0xb66a603f4cfe17e3d27b87a8bfcad319856518b8/30863102027102893654962906943771709949552249080103479762628255485000553594882',
    name: 'DPX Diamond Pepe Bust',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/R_X2nXK8Knl1ioNMVduygkCJog6sa9waLEoTUrhyvYZDSidNF0Pcex9LZ6wgbUP2G_Xvo1eMxLaxRDrWsAm7liHbmvDBGWWsNJoPKw=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/35485684725155303981490729192961144699023552664245873084242323138241030520833/',
    name: 'The Defi Crusade',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/9XWC9UAKjGNsy03U1HpgWwlyPtd8mjqKK3vRtNlJ90ypDOjzacAhCo8Lr5SITR5aEhN55rAHoMaAhxC9t9XRTWMJbfmFl8SMKaxtrnw=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/35485684725155303981490729192961144699023552664245873084242323139340542148609/',
    name: 'Symbiosis',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/_wGlHYfY5cOmwh5Rgqt03ak6juANI0bCjCdYBiW_6wvbxPDSI5APKgPs_wMuIZaS8i6xx7cipfYXbT0Uq9GCZAvTDI8thSjrKIc7=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/45085975291671188684684423873928499579949724979171599992235381888671696289802',
    name: 'Dopex Bull',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/SJ6EdL-zgnJuQJI3VRzL3UyoMsMJL6DVNBYoM_ZZE7SXhvuQDVq_mePWob22_oEZ_4j7aKa0t9BHyK7_rEvqFmxJgx28H8QhNYjG=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/45085975291671188684684423873928499579949724979171599992235381889771207917569',
    name: 'Dopex Bull OG',
    horizontal: false,
  },
];

export const OPTION_TYPE_NAMES = {
  0: 'Put',
  1: 'Call',
};

export const MAX_VALUE: string =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const SECONDS_IN_A_DAY: Number = 86400;

export const STRIKE_PRECISION: BigNumber = BigNumber.from(10).pow(8);

export const BLOCKED_COUNTRIES_ALPHA_2_CODES: string[] = [
  'US',
  'VI',
  'BY',
  'MM',
  'CI',
  'CU',
  'CD',
  'IR',
  'IQ',
  'LR',
  'KP',
  'SD',
  'SY',
  'ZW',
];

export const UNISWAP_LINKS: { [key: string]: string } = {
  'DPX-WETH':
    'https://app.sushi.com/add/ETH/0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
  'rDPX-WETH':
    'https://app.sushi.com/add/ETH/0x32eb7902d4134bf98a28b963d26de779af92a212',
  DPX: 'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
  RDPX: 'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x32eb7902d4134bf98a28b963d26de779af92a212',
};

export const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

export const ANKR_KEY = process.env.NEXT_PUBLIC_ANKR_KEY;

export const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL;

export const AVAX_RPC_URL = process.env.NEXT_PUBLIC_AVAX_RPC_URL;

export const METIS_RPC_URL = process.env.NEXT_PUBLIC_METIS_RPC_URL;

export const GREEK_SYMBOLS = {
  delta: 'Δ',
  theta: 'θ',
  gamma: 'Γ',
  vega: 'V',
};

export const DELEGATE_INFO: string =
  'Auto exercising will charge 1% of the total P&L as fee. (This is temporary and will be reduced heavily during our final launch).';

export const BUILD: string = process.env.NEXT_PUBLIC_BUILD;

export const FIREBASE_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const S3_BUCKET_RESOURCES = {
  DPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/DPX.png',
  RDPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/rDPX.png',
};

export const DISPLAY_TOKENS = {
  42161: ['DPX', 'RDPX', 'ETH'],
  56: ['BNB', 'VBNB'],
  43114: ['AVAX'],
  1088: ['METIS'],
};

export const CHAIN_ID_TO_NETWORK_DATA = {
  1: { name: 'Mainnet', icon: '/assets/eth.svg' },
  42: { name: 'Kovan', icon: '/assets/eth.svg' },
  56: { name: 'BSC', icon: '/assets/bsc.svg' },
  42161: { name: 'Arbitrum', icon: '/assets/arbitrum.svg' },
  421611: { name: 'Testnet', icon: '/assets/arbitrum.svg' },
  43114: { name: 'Avalanche', icon: '/assets/avax.svg' },
  1088: { name: 'Metis', icon: '/assets/metis.svg' },
};

export const TOKEN_DECIMALS = {
  '56': {
    BNB: 18,
    VBNB: 8,
  },
  '1': {
    USDT: 6,
    USDC: 6,
  },
  '421611': {
    USDT: 6,
    USDC: 6,
  },
  '42161': {
    USDT: 6,
    USDC: 6,
  },
  '43114': {
    USDT: 6,
    USDC: 6,
  },
  '1088': {
    USDT: 6,
    USDC: 6,
  },
};

export const SSOV_V3_ABI = JSON.parse(
  '[{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_underlyingSymbol","type":"string"},{"internalType":"address","name":"_collateralToken","type":"address"},{"internalType":"bool","name":"_isPut","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ContractNotPaused","type":"error"},{"inputs":[],"name":"ContractPaused","type":"error"},{"inputs":[],"name":"E1","type":"error"},{"inputs":[],"name":"E10","type":"error"},{"inputs":[],"name":"E11","type":"error"},{"inputs":[],"name":"E12","type":"error"},{"inputs":[],"name":"E13","type":"error"},{"inputs":[],"name":"E14","type":"error"},{"inputs":[],"name":"E2","type":"error"},{"inputs":[],"name":"E3","type":"error"},{"inputs":[],"name":"E4","type":"error"},{"inputs":[],"name":"E5","type":"error"},{"inputs":[],"name":"E6","type":"error"},{"inputs":[],"name":"E7","type":"error"},{"inputs":[],"name":"E8","type":"error"},{"inputs":[],"name":"E9","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_contract","type":"address"}],"name":"AddToContractWhitelist","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"feeStrategy","type":"address"},{"internalType":"address","name":"stakingStrategy","type":"address"},{"internalType":"address","name":"optionPricing","type":"address"},{"internalType":"address","name":"priceOracle","type":"address"},{"internalType":"address","name":"volatilityOracle","type":"address"},{"internalType":"address","name":"feeDistributor","type":"address"},{"internalType":"address","name":"optionsTokenImplementation","type":"address"}],"indexed":false,"internalType":"struct SsovV3State.Addresses","name":"addresses","type":"tuple"}],"name":"AddressesSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"strikes","type":"uint256[]"}],"name":"Bootstrap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"settlementPrice","type":"uint256"}],"name":"EpochExpired","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"expireDelayTolerance","type":"uint256"}],"name":"ExpireDelayToleranceUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"premium","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"}],"name":"Purchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_contract","type":"address"}],"name":"RemoveFromContractWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pnl","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Settle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"collateralTokenWithdrawn","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"rewardTokenWithdrawAmounts","type":"uint256[]"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"addToContractWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"addresses","outputs":[{"internalType":"address","name":"feeStrategy","type":"address"},{"internalType":"address","name":"stakingStrategy","type":"address"},{"internalType":"address","name":"optionPricing","type":"address"},{"internalType":"address","name":"priceOracle","type":"address"},{"internalType":"address","name":"volatilityOracle","type":"address"},{"internalType":"address","name":"feeDistributor","type":"address"},{"internalType":"address","name":"optionsTokenImplementation","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"strikes","type":"uint256[]"},{"internalType":"uint256","name":"expiry","type":"uint256"}],"name":"bootstrap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculatePnl","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_strike","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_expiry","type":"uint256"}],"name":"calculatePremium","outputs":[{"internalType":"uint256","name":"premium","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculatePurchaseFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"settlementPrice","type":"uint256"},{"internalType":"uint256","name":"pnl","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculateSettlementFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_increase","type":"bool"},{"internalType":"uint256","name":"_allowance","type":"uint256"}],"name":"changeAllowanceForStakingStrategy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collateralPrecision","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"collateralToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"strikeIndex","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"tokens","type":"address[]"},{"internalType":"bool","name":"transferNative","type":"bool"}],"name":"emergencyWithdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"epochData","outputs":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"settlementPrice","type":"uint256"},{"internalType":"uint256","name":"totalCollateralBalance","type":"uint256"},{"internalType":"uint256","name":"collateralExchangeRate","type":"uint256"},{"internalType":"bool","name":"expired","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"epochStrikeData","outputs":[{"internalType":"address","name":"strikeToken","type":"address"},{"components":[{"internalType":"uint256","name":"premiumCollectedCumulative","type":"uint256"},{"internalType":"uint256","name":"activeCollateral","type":"uint256"},{"internalType":"uint256","name":"totalCollateral","type":"uint256"},{"internalType":"uint256","name":"activeCollateralRatio","type":"uint256"},{"internalType":"uint256","name":"premiumDistributionRatio","type":"uint256"},{"internalType":"uint256[]","name":"rewardDistributionRatios","type":"uint256[]"}],"internalType":"struct SsovV3State.VaultCheckpoint","name":"lastVaultCheckpoint","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"expire","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_settlementPrice","type":"uint256"}],"name":"expire","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"expireDelayTolerance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCollateralPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"}],"name":"getEpochData","outputs":[{"components":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"settlementPrice","type":"uint256"},{"internalType":"uint256","name":"totalCollateralBalance","type":"uint256"},{"internalType":"uint256","name":"collateralExchangeRate","type":"uint256"},{"internalType":"uint256[]","name":"totalRewardsCollected","type":"uint256[]"},{"internalType":"uint256[]","name":"rewardDistributionRatios","type":"uint256[]"},{"internalType":"address[]","name":"rewardTokensToDistribute","type":"address[]"},{"internalType":"uint256[]","name":"strikes","type":"uint256[]"},{"internalType":"bool","name":"expired","type":"bool"}],"internalType":"struct SsovV3State.EpochData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"},{"internalType":"uint256","name":"strike","type":"uint256"}],"name":"getEpochStrikeData","outputs":[{"components":[{"internalType":"address","name":"strikeToken","type":"address"},{"components":[{"internalType":"uint256","name":"premiumCollectedCumulative","type":"uint256"},{"internalType":"uint256","name":"activeCollateral","type":"uint256"},{"internalType":"uint256","name":"totalCollateral","type":"uint256"},{"internalType":"uint256","name":"activeCollateralRatio","type":"uint256"},{"internalType":"uint256","name":"premiumDistributionRatio","type":"uint256"},{"internalType":"uint256[]","name":"rewardDistributionRatios","type":"uint256[]"}],"internalType":"struct SsovV3State.VaultCheckpoint","name":"lastVaultCheckpoint","type":"tuple"},{"internalType":"uint256[]","name":"rewardsStoredForPremiums","type":"uint256[]"},{"internalType":"uint256[]","name":"rewardsDistributionRatiosForPremiums","type":"uint256[]"}],"internalType":"struct SsovV3State.EpochStrikeData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"}],"name":"getEpochStrikes","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"}],"name":"getEpochTimes","outputs":[{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUnderlyingPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_strike","type":"uint256"}],"name":"getVolatility","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"isContract","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"strikeIndex","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"purchase","outputs":[{"internalType":"uint256","name":"premium","type":"uint256"},{"internalType":"uint256","name":"totalFee","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"removeFromContractWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"feeStrategy","type":"address"},{"internalType":"address","name":"stakingStrategy","type":"address"},{"internalType":"address","name":"optionPricing","type":"address"},{"internalType":"address","name":"priceOracle","type":"address"},{"internalType":"address","name":"volatilityOracle","type":"address"},{"internalType":"address","name":"feeDistributor","type":"address"},{"internalType":"address","name":"optionsTokenImplementation","type":"address"}],"internalType":"struct SsovV3State.Addresses","name":"_addresses","type":"tuple"}],"name":"setAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"strikeIndex","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"epoch","type":"uint256"}],"name":"settle","outputs":[{"internalType":"uint256","name":"pnl","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"underlyingSymbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_expireDelayTolerance","type":"uint256"}],"name":"updateExpireDelayTolerance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelistedContracts","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"collateralTokenWithdrawAmount","type":"uint256"},{"internalType":"uint256[]","name":"rewardTokenWithdrawAmounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"writePosition","outputs":[{"internalType":"uint256","name":"epoch","type":"uint256"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"uint256","name":"collateralAmount","type":"uint256"},{"components":[{"internalType":"uint256","name":"premiumCollectedCumulative","type":"uint256"},{"internalType":"uint256","name":"activeCollateral","type":"uint256"},{"internalType":"uint256","name":"totalCollateral","type":"uint256"},{"internalType":"uint256","name":"activeCollateralRatio","type":"uint256"},{"internalType":"uint256","name":"premiumDistributionRatio","type":"uint256"},{"internalType":"uint256[]","name":"rewardDistributionRatios","type":"uint256[]"}],"internalType":"struct SsovV3State.VaultCheckpoint","name":"vaultCheckpoint","type":"tuple"}],"stateMutability":"view","type":"function"}]'
);
