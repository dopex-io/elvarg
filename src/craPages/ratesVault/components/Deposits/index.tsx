import {
  useContext,
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import CustomButton from 'components/UI/CustomButton';
import Withdraw from '../Dialogs/Withdraw';

import { RateVaultContext } from 'contexts/RateVault';

import { WalletContext } from 'contexts/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import displayAddress from 'utils/general/displayAddress';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import styles from './styles.module.scss';

interface DepositsTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  totalUserDeposits: number;
  totalUserPremiums: number;
  totalDeposits: number;
  totalPremiums: number;
  imgSrc: string;
  tokenSymbol: string;
  setIsWithdrawModalVisible: Dispatch<SetStateAction<boolean>>;
}

const YEAR_SECONDS = 31536000;

const DepositsTableData = (
  props: DepositsTableDataProps & {
    price: number;
    epochTime: number;
    epochEndTime: Date;
    activeVaultContextSide: string;
  }
) => {
  const {
    strikePrice,
    totalUserDeposits,
    totalUserPremiums,
    totalDeposits,
    totalPremiums,
    price,
    epochTime,
    epochEndTime,
    imgSrc,
    tokenSymbol,
    setIsWithdrawModalVisible,
    activeVaultContextSide,
  } = props;

  const tokenName = tokenSymbol === 'BNB' ? 'vBNB' : tokenSymbol;

  const isWithdrawalEnabled: boolean = useMemo(() => {
    return new Date() > epochEndTime;
  }, [epochEndTime]);

  return (
    <TableRow className="text-white mb-2 rounded-lg mt-2">
      <TableCell align="left" className="mx-0 pt-2">
        <Box className={'pt-2'}>
          <Box className={`rounded-md flex mb-4 p-3 pt-2 pb-2 bg-umbra w-fit`}>
            <Typography variant="h6">
              ${formatAmount(strikePrice, 5)}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(totalUserDeposits, 5)} {tokenName}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(totalUserDeposits * price, 2)}
        </Box>
      </TableCell>

      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(totalUserPremiums, 5)} {tokenName}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(totalUserPremiums * price, 2)}
        </Box>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6" className="text-[#6DFFB9]">
          {formatAmount(
            epochTime > 0 && totalDeposits > 0
              ? 100 *
                  (YEAR_SECONDS / epochTime) *
                  (totalPremiums / totalDeposits)
              : 0,
            2
          )}
          {'%'}
        </Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography
          variant="h6"
          className={activeVaultContextSide === 'CALL' ? '' : ''}
        >
          {activeVaultContextSide}
        </Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Button
          onClick={() => setIsWithdrawModalVisible(true)}
          className={cx(
            'rounded-md h-10 ml-1 hover:bg-opacity-70 pl-2 pr-2',
            epochEndTime > new Date()
              ? 'bg-umbra hover:bg-cod-gray'
              : 'bg-primary hover:bg-primary text-white '
          )}
          disabled={!isWithdrawalEnabled}
        >
          {isWithdrawalEnabled ? (
            'Withdraw'
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
    </TableRow>
  );
};

const ROWS_PER_PAGE = 5;

const Deposits = ({
  activeVaultContextSide,
  setActiveVaultContextSide,
}: {
  activeVaultContextSide: string;
  setActiveVaultContextSide: Dispatch<SetStateAction<string>>;
}) => {
  const rateVaultContext = useContext(RateVaultContext);
  const { accountAddress, changeWallet, disconnect, chainId, ensName } =
    useContext(WalletContext);

  const [isWithdrawModalVisible, setIsWithdrawModalVisible] =
    useState<boolean>(false);

  const epochTime: number = useMemo(() => {
    return rateVaultContext.rateVaultEpochData.epochStartTimes &&
      rateVaultContext.rateVaultEpochData.epochEndTimes
      ? (rateVaultContext.rateVaultEpochData.epochStartTimes as BigNumber)
          .sub(rateVaultContext.rateVaultEpochData.epochEndTimes as BigNumber)
          .toNumber()
      : 0;
  }, [rateVaultContext]);

  const epochEndTime: Date = useMemo(() => {
    return new Date(
      rateVaultContext.rateVaultEpochData.epochEndTimes.toNumber() * 1000
    );
  }, [rateVaultContext]);

  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const price: number = 1;

  const [copyState, setCopyState] = useState('Copy Address');

  const copyToClipboard = () => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(accountAddress);
  };

  const deposits: any[] = [];

  const handleClose = () => {
    setIsWithdrawModalVisible(false);
  };

  return rateVaultContext.selectedEpoch > 0 ? (
    <Box>
      <Withdraw
        open={isWithdrawModalVisible}
        handleClose={handleClose}
        activeVaultContextSide={activeVaultContextSide}
      />

      <Typography variant="h4" className="text-white mb-7">
        Deposits
      </Typography>
      <Box className={'bg-cod-gray w-full p-4 pt-5 pb-4.5 pb-0 rounded-xl'}>
        <Box className={'flex pb-[3px] border-b border-[#1E1E1E]'}>
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h5" className="bg-umbra rounded-md py-1 px-2">
              {displayAddress(accountAddress, ensName)}
            </Typography>
          </Box>
          <Tooltip title={'Not implemented yet'}>
            <Box className="ml-5 mb-3 cursor-not-allowed hidden lg:flex">
              <Checkbox
                color="secondary"
                className={'p-0 text-white'}
                checked={false}
              />
              <Typography
                variant="h6"
                className="text-stieglitz ml-0 mr-auto flex mt-1.5 ml-2.5"
              >
                Show Previous Epoch (2)
              </Typography>
            </Box>
          </Tooltip>
          <CustomButton
            className={'ml-auto flex'}
            size={'small'}
            color={'umbra'}
            onClick={() =>
              setActiveVaultContextSide(
                activeVaultContextSide === 'CALL' ? 'PUT' : 'CALL'
              )
            }
          >
            <Typography variant="h5">Switch to</Typography>
            <img
              src={`/assets/${
                activeVaultContextSide === 'CALL' ? 'puts.svg' : 'calls.svg'
              }`}
              className={'mt-[4px] ml-2'}
            />
          </CustomButton>
        </Box>

        <Box className="balances-table text-white min-h-[12rem]">
          <TableContainer className={cx(styles.optionsTable, 'bg-cod-gray')}>
            {isEmpty(rateVaultContext.rateVaultEpochData.epochStrikes) ? (
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
                        Amount
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-stieglitz bg-cod-gray border-0 pb-0"
                    >
                      <Typography variant="h6" className="text-stieglitz">
                        Premium
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-stieglitz bg-cod-gray border-0 pb-0"
                    >
                      <Typography variant="h6" className="text-stieglitz">
                        APY
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-stieglitz bg-cod-gray border-0 pb-0"
                    >
                      <Typography variant="h6" className="text-stieglitz">
                        Side
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-stieglitz bg-cod-gray border-0 pb-0"
                    >
                      <Typography variant="h6" className="text-stieglitz">
                        Withdraw
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={cx('rounded-lg')}>
                  {deposits
                    .slice(
                      page * ROWS_PER_PAGE,
                      page * ROWS_PER_PAGE + ROWS_PER_PAGE
                    )
                    ?.map(
                      ({
                        strikeIndex,
                        strikePrice,
                        totalUserDeposits,
                        totalUserPremiums,
                        totalDeposits,
                        totalPremiums,
                      }) => {
                        return (
                          <DepositsTableData
                            setIsWithdrawModalVisible={
                              setIsWithdrawModalVisible
                            }
                            activeVaultContextSide={activeVaultContextSide}
                            key={strikeIndex}
                            epochTime={epochTime}
                            strikeIndex={strikeIndex}
                            strikePrice={strikePrice}
                            totalUserDeposits={totalUserDeposits}
                            totalUserPremiums={totalUserPremiums}
                            totalDeposits={totalDeposits}
                            totalPremiums={totalPremiums}
                            price={price}
                            epochEndTime={epochEndTime}
                            imgSrc={'ir.svg'}
                            tokenSymbol={'2CRV'}
                          />
                        );
                      }
                    )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {rateVaultContext.rateVaultEpochData?.epochStrikes.length >
          ROWS_PER_PAGE ? (
            <TablePagination
              component="div"
              id="stats"
              rowsPerPageOptions={[ROWS_PER_PAGE]}
              count={rateVaultContext.rateVaultEpochData?.epochStrikes.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={ROWS_PER_PAGE}
              className="text-stieglitz border-0 flex flex-grow justify-center"
              ActionsComponent={TablePaginationActions}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Deposits;
