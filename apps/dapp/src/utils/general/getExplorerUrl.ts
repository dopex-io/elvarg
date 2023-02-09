import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

function getExplorerUrl(chainId: number): string | undefined {
  return CHAIN_ID_TO_EXPLORER[chainId];
}

export default getExplorerUrl;
