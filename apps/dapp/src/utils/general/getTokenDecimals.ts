import { TOKEN_DECIMALS } from 'constants/index';

const getTokenDecimals = (tokenSymbol: string, chainId: number) => {
  return (
    TOKEN_DECIMALS[chainId.toString()]![tokenSymbol.toLocaleUpperCase()] ||
    (tokenSymbol.includes('NFT') ? 0 : 18)
  );
};

export default getTokenDecimals;
