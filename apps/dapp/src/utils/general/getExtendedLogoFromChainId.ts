const LOGOS: { [key: number]: string } = {
  5: '/images/networks/arbitrum.svg',
  56: '/images/networks/bnb-smart-chain.svg',
  42161: '/images/networks/arbitrum.svg',
  421613: '/images/networks/arbitrum.svg',
  43114: '/images/networks/avalanche.svg',
  137: '/images/networks/polygon.svg',
};

export const getExtendedLogoFromChainId = (chainId: number) => {
  return LOGOS[chainId] || '';
};

export default getExtendedLogoFromChainId;
