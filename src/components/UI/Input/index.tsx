import { useEffect, ReactNode } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import MuiInput, { InputProps as MuiInputProps } from '@mui/material/Input';

interface InputProps extends MuiInputProps {
  leftElement: ReactNode;
  bottomElement?: ReactNode;
}

const Input = (props: InputProps) => {
  const { leftElement, bottomElement, className, ...rest } = props;

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
    <Box className={cx('bg-umbra p-4 rounded-xl', className)}>
      <Box className="flex justify-between items-center">
        {leftElement}
        <MuiInput
          disableUnderline={true}
          className="h-12 text-2xl text-white ml-2 font-mono"
          classes={{ input: 'text-right' }}
          {...rest}
        />
      </Box>
      {bottomElement}
    </Box>
  );
};

export default Input;
