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

import changeOrAddNetworkToMetaMask from 'utils/general/changeOrAddNetworkToMetaMask';

const CHAIN_ID_TO_NETWORK_DATA = {
  1: { name: 'Mainnet', icon: ethDiamond },
  42: { name: 'Kovan', icon: ethDiamond },
  42161: { name: 'Arbitrum', icon: arbitrum },
  421611: { name: 'Testnet', icon: arbitrum },
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
    const toChainId = BUILD === 'main' ? 42161 : 421611;

    if (chainId !== toChainId) {
      changeOrAddNetworkToMetaMask(toChainId);
    }
  };

  const menuOptions = {
    testnet: [
      <MenuItem
        key={1}
        text="Asset Bridge"
        icon={<img src={bridge} alt="Arbitrum" className="w-4 mr-3" />}
        className="mb-6"
        onClick={() => window.open('https://bridge.arbitrum.io', '_blank')}
      />,
      <MenuItem
        key={2}
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
        key={1}
        text="Switch to L2 (Arbitrum)"
        icon={<img src={arbitrum} alt="Arbitrum" className="w-4 mr-3" />}
        className="mb-6"
        endComponent={<Switch checked={chainId === 42161} className="ml-8" />}
        onClick={handleClick}
      />,
      <MenuItem
        key={2}
        text="Asset Bridge"
        icon={<img src={bridge} alt="Arbitrum" className="w-4 mr-3" />}
        className="mb-6"
        onClick={() => window.open('https://bridge.arbitrum.io', '_blank')}
      />,
      <MenuItem
        key={3}
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
            src={CHAIN_ID_TO_NETWORK_DATA[chainId].icon}
            alt={CHAIN_ID_TO_NETWORK_DATA[chainId].name}
            style={{ width: 13, height: 'auto' }}
          />
        }
        onClick={handleOpen}
      >
        {CHAIN_ID_TO_NETWORK_DATA[chainId].name}
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
