const LOGOS: { [key: number]: string } = {
  56: '/images/networks/bnb-smart-chain.svg',
  42161: '/images/networks/arbitrum-full.svg',
  43114: '/images/networks/avalanche.svg',
};

export const getExtendedLogoFromChainId = (chainId: number) => {
  return LOGOS[chainId] || '';
};

export default getExtendedLogoFromChainId;
