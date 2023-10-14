import { CHAINS } from 'constants/chains';

function getExplorerTxURL(chainId: number, hash: string): string {
  const explorer = CHAINS[chainId]?.explorer || 'https://arbiscan.io/';
  return `${explorer}tx/${hash}`;
}

export default getExplorerTxURL;
