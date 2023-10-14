import cx from './utils/cx';

export interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  color?: string;
  variant?: 'rectangular' | 'rounded' | 'circular';
}

const VARIANT_CLASSES = {
  rectangular: '',
  rounded: 'rounded-md',
  circular: 'rounded-full',
};

const Skeleton = (props: SkeletonProps) => {
  const {
    height = 40,
    width = 40,
    variant = 'rectangular',
    color = 'stieglitz',
  } = props;

  return (
    <div
      style={{
        height,
        width,
      }}
      className={cx('animate-pulse', `bg-${color}`, VARIANT_CLASSES[variant])}
    />
  );
};

export default Skeleton;
