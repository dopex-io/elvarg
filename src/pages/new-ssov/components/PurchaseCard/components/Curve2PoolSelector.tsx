import cx from 'classnames';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Curve2PoolSelector = ({ token, setToken, className }) => {
  const handleToken = (_event, newToken) => {
    setToken(newToken);
  };

  return (
    <Box className={cx('flex space-x-2 items-center text-white', className)}>
      <Box>Deposit using: </Box>
      <ToggleButtonGroup
        value={token}
        exclusive
        onChange={handleToken}
        aria-label="text alignment"
      >
        <ToggleButton
          value="2CRV"
          aria-label="2CRV"
          className="text-white"
          color="primary"
        >
          2CRV
        </ToggleButton>
        <ToggleButton
          value="USDC"
          aria-label="USDC"
          className="text-white"
          color="primary"
        >
          USDC
        </ToggleButton>
        <ToggleButton
          value="USDT"
          aria-label="USDT"
          className="text-white"
          color="primary"
        >
          USDT
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default Curve2PoolSelector;
