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
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import LaunchIcon from '@mui/icons-material/Launch';
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
import getExplorerUrl from 'utils/general/getExplorerUrl';
import displayAddress from 'utils/general/displayAddress';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import styles from './styles.module.scss';

interface DepositsTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  totalDeposits: number;
  totalPurchased: number;
  totalPremiums: number;
  imgSrc: string;
  tokenSymbol: string;
}

const YEAR_SECONDS = 31536000;

const DepositsTableData = (
  props: DepositsTableDataProps & { price: number; epochTime: number }
) => {
  const {
    strikePrice,
    totalDeposits,
    totalPurchased,
    totalPremiums,
    price,
    epochTime,
    imgSrc,
    tokenSymbol,
  } = props;

  const { convertToBNB } = useContext(BnbConversionContext);

  const tokenName = tokenSymbol === 'BNB' ? 'vBNB' : tokenSymbol;

  return (
    <TableRow className="text-white mb-2 rounded-lg mt-2">
      <TableCell align="left" className="mx-0 pt-2">
        <Box className={'pt-2'}>
          <Box className={`rounded-md flex mb-4 p-2 pt-1 pb-1 bg-umbra w-fit`}>
            <Typography variant="h6">
              ${formatAmount(strikePrice, 5)}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(totalDeposits, 5)} {tokenName}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(
            tokenSymbol === 'BNB'
              ? (convertToBNB(ethers.utils.parseEther(totalDeposits.toString()))
                  .div(oneEBigNumber(6))
                  .toNumber() /
                  1e4) *
                  price
              : totalDeposits * price,
            2
          )}
        </Box>
      </TableCell>

      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(totalPremiums, 5)} {tokenName}
        </Typography>
        <Box component="h6" className="text-xs text-stieglitz">
          {'$'}
          {formatAmount(
            tokenSymbol === 'BNB'
              ? (convertToBNB(ethers.utils.parseEther(totalPremiums.toString()))
                  .div(oneEBigNumber(6))
                  .toNumber() /
                  1e4) *
                  price
              : totalPremiums * price,
            2
          )}
        </Box>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
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
            'rounded-md h-10 ml-1 text-white hover:bg-opacity-70',
            !true ? 'bg-umbra hover:bg-cod-gray' : 'bg-primary hover:bg-primary'
          )}
        >
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};

const ROWS_PER_PAGE = 5;

const Deposits = ({
  activeType,
  setActiveType,
}: {
  activeType: string;
  setActiveType: Dispatch<SetStateAction<string>>;
}) => {
  const ssovContext = useContext(SsovContext);
  const { convertToBNB } = useContext(BnbConversionContext);
  const { accountAddress, changeWallet, disconnect, chainId, ensName } =
    useContext(WalletContext);

  const { tokenPrice, tokenName } = ssovContext[activeType].ssovData;
  const {
    epochTimes,
    epochStrikes,
    totalEpochPremium,
    totalEpochStrikeDeposits,
    totalEpochOptionsPurchased,
  } = ssovContext[activeType].ssovEpochData;

  const epochTime =
    epochTimes && epochTimes[0] && epochTimes[1]
      ? (epochTimes[1] as BigNumber).sub(epochTimes[0] as BigNumber).toNumber()
      : 0;

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
        const totalPurchased =
          tokenName === 'BNB'
            ? convertToBNB(totalEpochOptionsPurchased[strikeIndex]) ?? 0
            : getUserReadableAmount(
                totalEpochOptionsPurchased[strikeIndex] ?? 0,
                18
              );

        const totalPremiums =
          tokenName === 'BNB'
            ? getUserReadableAmount(totalEpochPremium[strikeIndex] ?? 0, 8)
            : getUserReadableAmount(totalEpochPremium[strikeIndex] ?? 0, 18);

        return {
          strikeIndex,
          strikePrice,
          totalDeposits,
          totalPurchased,
          totalPremiums,
        };
      }),
    [
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      tokenName,
      convertToBNB,
    ]
  );

  return ssovContext[activeType].selectedEpoch > 0 ? (
    <Box>
      <Typography variant="h4" className="text-white mb-7">
        Deposits
      </Typography>
      <Box className={'bg-cod-gray w-full p-4 pt-4 pb-4.5 pb-0 rounded-xl'}>
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
                        Amount
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-stieglitz bg-cod-gray border-0 pb-0"
                    >
                      <Typography variant="h6" className="text-stieglitz">
                        Premiums
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
                        totalDeposits,
                        totalPurchased,
                        totalPremiums,
                      }) => {
                        return (
                          <DepositsTableData
                            key={strikeIndex}
                            strikeIndex={strikeIndex}
                            strikePrice={strikePrice}
                            totalDeposits={totalDeposits}
                            totalPurchased={totalPurchased}
                            totalPremiums={totalPremiums}
                            price={price}
                            epochTime={epochTime}
                            imgSrc={
                              SSOV_MAP[
                                ssovContext[activeType].ssovData.tokenName
                              ].imageSrc
                            }
                            tokenSymbol={
                              SSOV_MAP[
                                ssovContext[activeType].ssovData.tokenName
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

export default Deposits;
