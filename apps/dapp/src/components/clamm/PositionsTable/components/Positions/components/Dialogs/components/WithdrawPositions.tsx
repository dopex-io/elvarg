import React, { useMemo } from 'react';

import { Button } from '@dopex-io/ui';
import { CheckIcon } from '@heroicons/react/24/solid';
import * as Checkbox from '@radix-ui/react-checkbox';

import { cn, formatAmount } from 'utils/general';

type Props = {
  positions: {
    token0: {
      amount: string;
      symbol: string;
    };
    token1: {
      amount: string;
      symbol: string;
    };
    withdrawTx: `0x${string}`;
    strike: number;
    sharesWithdrawable: bigint;
  }[];
};
const WithdrawPositions = ({ positions }: Props) => {
  const total = useMemo(() => {
    return {
      token0: {
        amount: positions.reduce((prev, curr) => {
          return prev + Number(curr.token0.amount);
        }, 0),
        symbol: positions.length > 0 ? positions[0].token0.symbol : '-',
      },
      token1: {
        amount: positions.reduce((prev, curr) => {
          return prev + Number(curr.token1.amount);
        }, 0),
        symbol: positions.length > 0 ? positions[0].token1.symbol : '-',
      },
    };
  }, [positions]);
  return (
    <div className="flex flex-col">
      <div className="w-full flex items-center justify-start text-xs border-b border-b-carbon pb-[12px]">
        <span className="w-[14px]"></span>
        <p className="flex-1 text-stieglitz">Strike</p>
        <p className="flex-1 text-stieglitz">Composition</p>
      </div>
      <div className="max-h-[250px] flex flex-col items-center w-full overflow-y-scroll space-y-[4px] border-b-carbon border-b divide-y divide-carbon">
        {positions.map(({ strike, token0, token1 }, index) => (
          <div
            key={index}
            className="text-xs flex justify-start w-full items-center space-x-[8px]"
          >
            <form>
              <div className="flex items-center">
                <Checkbox.Root
                  className={cn(
                    'flex h-[14px] w-[14px] appearance-none items-center justify-center rounded-sm bg-wave-blue  outline-none border-stieglitz border',
                    false ? 'bg-wave-blue' : 'bg-umbra',
                  )}
                  id="c1"
                >
                  <Checkbox.Indicator className="text-umbra">
                    <CheckIcon height={14} width={14} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </div>
            </form>
            <div className="flex-1 flex items-center space-x-[4px]">
              <p className="text-stieglitz">$</p>
              <p>{formatAmount(strike, 4)}</p>
            </div>
            <div className="flex-1 flex-col items-center space-y-[2px]">
              <p className="flex items-center space-x-[4px]">
                <span>{formatAmount(token0.amount, 4)}</span>
                <span className="text-xs text-stieglitz">{token0.symbol}</span>
              </p>
              <p className="flex items-center space-x-[4px]">
                <span>{formatAmount(token1.amount, 4)}</span>
                <span className="text-xs text-stieglitz">{token1.symbol}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs flex items-center justify-between py-[12px]">
        <p className="text-stieglitz space-x-[4px]">
          <span>Total</span>
          <span>({positions.length})</span>
        </p>
        <div className="flex items-center space-x-[6px]">
          <p className="flex items-center space-x-[4px]">
            <span>{formatAmount(total.token0.amount, 4)}</span>
            <span className="text-stieglitz">{total.token0.symbol}</span>
          </p>
          <p className="flex items-center space-x-[4px]">
            <span>{formatAmount(total.token1.amount, 4)}</span>
            <span className="text-stieglitz">{total.token1.symbol}</span>
          </p>
        </div>
      </div>
      <Button size="small">Withdraw</Button>
    </div>
  );
};

export default WithdrawPositions;
