import { useEffect, useState, useCallback } from 'react';
import { Button } from '@dopex-io/ui';
import {
  useAccount,
  useProvider,
  useSigner,
  useNetwork,
  useEnsAvatar,
} from 'wagmi';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { useBoundStore } from 'store';

import { smartTrim } from 'utils/general';

import WalletDialog from '../WalletDialog';
import { useConnectDialog } from '../ConnectDialog';

export function ConnectButton() {
  const [walletDialog, setWalletDialog] = useState(false);

  const { updateState, userAssetBalances } = useBoundStore();

  const open = useConnectDialog((state) => state.open);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { data } = useEnsAvatar(address ? { address, chainId: 1 } : {});

  useEffect(() => {
    updateState({
      signer,
      provider,
      chainId: chain?.id || DEFAULT_CHAIN_ID,
      accountAddress: address,
    });
  }, [address, chain, provider, signer, updateState]);

  const handleClick = useCallback(() => {
    setWalletDialog(true);
  }, []);

  const handleWalletDialogClose = useCallback(() => {
    setWalletDialog(false);
  }, []);

  return (
    <>
      <WalletDialog
        open={walletDialog}
        userBalances={userAssetBalances}
        handleClose={handleWalletDialogClose}
      />
      {address ? (
        <Button
          className="text-white border-cod-gray flex items-center"
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
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}

export default ConnectButton;
