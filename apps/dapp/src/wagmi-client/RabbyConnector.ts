import type { Chain } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';

export class RabbyConnector extends InjectedConnector {
  override readonly id = 'rabby';

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[];
    options?: any;
  } = {}) {
    const options = {
      name: 'Rabby',
      shimDisconnect: true,
      getProvider() {
        if (typeof window !== 'undefined') {
          if ((window as any).ethereum.isRabby) {
            const provider = (window as any).ethereum;
            return provider;
          }
          return;
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
