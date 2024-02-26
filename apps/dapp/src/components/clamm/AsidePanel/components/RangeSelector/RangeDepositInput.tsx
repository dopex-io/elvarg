import React, { ChangeEvent } from 'react';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';

import { cn } from 'utils/general';

type Props = {
  isCall: boolean;
  lowerStrike: string;
  upperStrike: string;
  placeHolder: string;
  inputValue: string;
  onChangeInput: (event: ChangeEvent<HTMLInputElement>) => void;
};

const RangeDepositInput = ({
  isCall,
  lowerStrike,
  upperStrike,
  placeHolder,
  onChangeInput,
  inputValue,
}: Props) => {
  return (
    <div className="w-full flex items-center justify-center space-x-[4px]">
      <div className="w-fit rounded-md bg-carbon h-fit p-[7px]">
        {isCall ? (
          <ArrowUpRightIcon className="text-up-only" height={14} width={14} />
        ) : (
          <ArrowDownRightIcon
            className="text-down-bad"
            height={14}
            width={14}
          />
        )}
      </div>
      <div className="w-fit flex items-center justify-center text-[12px] font-medium rounded-md bg-mineshaft p-[4px] divide-x divide-stieglitz">
        <div className="w-[80px] text-center">{lowerStrike}</div>
        <div className="w-[80px] text-center">{upperStrike}</div>
      </div>
      <div
        id="strikes-drop-down-input"
        className="border-[1.5px] w-full p-[4px] flex items-center justify-end space-x-[4px] rounded-md border-carbon text-[12px]"
      >
        <input
          onChange={onChangeInput}
          value={inputValue}
          spellCheck="false"
          inputMode="decimal"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          minLength={1}
          maxLength={15}
          placeholder={placeHolder}
          className={cn(
            'w-full text-[12px] text-right bg-umbra focus:outline-none focus:border-mineshaft rounded-md placeholder-stieglitz text-xs',
          )}
        />
      </div>
    </div>
  );
};

export default RangeDepositInput;
