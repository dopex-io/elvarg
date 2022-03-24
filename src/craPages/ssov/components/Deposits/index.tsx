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

import {
  SsovData,
  SsovEpochData,
  SsovUserData,
  SsovContext,
} from 'contexts/Ssov';

import { BnbConversionContext } from 'contexts/BnbConversion';
import { WalletContext } from 'contexts/Wallet';

import { SSOV_MAP } from 'constants/index';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import displayAddress from 'utils/general/displayAddress';
import oneEBigNumber from 'utils/math/oneEBigNumber';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import styles from './styles.module.scss';

interface DepositsTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  totalUserDeposits: number;
  totalUserPremiums: number;
  totalDeposits: number;
  totalPremiums: number;
  imgSrc: string;
  tokenName: string;
  setIsWithdrawModalVisible: Dispatch<SetStateAction<boolean>>;
}

const YEAR_SECONDS = 31536000;

const DepositsTableData = (
  props: DepositsTableDataProps & {
    price: number;
    epochTime: number;
    epochEndTime: Date;
    activeContextSide: string;
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
    tokenName,
    setIsWithdrawModalVisible,
    activeContextSide,
  } = props;

  const { convertToBNB } = useContext(BnbConversionContext);

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
          {formatAmount(
            tokenName === 'BNB'
              ? (convertToBNB(
                  BigNumber.from(
                    Math.round(totalUserDeposits * 10 ** 18).toString()
                  )
                )
                  .div(oneEBigNumber(6))
                  .toNumber() /
                  1e4) *
                  price
              : totalUserDeposits * price,
            2
          )}
        </Box>
      </TableCell>

      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(totalUserPremiums, 5)} {tokenName}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(
            tokenName === 'BNB'
              ? (convertToBNB(
                  BigNumber.from(
                    Math.round(totalUserPremiums * 10 ** 18).toString()
                  )
                )
                  .div(oneEBigNumber(6))
                  .toNumber() /
                  1e4) *
                  price
              : totalUserPremiums * price,
            2
          )}
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
          className={activeContextSide === 'CALL' ? '' : ''}
        >
          {activeContextSide}
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
  activeSsovContextSide,
  setActiveSsovContextSide,
  enabledSides = ['CALL', 'PUT'],
}: {
  activeSsovContextSide: string;
  setActiveSsovContextSide: Dispatch<SetStateAction<string>>;
  enabledSides?: string[];
}) => {
  const ssovContext = useContext(SsovContext);
  const { convertToBNB } = useContext(BnbConversionContext);
  const { accountAddress, changeWallet, disconnect, chainId, ensName } =
    useContext(WalletContext);

  const [isWithdrawModalVisible, setIsWithdrawModalVisible] =
    useState<boolean>(false);

  const { tokenPrice, tokenName } = ssovContext[activeSsovContextSide].ssovData;
  const {
    epochTimes,
    epochStrikes,
    totalEpochPremium,
    totalEpochStrikeDeposits,
    totalEpochOptionsPurchased,
  } = ssovContext[activeSsovContextSide].ssovEpochData;

  const { userEpochStrikeDeposits } =
    ssovContext[activeSsovContextSide].ssovUserData;

  const epochTime: number = useMemo(() => {
    return epochTimes && epochTimes[0] && epochTimes[1]
      ? (epochTimes[1] as BigNumber).sub(epochTimes[0] as BigNumber).toNumber()
      : 0;
  }, [epochTimes]);

  const epochEndTime: Date = useMemo(() => {
    return new Date(
      ssovContext[
        activeSsovContextSide
      ].ssovEpochData.epochTimes[1].toNumber() * 1000
    );
  }, [ssovContext, activeSsovContextSide]);

  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const price = useMemo(
    () => getUserReadableAmount(tokenPrice ?? 0, 8),
    [tokenPrice]
  );

  const [copyState, setCopyState] = useState('Copy Address');

  const copyToClipboard = () => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(accountAddress);
  };

  const deposits: any[] = useMemo(
    () =>
      epochStrikes.map((strike, strikeIndex) => {
        const strikePrice = getUserReadableAmount(strike, 8);

        const totalUserDeposits =
          tokenName === 'BNB'
            ? getUserReadableAmount(
                userEpochStrikeDeposits[strikeIndex] ?? 0,
                8
              )
            : getUserReadableAmount(
                userEpochStrikeDeposits[strikeIndex] ?? 0,
                18
              );

        const totalDeposits =
          tokenName === 'BNB'
            ? getUserReadableAmount(
                totalEpochStrikeDeposits[strikeIndex] ?? 0,
                8
              )
            : getUserReadableAmount(
                totalEpochStrikeDeposits[strikeIndex] ?? 0,
                18
              );

        const totalPremiums =
          tokenName === 'BNB'
            ? getUserReadableAmount(totalEpochPremium[strikeIndex] ?? 0, 8)
            : getUserReadableAmount(totalEpochPremium[strikeIndex] ?? 0, 18);

        const totalUserPremiums =
          (totalPremiums * totalUserDeposits) / totalDeposits;

        return {
          strikeIndex,
          strikePrice,
          totalUserDeposits,
          totalUserPremiums,
          totalDeposits,
          totalPremiums,
        };
      }),
    [
      epochStrikes,
      totalEpochStrikeDeposits,
      userEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      tokenName,
      convertToBNB,
    ]
  );

  const handleClose = () => {
    setIsWithdrawModalVisible(false);
  };

  return ssovContext[activeSsovContextSide].selectedEpoch > 0 ? (
    <Box>
      <Withdraw
        open={isWithdrawModalVisible}
        handleClose={handleClose}
        activeSsovContextSide={activeSsovContextSide}
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
          {enabledSides.length === 2 ? (
            <CustomButton
              className={'ml-auto flex'}
              size={'small'}
              color={'umbra'}
              onClick={() =>
                setActiveSsovContextSide(
                  activeSsovContextSide === 'CALL' ? 'PUT' : 'CALL'
                )
              }
            >
              <Typography variant="h5">Switch to</Typography>
              <img
                src={`/assets/${
                  activeSsovContextSide === 'CALL' ? 'puts.svg' : 'calls.svg'
                }`}
                className={'mt-[4px] ml-2'}
                alt={'Switch'}
              />
            </CustomButton>
          ) : null}
        </Box>

        <Box className="balances-table text-white">
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
                            activeContextSide={activeSsovContextSide}
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
                            imgSrc={
                              SSOV_MAP[
                                ssovContext[activeSsovContextSide].ssovData
                                  .tokenName
                              ].imageSrc
                            }
                            tokenName={
                              ssovContext[activeSsovContextSide].ssovData
                                .tokenName
                            }
                          />
                        );
                      }
                    )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {epochStrikes.length > ROWS_PER_PAGE ? (
            <TablePagination
              component="div"
              id="stats"
              rowsPerPageOptions={[ROWS_PER_PAGE]}
              count={epochStrikes.length}
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
