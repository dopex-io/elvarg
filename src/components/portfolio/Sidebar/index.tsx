import Box from '@mui/material/Box';
import cx from 'classnames';

import Typography from 'components/UI/Typography';
import Button from '@mui/material/Button';
import Balances from '../Balances';

export default function Sidebar({ className }: { className?: string }) {
  return (
    <Box className={cx('', className)}>
      <Balances />
      <Box className="mb-2">
        <Typography variant="h5">
          <span className="text-stieglitz">Claimable</span>
        </Typography>
        <Box className="bg-cod-gray py-3 px-3 mt-3 rounded-md text-center">
          <Box>
            {' '}
            <Box className="flex">
              <img src={`/assets/dpx.svg`} className="w-8 h-8" />
              <Typography variant="h5" className="ml-3 mt-0.5">
                <span className="text-white">~$3,143</span>
              </Typography>

              <Box className="ml-auto mr-3 mt-1 rounded-md text-center">
                <Typography variant="h6">
                  <span className="text-wave-blue">Details</span>
                </Typography>
              </Box>
            </Box>
            <Button className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 text-white mt-3 w-full">
              Claim
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
