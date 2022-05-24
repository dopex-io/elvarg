import {
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import cx from 'classnames';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import RefreshIcon from '@mui/icons-material/Refresh';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import Typography from 'components/UI/Typography';

import { RateVaultContext } from 'contexts/RateVault';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import styles from './styles.module.scss';

const PurchaseOptions = ({
  setActiveVaultContextSide,
  setStrikeIndex,
}: {
  setActiveVaultContextSide: Dispatch<SetStateAction<string>>;
  setStrikeIndex: Dispatch<SetStateAction<number>>;
}) => {
  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);
  const rateVaultContext = useContext(RateVaultContext);
  const [updated, setUpdated] = useState<boolean>(false);

  const { epochStrikes } = rateVaultContext.rateVaultEpochData;

  const [purchaseOptions, setPurchaseOptions] = useState<{
    [key: string]: any[];
  }>({ CALL: [], PUT: [] });

  useEffect(() => {
    const getPurchaseOptions = async (i: number, ssovContextSide: string) => {
      let strike: BigNumber = BigNumber.from('0');

      const _strike = rateVaultContext.rateVaultEpochData.epochStrikes[i];
      if (_strike) strike = _strike;

      let available: BigNumber | undefined = BigNumber.from('0');

      let price: BigNumber = BigNumber.from('0');

      let callDeposits = rateVaultContext.rateVaultEpochData.callsDeposits[i];
      let putDeposits = rateVaultContext.rateVaultEpochData.putsDeposits[i];

      let volatility: BigNumber = BigNumber.from('0');

      const _volatility = rateVaultContext.rateVaultEpochData.volatilities[i];
      if (_volatility) volatility = _volatility;

      if (ssovContextSide === 'CALL' && callDeposits) {
        available = callDeposits.sub(
          rateVaultContext.rateVaultEpochData.totalCallsPurchased
        );
        const _price = rateVaultContext.rateVaultEpochData.callsCosts[i];
        if (_price) price = _price;
      } else if (putDeposits) {
        available = putDeposits.sub(
          rateVaultContext.rateVaultEpochData.totalPutsPurchased
        );
        const _price = rateVaultContext.rateVaultEpochData.putsCosts[i];
        if (_price) price = _price;
      }

      return {
        available: Math.max(0, getUserReadableAmount(available, 18)),
        strike: getUserReadableAmount(strike, 8),
        volatility: getUserReadableAmount(volatility, 0),
        price: getUserReadableAmount(price, 18),
        side: ssovContextSide,
      };
    };
    async function updatePurchaseOptions() {
      setIsPurchaseStatsLoading(true);
      const options: {
        [key: string]: any[];
      } = { CALL: [], PUT: [] };

      const strikeIndexes = [];
      for (let strikeIndex in rateVaultContext.rateVaultEpochData
        .epochStrikes) {
        strikeIndexes.push(getPurchaseOptions(Number(strikeIndex), 'CALL'));
        strikeIndexes.push(getPurchaseOptions(Number(strikeIndex), 'PUT'));
      }

      const results = await Promise.all(strikeIndexes);

      for (let i in results) {
        const result = results[i];
        if (result) {
          const side = result['side'];
          if (results[i]) options[side]?.push(result);
        }
      }

      setPurchaseOptions(options);
      setIsPurchaseStatsLoading(false);
      setUpdated(true);
    }

    if (updated === false) updatePurchaseOptions();
  }, [rateVaultContext, updated]);

  return rateVaultContext?.rateVaultEpochData.epochStrikes ? (
    <Box>
      <Box className="flex">
        <Typography variant="h4" className="text-white mb-7">
          Purchase Options
        </Typography>
        <Tooltip title={'Refresh'}>
          <RefreshIcon
            className="mt-1 ml-2 hover:opacity-70 cursor-pointer"
            onClick={() => setUpdated(false)}
          />
        </Tooltip>
      </Box>
      {!rateVaultContext.rateVaultEpochData.isVaultReady ? (
        <Typography variant="h4" className="text-stieglitz mt-3">
          You will be able to purchase options once deposits phase ends
        </Typography>
      ) : (
        <Box className={'bg-cod-gray w-full p-4 pt-2 pb-4.5 pb-0 rounded-xl'}>
          <Box className="balances-table text-white min-h-[12rem]">
            <TableContainer
              className={cx(styles['optionsTable'], 'bg-cod-gray')}
            >
              {isEmpty(epochStrikes) ? (
                <Box className="border-4 border-umbra rounded-lg p-3">
                  {range(3).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      animation="wave"
                      height={60}
                      className="bg-umbra"
                    />
                  ))}
                </Box>
              ) : isPurchaseStatsLoading ? (
                <Box>
                  <Box className={cx('rounded-lg text-center mt-1')}>
                    <CircularProgress size={25} className={'mt-10'} />
                    <Typography variant="h6" className="text-white mb-10 mt-2">
                      Checking options availability...
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Table>
                  <TableHead className="bg-umbra">
                    <TableRow className="bg-umbra">
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 pb-0"
                      >
                        <Typography variant="h6">Strike</Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 pb-0"
                      >
                        <Typography variant="h6" className="text-stieglitz">
                          Available
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 pb-0"
                      >
                        <Typography variant="h6" className="text-stieglitz">
                          Breakeven
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 pb-0"
                      >
                        <Typography variant="h6" className="text-stieglitz">
                          IV
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 pb-0"
                      >
                        <Typography variant="h6" className="text-stieglitz">
                          Type
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 pb-0"
                      >
                        <Typography variant="h6" className="text-stieglitz">
                          Buy
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={cx('rounded-lg')}>
                    {['CALL', 'PUT'].map((ssovContextSide) =>
                      purchaseOptions[ssovContextSide]?.map((row, i) => {
                        const isDisabled =
                          row['available'] < 0.1 ||
                          rateVaultContext.rateVaultEpochData.epochEndTimes.toNumber() <
                            new Date().getTime() / 1000;
                        return (
                          <TableRow
                            key={i}
                            className="text-white mb-2 rounded-lg mt-2"
                          >
                            <TableCell align="left" className="mx-0 pt-2">
                              <Box className={'pt-2'}>
                                <Box
                                  className={`rounded-md flex mb-4 p-3 pt-2 pb-2 bg-umbra w-fit`}
                                >
                                  <Typography variant="h6">
                                    {formatAmount(row['strike'], 1)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="left" className="pt-2">
                              <Typography variant="h6">
                                {'$'}
                                {formatAmount(row['available'], 2)}
                              </Typography>
                            </TableCell>

                            <TableCell align="left" className="px-6 pt-2">
                              <Typography variant="h6">
                                {ssovContextSide === 'CALL' ? '+' : '-'}
                                {formatAmount(
                                  (row['price'] * 52) / (1 / 100),
                                  2
                                )}
                                %
                              </Typography>
                            </TableCell>
                            <TableCell align="left" className="px-6 pt-2">
                              <Typography variant="h6">
                                {row['volatility']}
                              </Typography>
                            </TableCell>
                            <TableCell align="left" className="px-6 pt-2">
                              <Typography
                                variant="h6"
                                className={
                                  ssovContextSide === 'CALL'
                                    ? 'text-[#6DFFB9]'
                                    : 'text-[#FF617D]'
                                }
                              >
                                {ssovContextSide}
                              </Typography>
                            </TableCell>
                            <TableCell align="left" className="px-6 pt-2">
                              <Button
                                onClick={() => {
                                  setActiveVaultContextSide(ssovContextSide);
                                  setStrikeIndex(i);
                                }}
                                disabled={isDisabled}
                                className={
                                  !isDisabled
                                    ? 'cursor-pointer bg-primary hover:bg-primary hover:opacity-90 text-white'
                                    : 'bg-umbra cursor-pointer'
                                }
                              >
                                ${formatAmount(row['price'], 8)}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>
        </Box>
      )}
    </Box>
  ) : null;
};

export default PurchaseOptions;
