import Box from '@mui/material/Box';

import Balances from 'components/portfolio/Balances';

import { cn } from 'utils/general';

export default function Sidebar({ className }: { className?: string }) {
  return (
    <Box className={cn('', className)}>
      <Balances />
    </Box>
  );
}
