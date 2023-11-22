import Box from '@mui/material/Box';

import cx from 'classnames';
import noop from 'lodash/noop';

import Typography from 'components/UI/Typography';

interface Props {
  active: boolean;
  title: string;
  onClick: any;
  disabled?: boolean;
}

/**
 * @deprecated
 */
const Tab = ({ active, title, onClick, disabled = false }: Props) => {
  return (
    <Box
      className={cx(
        'text-center w-1/2 pt-0.5 pb-1 group rounded hover:opacity-80',
        active && 'bg-carbon hover:bg-mineshaft',
        disabled && 'cursor-not-allowed'
      )}
      onClick={disabled ? noop : onClick}
      role="button"
    >
      <Typography variant="h6" className="text-xs font-normal">
        {title}
      </Typography>
    </Box>
  );
};

export default Tab;
