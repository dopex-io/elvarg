import Box from '@mui/material/Box';

import noop from 'lodash/noop';

import Typography from 'components/UI/Typography';

import { cn } from 'utils/general';

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
      className={cn(
        'text-center w-1/2 pt-0.5 pb-1 group rounded hover:opacity-80',
        active && 'bg-carbon hover:bg-mineshaft',
        disabled && 'cursor-not-allowed',
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
