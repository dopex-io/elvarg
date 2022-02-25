import { useContext, useState, useEffect, useMemo } from 'react';
import { BigNumber } from 'ethers';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import Skeleton from '@material-ui/lab/Skeleton';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import WalletButton from 'components/WalletButton';
import ExerciseTableData from './ExerciseTableData';

import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import isZeroAddress from 'utils/contracts/isZeroAddress';

import styles from './styles.module.scss';

interface userExercisableOption {
  strikeIndex: number;
  strikePrice: number;
  depositedAmount: number;
  purchasedAmount: number;
  settleableAmount: BigNumber;
  totalPremiumsEarned: BigNumber;
  pnlAmount: BigNumber;
  isSettleable: boolean;
  isPastEpoch: boolean;
}

const ROWS_PER_PAGE = 5;

const ExerciseList = () => {
  const { accountAddress } = useContext(WalletContext);
  const { ssovUserData, ssovData, ssovEpochData, selectedEpoch, selectedSsov } =
    useContext(SsovContext);

  const [userExercisableOptions, setUserExercisableOptions] = useState<
    userExercisableOption[]
  >([]);
  const [page, setPage] = useState(0);

  const isPut = useMemo(() => selectedSsov.type === 'PUT', [selectedSsov]);

  const { currentEpoch, tokenPrice, tokenName } = ssovData;
  const {
    epochStrikes,
    totalEpochPremium,
    totalEpochStrikeDeposits,
    settlementPrice,
  } = ssovEpochData;
  const {
    epochStrikeTokens,
    userEpochStrikeDeposits,
    userEpochOptionsPurchased,
  } = ssovUserData;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => setPage(newPage);

  useEffect(() => {
    if (!accountAddress) return;

    (async function () {
      const userEpochStrikeTokenBalanceArray = epochStrikeTokens.length
        ? await Promise.all(
            epochStrikeTokens
              .map((token) => {
                if (isZeroAddress(token.address)) return null;
                return token.balanceOf(accountAddress);
              })
              .filter((c) => c)
          )
        : [];

      const userExercisableOptions = epochStrikes.map((strike, strikeIndex) => {
        const strikePrice = getUserReadableAmount(strike, 8);
        const depositedAmount =
          tokenName === 'BNB'
            ? getUserReadableAmount(userEpochStrikeDeposits[strikeIndex], 8)
            : getUserReadableAmount(userEpochStrikeDeposits[strikeIndex], 18);

        const purchasedAmount = getUserReadableAmount(
          userEpochOptionsPurchased[strikeIndex],
          18
        );
        const settleableAmount =
          userEpochStrikeTokenBalanceArray[strikeIndex] || BigNumber.from(0);
        const isSettleable =
          settleableAmount.gt(0) &&
          ((isPut && settlementPrice.lt(strike)) ||
            (!isPut && settlementPrice.gt(strike)));
        const isPastEpoch = selectedEpoch < currentEpoch;
        const pnlAmount = settlementPrice.isZero()
          ? isPut
            ? strike
                .sub(tokenPrice)
                .mul(userEpochOptionsPurchased[strikeIndex])
                .mul(1e10)
                .div(ssovData.lpPrice)
            : tokenPrice
                .sub(strike)
                .mul(userEpochOptionsPurchased[strikeIndex])
                .div(tokenPrice)
          : isPut
          ? strike
              .sub(settlementPrice)
              .mul(settleableAmount)
              .mul(1e10)
              .div(ssovData.lpPrice)
          : settlementPrice
              .sub(strike)
              .mul(userEpochOptionsPurchased[strikeIndex])
              .div(settlementPrice);
        const totalPremiumsEarned = userEpochStrikeDeposits[strikeIndex]
          .mul(totalEpochPremium[strikeIndex])
          .div(
            totalEpochStrikeDeposits[strikeIndex].isZero()
              ? BigNumber.from(1)
              : totalEpochStrikeDeposits[strikeIndex]
          );

        return {
          strikeIndex,
          strikePrice,
          depositedAmount,
          purchasedAmount,
          settleableAmount,
          totalPremiumsEarned,
          pnlAmount,
          isSettleable,
          isPastEpoch,
        };
      });

      setUserExercisableOptions(userExercisableOptions);
    })();
  }, [
    currentEpoch,
    selectedEpoch,
    epochStrikeTokens,
    accountAddress,
    epochStrikes,
    totalEpochStrikeDeposits,
    totalEpochPremium,
    userEpochStrikeDeposits,
    userEpochOptionsPurchased,
    tokenPrice,
    settlementPrice,
    tokenName,
    isPut,
    ssovData,
  ]);

  return selectedEpoch > 0 ? (
    <Box className="bg-cod-gray w-full p-4 rounded-xl">
      <Box className="flex flex-row justify-between mb-1">
        <Typography variant="h5" className="text-stieglitz">
          Your Options & Deposits
        </Typography>
        <Typography variant="h6" className="text-stieglitz">
          Epoch {selectedEpoch}
        </Typography>
      </Box>
      <Box className="balances-table text-white pb-4">
        <TableContainer className={cx(styles.optionsTable, 'bg-cod-gray')}>
          {!accountAddress ? (
            <Box className="p-4 flex items-center justify-center">
              <WalletButton size="medium" />
            </Box>
          ) : isEmpty(userExercisableOptions) ? (
            <Box className="border-4 border-umbra rounded-lg mt-2 p-3">
              {range(4).map((_, index) => (
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
                    <Typography variant="h6">Option</Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Strike Price
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      My Deposit
                    </Typography>
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
                      Exercisable
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Final PnL
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Premiums Earned
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    className="text-stieglitz bg-cod-gray border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={cx('rounded-lg')}>
                {userExercisableOptions
                  .slice(
                    page * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE + ROWS_PER_PAGE
                  )
                  ?.map(
                    ({
                      strikeIndex,
                      strikePrice,
                      depositedAmount,
                      purchasedAmount,
                      settleableAmount,
                      totalPremiumsEarned,
                      pnlAmount,
                      isSettleable,
                      isPastEpoch,
                    }) => {
                      return (
                        <ExerciseTableData
                          key={strikeIndex}
                          strikeIndex={strikeIndex}
                          strikePrice={strikePrice}
                          depositedAmount={depositedAmount}
                          purchasedAmount={purchasedAmount}
                          totalPremiumsEarned={totalPremiumsEarned}
                          pnlAmount={pnlAmount}
                          settleableAmount={settleableAmount}
                          isSettleable={isSettleable}
                          isPastEpoch={isPastEpoch}
                        />
                      );
                    }
                  )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {userExercisableOptions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="balances"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={userExercisableOptions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            className="text-stieglitz border-0 flex flex-grow justify-center"
            ActionsComponent={TablePaginationActions}
          />
        ) : null}
      </Box>
    </Box>
  ) : null;
};

export default ExerciseList;
