import { useContext, useState, useEffect } from 'react';
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
  exercisableAmount: BigNumber;
  pnlAmount: number;
  isExercisable: boolean;
  isPastEpoch: boolean;
}

const ExerciseList = ({ ssov }: { ssov: 'dpx' | 'rdpx' }) => {
  const context = useContext(SsovContext);
  const {
    currentEpoch,
    selectedEpoch,
    ssovData: { isVaultReady, epochStrikes },
    userSsovData: {
      epochStrikeTokens,
      userEpochStrikeDeposits,
      userEpochCallsPurchased,
    },
    tokenPrice,
  } = context[ssov];
  const { accountAddress } = useContext(WalletContext);
  const [userExercisableOptions, setUserExercisableOptions] = useState<
    userExercisableOption[]
  >([]);

  useEffect(() => {
    if (!accountAddress || !isVaultReady) return;

    (async function () {
      const userEpochStrikeTokenBalanceArray = await Promise.all(
        epochStrikeTokens
          .map((token) => {
            if (isZeroAddress(token.address)) return null;
            return token.balanceOf(accountAddress);
          })
          .filter((c) => c)
      );

      const userExercisableOptions = epochStrikes.map((strike, strikeIndex) => {
        const strikePrice = getUserReadableAmount(strike, 8);
        const depositedAmount = getUserReadableAmount(
          userEpochStrikeDeposits[strikeIndex],
          18
        );
        const purchasedAmount = getUserReadableAmount(
          userEpochCallsPurchased[strikeIndex],
          18
        );
        const exercisableAmount = userEpochStrikeTokenBalanceArray[strikeIndex];
        const isExercisable = exercisableAmount.gt(0) && tokenPrice.gt(strike);

        const isPastEpoch = selectedEpoch < currentEpoch;

        const pnlAmount =
          ((Number(tokenPrice.div(1e8)) - strikePrice) * purchasedAmount) /
          Number(tokenPrice.div(1e8));

        return {
          strikeIndex,
          strikePrice,
          depositedAmount,
          purchasedAmount,
          exercisableAmount,
          pnlAmount,
          isExercisable,
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
    userEpochStrikeDeposits,
    userEpochCallsPurchased,
    tokenPrice,
    isVaultReady,
  ]);

  const ROWS_PER_PAGE = 5;
  const [page, setPage] = useState(0);
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return selectedEpoch > 0 ? (
    <Box className="bg-cod-gray w-full p-4 rounded-xl">
      <Box className="flex flex-row justify-between mb-1">
        <Typography variant="h5" className="text-stieglitz">
          Your Exercisable Options
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
                      exercisableAmount,
                      pnlAmount,
                      isExercisable,
                      isPastEpoch,
                    }) => {
                      return (
                        <ExerciseTableData
                          key={strikeIndex}
                          strikeIndex={strikeIndex}
                          strikePrice={strikePrice}
                          depositedAmount={depositedAmount}
                          purchasedAmount={purchasedAmount}
                          pnlAmount={pnlAmount}
                          exercisableAmount={exercisableAmount}
                          isExercisable={isExercisable}
                          isPastEpoch={isPastEpoch}
                          ssov={ssov}
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
