const LOGOS = {
  56: '/assets/binance-full.svg',
  42161: '/assets/arbitrum-full.svg',
  43114: '/assets/avax-full.svg',
};

export const getExtendedLogoFromChainId = (chainId) => {
  return LOGOS[chainId] || '#';
};

export default getExtendedLogoFromChainId;
