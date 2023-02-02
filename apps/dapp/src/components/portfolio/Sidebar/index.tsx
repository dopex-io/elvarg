import Box from '@mui/material/Box';
import cx from 'classnames';

import Balances from 'components/portfolio/Balances';

export default function Sidebar({ className }: { className?: string }) {
  return (
    <Box className={cx('', className)}>
      <Balances />
    </Box>
  );
}
