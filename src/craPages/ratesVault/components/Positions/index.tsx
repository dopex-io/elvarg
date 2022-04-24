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
import { ERC20__factory } from '@dopex-io/sdk';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';

import { RateVaultContext } from 'contexts/RateVault';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import displayAddress from 'utils/general/displayAddress';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import TransferDialog from '../Dialogs/Transfer';

import styles from './styles.module.scss';

const YEAR_SECONDS = 31536000;

export interface PositionProps {
  strike: number;
  strikeIndex: number;
  purchased: number;
  rawPurchased: BigNumber;
  side: string;
  canBeSettled: boolean;
  pnl: number;
}

const Positions = () => {
  const [isPositionsStatsLoading, setIsPositionsStatsLoading] =
    useState<Boolean>(false);
  const rateVaultContext = useContext(RateVaultContext);
  const {
    accountAddress,
    changeWallet,
    disconnect,
    chainId,
    ensName,
    provider,
    signer,
  } = useContext(WalletContext);
  const { updateAssetBalances } = useContext(AssetsContext);
  const [updated, setUpdated] = useState<boolean>(false);
  const [tokenAddressToTransfer, setTokenAddressToTransfer] = useState<
    string | null
  >(null);
  const [positionToSettle, setPositionToSettle] =
    useState<null | PositionProps>(null);

  const {
    rateVaultUserData,
    rateVaultEpochData,
    rateVaultData,
    updateRateVaultUserData,
    selectedEpoch,
  } = rateVaultContext;
  const { rateVaultContract } = rateVaultData;

  const [page, setPage] = useState(0);

  const [copyState, setCopyState] = useState('Copy Address');

  const [positions, setPositions] = useState([]);
  const tokenPrice: number = 1;
  const tokenName: string = '2CRV';

  const { epochTimes, epochStrikes } = rateVaultContext.rateVaultEpochData;

  const epochEndTime: Date = useMemo(() => {
    return new Date(epochTimes[1].toNumber() * 1000);
  }, [epochTimes]);

  const copyToClipboard = () => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(accountAddress);
  };

  // Handle settle
  const handleSettle = useCallback(
    async (strikeIndex, isPut) => {
      const tokenAddress = isPut
        ? rateVaultEpochData.putsToken[strikeIndex]
        : rateVaultEpochData.callsToken[strikeIndex];
      const amount = ERC20__factory.connect(tokenAddress, signer).balanceOf(
        accountAddress
      );

      rateVaultContract
        .connect(signer)
        .settle(strikeIndex, isPut, amount, selectedEpoch);

      updateAssetBalances();
      updateRateVaultUserData();
    },
    [
      signer,
      selectedEpoch,
      updateAssetBalances,
      accountAddress,
      chainId,
      rateVaultEpochData,
      updateRateVaultUserData,
    ]
  );

  useEffect(() => {
    async function updatePositions() {
      setIsPositionsStatsLoading(true);
      const _positions = [];

      rateVaultUserData?.userStrikePurchaseData?.map((purchase) => {
        ['CALL', 'PUT'].map((contextSide) => {
          const duration =
            (rateVaultEpochData.epochTimes[1].toNumber() -
              epochTimes[0].toNumber()) /
            86400;
          let pnl = 0;
          const price = getUserReadableAmount(rateVaultEpochData.usdPrice, 18);
          const strike = purchase.strike.toNumber();
          const amount = getUserReadableAmount(
            contextSide === 'CALL'
              ? purchase.callsPurchased
              : purchase.putsPurchased,
            18
          );

          if (contextSide === 'CALL') {
            if (strike < price) {
              pnl = ((price - strike) * amount * duration) / 36500 / 1e8;
            }
          } else {
            if (strike > price) {
              pnl = ((strike - price) * amount * duration) / 36500 / 1e8;
            }
          }

          if (
            (contextSide === 'CALL' && purchase.callsPurchased.gt(0)) ||
            (contextSide === 'PUT' && purchase.putsPurchased.gt(0))
          )
            _positions.push({
              strike: purchase.strike,
              strikeIndex: purchase.strikeIndex,
              rawPurchased:
                contextSide === 'CALL'
                  ? purchase.callsPurchased
                  : purchase.putsPurchased,
              purchased: getUserReadableAmount(
                contextSide === 'CALL'
                  ? purchase.callsPurchased
                  : purchase.putsPurchased,
                18
              ),
              side: contextSide,
              canBeSettled: new Date() > epochEndTime && pnl > 0,
              pnl: pnl,
            });
        });
      });

      setPositions(_positions);
      setIsPositionsStatsLoading(false);
      setUpdated(true);
    }

    if (updated === false) updatePositions();
  }, [
    rateVaultEpochData,
    rateVaultUserData,
    updated,
    epochEndTime,
    tokenPrice,
  ]);

  const handleTransferDialogClose = () => {
    setTokenAddressToTransfer(null);
  };

  return positions.length > 0 || isPositionsStatsLoading ? (
    <Box>
      <TransferDialog
        setTokenAddressToTransfer={setTokenAddressToTransfer}
        tokenAddressToTransfer={tokenAddressToTransfer}
      />
      <Box className="flex">
        <Typography variant="h4" className="text-white mb-7">
          Positions
        </Typography>
        <Tooltip title={'Refresh'}>
          <RefreshIcon
            className="mt-1 ml-2 hover:opacity-70 cursor-pointer"
            onClick={() => setUpdated(false)}
          />
        </Tooltip>
      </Box>
      <Box className={'bg-cod-gray w-full p-4 pt-2 pb-4.5 pb-0 rounded-xl'}>
        <Box className="balances-table text-white">
          <TableContainer className={cx(styles.optionsTable, 'bg-cod-gray')}>
            {isPositionsStatsLoading ? (
              <Box>
                <Box className={cx('rounded-lg text-center mt-1')}>
                  <CircularProgress size={25} className={'mt-10'} />
                  <Typography variant="h6" className="text-white mb-10 mt-2">
                    Checking positions...
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
                        Purchased
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-stieglitz bg-cod-gray border-0 pb-0"
                    >
                      <Typography variant="h6" className="text-stieglitz">
                        PnL ($)
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
                        Settle
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-stieglitz bg-cod-gray border-0 pb-0"
                    >
                      <Typography variant="h6" className="text-stieglitz">
                        Transfer
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={cx('rounded-lg')}>
                  {positions.map((position, i) => (
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
                              $
                              {formatAmount(
                                getUserReadableAmount(position['strike'], 8),
                                0
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left" className="pt-2">
                        <Typography variant="h6">
                          ${formatAmount(position['purchased'], 2)}
                        </Typography>
                      </TableCell>

                      <TableCell align="left" className="pt-2">
                        <Typography
                          variant="h6"
                          className={
                            position['pnl'] >= 0
                              ? 'text-[#6DFFB9]'
                              : 'text-[#FF617D]'
                          }
                        >
                          ${formatAmount(position['pnl'], 2)}
                        </Typography>
                      </TableCell>

                      <TableCell align="left" className="px-6 pt-2">
                        <Typography
                          variant="h6"
                          className={
                            position['side'] === 'CALL'
                              ? 'text-[#6DFFB9]'
                              : 'text-[#FF617D]'
                          }
                        >
                          {position['side']}
                        </Typography>
                      </TableCell>

                      <TableCell align="left" className="px-6 pt-2 w-[15rem]">
                        <Button
                          onClick={() =>
                            handleSettle(
                              position['strikeIndex'],
                              position['side'] === 'PUT'
                            )
                          }
                          disabled={!position['canBeSettled']}
                          className={
                            position['canBeSettled']
                              ? 'cursor-pointer bg-primary hover:bg-primary hover:opacity-90 text-white'
                              : 'bg-umbra cursor-pointer'
                          }
                        >
                          {position['canBeSettled'] ? (
                            'Settle'
                          ) : (
                            <Countdown
                              date={epochEndTime}
                              renderer={({ days, hours, minutes, seconds }) => {
                                return (
                                  <Box className={'flex'}>
                                    <img
                                      src={'/assets/timer.svg'}
                                      className={'h-[1rem] mt-1 mr-2 ml-1'}
                                    />
                                    <Typography
                                      variant="h5"
                                      className="ml-auto text-stieglitz mr-1"
                                    >
                                      {days}d {hours}h {minutes}m
                                    </Typography>
                                  </Box>
                                );
                              }}
                            />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell align="left" className="px-6 pt-2">
                        <Button
                          onClick={() =>
                            setTokenAddressToTransfer(
                              position['side'] === 'CALL'
                                ? rateVaultEpochData.callsToken[
                                    position['strikeIndex']
                                  ]
                                : rateVaultEpochData.putsToken[
                                    position['strikeIndex']
                                  ]
                            )
                          }
                          className={
                            'cursor-pointer bg-primary hover:bg-primary hover:opacity-90 text-white'
                          }
                        >
                          Transfer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Positions;
