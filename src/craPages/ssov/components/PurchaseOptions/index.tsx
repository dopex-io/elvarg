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

import styles from './styles.module.scss';

interface PurchaseOptionsTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  totalUserDeposits: number;
  totalUserPremiums: number;
  totalDeposits: number;
  totalPremiums: number;
  imgSrc: string;
  tokenSymbol: string;
}

const YEAR_SECONDS = 31536000;

const PurchaseOptionsTableData = (
  props: PurchaseOptionsTableDataProps & {
    price: number;
    epochTime: number;
    epochEndTime: Date;
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
  } = props;

  const { convertToVBNB, convertToBNB } = useContext(BnbConversionContext);

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
          {formatAmount(
            tokenSymbol === 'BNB'
              ? (convertToBNB(
                  ethers.utils.parseEther(totalUserDeposits.toString())
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
            tokenSymbol === 'BNB'
              ? (convertToBNB(
                  ethers.utils.parseEther(totalUserPremiums.toString())
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
        <Typography variant="h6">Call</Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Button
          onClick={null}
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

const PurchaseOptions = ({
  activeSsovContextSide,
  setActiveSsovContextSide,
}: {
  activeSsovContextSide: string;
  setActiveSsovContextSide: Dispatch<SetStateAction<string>>;
}) => {
  const { provider } = useContext(WalletContext);
  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);
  const ssovContext = useContext(SsovContext);
  const { convertToBNB } = useContext(BnbConversionContext);
  const { accountAddress, changeWallet, disconnect, chainId, ensName } =
    useContext(WalletContext);

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

  const [purchaseOptions, setPurchaseOptions] = useState([]);

  const copyToClipboard = () => {
    setCopyState('Copied');
    delay(() => setCopyState('Copy Address'), 500);
    navigator.clipboard.writeText(accountAddress);
  };

  useEffect(() => {
    setIsPurchaseStatsLoading(true);
    async function updatePurchaseOptions() {
      const options = {
        CALL: {},
        PUT: {},
      };

      ['CALL', 'PUT'].map((ssovContextSide) => {
        ssovContext[ssovContextSide].ssovEpochData.epochStrikes.map(
          (strike, i) => {
            options[ssovContextSide][getUserReadableAmount(strike, 8)] = {
              available: options[ssovContextSide].ssovEpochData
                ? options[
                    ssovContextSide
                  ].ssovEpochData.totalEpochStrikeDeposits[i].min(
                    options[ssovContextSide].ssovEpochData
                      .totalEpochOptionsPurchased[i]
                  )
                : BigNumber.from('0'),
            };
          }
        );
      });
    }
    updatePurchaseOptions();
  }, [epochStrikes, ssovContext, tokenPrice, provider]);

  return ssovContext[activeSsovContextSide].selectedEpoch > 0 ? (
    <Box>
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
            <Box className="ml-5 mb-3 flex cursor-not-allowed">
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
                        Buy
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={cx('rounded-lg')}>
                  {[]
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
                          <PurchaseOptionsTableData
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
                            tokenSymbol={
                              SSOV_MAP[
                                ssovContext[activeSsovContextSide].ssovData
                                  .tokenName
                              ].tokenSymbol
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

export default PurchaseOptions;
