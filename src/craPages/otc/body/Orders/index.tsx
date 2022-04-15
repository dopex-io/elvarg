import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Switch from 'components/UI/Switch';
import LiveOrders from './LiveOrders';
import IndicativeRfqs from './IndicativeRfqs';
import UserOrders from './UserOrders';

interface OrdersInterface {
  smViewport: boolean;
  isLive: boolean;
  toggleLiveRfq: (e: any) => void;
}

const Orders = (props: OrdersInterface) => {
  const { smViewport, isLive, toggleLiveRfq } = props;

  const [filterFulfilled, setFilterFulfilled] = useState(true);

  const handleFilterFulfilled = useCallback(() => {
    setFilterFulfilled(!filterFulfilled);
  }, [filterFulfilled]);

  return (
    <Box className="space-y-4">
      <Box className="flex justify-between">
        <Typography variant="h5" className="font-bold">
          {isLive ? 'Live Orders' : 'RFQs'}
        </Typography>
        <Box className="flex space-x-2">
          <Typography
            variant="h5"
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
            variant="h5"
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
          smViewport={smViewport}
          filterFulfilled={filterFulfilled}
          handleFilterFulfilled={handleFilterFulfilled}
        />
      )}
      <UserOrders />
    </Box>
  );
};

export default Orders;
