import { useEffect, ReactNode } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import MuiInput, { InputProps as MuiInputProps } from '@mui/material/Input';

interface InputProps extends MuiInputProps {
  leftElement: ReactNode;
}

const Input = (props: InputProps) => {
  const { leftElement, className, ...rest } = props;

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
      className={cx('bg-umbra flex p-4 rounded-xl justify-between', className)}
    >
      {leftElement}
      <MuiInput
        disableUnderline={true}
        className="h-12 text-2xl text-white ml-2 font-mono"
        classes={{ input: 'text-right' }}
        {...rest}
      />
    </Box>
  );
};

export default Input;
