import type { Chain } from 'wagmi/chains';

import { InjectedConnector } from 'wagmi/connectors/injected';

export class BitKeepConnector extends InjectedConnector {
  override readonly id = 'bitKeep';

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[];
    options?: any;
  } = {}) {
    const options = {
      name: 'BitKeep',
      shimDisconnect: true,
      getProvider() {
        if (typeof window !== 'undefined') {
          const provider =
            (window as any).bitkeep && (window as any).bitkeep.ethereum;
          return provider;
        } else {
          return;
        }
      },
      ...options_,
    };
    // @ts-ignore
    super({ chains, options });
  }
}
