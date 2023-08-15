import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Menu } from '@dopex-io/ui';

import { MARKETS_MENU } from 'constants/ssov/markets';

export function TokenPair() {
  const router = useRouter();

  const [selectTokenA, setSelectTokenA] = useState<string>('ARB');
  const [selectTokenB, setSelectTokenB] = useState<string>('ARB');

  const handleSelectTokenA = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      router.query.tokenA = e.target.innerText;
      router.push(router);
    },
    [router],
  );

  const handleSelectTokenB = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      router.query.tokenB = e.target.innerText;
      router.push(router);
    },
    [router],
  );

  useEffect(() => {
    const { tokenA: tokenASymbol, tokenB: tokenBSymbol } = router.query;
    if (tokenASymbol) {
      setSelectTokenA(tokenASymbol as string);
    }
    if (tokenBSymbol) {
      setSelectTokenB(tokenBSymbol as string);
    }
  }, [router]);

  return (
    <div>
      <h3>Select Pair</h3>
      <div className="flex gap-4 mt-2">
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelectTokenA}
          selection={selectTokenA}
          data={MARKETS_MENU}
          className="z-20"
          showArrow
        />
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelectTokenB}
          selection={selectTokenB}
          data={MARKETS_MENU}
          className="z-20"
          showArrow
        />
      </div>
    </div>
  );
}
