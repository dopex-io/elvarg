import { TOKEN_DECIMALS } from 'constants/index';

const getTokenDecimals = (tokenSymbol: string, chainId: number) => {
  return (
    // @ts-ignore TODO: FIX
    TOKEN_DECIMALS[chainId.toString()][tokenSymbol.toLocaleUpperCase()] || 18
  );
};

export default getTokenDecimals;
