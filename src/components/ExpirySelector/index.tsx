import { useContext, useState, useCallback, useMemo, useEffect } from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dopex__factory } from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';

import CustomButton from 'components/UI/CustomButton';

import isDailyExpired from 'utils/date/isDailyExpired';

interface ExpirySelectorProps {
  expiry: number;
  handleExpiryChange: Function;
}

export default function ExpirySelector(props: ExpirySelectorProps) {
  const { expiry, handleExpiryChange } = props;

  const [weeklyExpiry, setWeeklyExpiry] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpiry, setSelectedExpiry] = useState(0);
  const [epochInitTime, setEpochInitTime] = useState(0);

  const { blockTime, provider, contractAddresses } = useContext(WalletContext);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    if (!provider || !contractAddresses) return;
    (async function () {
      const dopex = Dopex__factory.connect(contractAddresses.Dopex, provider);

      const timestamp = (new Date().getTime() / 1000).toFixed(0);
      setWeeklyExpiry(
        Number(await dopex.getWeeklyExpiryFromTimestamp(timestamp))
      );
      setEpochInitTime(Number(await dopex.epochInitTime()));

      setSelectedExpiry(expiry);
    })();
  }, [provider, expiry, contractAddresses]);

  const expiries = useMemo(() => {
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
          setSelectedExpiry(_expiry);
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

  return (
    <Box className="flex">
      <Box>
        <CustomButton
          size="medium"
          color="umbra"
          className="w-40 uppercase"
          aria-controls="expiry-menu"
          aria-haspopup="true"
          onClick={handleClick}
          endIcon={<ExpandMoreIcon />}
        >
          {format(selectedExpiry, 'EEE d LLLL')}
        </CustomButton>
        <Menu
          id="expiry-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          classes={{ paper: 'bg-cod-gray' }}
        >
          {expiries}
        </Menu>
      </Box>
    </Box>
  );
}
