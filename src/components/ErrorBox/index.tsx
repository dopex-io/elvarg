import cx from 'classnames';

import Typography from 'components/UI/Typography';

interface Props {
  error: string;
  className?: string;
}

export default function ErrorBox({ error, className }: Props) {
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
