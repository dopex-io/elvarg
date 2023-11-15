import { Address } from 'viem';

export const rdpxV2ContractKeys = [
  'v2core',
  'perpPool',
  'delegateBonds',
  'perpPoolLp',
  'receiptToken',
  'rdpxReserve',
  'redeemDpxeth',
  'rdpx',
  'weth',
  'dpxeth',
  'dbrdpx',
  'bond',
  'rdpxReserve',
  'multirewards1',
  'multirewards2',
  'rewardToken1',
  'rewardToken2',
] as const;

type AddressKey = (typeof rdpxV2ContractKeys)[number];

const addresses: { [key in AddressKey]: Address } = {
  v2core: '0x0EF3eF2aF710a1160d09a2cC7174C9d8944dd7E9',
  perpPool: '0xb505240Eab31a2bB51B260E54bB43615B4A64560',
  delegateBonds: '0xb011CE8798d31256Ff4a293c15Bc2793b69592c2',
  perpPoolLp: '0x000E6b50b6c2cCD99ce656348E2cB0Fa9386dA08',
  receiptToken: '0xE7cF5b533D95a9d489AE966D3aCEBc2A326d9E5C',
  rdpxReserve: '0x62DB1F4bdC8dd04fD703189058BA6dcE7cCCB1C1',
  redeemDpxeth: '0x0650B90a60A69Fa76b2cD216DC092912a29D57d1',
  rdpx: '0x3CdcA7d41430f53BFE2fA6303b4E2cE2C81048B3',
  weth: '0x0ED8992E7af2B553FF66F47677335ac7Af2B2420',
  dpxeth: '0x4e12fAAC1b8f38Ffe82142d54dB8b3ad6A23Ac5F',
  dbrdpx: '0x165F39bF7bbD9ac9a1E91a8D9db4de0E64c40f2E',
  bond: '0x1E625b038aE0a33e48a99555f24F6298B17A4F88',
  multirewards1: '0x4e8ce4a166710D0110De85669Fe0B5A3d1B71c7B',
  multirewards2: '0xE364E758b8A018d05f5ae72f4ea4373D8Adf28D2',
  rewardToken1: '0x6005F3DA8B31daDd15688e6247dFAC0d71c11dB5',
  rewardToken2: '0x28DA5Ec3e00C4B5F454526Ecb437eC95F5239902',
};

export default addresses;
