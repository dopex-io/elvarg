import Box from '@mui/material/Box';
import cx from 'classnames';

import Balances from '../Balances';
import Rewards from '../Rewards';

export default function Sidebar({ className }: { className?: string }) {
  return (
    <Box className={cx('', className)}>
      <Balances />
      <Rewards />
    </Box>
  );
}
