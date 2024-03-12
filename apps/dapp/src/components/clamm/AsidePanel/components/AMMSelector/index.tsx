import React, { useEffect, useMemo } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import * as Select from '@radix-ui/react-select';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { cn } from 'utils/general';

import { AMM_TO_READABLE_NAME, HANDLER_TO_POOLS } from 'constants/clamm';

const CLAMM_AMMS: Record<number, string[]> = {
  42161: ['uniswap'],
  5000: ['agni', 'fusionx', 'butter'],
};

const AMMSelector = () => {
  const { setSelectedAMM, selectedAMM, selectedOptionsMarket } =
    useClammStore();

  const { chain } = useNetwork();

  const amms = useMemo(() => {
    if (!chain || !selectedOptionsMarket) return [];
    const poolKey = selectedOptionsMarket.callToken.symbol
      .toLowerCase()
      .concat('-')
      .concat(selectedOptionsMarket.putToken.symbol.toLowerCase());

    const handlerPools = HANDLER_TO_POOLS[chain.id];

    if (!handlerPools) return [];

    return Object.entries(handlerPools)
      .filter(([_, pool]) => {
        // @ts-ignore
        return Object.keys(pool).includes(poolKey);
      })
      .map(([amm]) => amm);
  }, [chain, selectedOptionsMarket]);

  useEffect(() => {
    if (!chain) return;
    if (!Boolean(selectedAMM)) {
      const _amms = CLAMM_AMMS[chain.id];
      if (!_amms) return;
      setSelectedAMM(_amms[0]);
    }
  }, [chain, setSelectedAMM, selectedAMM]);

  useEffect(() => {
    if (!amms.includes(selectedAMM)) {
      setSelectedAMM(amms[0]);
    }
  }, [amms, selectedAMM, setSelectedAMM]);

  console.log(amms.length);

  return (
    <div className="flex items-center justify-between bg-umbra p-[12px]">
      <span className="text-[13px] text-stieglitz">Select AMM</span>
      <Select.Root
        disabled={amms.length === 1}
        defaultValue={amms[0]}
        onValueChange={(v) => {
          setSelectedAMM(v);
        }}
      >
        <Select.Trigger
          disabled={amms.length === 1}
          className={cn(
            'w-[160px] text-white text-[13px] bg-mineshaft rounded-sm outline-none h-[25px]',
            amms.length === 1 && 'cursor-not-allowed',
          )}
        >
          <Select.Value className="flex items-center">
            <Select.Icon className="flex items-center justify-between px-[12px]">
              <span className="text-[13px] text-center w-full flex items-center">
                {AMM_TO_READABLE_NAME[selectedAMM]}
              </span>
              <ChevronDownIcon
                height={18}
                width={18}
                className="text-stieglitz"
              />
            </Select.Icon>
          </Select.Value>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="bg-carbon rounded-md">
            <Select.Viewport>
              {chain &&
                amms.map((amm, index) => (
                  <Select.Item
                    value={amm}
                    className="text-[13px] p-[4px] hover:bg-mineshaft flex items-center justify-center hover:cursor-pointer rounded-md outline-none"
                    key={index}
                  >
                    <Select.ItemText>
                      {AMM_TO_READABLE_NAME[amm]}
                    </Select.ItemText>
                  </Select.Item>
                ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default AMMSelector;
