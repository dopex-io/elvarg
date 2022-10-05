import { FC, useMemo, useCallback } from 'react';

import { useBoundStore } from 'store';

import CustomButton, { CustomButtonProps } from '../../UI/Button';

const WalletButton: FC<CustomButtonProps> = (props) => {
  const { children, onClick, disabled, ...otherProps } = props;

  const { accountAddress, connect } = useBoundStore();

  const isWalletConnected = useMemo(
    () => Boolean(accountAddress),
    [accountAddress]
  );

  const onConnectWallet = useCallback(() => connect(), [connect]);

  return (
    <CustomButton
      onClick={!isWalletConnected ? onConnectWallet : onClick}
      disabled={!isWalletConnected ? false : disabled!}
      {...otherProps}
    >
      {children}
    </CustomButton>
  );
};

export default WalletButton;
