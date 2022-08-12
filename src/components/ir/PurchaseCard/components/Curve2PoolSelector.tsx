import cx from 'classnames';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Dispatch, SetStateAction } from 'react';

const SUPPORTED_TOKENS = ['2CRV', 'USDT', 'USDC'];

const Curve2PoolSelector = ({
  token,
  className,
  setToken,
  isPurchasing = false,
}: {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  className: string;
  isPurchasing: boolean;
}) => {
  return (
    <Box className={cx('flex space-x-2 items-center text-white', className)}>
      <Box>{isPurchasing ? 'Purchase' : 'Deposit'} using </Box>
      <ToggleButtonGroup value={token} exclusive aria-label="text alignment">
        {SUPPORTED_TOKENS.map((supportedToken) => (
          <ToggleButton
            key={supportedToken}
            value={supportedToken}
            aria-label={supportedToken}
            className="text-white"
            color="primary"
            onClick={() => setToken(supportedToken)}
          >
            {supportedToken}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default Curve2PoolSelector;
