import { useEffect, ReactNode } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import MuiInput, { InputProps as MuiInputProps } from '@mui/material/Input';

interface InputProps extends MuiInputProps {
  leftElement: ReactNode;
  bottomElement?: ReactNode;
  variant: string;
  placeholder?: string;
}

const variants = {
  default: {
    box: 'bg-umbra p-4 rounded-xl',
    font: 'h-12 text-2xl text-white ml-2 font-mono',
    textPosition: 'text-right',
    alignment: 'flex justify-between items-center',
  },
  variant1: {
    box: 'mt-5 flex bg-umbra rounded-sm px-2 h-[2.4rem]',
    font: 'h-auto text-white',
    textPosition: 'text-left text-sm',
    alignment: 'flex justify-between items-center',
  },
};

const Input = (props: InputProps) => {
  const {
    leftElement,
    bottomElement,
    className,
    variant = 'default',
    placeholder = '',
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
    // @ts-ignore
    <Box className={cx(variants[variant].box, className)}>
      <Box className="flex justify-between items-center">
        {leftElement}
        <MuiInput
          disableUnderline={true}
          className={`text-white`}
          // @ts-ignore
          classes={{ input: variants[variant].textPosition }}
          {...rest}
          placeholder={placeholder}
        />
      </Box>
      {bottomElement}
    </Box>
  );
};

export default Input;
