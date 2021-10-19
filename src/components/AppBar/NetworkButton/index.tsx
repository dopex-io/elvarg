import { useCallback, useState, useContext } from 'react';
import cx from 'classnames';
import Menu from '@material-ui/core/Menu';
import MuiMenuItem from '@material-ui/core/MenuItem';
import InfoIcon from '@material-ui/icons/Info';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Switch from 'components/UI/Switch';

import { WalletContext } from 'contexts/Wallet';

import ethDiamond from 'assets/tokens/eth_diamond.svg';
import arbitrum from 'assets/icons/arbitrum.svg';
import bridge from 'assets/icons/bridge.svg';

import { BUILD } from 'constants/index';

import addNetworkToMetaMask from 'utils/general/addNetworkToMetaMask';

const CHAIN_ID_TO_NETWORK_NAME = {
  1: 'Mainnet',
  42: 'Kovan',
  42161: 'Arbitrum',
  421611: 'Testnet',
};

const CHAIN_ID_TO_NETWORK_ICON = {
  1: ethDiamond,
  42: ethDiamond,
  42161: arbitrum,
  421611: arbitrum,
};

const MenuItem = ({
  text,
  icon,
  endComponent,
  className,
  onClick,
}: {
  text: string;
  icon: any;
  endComponent?: any;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <MuiMenuItem
      className={cx('ml-2 text-white p-0', className)}
      onClick={onClick}
    >
      {icon}
      <Typography variant="caption" component="div">
        {text}
      </Typography>
      {endComponent}
    </MuiMenuItem>
  );
};

export default function NetworkButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { chainId } = useContext(WalletContext);

  const handleOpen = useCallback((e) => setAnchorEl(e.currentTarget), []);

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleClick = () => {
    if (chainId !== 42161) {
      addNetworkToMetaMask();
    }
  };

  const menuOptions = {
    testnet: [
      <MenuItem
        text="Asset Bridge"
        icon={<img src={bridge} alt="Arbitrum" className="w-4 mr-3" />}
        className="mb-6"
        onClick={() => window.open('https://bridge.arbitrum.io', '_blank')}
      />,
      <MenuItem
        text="Learn More"
        icon={<InfoIcon className="w-4 mr-3 text-stieglitz" />}
        onClick={() =>
          window.open(
            'https://developer.offchainlabs.com/docs/public_testnet',
            '_blank'
          )
        }
      />,
    ],
    main: [
      <MenuItem
        text="Switch to L2 (Arbitrum)"
        icon={<img src={arbitrum} alt="Arbitrum" className="w-4 mr-3" />}
        className="mb-6"
        endComponent={<Switch checked={chainId === 42161} className="ml-8" />}
        onClick={handleClick}
      />,
      <MenuItem
        text="Asset Bridge"
        icon={<img src={bridge} alt="Arbitrum" className="w-4 mr-3" />}
        className="mb-6"
        onClick={() => window.open('https://bridge.arbitrum.io', '_blank')}
      />,
      <MenuItem
        text="Learn More"
        icon={<InfoIcon className="w-4 mr-3 text-stieglitz" />}
        onClick={() =>
          window.open(
            'https://developer.offchainlabs.com/docs/mainnet',
            '_blank'
          )
        }
      />,
    ],
  };

  return (
    <>
      <CustomButton
        size="medium"
        className="ml-4 w-28"
        color="cod-gray"
        startIcon={
          <img
            src={CHAIN_ID_TO_NETWORK_ICON[chainId]}
            alt={CHAIN_ID_TO_NETWORK_NAME[chainId]}
            style={{ width: 13, height: 'auto' }}
          />
        }
        onClick={handleOpen}
      >
        {CHAIN_ID_TO_NETWORK_NAME[chainId]}
      </CustomButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ paper: 'bg-cod-gray p-3 rounded-md mt-2' }}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{ classes: { root: 'p-0' } }}
      >
        {menuOptions[BUILD]}
      </Menu>
    </>
  );
}
