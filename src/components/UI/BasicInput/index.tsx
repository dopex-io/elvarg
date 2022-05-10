import { useEffect } from 'react';
import MuiInput, { InputProps as MuiInputProps } from '@mui/material/Input';

const BasicInput = (props: MuiInputProps) => {
  useEffect(() => {
    document.addEventListener('wheel', function () {
      // @ts-ignore
      if (document.activeElement.type === 'number') {
        // @ts-ignore
        document.activeElement.blur();
      }
    });

    return document.removeEventListener('wheel', function () {
      // @ts-ignore
      if (document.activeElement.type === 'number') {
        // @ts-ignore
        document.activeElement.blur();
      }
    });
  });

  return <MuiInput {...props} />;
};

export default BasicInput;
