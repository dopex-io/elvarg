import { Address } from 'viem';

export const rdpxV2ContractKeys = [
  'v2core',
  'perpPool',
  'delegateBondsV1',
  'delegateBondsV2',
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
  'perpVaultStaking',
  'receiptTokenStaking',
  'arb',
  'dpx',
  'camelotPositionManager',
  'rtethEthStaking',
  'rtethEthLp',
  'communalFarm',
  // todo remove
  'mockStakeToken',
  'mockRewardToken',
] as const;

type AddressKey = (typeof rdpxV2ContractKeys)[number];

// @todo use tokenlist
const addresses: { [key in AddressKey]: Address } = {
  v2core: '0xAe1De74153fb8f46f16A2cCFf6B922dD1dc7dD13',
  perpPool: '0x57AA1138BC3ede5A6320C452f2E4871A7dD002b5',
  delegateBondsV1: '0x848faD32b251CDa18a0c0f43cd2ac35Eb931b407',
  delegateBondsV2: '0x44E0D0853a465419C6017fd5dA6F550C293D81AA',
  perpPoolLp: '0x819F4B81c7eEc22b3EdC1d9E150896C5F4eEA6cB',
  receiptToken: '0xc15B9DB0ee5B1B7FB8800A644457207f482e260D',
  rdpxReserve: '0x13F4063c6E0CB8B6486fcb726dCe3CD19bae97E8',
  redeemDpxeth: '0x9029B5cfc31eec72BF9120032d39F1F85e0C2e09',
  rdpx: '0x32eb7902d4134bf98a28b963d26de779af92a212',
  weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  dpxeth: '0x3EbBBD6F3320CFa4BEdae7500120bAe900f8126B',
  dbrdpx: '0x68951FbefD66BAb9BdcFEDD2a37Fb0b3635135a3',
  bond: '0x5Bd9362835ABE0E9be3742Be0Ba4011BF1229B67',
  perpVaultStaking: '0x1DE544147ee3d2f3083951504ed82a514D4e9Af8',
  receiptTokenStaking: '0xd9c79b111D2737013f1af210f6687a9Fa7852b49',
  rtethEthStaking: '0x8Ee8B7DC139AA95626768B72Ce08625312cCCDf2',
  rtethEthLp: '0x9f6AC103E5d22a7CE8F2CE90bC3991ee4EE4324e',
  arb: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  dpx: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
  communalFarm: '0x27a1E5d887EBC1F97b494De65ad27c09a864c02D', // '0x33890B88F98a9D511678954AD8DB0510B6953Cfc',
  camelotPositionManager: '0x00c7f3082833e796A5b3e4Bd59f6642FF44DCD15',
  mockStakeToken: '0x5d9EE9048A722516370a42998473D78AbC258261',
  mockRewardToken: '0xcbE75543B51BA42dC30e0b5BD8C4a07fc61F141D',
};

export default addresses;
