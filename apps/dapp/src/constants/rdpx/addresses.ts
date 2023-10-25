import { Address } from 'viem';

const keys = [
  'v2core',
  'perpPool',
  'receiptToken',
  'rdpxReserve',
  'rdpx',
  'weth',
  'dpxeth',
  'dbrdpx',
] as const;

type AddressKey = (typeof keys)[number];

const addresses: { [key in AddressKey]: Address } = {
  v2core: '0x',
  perpPool: '0x',
  receiptToken: '0x',
  rdpxReserve: '0x',
  rdpx: '0x',
  weth: '0x',
  dpxeth: '0x',
  dbrdpx: '0x',
};

export default addresses;
