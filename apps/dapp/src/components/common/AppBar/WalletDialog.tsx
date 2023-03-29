import { useState, useCallback } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';
import delay from 'lodash/delay';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import BalanceItem from 'components/common/BalanceItem';

import { useBoundStore } from 'store';

import getExplorerUrl from 'utils/general/getExplorerUrl';
import displayAddress from 'utils/general/displayAddress';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { CHAINS } from 'constants/chains';

interface Props {
  open: boolean;
  handleClose: () => void;
  userBalances: {
    [key: string]: string | number | BigNumber | BigNumber;
  };
}

const WalletDialog = ({ open, handleClose, userBalances }: Props) => {
  const { accountAddress, chainId, ensName } = useBoundStore();

  const [copyState, setCopyState] = useState('Copy Address');

  const copyToClipboard = () => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(accountAddress ?? '-');
  };

  const changeWalletClick = useCallback(() => {
    // changeWallet();
    handleClose();
  }, [handleClose]);

  const disconnectWalletClick = useCallback(() => {
    // disconnect();
    handleClose();
  }, [handleClose]);

  return (
    <Dialog handleClose={handleClose} open={open} showCloseIcon>
      <Typography variant="h3" className="mb-4">
        Account
      </Typography>
      <Box className="flex items-center justify-between mb-4">
        <Typography
          variant="h5"
          className="bg-umbra rounded-xl border border-mineshaft border-opacity-50 py-1 px-2"
        >
          {displayAddress(accountAddress, ensName)}
        </Typography>
        <Box className="flex space-x-2">
          <Typography
            className="bg-mineshaft bg-opacity-10 rounded-xl border border-mineshaft border-opacity-20 hover:border-opacity-40 px-2 py-1 my-auto"
            variant="caption"
            onClick={copyToClipboard}
            role="button"
          >
            {copyState}
          </Typography>
          <Typography
            className="bg-mineshaft bg-opacity-10 rounded-xl border border-mineshaft border-opacity-20 hover:border-opacity-40 px-2 py-1 my-auto"
            variant="caption"
            onClick={copyToClipboard}
            role="button"
          >
            <a
              href={`${getExplorerUrl(chainId)}/address/${accountAddress}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <LaunchIcon className="p-0 m-0 w-3 h-3" /> Explorer
            </a>
          </Typography>
        </Box>
      </Box>
      <Box className="flex justify-between mb-4">
        <Typography
          className="text-wave-blue bg-wave-blue bg-opacity-10 rounded-xl border border-wave-blue border-opacity-20 hover:border-opacity-40 px-2 py-1 my-auto"
          variant="caption"
          onClick={changeWalletClick}
          role="button"
        >
          Change Wallet
        </Typography>
        <Typography
          className="text-down-bad bg-down-bad bg-opacity-10 rounded-xl border border-down-bad border-opacity-20 hover:border-opacity-40 px-2 py-1 my-auto"
          variant="caption"
          onClick={disconnectWalletClick}
          role="button"
        >
          Disconnect
        </Typography>
      </Box>
      {(CHAINS[chainId]?.displayTokens?.length! ?? 0) > 0 ? (
        <Box className="bg-umbra rounded-2xl border border-mineshaft border-opacity-50 p-2">
          <Box className="flex flex-col space-y-4">
            {CHAINS[chainId]?.displayTokens?.map((key: string, index) => {
              return (
                <BalanceItem
                  key={index}
                  balance={getUserReadableAmount(
                    userBalances[key] ?? '0',
                    chainId === 56 ? 8 : 18
                  ).toString()}
                  decimals={18}
                  token={key}
                  iconSrc={`/images/tokens/${key.toLowerCase()}.svg`}
                  iconAlt={key}
                />
              );
            })}
          </Box>
        </Box>
      ) : null}
      {typeof window !== 'undefined' && !window?.ethereum?.isMetaMask ? (
        <Box className="mt-2 mb-2 flex">
          <Typography
            className="text-yellow bg-opacity-10 rounded-xl w-full"
            variant="caption"
          >
            If you are using Wallet Connect you can choose the desired network
            clicking on the dropdown menu immediately after you scan the QR Code
          </Typography>
        </Box>
      ) : null}
    </Dialog>
  );
};

export default WalletDialog;
