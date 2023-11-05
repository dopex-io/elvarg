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
  'multirewards',
] as const;

type AddressKey = (typeof rdpxV2ContractKeys)[number];

const addresses: { [key in AddressKey]: Address } = {
  v2core: '0x1784f23e6e054AEe050308AA88f2ae85C77150a1', // 421613
  perpPool: '0x04ef82C73106c8771AdF0c79FD6fB455a44A28Dc', // 421613
  perpPoolLp: '0x10A40c5fC09f686e760469Fea12c6733af47BED4', // 421613
  receiptToken: '0xa03cc2AdA8f0ef94AD31d5290BffEab131521f3D', // 421613
  rdpxReserve: '0x277C7c36bFD15BA1DacDc89524Fe8D80851580c9', // 421613
  redeemDpxeth: '0xAD150b6Cb1B0DdcBD53f81C214766279a33130D6',
  rdpx: '0x52192d240D4398e87C95A5b1779dfCfFd0B0a6b6', // 421613
  weth: '0x8021eCCA584ba863922Fc9fa87F13fF7dBa74BA0', // 421613
  dpxeth: '0x5F7B21c3e819FbE92ebe446397Ce851b0353E49E', // 421613
  dbrdpx: '0x265290a30a00AD5353cFE7B3bFa56722D7f5b273', // 421613
  bond: '0xf9D5622a71949Bc38d35805f4dBeC58Bf651141A', // 421613
  multirewards: '0x696c33d47D770c943E47521e23dA7a01F18c4fd4', // 421613
};

export default addresses;
