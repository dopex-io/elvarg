import { useCallback } from 'react';

import { Button } from '@dopex-io/ui';
import { useBoundStore } from 'store';

import { CHAINS } from 'constants/chains';

export default function NetworkButton({
  className = '',
}: {
  className?: string;
}) {
  const { chainId, setChangeNetwork } = useBoundStore();

  const handleOpen = useCallback(
    () => setChangeNetwork && setChangeNetwork('user'),
    [setChangeNetwork]
  );

  return (
    <Button className={className} color="carbon" onClick={handleOpen}>
      <img
        src={CHAINS[chainId]?.icon}
        alt={CHAINS[chainId]?.name}
        className="w-[18px] h-auto mx-1"
      />
      <span className="hidden lg:block ml-1">{CHAINS[chainId]?.name}</span>
    </Button>
  );
}
