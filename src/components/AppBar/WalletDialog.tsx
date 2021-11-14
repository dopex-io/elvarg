import { useCallback, useContext } from 'react';
import {} from '@dopex-io/sdk';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import BalanceItem from 'components/BalanceItem';

import { WalletContext } from 'contexts/Wallet';

import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const WalletDialog = ({ open, handleClose, userBalances }) => {
  const { accountAddress, changeWallet, disconnect } =
    useContext(WalletContext);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountAddress);
  };

  const changeWalletClick = useCallback(() => {
    changeWallet();
    handleClose();
  }, [handleClose, changeWallet]);

  const disconnectWalletClick = useCallback(() => {
    disconnect();
    handleClose();
  }, [disconnect, handleClose]);

  return (
    <Dialog handleClose={handleClose} open={open} showCloseIcon>
      <Typography variant="h3" className="mb-4">
        Account
      </Typography>
      <Box className="flex items-center justify-between mb-4">
        <Typography
          variant="h5"
          className="text-white font-lg bg-umbra rounded-md py-2 px-4"
        >
          {smartTrim(accountAddress, 10)}
        </Typography>
        <Box className="flex space-x-2">
          <IconButton
            className="text-white focus:bg-transparent p-0"
            onClick={copyToClipboard}
          >
            <FileCopyRoundedIcon className="p-1 text-stieglitz hover:text-white transition duration-150 ease-in-out" />
          </IconButton>
          <IconButton
            className="text-white focus:bg-transparent p-0"
            href={`https://etherscan.io/address/${accountAddress}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <LaunchIcon className="p-1 text-stieglitz hover:text-white transition duration-150 ease-in-out" />
          </IconButton>
        </Box>
      </Box>
      <Box className="flex justify-between mb-4">
        <Typography
          className="text-wave-blue px-2 py-1 my-auto"
          variant="h5"
          onClick={changeWalletClick}
          role="button"
        >
          Change Wallet
        </Typography>
        <Typography
          className="text-down-bad bg-down-bad bg-opacity-10 rounded-md px-2 py-1 my-auto"
          variant="h5"
          onClick={disconnectWalletClick}
          role="button"
        >
          Disconnect
        </Typography>
      </Box>
      <Box className="flex flex-col w-full space-y-4">
        <Typography variant="h4">Balances</Typography>
        <Box className="flex flex-col justify-left space-y-4">
          <BalanceItem
            balance={getUserReadableAmount(userBalances.DPX, 18).toString()}
            decimals={18}
            token="DPX"
            iconSrc={'/assets/dpx.svg'}
            iconAlt="DPX"
          />
          <BalanceItem
            balance={getUserReadableAmount(userBalances.RDPX, 18).toString()}
            decimals={18}
            token="rDPX"
            iconSrc={'/assets/rdpx.svg'}
            iconAlt="rDPX"
          />
          <BalanceItem
            balance={getUserReadableAmount(userBalances.ETH, 18).toString()}
            token="ETH"
            iconSrc={'/assets/eth.svg'}
            iconAlt="ETH"
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default WalletDialog;
