import { Address } from 'viem';

export const rdpxV2ContractKeys = [
  'v2core',
  'perpPool',
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
  'multicall',
] as const;

type AddressKey = (typeof rdpxV2ContractKeys)[number];

const addresses: { [key in AddressKey]: Address } = {
  v2core: '0x1784f23e6e054AEe050308AA88f2ae85C77150a1', // 421613
  perpPool: '0xA4A485b87B57d9C88c439f544389d13954e12408', // 421613
  perpPoolLp: '0x341BFe62e84f4EdB628c4f07E5Cd027000DbF034', // 421613
  receiptToken: '0xa03cc2AdA8f0ef94AD31d5290BffEab131521f3D', // 421613
  rdpxReserve: '0x277C7c36bFD15BA1DacDc89524Fe8D80851580c9', // 421613
  redeemDpxeth: '0xAD150b6Cb1B0DdcBD53f81C214766279a33130D6',
  rdpx: '0x52192d240D4398e87C95A5b1779dfCfFd0B0a6b6', // 421613
  weth: '0x8021eCCA584ba863922Fc9fa87F13fF7dBa74BA0', // 421613
  dpxeth: '0x5F7B21c3e819FbE92ebe446397Ce851b0353E49E', // 421613
  dbrdpx: '0x265290a30a00AD5353cFE7B3bFa56722D7f5b273', // 421613
  bond: '0xf9D5622a71949Bc38d35805f4dBeC58Bf651141A', // 421613
  multicall: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
};

export default addresses;
