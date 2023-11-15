import { CHAINS } from 'constants/chains';

function getExplorerUrl(chainId: number): string {
  return CHAINS[chainId]?.explorer || 'https://arbiscan.io/';
}

export default getExplorerUrl;
