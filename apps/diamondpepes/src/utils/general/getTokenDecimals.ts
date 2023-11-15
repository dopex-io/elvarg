import { CHAINS } from 'constants/chains';

const getTokenDecimals = (tokenSymbol: string, chainId: number) => {
  return (
    CHAINS[chainId]?.tokenDecimals[tokenSymbol.toLocaleUpperCase()] ||
    (tokenSymbol.includes('NFT') ? 0 : 18)
  );
};

export default getTokenDecimals;
