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
  'multirewards1',
  'multirewards2',
  'rewardToken1',
  'rewardToken2',
] as const;

type AddressKey = (typeof rdpxV2ContractKeys)[number];

// 421613
const addresses: { [key in AddressKey]: Address } = {
  v2core: '0x1784f23e6e054AEe050308AA88f2ae85C77150a1',
  perpPool: '0x04ef82C73106c8771AdF0c79FD6fB455a44A28Dc',
  perpPoolLp: '0x10A40c5fC09f686e760469Fea12c6733af47BED4',
  receiptToken: '0xa03cc2AdA8f0ef94AD31d5290BffEab131521f3D',
  rdpxReserve: '0x277C7c36bFD15BA1DacDc89524Fe8D80851580c9',
  redeemDpxeth: '0xAD150b6Cb1B0DdcBD53f81C214766279a33130D6',
  rdpx: '0x52192d240D4398e87C95A5b1779dfCfFd0B0a6b6',
  weth: '0x8021eCCA584ba863922Fc9fa87F13fF7dBa74BA0',
  dpxeth: '0x5F7B21c3e819FbE92ebe446397Ce851b0353E49E',
  dbrdpx: '0x265290a30a00AD5353cFE7B3bFa56722D7f5b273',
  bond: '0xf9D5622a71949Bc38d35805f4dBeC58Bf651141A',
  multirewards1: '0x4e8ce4a166710D0110De85669Fe0B5A3d1B71c7B',
  multirewards2: '0xE364E758b8A018d05f5ae72f4ea4373D8Adf28D2',
  rewardToken1: '0x6005F3DA8B31daDd15688e6247dFAC0d71c11dB5',
  rewardToken2: '0x28DA5Ec3e00C4B5F454526Ecb437eC95F5239902',
};

export default addresses;
