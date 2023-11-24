import addresses from './addresses';

export const quickLinks = {
  core: {
    text: 'What is rDPX v2?',
    iconSymbol: '/images/tokens/rdpx.svg',
    url: 'https://learn.dopex.io/product-explainers#block-e8011587ccb84ad3946d0c5bc9d7b2ef',
    body: 'rDPX v2 is a system that allows you to mint rtETH, a yield-bearing synthetic version of ETH.',
  },
  arbiscanV2Core: {
    text: 'RDPX V2 Core',
    iconSymbol: '/images/misc/etherscan.svg',
    url: `https://arbiscan.io/address/${addresses.v2core}`,
  },
  arbiscanPerpVault: {
    text: 'Perpetual Put Vault',
    iconSymbol: '/images/misc/etherscan.svg',
    url: `https://arbiscan.io/address/${addresses.perpPool}`,
  },
  arbiscanStaking: {
    text: 'MultiRewards',
    iconSymbol: '/images/misc/etherscan.svg',
    url: `https://arbiscan.io/address/${addresses.receiptTokenStaking}`,
  },
  dune: {
    text: 'Dune Analytics',
    iconSymbol: '/images/misc/dune-dashboard.svg',
    url: `https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713`,
  },
  strategyVault: {
    text: 'What is rDPX Perpetual Put Vault?',
    iconSymbol: '/images/tokens/rdpx.svg',
    url: 'https://learn.dopex.io/quick-start/rdpx-v2-using-the-perpetual-put-vaults',
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
