import { FC } from 'react';

import cx from 'classnames';

type FontWeight = '400' | '500';
type Variant =
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'caption';

type Color = 'white' | 'stieglitz' | 'mineshaft' | 'up-only' | 'down-bad' | '';

const CLASSES: { [key in FontWeight]: { [key in Variant]: string } } = {
  // font weight
  400: {
    h4: 'text-[36px] leading-normal',
    h5: 'text-[24px] leading-6',
    h6: 'text-[20px] leading-6',
    body1: 'text-[16px] leading-6',
    body2: 'text-[14px] leading-4',
    subtitle1: 'text-[16px] leading-6 text-right',
    subtitle2: 'text-[14px] leading-4 text-right',
    caption: 'text-[13px] leading-4',
  },
  500: {
    h4: 'text-[36px] font-medium leading-normal',
    h5: 'text-[24px] font-medium leading-6',
    h6: 'text-[20px] font-medium leading-6',
    body1: 'text-[16px] font-medium leading-6',
    body2: 'text-[14px] font-medium leading-4',
    subtitle1: 'text-[16px] font-medium leading-6 text-right',
    subtitle2: 'text-[14px] font-medium leading-4 text-right',
    caption: 'text-[13px] font-medium leading-4',
  },
};

interface TypographyProps extends React.HTMLProps<HTMLParagraphElement> {
  variant: Variant;
  weight?: FontWeight;
  color?: Color;
}

const Typography2: FC<TypographyProps> = (props) => {
  const {
    children,
    variant,
    className,
    weight = '500',
    color = 'white',
    ...otherProps
  } = props;

  return (
    <span
      className={cx(CLASSES[weight][variant], `text-${color}`, className)}
      {...otherProps}
    >
      {children}
    </span>
  );
};

export default Typography2;
