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
  v2core: '0xA4C849Bd283188BBC88123Cbf186CBD84e070753', // 421613
  // perpPool: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  perpPool: '0x908B57C7e6e7F38B99a333E2E7773F0E8351eac6', // 421613
  // perpPoolLp: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  perpPoolLp: '0xE28a68a8a26A564d1766832D3F7C31780D559330', // 421613
  receiptToken: '0x4d4C43670ce0b78262Dd703C28DdFce4cEf187F9', // 421613
  rdpxReserve: '0x7382Be0c1817b6a201ba1E3292FC73E5fA69a4a4', // 421613
  // rdpx: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  rdpx: '0xd0Beff459477098e4D98e21B6C70aE1b9aC54Ed6', // 421613
  // weth: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  weth: '0x218248DbeBC698df6683Fb041C66a7d5D35bE1Bf', // 421613
  dpxeth: '0x08Ede14AD3d97eBC1CB6C128967a8f9A555b53F2', // 421613
  dbrdpx: '0xC37E0cCe95766444dFF3ADFeE9A633703654610E', // 421613
  bond: '0x6df847880A929e4bc855DA5C2C35500dbAc4E00c', // 421613
  multicall: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
};

export default addresses;
