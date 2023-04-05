import { useConnect, useAccount } from 'wagmi';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import CircularProgress from '@mui/material/CircularProgress';

import { Dialog } from 'components/UI';

interface ConnectDialogState {
  isOpen: boolean;
  open: () => void;
  close: (e: any, reason: string) => void;
}

export const useConnectDialog = create<ConnectDialogState>()(
  devtools((set) => ({
    isOpen: false,
    open: () =>
      set(() => ({
        isOpen: true,
      })),
    close: (_e: any, _reason: any) =>
      set(() => ({
        isOpen: false,
      })),
  }))
);

const ConnectDialog = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const open = useConnectDialog((state) => state.isOpen);
  const handleClose = useConnectDialog((state) => state.close);

  const { connector: activeConnector } = useAccount();

  const WALLET_DATA: {
    [key: string]: {
      icon: string;
      downloadLink?: string;
      action?: () => void;
    };
  } = {
    coinbaseWallet: {
      icon: 'coinbase.svg',
    },
    metaMask: {
      icon: 'metamask.svg',
      downloadLink: 'https://metamask.io/download/',
    },
    walletConnect: {
      icon: 'walletconnect.svg',
      action: () => handleClose('', ''),
    },
    ledger: { icon: 'ledger.svg', action: () => handleClose('', '') },
    bitKeep: {
      icon: 'bitkeep.svg',
      downloadLink: 'https://bitkeep.com/en/download?type=2',
    },
    injected: {
      icon: 'injected.svg',
    },
  };

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <div className="text-white font-bold text-lg mb-3">Connect a Wallet</div>
      <div className="grid gap-3">
        {connectors.map((connector) => {
          const icon = WALLET_DATA[connector.id]?.icon;
          const downloadLink = WALLET_DATA[connector.id]?.downloadLink;
          const action = WALLET_DATA[connector.id]?.action;
          return (
            <div
              className="w-full bg-umbra text-white rounded-lg p-3 flex space-x-3 cursor-pointer"
              key={connector.id}
              onClick={() => {
                if (!connector.ready && downloadLink) {
                  window.open(downloadLink);
                } else {
                  connect({ connector });
                }

                action && action();
              }}
            >
              <img
                src={`/images/wallets/${icon}`}
                alt={connector.id}
                className="w-7"
              />
              <span className="grow">{connector.name}</span>
              {connector.id === activeConnector?.id ? (
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 align-center self-center" />
              ) : (
                ''
              )}
              {isLoading && connector.id === pendingConnector?.id && (
                <CircularProgress size={25} />
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <div className="text-down-bad mt-3">Error: {error.message}</div>
      )}
    </Dialog>
  );
};

export default ConnectDialog;
