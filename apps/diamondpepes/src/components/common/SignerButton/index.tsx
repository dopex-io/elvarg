import { FC } from 'react';

import { Button, ButtonProps } from '@dopex-io/ui';
import { useAccount } from 'wagmi';

import { useConnectDialog } from '../ConnectDialog';

const SignerButton: FC<ButtonProps> = (props) => {
  const { children, onClick, disabled, ...otherProps } = props;

  const { isConnected } = useAccount();

  const connect = useConnectDialog((state) => state.open);

  return (
    <Button
      onClick={!isConnected ? connect : onClick}
      disabled={!isConnected ? false : disabled!}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export default SignerButton;
