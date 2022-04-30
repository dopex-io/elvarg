import { useCallback, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';

import changeOrAddNetwork from 'utils/general/changeOrAddNetwork';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

interface Props {
  imgSrc: string;
  name: string;
  chainId: number;
}

const NetworkOption = ({ imgSrc, name, chainId }: Props) => {
  const handleClick = async () => {
    await changeOrAddNetwork(chainId);
  };

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
  const { wrongNetwork, supportedChainIds, changeNetwork, setChangeNetwork } =
    useContext(WalletContext);

  useEffect(() => {
    setChangeNetwork(wrongNetwork ? 'wrong-network' : 'close');
  }, [wrongNetwork, setChangeNetwork]);

  const handleClose = useCallback(
    (_, reason) => {
      if (reason === 'backdropClick') return;
      setChangeNetwork('close');
    },
    [setChangeNetwork]
  );

  return (
    <Dialog
      width={450}
      open={changeNetwork !== 'close'}
      handleClose={handleClose}
      showCloseIcon={changeNetwork === 'user'}
      aria-labelledby="wrong-network-dialog-title"
    >
      <Typography variant="h3" className="mb-4">
        Change Network
      </Typography>
      <Typography variant="h5" component="p" className="text-white mb-4">
        Connect to a supported network below:
      </Typography>
      <Box className="grid grid-cols-2 gap-4 mb-4">
        {supportedChainIds?.map((chainId) => {
          const data = CHAIN_ID_TO_NETWORK_DATA[chainId];
          return (
            <NetworkOption
              key={chainId}
              imgSrc={data.icon}
              name={data.name}
              chainId={chainId}
            />
          );
        })}
      </Box>

      {typeof window !== 'undefined' &&
        (!window?.ethereum?.isMetaMask ? (
          <Box className="mt-2 mb-2 flex">
            <Typography
              className="text-yellow bg-opacity-10 rounded-xl w-full"
              variant="caption"
            >
              If you are using Wallet Connect you can choose the desired network
              clicking on the dropdown menu immediately after you scan the QR
              Code
            </Typography>
          </Box>
        ) : null)}
    </Dialog>
  );
};

export default ChangeNetworkDialog;
