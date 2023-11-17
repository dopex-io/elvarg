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
  v2core: '0x95A0BcB581e596e78eE4C6AdAC4f076684364c0C',
  perpPool: '0x59AEB05305e71586f751A7d1945f25633164738a',
  delegateBonds: '0xA330e77410a02B53F5920cACd2d374B28D669b18',
  perpPoolLp: '0x043031e785F6E32C0Dbd7ba8167D5d021A34FF83',
  receiptToken: '0x7bD949f5B8825Ac2854bFC85a019555AcD1c306E', // 0x592f0bD1027f1b6B1eaD290aaD958B88dd74e2f3
  rdpxReserve: '0x7c8d9F880E72B1915BEE710e514a60CF9Bd47667',
  redeemDpxeth: '0xEdc6E4F717967f6F4584B94D9A03d7633739AdAE',
  rdpx: '0x73E421392523CCdC45A84612EC56De2c0Ea06163',
  weth: '0x7Da8b6eB1dd23EFE2a77bbdd4885Ac2538481583',
  dpxeth: '0x75042A03D87c8aC2B5b035C1f05E506E3F6a6093',
  dbrdpx: '0x2FeD783b22B80d658555Cc66F1c872F83727ca57',
  bond: '0xB7C5f2A78ac434ecdfb448b4A7EE3922e3e5B66F',
  multirewards1: '0x4e8ce4a166710D0110De85669Fe0B5A3d1B71c7B',
  multirewards2: '0xE364E758b8A018d05f5ae72f4ea4373D8Adf28D2',
  rewardToken1: '0x6005F3DA8B31daDd15688e6247dFAC0d71c11dB5',
  rewardToken2: '0x28DA5Ec3e00C4B5F454526Ecb437eC95F5239902',
};

export default addresses;
