import React from 'react';

const AMMSelector = () => {
  return (
    <div className="flex flex-col items-start text-[13px] space-y-[12px]">
      <span className="text-stieglitz">AMM</span>
      <p className="flex items-center space-x-[4px] bg-mineshaft px-[4px] py-[2px] rounded-md">
        <span>Uniswap V3</span>
        <img
          src={`/images/exchanges/uniswap.svg`}
          alt={'uniswap'}
          className="w-[24px] h-[24px]"
        />
      </p>
    </div>
  );
};

export default AMMSelector;
