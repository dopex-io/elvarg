import React from 'react';

import cx from 'classnames';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

const TradeSideSelector = () => {
  const { setIsTrade, isTrade } = useClammStore();
  const { reset } = useStrikesChainStore();
  return (
    <div className="flex space-x-[12px] items-center justfiy-start w-full mb-[12px]">
      <span
        role="button"
        onClick={() => {
          setIsTrade(true);
          reset();
        }}
        className={cx('text-[14px]', isTrade ? 'text-white' : 'text-stieglitz')}
      >
        Trade
      </span>
      <span
        role="button"
        onClick={() => {
          setIsTrade(false);
          reset();
        }}
        className={cx(
          'text-[14px]',
          !isTrade ? 'text-white' : 'text-stieglitz',
        )}
      >
        Liquidity Provision
      </span>
    </div>
  );
};

export default TradeSideSelector;
