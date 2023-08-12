import { useEffect, useState } from 'react';

import { Button } from '@dopex-io/ui';
import cx from 'classnames';
import { useAccount, useEnsAvatar, useEnsName, useNetwork } from 'wagmi';

import { useBoundStore } from 'store';

import { useEthersProvider } from 'hooks/useEthersProvider';
import { useEthersSigner } from 'hooks/useEthersSigners';

import { smartTrim } from 'utils/general';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { useConnectDialog } from '../ConnectDialog';
import WalletDialog from '../WalletDialog';

export function ConnectButton({ className }: { className?: string }) {
  const [walletDialog, setWalletDialog] = useState(false);

  const { updateState, userAssetBalances } = useBoundStore();

  const open = useConnectDialog((state) => state.open);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useEthersProvider({ chainId: chain?.id });
  const signer = useEthersSigner({ chainId: chain?.id });
  const { data: ensName } = useEnsName(address ? { address, chainId: 1 } : {});
  const { data } = useEnsAvatar({ name: ensName, chainId: 1 });

  useEffect(() => {
    updateState({
      signer,
      provider,
      chainId: chain?.id || DEFAULT_CHAIN_ID,
      accountAddress: address,
    });
  }, [address, chain, provider, signer, updateState]);

  const handleClick = () => {
    setWalletDialog(true);
  };

  const handleWalletDialogClose = () => {
    setWalletDialog(false);
  };

  return (
    <>
      <WalletDialog
        open={walletDialog}
        userBalances={userAssetBalances}
        handleClose={handleWalletDialogClose}
      />
      {address ? (
        <Button
          className={cx(
            'text-white border-cod-gray flex items-center',
            className,
          )}
          color="carbon"
          onClick={handleClick}
        >
          {data && <img src={data} className="w-5 mr-2" alt="ens avatar" />}
          {smartTrim(address || '', 10)}
        </Button>
      ) : (
        <Button
          size="medium"
          onClick={() => {
            open();
          }}
          className={className}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}

export default ConnectButton;
