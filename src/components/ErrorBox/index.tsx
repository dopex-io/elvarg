import cx from 'classnames';

import Typography from 'components/UI/Typography';

export default function ErrorBox({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  if (error)
    return (
      <Typography
        variant="caption"
        component="div"
        className={cx(
          'text-down-bad text-center p-4 rounded-xl border-down-bad border',
          className
        )}
      >
        {error}
      </Typography>
    );

  return null;
}
