const COLORS = {
  56: 'mineshaft',
  42161: '[#2D364D]',
  43114: 'mineshaft',
  1: 'mineshaft',
};

export const getBackgroundColorFromChainId = (chainId) => {
  return COLORS[chainId] || 'mineshaft';
};

export default getBackgroundColorFromChainId;
