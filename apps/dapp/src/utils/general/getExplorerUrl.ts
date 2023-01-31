const ETHERSCAN = 'https://etherscan.io/';

const CHAIN_ID_TO_EXPLORER = {
  1: ETHERSCAN,
  5: 'https://goerli.etherscan.io/',
  42: 'https://kovan.etherscan.io/',
  56: 'https://bscscan.com/',
  1337: '',
  421611: 'https://testnet.arbiscan.io/',
  42161: 'https://arbiscan.io/',
  43114: 'https://snowtrace.io/',
};

function getExplorerUrl(chainId: number): string {
  // @ts-ignore TODO: FIX
  return CHAIN_ID_TO_EXPLORER[chainId] ?? ETHERSCAN;
}

export default getExplorerUrl;
