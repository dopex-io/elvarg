import { useMemo } from 'react';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import cx from 'classnames';

export enum AlertSeverity {
  info,
  warning,
  error,
  success,
}

const Icon = ({
  severity,
  className = '',
}: {
  severity: AlertSeverity;
  className?: string;
}) => {
  switch (severity) {
    case 0 || 2:
      return <ExclamationCircleIcon className={className} />;
    case 1:
      return <ExclamationTriangleIcon className={className} />;
    case 3:
      return <CheckCircleIcon className={className} />;
    default:
      return (
        <ExclamationCircleIcon className={cx('text-stieglitz', className)} />
      );
  }
};

interface Props {
  header: string;
  body?: string;
  severity: AlertSeverity;
}

const Alert = (props: Props) => {
  const { header, body, severity } = props;

  const theme = useMemo(() => {
    switch (severity) {
      case 0:
        return 'bg-carbon text-white';
      case 1:
        return 'bg-jaffa';
      case 2:
        return 'bg-down-bad';
      case 3:
        return 'bg-up-only';
      default:
        return 'bg-umbra';
    }
  }, [severity]);

  return (
    <div
      className={`flex flex-col p-2 space-y-2 justify-around rounded-lg text-black ${theme}`}
    >
      <span className="flex space-x-2">
        <Icon className="w-4 h-4 my-auto" severity={severity} />
        <p className="text-left text-sm">{header}</p>
      </span>
      {body ? (
        <p
          className={`text-xs break-all ${
            severity === AlertSeverity.info ? 'text-stieglitz' : null
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
};

export default Alert;
