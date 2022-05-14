const LOGOS = {
  56: '/assets/binance-full.svg',
  42161: '/assets/arbitrum-full.svg',
  43114: '/assets/avax-full.svg',
};

// @ts-ignore TODO: FIX
export const getExtendedLogoFromChainId = (chainId) => {
  // @ts-ignore TODO: FIX
  return LOGOS[chainId] || '#';
};

export default getExtendedLogoFromChainId;
