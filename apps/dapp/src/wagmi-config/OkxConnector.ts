import type { Chain } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';

export class OkxConnector extends InjectedConnector {
  override readonly id = 'okx';

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[];
    options?: any;
  } = {}) {
    const options = {
      name: 'OKX',
      shimDisconnect: true,
      getProvider() {
        if (typeof window !== 'undefined') {
          if ((window as any).okxwallet) {
            const provider = (window as any).okxwallet;
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
