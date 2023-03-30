import { useEffect, useState, useCallback } from 'react';
import { Button } from '@dopex-io/ui';
import {
  useAccount,
  useProvider,
  useSigner,
  useNetwork,
  useEnsAvatar,
  useBalance,
} from 'wagmi';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { useBoundStore } from 'store';

import { smartTrim, smartDisplay } from 'utils/general';

import WalletDialog from '../WalletDialog';
import ConnectDialog from '../ConnectDialog';

export function ConnectButton() {
  const [open, setOpen] = useState(false);

  const [walletDialog, setWalletDialog] = useState(false);

  const { updateState, userAssetBalances } = useBoundStore();

  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { data } = useEnsAvatar(address ? { address } : {});
  const balance = useBalance(address ? { address } : {});

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

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <ConnectDialog open={open} handleClose={handleClose} />
      <WalletDialog
        open={walletDialog}
        userBalances={userAssetBalances}
        handleClose={handleWalletDialogClose}
      />
      {address ? (
        <>
          <div className="bg-cod-gray flex flex-row rounded-md items-center">
            <Button
              variant="text"
              className="text-white border-cod-gray hover:border-wave-blue border border-solid"
              onClick={handleClick}
            >
              {data && <img src={data} className="w-5 mr-2" alt="ens avatar" />}
              {smartTrim(address || '', 10)}
            </Button>
            <div className="bg-mineshaft flex-row px-2 py-2 rounded-md items-center mr-1 hidden lg:flex">
              <span className="text-white mr-2">
                {smartDisplay(balance.data?.formatted || '0.0')}
              </span>
              <span className="text-stieglitz">{balance.data?.symbol}</span>
            </div>
          </div>
        </>
      ) : (
        <Button
          size="medium"
          onClick={() => {
            setOpen(true);
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}

export default ConnectButton;
