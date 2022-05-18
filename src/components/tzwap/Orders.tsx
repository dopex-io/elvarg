import { Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { Order } from 'types/tzwap';

export interface Props {
  isFetchingOrders: boolean;
  orders: Order[];
  setOpenOrder: Dispatch<SetStateAction<number | null>>;
}

const Orders = ({ isFetchingOrders, orders, setOpenOrder }: Props) => {
  return (
    <Box className="h-[40.5rem] overflow-y-auto overflow-x-hidden">
      {!isFetchingOrders
        ? orders.reverse().map((order) => (
            <Box
              key={order.id}
              className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mb-3"
            >
              <Box className={'flex h-[2.75rem]'}>
                <Box className={'relative'}>
                  <img
                    src={'/images/tokens/' + order.srcTokenName + '.svg'}
                    className={
                      'inherit w-6 h-6 z-15 border-[0.2px] border-gray-800 rounded-full'
                    }
                    alt={order.srcTokenName}
                  />
                  <img
                    src={'/images/tokens/' + order.dstTokenName + '.svg'}
                    className={
                      'inherit w-6 h-6 border-[0.2px] border-gray-800 rounded-full ml-[1rem] mt-[-1rem] z-1'
                    }
                    alt={order.dstTokenName}
                  />
                </Box>
                <Box className="mt-1 ml-4 flex w-full">
                  <Typography variant="h6" className="text-xs font-normal mr-3">
                    {order.srcTokenName.toLocaleUpperCase()}
                  </Typography>
                  <img
                    src={'/assets/longarrowright.svg'}
                    alt="Arrow right"
                    className={'mr-1 w-4 h-2.5 mt-1.5'}
                  />
                  <Typography
                    variant="h6"
                    className="text-xs font-normal ml-2 mr-2"
                  >
                    {order.dstTokenName.toLocaleUpperCase()}
                  </Typography>
                  {order.killed ? (
                    <CustomButton
                      size="small"
                      className="ml-auto !rounded-md bg-[#2D2D2D] mt-[-0.3rem]"
                      color="mineshaft"
                      disabled
                    >
                      Killed
                      <img
                        src="/assets/killpepe.svg"
                        className="ml-2 mr-1.5"
                        alt={'Pepe Kill'}
                      />
                    </CustomButton>
                  ) : getUserReadableAmount(
                      order.total,
                      order.srcTokenDecimals
                    ) === order.srcTokensSwapped ? (
                    <CustomButton
                      size="small"
                      className="ml-auto !rounded-md bg-[#2D2D2D] mt-[-0.3rem]"
                      color="mineshaft"
                    >
                      Filled
                    </CustomButton>
                  ) : (
                    <CustomButton
                      size="small"
                      className="ml-auto !rounded-md bg-[#2D2D2D] mt-[-0.3rem]"
                      color="mineshaft"
                      onClick={() => setOpenOrder(order.id)}
                    >
                      <CircularProgress
                        className="text-stieglitz mt-0.5 mr-2"
                        size={10}
                      />
                      Open
                      <img
                        src="/assets/cross.svg"
                        className="ml-2 mr-1.5"
                        alt={'Cancel'}
                      />
                    </CustomButton>
                  )}
                </Box>
              </Box>
              <Box className="rounded-md flex flex-col p-4 border border-neutral-800 w-full bg-neutral-800">
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Interval
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(
                        getUserReadableAmount(order.interval, 0) / 60
                      )}{' '}
                      Min
                    </Typography>
                  </Box>
                </Box>

                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Total
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(
                        getUserReadableAmount(
                          order.total,
                          order.srcTokenDecimals
                        ),
                        2
                      )}{' '}
                      {order.srcTokenName.toLocaleUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Tick Size
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {getUserReadableAmount(
                        order.tickSize,
                        order.srcTokenDecimals
                      )}{' '}
                      {order.srcTokenName.toLocaleUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Start
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {
                        new Date(order.created * 1000)
                          .toLocaleString()
                          .split(',')[0]
                      }
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Fees
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(getUserReadableAmount(order.minFees, 3), 2)}
                      %
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Swapped
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(order.srcTokensSwapped, 2)}{' '}
                      {order.srcTokenName.toLocaleUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  className={
                    order.srcTokensSwapped > 0 ? 'flex mb-2' : 'flex mb-0'
                  }
                >
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Obtained
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(order.dstTokensSwapped, 2)}{' '}
                      {order.dstTokenName.toLocaleUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                {order.srcTokensSwapped > 0 ? (
                  <LinearProgress
                    variant="determinate"
                    className={'mt-3 rounded-sm'}
                    value={
                      (100 * order.srcTokensSwapped) /
                      getUserReadableAmount(order.total, order.srcTokenDecimals)
                    }
                  />
                ) : null}
                <Box
                  className={
                    'text-wave-blue text-center mb-4 text-[0.6rem] mt-1.5'
                  }
                >
                  {formatAmount(
                    (100 * order.srcTokensSwapped) /
                      getUserReadableAmount(
                        order.total,
                        order.srcTokenDecimals
                      ),
                    2
                  )}
                  %
                </Box>
                {order.srcTokensSwapped > 0 ? (
                  <Box className={'flex'}>
                    <Typography
                      variant="h6"
                      className="text-stieglitz ml-0 mr-auto"
                    >
                      Current price
                    </Typography>
                    <Box className={'text-right'}>
                      <Typography
                        variant="h6"
                        className="text-white mr-auto ml-0"
                      >
                        1 {order.srcTokenName.toLocaleUpperCase()} ={' '}
                        {formatAmount(
                          order.dstTokensSwapped / order.srcTokensSwapped,
                          2
                        )}{' '}
                        {order.dstTokenName.toLocaleUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            </Box>
          ))
        : null}
      {!isFetchingOrders && orders.length === 0 ? (
        <Box className={'text-center mt-3'}>
          <Typography variant="h6" className="mb-3 text-stieglitz">
            No orders have been created yet
          </Typography>
        </Box>
      ) : null}
      {isFetchingOrders ? (
        <Box className={'text-center mt-3'}>
          <CircularProgress
            color="inherit"
            size="17px"
            className="mr-auto ml-auto"
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default Orders;
