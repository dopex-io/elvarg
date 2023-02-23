import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

function getExplorerUrl(chainId: number): string {
  return CHAIN_ID_TO_EXPLORER[chainId] || 'https://arbiscan.io/';
}

export default getExplorerUrl;
