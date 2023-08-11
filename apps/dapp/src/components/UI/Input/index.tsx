import { ReactNode, useEffect } from 'react';

import Box from '@mui/material/Box';
import MuiInput, { InputProps as MuiInputProps } from '@mui/material/Input';

interface InputProps extends MuiInputProps {
  leftElement?: ReactNode;
  bottomElement?: ReactNode;
  topElement?: ReactNode;
  variant?: string;
  outline?: 'mineshaft' | 'down-bad' | 'umbra';
  placeholder?: string;
}

const variants: Record<string, Record<string, string>> = {
  default: {
    box: 'bg-umbra p-4 rounded-xl',
    font: 'h-10 text-2xl text-white ml-2 font-mono',
    textPosition: 'text-right',
    alignment: 'flex justify-between items-center',
  },
  variant1: {
    box: 'mt-5 flex bg-umbra rounded-sm px-2 h-[2.4rem]',
    font: 'h-auto text-white',
    textPosition: 'text-left text-sm',
    alignment: 'flex justify-between items-center',
  },
  zdte: {
    box: 'mt-5 pt-3 flex bg-carbon rounded-t-xl px-2',
    font: 'h-auto text-2xl text-white ml-2 font-mono',
    textPosition: 'text-right',
    alignment: 'flex justify-between items-center',
  },
  straddles: {
    box: 'bg-umbra pr-4 rounded-xl',
    font: 'text-2xl text-white ml-2 font-mono',
    textPosition: 'text-right',
    alignment: 'flex justify-between items-center',
  },
};

/**
 * @deprecated
 */
const Input = (props: InputProps) => {
  const {
    leftElement = '',
    bottomElement = '',
    className,
    variant = 'default',
    outline = 'umbra',
    placeholder = '',
    topElement,
    ...rest
  } = props;

  useEffect(() => {
    document.addEventListener('wheel', function () {
      //@ts-ignore
      if (document.activeElement.type === 'number') {
        //@ts-ignore
        document.activeElement.blur();
      }
    });

    return document.removeEventListener('wheel', function () {
      //@ts-ignore
      if (document.activeElement.type === 'number') {
        //@ts-ignore
        document.activeElement.blur();
      }
    });
  });

  return (
    <Box
      className={`${variants[variant]?.['box']} ${className} border border-${outline} flex-col`}
    >
      <Box>{topElement}</Box>
      <Box className="flex justify-between items-center">
        {leftElement}
        <MuiInput
          disableUnderline={true}
          className={`text-white`}
          classes={{
            input:
              variants[variant]?.['textPosition']?.concat(
                ' ',
                variants[variant]?.['font'] ?? '',
              ) ?? '',
          }}
          {...rest}
          placeholder={placeholder}
        />
      </Box>
      <Box>{bottomElement}</Box>
    </Box>
  );
};

export default Input;
