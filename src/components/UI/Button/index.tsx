import { FC, forwardRef } from 'react';
import cx from 'classnames';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface CustomButtonProps
  extends Omit<MuiButtonProps, 'color' | 'size'> {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const CLASSES = {
  small: `h-[30px]`,
  medium: `h-9`,
  large: `h-[42px]`,
};

const Button: FC<CustomButtonProps> = forwardRef((props, ref) => {
  const {
    children,
    className,
    size = 'medium',
    color = 'primary',
    ...otherProps
  } = props;

  return (
    <MuiButton
      className={cx(
        CLASSES[size],
        `bg-${color} hover:bg-${color}`,
        className,
        'text-white disabled:text-white disabled:opacity-20 disabled:rounded-[5px] hover:bg-opacity-70'
      )}
      ref={ref}
      {...otherProps}
    >
      {children}
    </MuiButton>
  );
});

Button.displayName = 'Button';

export default Button;
