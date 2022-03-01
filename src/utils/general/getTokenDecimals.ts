import { TOKEN_DECIMALS } from 'constants/index';

const getTokenDecimals = (tokenSymbol: string) => {
  return TOKEN_DECIMALS[tokenSymbol.toLocaleUpperCase()] || 18;
};

export default getTokenDecimals;
