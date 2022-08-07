import { useCallback } from 'react';

import CustomButton from 'components/UI/CustomButton';

import { useWalletStore } from 'store/Wallet';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

export default function NetworkButton({ className }: { className?: string }) {
  const { chainId, setChangeNetwork } = useWalletStore();

  const handleOpen = useCallback(
    () => setChangeNetwork && setChangeNetwork('user'),
    [setChangeNetwork]
  );

  return (
    // TODO: FIX
    // @ts-ignore
    <CustomButton
      size="medium"
      className={className}
      color="cod-gray"
      startIcon={
        <img
          // @ts-ignore TODO: FIX
          src={CHAIN_ID_TO_NETWORK_DATA[chainId].icon}
          // @ts-ignore TODO: FIX
          alt={CHAIN_ID_TO_NETWORK_DATA[chainId].name}
          style={{ width: 13, height: 'auto' }}
        />
      }
      onClick={handleOpen}
    >
      {CHAIN_ID_TO_NETWORK_DATA[chainId]?.name}
    </CustomButton>
  );
}
