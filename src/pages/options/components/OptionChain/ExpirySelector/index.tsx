import { useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Dopex__factory } from '@dopex-io/sdk';
import cx from 'classnames';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { OptionsContext } from 'contexts/Options';
import { WalletContext } from 'contexts/Wallet';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';

import isDailyExpired from 'utils/date/isDailyExpired';

import styles from './styles.module.scss';

export default function ExpirySelector() {
  const [showCustomExpiryField, setShowCustomExpiryField] = useState(false);
  const [weeklyExpiry, setWeeklyExpiry] = useState(0);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [epochInitTime, setEpochInitTime] = useState(0);

  const { expiry, setExpiry, setLoading } = useContext(OptionsContext);
  const { provider, contractAddresses, blockTime } = useContext(WalletContext);

  const handleExpiryChange = useCallback(
    (value) => {
      if (value === 'custom') {
        setShowCustomExpiryField(true);
      } else {
        setShowCustomExpiryField(false);
        setLoading(true);
        setExpiry(value);
      }
    },
    [setExpiry, setLoading]
  );

  useEffect(() => {
    if (!provider || !contractAddresses) return;
    (async function () {
      const dopex = Dopex__factory.connect(contractAddresses.Dopex, provider);

      const timestamp = (new Date().getTime() / 1000).toFixed(0);
      setWeeklyExpiry(
        Number(await dopex.getWeeklyExpiryFromTimestamp(timestamp))
      );
      setEpochInitTime(Number(await dopex.epochInitTime()));
    })();
  }, [provider, expiry, contractAddresses]);

  const handleInputChange = useCallback(
    (e) => {
      if (
        isBefore(new Date(e.target.value), new Date()) &&
        !isSameDay(new Date(e.target.value), new Date())
      ) {
        setError('Cannot select a date before today');
        return;
      }
      setError('');
      const _expiry = new Date(e.target.value).setUTCHours(8, 0, 0, 0);
      setExpiry(_expiry);
    },
    [setExpiry]
  );

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const epochs = useMemo(() => {
    const timestamp = Number((new Date().getTime() / 1000).toFixed());

    let noOfDays = Math.max(Math.round((weeklyExpiry - timestamp) / 86400), 1);

    if (!isDailyExpired() && !isSameDay(new Date(), weeklyExpiry * 1000)) {
      noOfDays = noOfDays + 1;
    }

    return Array(noOfDays)
      .join()
      .split(',')
      .map((_item, days) => {
        if (!epochInitTime || !blockTime) return null;
        let _expiry = addDays(
          new Date(blockTime * 1000),
          isDailyExpired() ? days + 1 : days
        ).setUTCHours(8, 0, 0, 0);

        const handleClick = () => {
          handleExpiryChange(_expiry);
          handleClose();
        };

        return (
          <MenuItem
            onClick={handleClick}
            key={days}
            className="text-white uppercase"
          >
            {format(_expiry, 'EEE d LLLL')}
          </MenuItem>
        );
      });
  }, [blockTime, epochInitTime, handleClose, handleExpiryChange, weeklyExpiry]);

  // const handleCustomExpiry = useCallback(() => {
  //   handleExpiryChange('custom');
  //   handleClose();
  // }, [handleExpiryChange, handleClose]);

  return (
    <Box className="flex">
      <Box>
        <CustomButton
          size="medium"
          color="umbra"
          className="w-40"
          classes={{ label: 'uppercase' }}
          aria-controls="expiry-menu"
          aria-haspopup="true"
          onClick={handleClick}
          endIcon={<ExpandMoreIcon />}
        >
          {showCustomExpiryField
            ? 'Custom Expiry'
            : format(expiry, 'EEE d LLLL')}
        </CustomButton>
        <Menu
          id="expiry-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          classes={{ paper: 'bg-cod-gray' }}
        >
          {epochs}
          {/* <MenuItem onClick={handleCustomExpiry}>Custom Expiry</MenuItem> */}
        </Menu>
      </Box>
      {showCustomExpiryField ? (
        <Box>
          <Input
            onChange={handleInputChange}
            className={cx(styles.inputStyle, 'text-white ml-4')}
            disableUnderline
            placeholder="Select a custom expiry"
            type="date"
          />
          {error ? (
            <Typography
              variant="caption"
              component="div"
              className="text-red-400 ml-4 mt-2"
            >
              {error}
            </Typography>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
