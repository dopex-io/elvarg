import { BUILD } from 'constants/index';

const ARGS = {
  testnet: {
    chainId: '0x66EEB',
    params: [
      {
        chainId: '0x66EEB',
        chainName: 'Arbitrum Testnet',
        nativeCurrency: {
          name: 'Arbitrum Testnet',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://testnet.arbiscan.io/'],
      },
    ],
  },
  main: {
    chainId: '0xA4B1',
    params: [
      {
        chainId: '0xA4B1', // A 0x-prefixed hexadecimal string
        chainName: 'Arbitrum',
        nativeCurrency: {
          name: 'Arbitrum One',
          symbol: 'AETH',
          decimals: 18,
        },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io/'],
      },
    ],
  },
};

export default async function addNetworkToMetaMask() {
  if (!window && !window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARGS[BUILD].chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: ARGS[BUILD].params,
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}
