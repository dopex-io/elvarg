import { useCallback, useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Bid from '../Dialogs/Bid';
import CloseRfqDialog from '../Dialogs/CloseRfqDialog';

import { WalletContext } from 'contexts/Wallet';

interface CustomMenuProps {
  data: {
    data: {
      isBuy: boolean;
      dealer: string;
      dealerAddress: string;
      quote: string;
      base: string;
      price: string;
      amount: string;
      timestamp: any;
      isFulfilled: boolean;
    };
  };
  actions?: string[];
}

const DIALOGS = {
  BID: Bid,
  CLOSE: CloseRfqDialog,
};

const CustomMenu = (props: CustomMenuProps) => {
  const { accountAddress } = useContext(WalletContext);
  const { data, actions } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    type: 'BID',
    handleClose: () => {},
    data: {},
  });

  const Dialog = DIALOGS[dialogState.type];

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseDialog = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  const handleMenuClick = useCallback((data, type) => {
    setDialogState((prevState) => ({
      ...prevState,
      open: true,
      type,
      data,
    }));
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        className="text-white rounded px-0 ml-1"
        disabled={data.data.isFulfilled}
        disableRipple
      >
        <MoreVert className="fill-current text-white" />
      </IconButton>
      <Menu
        id="card-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="text-white rounded px-0 ml-1"
        classes={{ paper: 'bg-umbra text-white py-0' }}
      >
        <MenuItem onClick={() => handleMenuClick(data, 'BID')}>
          {actions[0]}
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuClick(data, 'CLOSE')}
          disabled={
            accountAddress !== data.data.dealerAddress || data.data.isFulfilled
          }
        >
          {actions[1]}
        </MenuItem>
      </Menu>
      <Dialog
        open={dialogState.open}
        handleClose={handleCloseDialog}
        data={data}
      />
    </>
  );
};

export default CustomMenu;
