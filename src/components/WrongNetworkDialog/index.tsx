import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';

import addNetworkToMetaMask from 'utils/general/addNetworkToMetaMask';

const WrongNetworkDialog = () => {
  const [open, setOpen] = useState(false);

  const { wrongNetwork } = useContext(WalletContext);

  useEffect(() => {
    setOpen(wrongNetwork);
  }, [wrongNetwork]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="wrong-network-dialog-title"
    >
      <Typography variant="h3" className="mb-4">
        Please connect to a valid network
      </Typography>
      <Typography variant="h5" component="p" className="text-white">
        Dopex contracts have not been deployed to the current network you are
        connected to. Please connect to a valid network.
      </Typography>
      <Box className="flex justify-end">
        <CustomButton size="medium" onClick={addNetworkToMetaMask}>
          Switch
        </CustomButton>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default WrongNetworkDialog;
