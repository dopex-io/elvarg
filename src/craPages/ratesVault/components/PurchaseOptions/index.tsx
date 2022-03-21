import {
  useContext,
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import delay from 'lodash/delay';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Countdown from 'react-countdown';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import RefreshIcon from '@mui/icons-material/Refresh';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';

import { RateVaultContext } from 'contexts/RateVault';

import { WalletContext } from 'contexts/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import displayAddress from 'utils/general/displayAddress';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import styles from './styles.module.scss';

const YEAR_SECONDS = 31536000;

const PurchaseOptions = ({
  activeVaultContextSide,
  setActiveVaultContextSide,
  setStrikeIndex,
}: {
  activeVaultContextSide: string;
  setActiveVaultContextSide: Dispatch<SetStateAction<string>>;
  setStrikeIndex: Dispatch<SetStateAction<number>>;
}) => {
  const { provider } = useContext(WalletContext);
  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);
  const rateVaultContext = useContext(RateVaultContext);
  const { accountAddress, changeWallet, disconnect, chainId, ensName } =
    useContext(WalletContext);
  const [updated, setUpdated] = useState<boolean>(false);

  const { epochTimes, epochStrikes } = rateVaultContext.rateVaultEpochData;

  const epochTime: number = useMemo(() => {
    return epochTimes && epochTimes[0] && epochTimes[1]
      ? (epochTimes[1] as BigNumber).sub(epochTimes[0] as BigNumber).toNumber()
      : 0;
  }, [epochTimes]);

  const epochEndTime: Date = useMemo(() => {
    return new Date(epochTimes[1].toNumber() * 1000);
  }, [epochTimes, activeVaultContextSide]);

  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const price: number = 1;

  const [copyState, setCopyState] = useState('Copy Address');

  const [purchaseOptions, setPurchaseOptions] = useState({ CALL: [], PUT: [] });

  const copyToClipboard = () => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(accountAddress);
  };

  const getPurchaseOptions = async (i, ssovContextSide) => {
    return {};
  };

  useEffect(() => {
    async function updatePurchaseOptions() {
      setIsPurchaseStatsLoading(true);
      const options = {
        CALL: [],
        PUT: [],
      };

      const strikeIndexes = [];
      // for (let strikeIndex in ssovContext['CALL'].ssovEpochData.epochStrikes) {
      //  strikeIndexes.push(getPurchaseOptions(strikeIndex, 'CALL'));
      //  strikeIndexes.push(getPurchaseOptions(strikeIndex, 'PUT'));
      //}

      const results = await Promise.all(strikeIndexes);

      for (let i in results)
        if (results[i]) options[results[i]['side']].push(results[i]);

      setPurchaseOptions(options);
      setIsPurchaseStatsLoading(false);
      setUpdated(true);
    }

    if (updated === false) updatePurchaseOptions();
  }, [rateVaultContext, updated]);

  return rateVaultContext.selectedEpoch > 0 ? (
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
      <Box className={'bg-cod-gray w-full p-4 pt-2 pb-4.5 pb-0 rounded-xl'}>
        <Box className="balances-table text-white min-h-[12rem]">
          <TableContainer className={cx(styles.optionsTable, 'bg-cod-gray')}>
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
                    purchaseOptions[ssovContextSide].map((row, i) => {
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
                                  ${formatAmount(row['strike'], 0)}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="left" className="pt-2">
                            <Typography variant="h6">
                              {formatAmount(row['available'], 2)} 2CRV
                            </Typography>
                            <Box
                              component="h6"
                              className="text-xs text-stieglitz"
                            >
                              {'$'}
                              {formatAmount(row['available'], 2)}
                            </Box>
                          </TableCell>

                          <TableCell align="left" className="px-6 pt-2">
                            <Typography variant="h6">
                              {formatAmount(
                                ssovContextSide === 'PUT'
                                  ? Number(row['strike']) - row['price']
                                  : Number(row['strike']) + row['price'],
                                0
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" className="px-6 pt-2">
                            <Typography variant="h6">
                              {row['volatility'].toNumber()}
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
                              disabled={row['available'] < 0.1}
                              className={
                                row['available'] > 0.1
                                  ? 'cursor-pointer bg-primary hover:bg-primary hover:opacity-90 text-white'
                                  : 'bg-umbra cursor-pointer'
                              }
                            >
                              ${formatAmount(row['price'], 2)}
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
    </Box>
  ) : null;
};

export default PurchaseOptions;
