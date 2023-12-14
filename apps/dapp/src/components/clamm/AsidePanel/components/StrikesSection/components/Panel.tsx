import React, { useCallback, useMemo } from 'react';

import { ArrowPathIcon, LinkIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/solid';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { cn } from 'utils/general';

type Props = {
  editAllMode: boolean;
  setEditAllMode: () => void;
  rangeSelectorMode: boolean;
  setRangeSelectorMode: () => void;
};

const Panel = (props: Props) => {
  const {
    editAllMode,
    setEditAllMode,
    rangeSelectorMode,
    setRangeSelectorMode,
  } = props;
  const { isTrade } = useClammStore();
  const { purchases, deposits, resetDeposits, resetPurchases } =
    useClammTransactionsStore();
  const { reset } = useStrikesChainStore();
  const amountOfStrikes = useMemo(() => {
    return isTrade ? purchases.size : deposits.size;
  }, [deposits.size, isTrade, purchases.size]);

  const resetSelectedStrikes = useCallback(() => {
    reset();
    if (isTrade) {
      resetPurchases();
    } else {
      resetDeposits();
    }
  }, [isTrade, reset, resetDeposits, resetPurchases]);

  return (
    <div className="flex w-full items-center justify-between">
      <div id="strikes-count" className="flex">
        <p className="text-[13px] font-medium text-stieglitz">
          <span>Strikes: </span>
          <span
            className={cn(
              amountOfStrikes === 0 ? 'text-stieglitz' : 'text-white',
            )}
          >
            {amountOfStrikes}
          </span>
        </p>
      </div>
      <div id="options" className="flex text-stieglitz space-x-[4px]">
        <ArrowPathIcon
          onClick={resetSelectedStrikes}
          id="edit-all-button"
          className="hover:cursor-pointer hover:text-white transition duration-300 ease-in-out p-[4px]"
          color="stieglitz"
          height={22}
          width={22}
        />
        <LinkIcon
          id="edit-all-button"
          onClick={setEditAllMode}
          height={22}
          width={22}
          className={cn(
            'hover:cursor-pointer hover:text-white transition duration-200 ease-in-out rounded-md p-[4px]',
            editAllMode && 'bg-mineshaft',
          )}
          color={'stieglitz'}
        />
        {!isTrade && (
          <ChartBarIcon
            id="edit-all-button"
            onClick={() => {
              resetSelectedStrikes();
              setRangeSelectorMode();
            }}
            height={22}
            width={22}
            className={cn(
              'hover:cursor-pointer hover:text-white transition duration-200 ease-in-out rounded-md p-[4px]',
              rangeSelectorMode && 'bg-mineshaft',
            )}
            color={'stieglitz'}
          />
        )}
      </div>
    </div>
  );
};

export default Panel;
