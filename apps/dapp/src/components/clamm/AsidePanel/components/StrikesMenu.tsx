import React, { ReactNode } from 'react';

import { Menu } from '@dopex-io/ui';

import { useBoundStore } from 'store';

export type Strike = {
  tickLower: number;
  tickUpper: number;
  tickLowerPrice: number;
  tickUpperPrice: number;
  optionsAvailable: number;
};

type StrikesMenuProps = {
  strikes: {
    textContent: JSX.Element;
  }[];
  selectedStrike: Strike;
  loading: boolean;
};

const StrikesMenu = ({
  strikes,
  selectedStrike,
  loading,
}: StrikesMenuProps) => {
  const { isPut } = useBoundStore();
  return (
    <div className="flex border border-[#1E1E1E] bg-[#1E1E1E] p-2 gap-3 flex-1">
      <div className="flex-1 space-y-3">
        <span className="text-stieglitz text-sm">Strike</span>
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={() => {}}
          selection={
            <span className="text-sm text-white flex">
              {loading ? (
                <span>Strikes Loading...</span>
              ) : strikes.length === 0 ? (
                <span>No Strikes</span>
              ) : !selectedStrike ? (
                'Select strike'
              ) : (
                <>
                  <p className="text-stieglitz inline mr-1">$</p>
                  {(isPut
                    ? selectedStrike?.tickLowerPrice
                    : selectedStrike?.tickUpperPrice
                  ).toFixed(5)}
                </>
              )}
            </span>
          }
          data={strikes}
          className="w-full flex-1"
          showArrow={strikes.length !== 0}
        />
      </div>
    </div>
  );
};

export default StrikesMenu;
