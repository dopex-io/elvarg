import { Address } from 'viem';

export const rdpxV2ContractKeys = [
  'v2core',
  'perpPool',
  'perpPoolLp',
  'receiptToken',
  'rdpxReserve',
  'rdpx',
  'weth',
  'dpxeth',
  'dbrdpx',
  'bond',
  'multicall',
] as const;

type AddressKey = (typeof rdpxV2ContractKeys)[number];

const addresses: { [key in AddressKey]: Address } = {
  v2core: '0x',
  perpPool: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  perpPoolLp: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  receiptToken: '0x',
  rdpxReserve: '0x',
  rdpx: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  weth: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  dpxeth: '0x',
  dbrdpx: '0x',
  bond: '0x',
  multicall: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
};

export default addresses;
