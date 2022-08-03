import { Farm } from 'types/farms';

const REWARD_TOKENS = [
  {
    symbol: 'DPX',
    address: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
  },
  {
    symbol: 'RDPX',
    address: '0x32eb7902d4134bf98a28b963d26de779af92a212',
  },
];

export const FARMS: { [key: number]: Farm[] } = {
  42161: [
    {
      stakingTokenSymbol: 'DPX-WETH',
      stakingTokenAddress: '0x0C1Cf6883efA1B496B01f654E247B9b419873054',
      stakingRewardsAddress: '0x1f80C96ca521d7247a818A09b0b15C38E3e58a28',
      rewardTokens: [
        {
          symbol: 'DPX',
          address: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
        },
      ],
      status: 'ACTIVE',
      type: 'LP',
      version: 3,
    },
    {
      stakingTokenSymbol: 'RDPX-WETH',
      stakingTokenAddress: '0x7418F5A2621E13c05d1EFBd71ec922070794b90a',
      stakingRewardsAddress: '0xEb0F03A203F25F08c7aFF0e1b1C2E0EE25Ca29Eb',
      rewardTokens: [
        {
          symbol: 'DPX',
          address: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
        },
      ],
      status: 'ACTIVE',
      type: 'LP',
      version: 3,
    },
    {
      stakingTokenSymbol: 'DPX-WETH',
      stakingTokenAddress: '0x0C1Cf6883efA1B496B01f654E247B9b419873054',
      stakingRewardsAddress: '0x96B0d9c85415C69F4b2FAC6ee9e9CE37717335B4',
      rewardTokens: REWARD_TOKENS,
      status: 'CLOSED',
      type: 'LP',
      version: 2,
      newStakingRewardsAddress: '0x1f80C96ca521d7247a818A09b0b15C38E3e58a28',
    },
    {
      stakingTokenSymbol: 'RDPX-WETH',
      stakingTokenAddress: '0x7418F5A2621E13c05d1EFBd71ec922070794b90a',
      stakingRewardsAddress: '0x03ac1Aa1ff470cf376e6b7cD3A3389Ad6D922A74',
      rewardTokens: REWARD_TOKENS,
      status: 'CLOSED',
      type: 'LP',
      version: 2,
      newStakingRewardsAddress: '0xEb0F03A203F25F08c7aFF0e1b1C2E0EE25Ca29Eb',
    },
    {
      stakingTokenSymbol: 'RDPX',
      stakingTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
      stakingRewardsAddress: '0x8d481245801907b45823Fb032E6848d0D3c29AE5',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'SINGLE',
      version: 2,
    },
    {
      stakingTokenSymbol: 'RDPX',
      stakingTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
      stakingRewardsAddress: '0x125Cc7CCE81A809c825C945E5aA874E60ccCB6Bb',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'SINGLE',
      version: 2,
    },
  ],
  1: [
    {
      stakingTokenSymbol: 'DPX-WETH',
      stakingTokenAddress: '0xf64af01a14c31164ff7381cf966df6f2b4cb349f',
      stakingRewardsAddress: '0x2a52330be21d311a7a3f40dacbfee8978541b74a',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'LP',
      version: 1,
    },
    {
      stakingTokenSymbol: 'RDPX-WETH',
      stakingTokenAddress: '0x0bf46ba06dc1d33c3bd80ff42497ebff13a88900',
      stakingRewardsAddress: '0x175029c85b14c326c83c9f83d4a21ca339f44cb5',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'LP',
      version: 1,
    },
  ],
  421611: [
    {
      stakingTokenSymbol: 'ST',
      stakingTokenAddress: '0xfAcEC50912e55c1D7C79f3312419CCDF001d45c2',
      stakingRewardsAddress: '0xDA2d91A827849580B75e668f22F49f9857bF3dF8',
      rewardTokens: [
        { symbol: 'RT', address: '0xf306fd3A1c3eFFD814E682Eb934Ce43Be81c3e1b' },
      ],
      status: 'ACTIVE',
      type: 'LP',
      version: 3,
    },
  ],
};
