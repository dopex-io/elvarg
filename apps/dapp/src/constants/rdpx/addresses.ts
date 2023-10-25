import { Address } from 'viem';

export const rdpxV2ContractKeys = [
  'v2core',
  'perpPool',
  'receiptToken',
  'rdpxReserve',
  'rdpx',
  'weth',
  'dpxeth',
  'dbrdpx',
  'bond',
] as const;

type AddressKey = (typeof rdpxV2ContractKeys)[number];

const addresses: { [key in AddressKey]: Address } = {
  v2core: '0x',
  perpPool: '0x',
  receiptToken: '0x',
  rdpxReserve: '0x',
  rdpx: '0x',
  weth: '0x',
  dpxeth: '0x',
  dbrdpx: '0x',
  bond: '0x',
};

export default addresses;
