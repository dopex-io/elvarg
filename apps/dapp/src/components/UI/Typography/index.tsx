import { FC } from 'react';
import cx from 'classnames';
import Box, { BoxProps } from '@mui/material/Box';

interface TypographyProps extends BoxProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'caption';
  color?: string;
}

const CLASSES = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-base',
  h6: 'text-sm',
  caption: 'text-xs',
};

/**
 * @deprecated
 */
const Typography: FC<TypographyProps> = (props) => {
  const {
    children,
    variant,
    component,
    className,
    color = 'white',
    ...otherProps
  } = props;

  return (
    <Box
      component={component || 'div'}
      className={cx(CLASSES[variant], `text-${color}`, className)}
      {...otherProps}
    >
      {children}
    </Box>
  );
};

export default Typography;
