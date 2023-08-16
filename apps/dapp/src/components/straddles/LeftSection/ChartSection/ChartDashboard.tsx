import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Menu } from '@dopex-io/ui';

import { MARKETS, MARKETS_MENU } from 'constants/straddles/markets';

const ChartDashboard = () => {
  const router = useRouter();
  const [selectedMarket, setSelectedMarket] = useState<string>('ETH');

  const handleSelectMarket = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      router.push(`/straddles/${e.target.innerText}`);
    },
    [router],
  );

  // useEffect(() => {
  //   let market = router.query['market'] as string;

  //   if (!market) return;

  //   market = market.toUpperCase();

  //   // setSelectedMarket(market);

  //   const vault = findDefaultSsov(market);

  //   if (vault) {
  //     update({
  //       address: vault.address,
  //       isPut: vault.isPut,
  //       underlyingSymbol: vault.underlyingSymbol,
  //       duration: vault.duration,
  //       collateralTokenAddress: vault.collateralTokenAddress,
  //     });
  //   }
  // }, [router, update]);

  return (
    <div className="z-10 h-[4rem] absolute flex rounded-md items-center justify-center space-x-4 px-4">
      <img
        src={`/images/tokens/${selectedMarket.toLowerCase()}.svg`}
        className="w-[32px] h-[32px] my-auto border rounded-full border-carbon"
        alt={selectedMarket}
      />
      <Menu
        color="mineshaft"
        dropdownVariant="icon"
        handleSelection={handleSelectMarket}
        selection={selectedMarket}
        data={MARKETS_MENU}
        className="z-20"
        showArrow
      />
      <div className="flex flex-col items-left justify-center">
        <span className="text-sm">
          <span className="text-stieglitz mr-1">$</span>1850.08
        </span>
        <span className="text-stieglitz text-sm ">Mark Price</span>
      </div>
      <div className="flex flex-col items-left justify-center">
        <span className="text-sm">
          <span className="text-stieglitz mr-1">$</span> 392.1K
        </span>
        <span className="text-stieglitz text-sm ">Open Interest</span>
      </div>
    </div>
  );
};

export default ChartDashboard;
