import { useCallback, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Bid from '../dialogs/Bid';

interface CustomMenuProps {
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
  actionText: string;
}

const CustomMenu = (props: CustomMenuProps) => {
  const { data, actionText } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    handleClose: () => {},
    data: {},
  });

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseDialog = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  const handleMenuClick = useCallback((data) => {
    setDialogState((prevState) => ({
      ...prevState,
      open: true,
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
        disabled={data.isFulfilled}
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
        <MenuItem onClick={() => handleMenuClick(data)}>{actionText}</MenuItem>
      </Menu>
      <Bid
        open={dialogState.open}
        handleClose={handleCloseDialog}
        data={data}
      />
    </>
  );
};

export default CustomMenu;
