import { useCallback } from 'react';

import CustomButton from 'components/UI/Button';

import { useBoundStore } from 'store';

import { CHAINS } from 'constants/chains';

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
          src={CHAINS[chainId]?.icon}
          alt={CHAINS[chainId]?.name}
          style={{ width: 13, height: 'auto' }}
        />
      }
      onClick={handleOpen}
    >
      {CHAINS[chainId]?.name}
    </CustomButton>
  );
}
