import { FC, forwardRef } from 'react';
import cx from 'classnames';
import Button, { ButtonProps } from '@material-ui/core/Button';

import styles from './styles.module.scss';

export interface CustomButtonProps extends Omit<ButtonProps, 'color' | 'size'> {
  size: 'small' | 'medium' | 'large' | 'xl';
  color?: string;
}

const CLASSES = {
  small: `${styles.button} ${styles.small} text-white hover:bg-opacity-70`,
  medium: `${styles.button} ${styles.medium} text-white hover:bg-opacity-70`,
  large: `${styles.button} ${styles.large} text-white hover:bg-opacity-70`,
  xl: `${styles.button} ${styles.xl} text-white hover:bg-opacity-70`,
};

const CustomButton: FC<CustomButtonProps> = forwardRef((props, ref) => {
  const { children, size, className, color = 'primary', ...otherProps } = props;

  return (
    <Button
      className={cx(CLASSES[size], `bg-${color} hover:bg-${color}`, className)}
      ref={ref}
      {...otherProps}
    >
      {children}
    </Button>
  );
});

CustomButton.displayName = 'CustomButton';

export default CustomButton;
