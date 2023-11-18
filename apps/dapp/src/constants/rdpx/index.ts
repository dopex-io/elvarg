import addresses from './addresses';

export const quickLinks = {
  whitepaper: {
    text: 'What is rDPX v2',
    iconSymbol: '/images/tokens/rdpx.svg',
    url: 'https://docs.google.com/document/d/1005YPC8-tUJhuhzTZK__3KZss0o_-ix4/edit',
    body: 'rDPX v2 is a system that allows you to mint rtETH, a yield-bearing synthetic version of ETH.',
  },
  arbiscanV2Core: {
    text: 'RDPX V2 Core',
    iconSymbol: '/assets/etherscan.svg',
    url: `https://arbiscan.io/address/${addresses.v2core}`,
  },
  arbiscanPerpVault: {
    text: 'Perpetual Put Vault',
    iconSymbol: '/assets/etherscan.svg',
    url: `https://arbiscan.io/address/${addresses.perpPool}`,
  },
  arbiscanStaking: {
    text: 'MultiRewards',
    iconSymbol: '/assets/etherscan.svg',
    url: `https://arbiscan.io/address/${addresses.multirewards2}`,
  },
  dune: {
    text: 'Dune Analytics',
    iconSymbol: '/assets/dune-dashboard.svg',
    url: `https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713`,
  },
  strategyVault: {
    text: 'What is rDPX Perpetual Put Vault?',
    iconSymbol: '/images/tokens/rdpx.svg',
    url: 'https://dopex.notion.site/rDPX-V2-RI-b45b5b402af54bcab758d62fb7c69cb4#c13cd86d4f054eec8f8d945596482b51',
    body: `Accrue premiums & earn rewards by depositing Wrapped Ether into the Perpetual Put Vault (PPV) to write 
    rDPX perpetual put options to the treasury. Options are asset-settled with rDPX.`,
  },
  staking: {
    text: 'What is rtETH Staking?',
    iconSymbol: '/images/tokens/rdpx.svg',
    url: undefined,
    body: `Stake your rtETH to accrue rewards. Once staked, you can claim rewards and withdraw your tokens at any time.`,
  },
};
