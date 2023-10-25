import React from 'react';

import cx from 'classnames';

import useClammStore from 'hooks/clamm/useClammStore';

import { EXPIRIES, EXPIRIES_BY_INDEX, EXPIRIES_TO_KEY } from 'constants/clamm';

const AsidePanel = () => {
  const { isTrade, setIsTrade, isPut, setIsPut, selectedTTL, setSelectedTTL } =
    useClammStore();
  return (
    <div className="w-full bg-cod-gray h-[30rem] p-[12px] rounded-lg space-y-[4px]">
      <div className="flex space-x-[12px] items-center justfiy-start w-full mb-[12px]">
        <span
          role="button"
          onClick={() => {
            setIsTrade(true);
          }}
          className={cx(
            'text-[14px]',
            isTrade ? 'text-white' : 'text-stieglitz',
          )}
        >
          Trade
        </span>
        <span
          role="button"
          onClick={() => {
            setIsTrade(false);
          }}
          className={cx(
            'text-[14px]',
            !isTrade ? 'text-white' : 'text-stieglitz',
          )}
        >
          Liquidity Provision
        </span>
      </div>
      <div className="w-full flex flex-col items-start justfiy-center space-y-[12px] bg-umbra rounded-md p-[12px]">
        <span className="w-full text-[16px] font-normal text-stieglitz">
          Side
        </span>
        <div className="w-full flex p-[4px] rounded-md bg-mineshaft h-[36px]">
          <span
            role="button"
            onClick={() => {
              setIsPut(false);
            }}
            className={cx(
              'flex-1 flex items-center justify-center text-center text-[14px] h-[30px] rounded-md',
              !isPut && 'bg-carbon',
            )}
          >
            <span>Call</span>
          </span>
          <span
            role="button"
            onClick={() => {
              setIsPut(true);
            }}
            className={cx(
              'flex-1 flex items-center justify-center text-center text-[14px] h-[30px] rounded-md',
              isPut && 'bg-carbon',
            )}
          >
            <span>Put</span>
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col space-y-[12px] p-[4px] bg-umbra rounded-md">
        <span>Expiry</span>
        <div className="w-full bg-mineshaft rounded-md p-[4px] flex justify-around items-center">
          {Object.keys(EXPIRIES).map((ttl, index) => (
            <span
              role="button"
              onClick={() => {
                setSelectedTTL(EXPIRIES[ttl]);
              }}
              className={cx(
                'rounded-md flex-1 py-[4px] text-center',
                selectedTTL === EXPIRIES[ttl] && 'bg-carbon',
              )}
              key={index}
            >
              {ttl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AsidePanel;
