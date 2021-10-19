import { FC, useContext, useMemo, useCallback } from 'react';

import { WalletContext } from 'contexts/Wallet';

import CustomButton, { CustomButtonProps } from '../UI/CustomButton';

const WalletButton: FC<CustomButtonProps> = (props) => {
  const { children, onClick, disabled, ...otherProps } = props;

  const { accountAddress, connect } = useContext(WalletContext);

  const isWalletConnected = useMemo(
    () => Boolean(accountAddress),
    [accountAddress]
  );

  const onConnectWallet = useCallback(() => connect(), [connect]);

  return (
    <CustomButton
      onClick={!isWalletConnected ? onConnectWallet : onClick}
      disabled={!isWalletConnected ? false : disabled}
      {...otherProps}
    >
      {!isWalletConnected ? 'Connect Wallet' : children}
    </CustomButton>
  );
};

export default WalletButton;
