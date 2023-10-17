import React from 'react';

import ArrowDownRightIcon from '@heroicons/react/24/solid/ArrowDownRightIcon';
import ArrowUpRightIcon from '@heroicons/react/24/solid/ArrowUpRightIcon';

type TradeSideMenuProps = {
  activeIndex: number;
  setActiveIndex: Function;
};
const TradeSideMenu = ({ activeIndex, setActiveIndex }: TradeSideMenuProps) => {
  return (
    <div className="flex bg-umbra rounded-r-md p-3 w-1/2">
      <div className="flex flex-col">
        <span className="text-stieglitz text-sm">Side</span>
        <div className="flex bg-mineshaft rounded-md p-1 mt-1 h-[40px]">
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
