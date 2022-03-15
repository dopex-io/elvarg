import { useCallback, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

import WalletButton from 'components/WalletButton';

const PageConnectDialog = () => {
  return (
    <Dialog
      width={450}
      open={true}
      aria-labelledby="not-connected-dialog-title"
      className={'z-1'}
    >
      <Typography variant="h5" className="mb-2">
        Connect to proceed
      </Typography>
      <Typography variant="h6" className="mb-4 text-stieglitz">
        It looks like you have not connected your wallet to Dopex
      </Typography>
      <WalletButton
        size="small"
        className="w-full"
        onClick={() => location.reload()}
      >
        Connect
      </WalletButton>
    </Dialog>
  );
};

export default PageConnectDialog;
