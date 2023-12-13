import React, { ChangeEvent, KeyboardEvent } from 'react';

import { cn } from 'utils/general';

type Props = {
  onChangeInput: (event: ChangeEvent<HTMLInputElement>) => void;
  inputAmount: string;
  onBlurCallback: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmitCallback: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeHolder: string;
  label: string;
};
const StrikeInput = ({
  onChangeInput,
  onBlurCallback,
  onSubmitCallback,
  inputAmount,
  placeHolder,
  label,
}: Props) => {
  return (
    <div
      id="range-selector-input"
      className="border-[1.5px] w-full p-[4px] flex items-center justify-end space-x-[4px] rounded-md border-carbon text-[13px]"
    >
      <label
        htmlFor="range-selector-input"
        className="text-stieglitz text-[10px] font-medium w-full"
      >
        {label}
      </label>
      <input
        onKeyDown={onSubmitCallback}
        onBlur={onBlurCallback}
        onChange={onChangeInput}
        value={inputAmount}
        type="number"
        min="0"
        placeholder={placeHolder}
        className={cn(
          'w-full text-[12px] text-right bg-umbra focus:outline-none focus:border-mineshaft rounded-md placeholder-stieglitz font-mono',
        )}
      />
    </div>
  );
};

export default StrikeInput;
