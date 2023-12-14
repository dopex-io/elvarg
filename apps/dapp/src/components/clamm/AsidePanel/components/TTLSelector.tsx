import React, { useMemo } from 'react';

import useClammStore from 'hooks/clamm/useClammStore';

import { cn } from 'utils/general';

import { EXPIRIES, EXPIRIES_TO_KEY } from 'constants/clamm';

const TTLSelector = () => {
  const { selectedOptionsPool, selectedTTL, setSelectedTTL } = useClammStore();
  const ttls = useMemo(() => {
    if (!selectedOptionsPool) return [];
    const { ttls } = selectedOptionsPool;
    return ttls.map((key) => EXPIRIES_TO_KEY[Number(key)]);
  }, [selectedOptionsPool]);

  return (
    <div className="bg-umbra w-full p-[12px] rounded-t-lg space-y-[12px]">
      <span className="text-stieglitz text-[13px] font-medium">Expiry</span>
      <div className="bg-mineshaft w-full h-[30px] rounded-md flex items-center justify-center p-[3px] space-x-[4px]">
        {ttls.map((ttl, index) => (
          <div
            onClick={() => setSelectedTTL(EXPIRIES[ttl])}
            role="button"
            className={cn(
              'flex-1 flex items-center justify-center font-medium text-[13px] rounded-md',
              EXPIRIES_TO_KEY[selectedTTL] === ttl && 'bg-umbra',
            )}
            key={index}
          >
            <span className=" text-center w-full p-[2px]">{ttl}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TTLSelector;
