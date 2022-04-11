import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Switch from 'components/UI/Switch';
import LiveOrders from './LiveOrders';
import IndicativeRfqs from './IndicativeRfqs';
import UserOrders from './UserOrders';

const Orders = (props) => {
  const { isLive, toggleLiveRfq } = props;

  const [filterFulfilled, setFilterFulfilled] = useState(false);

  const handleFilterFulfilled = useCallback((e) => {
    setFilterFulfilled(e.target.checked);
  }, []);

  return (
    <Box className="space-y-4">
      <Box className="flex justify-between">
        <Typography variant="body1" className="font-bold">
          {isLive ? 'Live Orders' : 'RFQs'}
        </Typography>
        <Box className="flex space-x-2">
          <Typography
            variant="body1"
            className={`${isLive ? 'text-stieglitz' : 'text-white'}`}
          >
            RFQ
          </Typography>
          <Switch
            aria-label="rfq-toggle"
            color="default"
            onClick={toggleLiveRfq}
            className="my-auto"
          />
          <Typography
            variant="body1"
            className={`${!isLive ? 'text-stieglitz' : 'text-white'}`}
          >
            Trade
          </Typography>
        </Box>
      </Box>
      {isLive ? (
        <LiveOrders />
      ) : (
        <IndicativeRfqs
          filterFulfilled={filterFulfilled}
          handleFilterFulfilled={handleFilterFulfilled}
        />
      )}
      <UserOrders />
    </Box>
  );
};

export default Orders;
