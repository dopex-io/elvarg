import { useConnect, useAccount } from 'wagmi';
import CircularProgress from '@mui/material/CircularProgress';

import { Dialog } from 'components/UI';

const WALLET_TO_ICON: { [key: string]: string } = {
  coinbaseWallet: 'coinbase.svg',
  metaMask: 'metamask.svg',
  walletConnect: 'walletconnect.svg',
  ledger: 'ledger.svg',
  injected: 'bitkeep.svg',
};

const ConnectDialog = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: any;
}) => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { connector: activeConnector } = useAccount();

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <div className="text-white font-bold text-lg mb-3">Connect a Wallet</div>
      <div className="grid gap-3">
        {connectors.map((connector) => {
          return (
            <div
              className="w-full bg-umbra text-white rounded-lg p-3 flex space-x-3 cursor-pointer"
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              <img
                src={`/images/wallets/${WALLET_TO_ICON[connector.id]}`}
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
