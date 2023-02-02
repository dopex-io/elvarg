import { useCallback } from 'react';

import CustomButton from 'components/UI/Button';

import { useBoundStore } from 'store';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

export default function NetworkButton({ className }: { className?: string }) {
  const { chainId, setChangeNetwork } = useBoundStore();

  const handleOpen = useCallback(
    () => setChangeNetwork && setChangeNetwork('user'),
    [setChangeNetwork]
  );

  return (
    <CustomButton
      size="medium"
      className={className || ''}
      color="cod-gray"
      startIcon={
        <img
          src={CHAIN_ID_TO_NETWORK_DATA[chainId]?.icon}
          alt={CHAIN_ID_TO_NETWORK_DATA[chainId]?.name}
          style={{ width: 13, height: 'auto' }}
        />
      }
      onClick={handleOpen}
    >
      {CHAIN_ID_TO_NETWORK_DATA[chainId]?.name}
    </CustomButton>
  );
}
