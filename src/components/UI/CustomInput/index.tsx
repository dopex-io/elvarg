import { ReactNode, useEffect } from 'react';
import { InputProps } from '@mui/material';
import MuiInput from '@mui/material/Input';
import Box from '@mui/material/Box';

interface CustomInputProps extends InputProps {
  size: 'medium' | 'small';
  variant: 'filled' | 'outlined' | 'standard';
  outline?: 'mineshaft' | 'down-bad' | 'umbra';
  leftElement?: ReactNode;
}

const CustomInput = (props: CustomInputProps) => {
  const {
    className,
    size,
    variant = 'outlined',
    outline = 'umbra',
    leftElement,
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
      className={`flex bg-umbra rounded-xl border border-${outline} justify-between p-3`}
    >
      {leftElement}
      <MuiInput
        size={size}
        className={`h-12 text-2xl ml-2 font-mono my-auto w-1/3`}
        type="number"
        classes={{ input: 'text-right text-white' }}
        disableUnderline
        placeholder="0.0"
        {...rest}
      />
    </Box>
  );
};

export default CustomInput;
