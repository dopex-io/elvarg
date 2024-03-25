import { Address, zeroAddress } from 'viem';

export const EXPIRIES: { [key: string]: number } = {
  '1h': 60 * 60,
  '2h': 2 * 60 * 60,
  '6h': 6 * 60 * 60,
  '12h': 12 * 60 * 60,
  '24h': 24 * 60 * 60,
};

export const EXPIRIES_TO_KEY: { [key: number]: string } = {
  [60 * 60]: '1h',
  [2 * 60 * 60]: '2h',
  [6 * 60 * 60]: '6h',
  [12 * 60 * 60]: '12h',
  [24 * 60 * 60]: '24h',
};

export const EXPIRIES_MENU = Object.keys(EXPIRIES);
export const EXPIRIES_BY_INDEX = Object.values(EXPIRIES);

export const MULTI_CALL_FN_SIG =
  'function multicall(bytes[] calldata data) external returns (bytes[] memory results)';

export const PROTOCOL_FEES_MULTIPLIER = 1.34;
export const AUTO_EXERCISER_TIME_BASED: Record<number, Address | undefined> = {
  42161: '0xb223eD797742E096632c39d1b2e0c313750B25FE',
  5000: '0x39d8AD7f378266dD995EEea3B87C7C7EC7Da7490',
};

export type FilterSettingsType = {
  bundleSize: string;
  range: number[];
  liquidityThreshold: number[];
};

export const DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS = {
  bundleSize: '',
  range: [],
  liquidityThreshold: [0, 0],
};

export const UNISWAP_V3_SWAPPER: Address =
  '0x985A3f3D6822F037968d48Aa3F7D7d990D72F333';

export const AMM_TO_HANDLER: Record<
  number,
  Record<string, Address | undefined> | undefined
> = {
  42161: {
    uniswap: '0x29bbf7ebb9c5146c98851e76a5529985e4052116',
    pancakeswap: '0x9ae336B61D7d2e19a47607f163A3fB0e46306b7b',
  },
  5000: {
    agni: '0x5DdA827f304Aeb693573720B344eD160e7D4703C',
    fusionx: '0x210D2963b555Ce5AC7e3d9b0e2F38d7AEBd4B43F',
    // butter: '0xD648267FC75e144f28436E7b54030C7466031b05',
  },
};

export const AMM_TO_READABLE_NAME: Record<string, string | undefined> = {
  fusionx: 'Fusion X',
  agni: 'Agni',
  uniswap: 'Uniswap V3',
  pancake: 'PancakeSwap V3',
  sushiswap: 'Sushiswap V3',
};

export const HANDLER_TO_POOLS: Record<
  number,
  Record<string, Record<string, Address | undefined> | undefined> | undefined
> = {
  5000: {
    agni: {
      'wmnt-usdt': '0xD08C50F7E69e9aeb2867DefF4A8053d9A855e26A',
      'weth-usdt': '0x628f7131CF43e88EBe3921Ae78C4bA0C31872bd4',
    },
    fusionx: {
      'wmnt-usdt': '0x262255F4770aEbE2D0C8b97a46287dCeCc2a0AfF',
      'weth-usdc': '0x01845ec86909006758DE0D57957D88Da10bf5809',
    },
    butter: {
      'weth-usdt': '0xD801D457D9cC70f6018a62885F03BB70706F59Cc',
      'wmnt-usdt': '0x0B15691C828fF6D499375e2ca2070B08Dd62369E',
    },
  },
  42161: {
    uniswap: {
      'weth-usdc': '0xc6962004f452be9203591991d15f6b388e09e8d0',
      'wbtc-usdc': '0x0e4831319a50228b9e450861297ab92dee15b44f',
      'arb-usdc': '0xb0f6ca40411360c03d41c5ffc5f179b8403cdcf8',
    },
    // pancake: {
    //   'weth-usdc': '0xd9e2a1a61B6E61b275cEc326465d417e52C1b95c',
    //   'arb-usdc': '0x9fFCA51D23Ac7F7df82da414865Ef1055E5aFCc3',
    // },
  },
};

export const CHAIN_TO_OPTION_MARKETS: Record<number, string[]> = {
  42161: [
    'WETH-USDC',
    'ARB-USDC',
    'WBTC-USDC',
    'WETH-USDC.e',
    'WBTC-USDC.e',
    'ARB-USDC.e',
  ],
  5000: ['WETH-USDT', 'WMNT-USDT'],
};

export const HANDLER_TO_SWAPPER: Record<
  string,
  undefined | Record<string, Address>
> = {
  5000: {
    agni: '0x471923c6148495530C5153040A9D8726213421Bd',
    fusionx: '0x480199183c57853a96BEF4F8e2B0C28dd877c7D8',
    // butter: '0x580bC0591b78c3a255fB908Bff2e1A4633B0c124',
  },
};
