import React, { useEffect, useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { AMM_TO_READABLE_NAME, HANDLER_TO_POOLS } from 'constants/clamm';

const CLAMM_AMMS: Record<number, string[]> = {
  42161: ['uniswap'],
  5000: ['agni', 'fusionx', 'butter'],
};

const AMMSelector = () => {
  const { setSelectedAMM, selectedAMM, selectedOptionsMarket } =
    useClammStore();
  const { chain } = useNetwork();
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [amms, setAmms] = useState(chain ? CLAMM_AMMS[chain.id] : []);

  useEffect(() => {
    if (!chain) return;
    if (!initialized) {
      setSelectedAMM(amms[0] ?? '');
      setInitialized(true);
    }
  }, [setSelectedAMM, selectedAMM, chain, amms, initialized]);

  useEffect(() => {
    if (!selectedOptionsMarket || !chain || !Boolean(selectedAMM)) return;
    const { callToken, putToken } = selectedOptionsMarket;
    const poolKey = callToken.symbol
      .toLowerCase()
      .concat('-')
      .concat(putToken.symbol.toLowerCase());

    const handlersToPools = HANDLER_TO_POOLS[chain.id];
    if (!handlersToPools) return;
    const handlerPools = handlersToPools[selectedAMM];
    if (!handlerPools) return;
    const pool = handlerPools[poolKey];
    if (pool) return;
    if (!pool) {
      const eligibleAMMS = amms.filter(
        (a) => a.toLowerCase() !== selectedAMM.toLowerCase(),
      );

      if (eligibleAMMS[0]) {
        setSelectedAMM(eligibleAMMS[0]);
      }
      setAmms(eligibleAMMS);
    }
  }, [chain, selectedOptionsMarket, amms, selectedAMM, setSelectedAMM]);

  return (
    <div className="flex items-center text-[13px] justify-between px-[12px] py-[6px] bg-umbra">
      <div className="text-stieglitz">
        <span>Selected AMM</span>
      </div>
      <DropdownMenu.Root open={open}>
        <DropdownMenu.Trigger
          className="flex items-center justify-end space-x-[4px] bg-carbon w-[100px] rounded-md p-[4px]"
          onClick={() => {
            if (amms.length > 0) {
              setOpen(true);
            }
          }}
        >
          <span className="text-[13px] text-center w-full">
            {selectedAMM && AMM_TO_READABLE_NAME[selectedAMM]}
          </span>
          <ChevronDownIcon height={18} width={18} className="text-stieglitz" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="min-h-[20px] w-[100px] rounded-md space-y-[12px] flex flex-col bg-carbon mt-[2px]">
            {chain &&
              amms
                .filter((a) => a.toLowerCase() !== selectedAMM.toLowerCase())
                .map((amm, index) => (
                  <span
                    onClick={() => {
                      setSelectedAMM(amm);
                      setOpen(false);
                    }}
                    className="text-[13px] px-[2px] hover:bg-mineshaft w-full text-center hover:cursor-pointer rounded-md"
                    key={index}
                  >
                    {amm[0].toUpperCase() + amm.slice(1)}
                  </span>
                ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default AMMSelector;
