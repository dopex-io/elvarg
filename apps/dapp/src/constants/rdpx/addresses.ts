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
  v2core: '0x6b191C610eEdB82945Bb17E2a43C74493B9C6250',
  perpPool: '0x37b1Cfc39750bf9fC41CBcfe74251A6498cB93c3',
  delegateBonds: '0x8A9c9A1C41D39a5f9371DBD56feCD5C1DeFA2E2B',
  perpPoolLp: '0xDbAC511dFf7B4ACC8416a3C447B102cD2293Bad1',
  receiptToken: '0x1dEc89C87f0d959b0331A56C893cf7BAE0cc53Ca',
  rdpxReserve: '0xD3B6eADf0E4C77CecfEe27d62F9D5720096711B3',
  redeemDpxeth: '0x709b50ef3aE3792937d4924D2603C5321C71B386',
  rdpx: '0x8939B652836472C4CEeC8C6DB62edc0c63e9C9bc',
  weth: '0x33f580784b8f9d27E2700F1aAd812F9D4eA9Fe53',
  dpxeth: '0x20E7410Ff61c1F30028Dcb104b9F19bE71F3D05B',
  dbrdpx: '0xfedaE4a77F69952B81884178044dE99B54B70E8B',
  bond: '0xC9518725cB63179D04373B683E0271C865271be7',
  multirewards1: '0x4e8ce4a166710D0110De85669Fe0B5A3d1B71c7B',
  multirewards2: '0xE364E758b8A018d05f5ae72f4ea4373D8Adf28D2',
  rewardToken1: '0x6005F3DA8B31daDd15688e6247dFAC0d71c11dB5',
  rewardToken2: '0x28DA5Ec3e00C4B5F454526Ecb437eC95F5239902',
};

export default addresses;
