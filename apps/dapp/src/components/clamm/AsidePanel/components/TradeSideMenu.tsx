import React from 'react';

import ArrowDownRightIcon from '@heroicons/react/24/solid/ArrowDownRightIcon';
import ArrowUpRightIcon from '@heroicons/react/24/solid/ArrowUpRightIcon';

type TradeSideMenuProps = {
  activeIndex: number;
  setActiveIndex: Function;
};
const TradeSideMenu = ({ activeIndex, setActiveIndex }: TradeSideMenuProps) => {
  return (
    <div className="flex border border-[#1E1E1E] bg-[#1E1E1E] p-[12px] flex-1">
      <div className="flex-1">
        <span className="text-stieglitz text-sm">Side</span>
        <div className="flex justify-between bg-mineshaft rounded-md mt-[10px] p-1">
          {['Call', 'Put'].map((label, i: number) => (
            <span
              key={i}
              role="button"
              className={`text-sm p-1 text-white flex items-center justify-center border-0 hover:border-0 w-full transition ease-in-out duration-500 rounded-md space-x-2 ${
                activeIndex === i
                  ? 'bg-carbon hover:bg-carbon'
                  : 'bg-mineshaft hover:bg-mineshaft'
              }`}
              onClick={() => setActiveIndex(i)}
            >
              <span>{label}</span>
              {i === 0 ? (
                <ArrowUpRightIcon
                  height={'1rem'}
                  className={`${
                    activeIndex === 0 ? 'text-up-only' : 'text-stieglitz'
                  }`}
                />
              ) : (
                <ArrowDownRightIcon
                  height={'1rem'}
                  className={`${
                    activeIndex === 1 ? 'text-down-bad' : 'text-stieglitz'
                  }`}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeSideMenu;
