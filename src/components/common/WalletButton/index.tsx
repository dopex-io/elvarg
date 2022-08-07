import { FC, useMemo, useCallback } from 'react';

import { useWalletStore } from 'store/Wallet';

import CustomButton, { CustomButtonProps } from '../../UI/CustomButton';

const WalletButton: FC<CustomButtonProps> = (props) => {
  const { children, onClick, disabled, ...otherProps } = props;

  const { accountAddress, connect } = useWalletStore();

  const isWalletConnected = useMemo(
    () => Boolean(accountAddress),
    [accountAddress]
  );

  const onConnectWallet = useCallback(() => connect(), [connect]);

  return (
    // @ts-ignore TODO: FIX
    <CustomButton
      onClick={!isWalletConnected ? onConnectWallet : onClick}
      disabled={!isWalletConnected ? false : disabled}
      {...otherProps}
    >
      {children}
    </CustomButton>
  );
};

export default WalletButton;
