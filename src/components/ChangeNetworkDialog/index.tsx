import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';

import changeOrAddNetworkToMetaMask from 'utils/general/changeOrAddNetworkToMetaMask';

interface Props {
  imgSrc: string;
  name: string;
  chainId: number;
}

const NETWORKS = {
  1: {
    imgSrc: '/assets/eth.svg',
    name: 'Ethereum',
  },
  56: {
    imgSrc: '/assets/bsc.svg',
    name: 'Binance Smart Chain',
  },
  42161: {
    imgSrc: '/assets/arbitrum.svg',
    name: 'Arbitrum',
  },
};

const NetworkOption = ({ imgSrc, name, chainId }: Props) => {
  const handleClick = () => changeOrAddNetworkToMetaMask(chainId);

  return (
    <Box
      className="flex space-x-3 bg-umbra rounded-md p-3 items-center hover:bg-black"
      onClick={handleClick}
      role="button"
    >
      <Box>
        <img src={imgSrc} alt={name} width="20" height="22" />
      </Box>
      <Typography variant="h5" className="text-white font-mono">
        {name}
      </Typography>
    </Box>
  );
};

const ChangeNetworkDialog = () => {
  const [open, setOpen] = useState(false);

  const { wrongNetwork, supportedChainIds } = useContext(WalletContext);

  useEffect(() => {
    setOpen(wrongNetwork);
  }, [wrongNetwork]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog
      width={450}
      open={open}
      onClose={handleClose}
      aria-labelledby="wrong-network-dialog-title"
    >
      <Typography variant="h3" className="mb-4">
        Change Network
      </Typography>
      <Typography variant="h5" component="p" className="text-white mb-4">
        The current page you are on does not support the network you are
        connected to. Connect to a supported network below:
      </Typography>
      <Box className="grid grid-cols-2 gap-4 mb-4">
        {supportedChainIds.map((chainId) => {
          const data = NETWORKS[chainId];

          return (
            <NetworkOption
              key={chainId}
              imgSrc={data.imgSrc}
              name={data.name}
              chainId={chainId}
            />
          );
        })}
      </Box>
    </Dialog>
  );
};

export default ChangeNetworkDialog;
