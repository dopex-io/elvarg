import { ReactNode } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from 'components/UI/Typography';
import cx from 'classnames';

function PoolSelectorButton({
  title,
  subtitle,
  startIcon,
  isSelected,
  onClick,
}: {
  title: string;
  subtitle: string;
  startIcon: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}): JSX.Element {
  return (
    <Button
      startIcon={<Box className="h-10 w-10">{startIcon}</Box>}
      variant="outlined"
      className={cx(
        'h-14 p-1 lg:mr-6 text-white px-4 hover:bg-umbra mb-2',
        isSelected ? 'bg-cod-gray' : 'bg-black-dark'
      )}
      onClick={onClick}
    >
      <Box className="flex-col text-left">
        <Typography variant="h5" className="text-white">
          {title}
        </Typography>
        <Typography variant="h6" className="text-stieglitz">
          {subtitle}
        </Typography>
      </Box>
    </Button>
  );
}

export default PoolSelectorButton;
