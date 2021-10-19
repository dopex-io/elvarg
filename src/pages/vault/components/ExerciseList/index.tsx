import { useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
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
  exercisableAmount: number;
  isExercisable: boolean;
  isPastEpoch: boolean;
}

const ExerciseList = () => {
  const {
    currentEpoch,
    selectedEpoch,
    selectedEpochSsovData: {
      isVaultReady,
      epochStrikes,
      epochStrikeTokens,
      userEpochStrikeDeposits,
      userEpochCallsPurchased,
    },
    dpxTokenPrice,
  } = useContext(SsovContext);
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
        const exercisableAmount = getUserReadableAmount(
          userEpochStrikeTokenBalanceArray[strikeIndex],
          18
        );
        const isExercisable = exercisableAmount > 0 && dpxTokenPrice.gt(strike);
        const isPastEpoch = selectedEpoch < currentEpoch;

        return {
          strikeIndex,
          strikePrice,
          depositedAmount,
          purchasedAmount,
          exercisableAmount,
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
    dpxTokenPrice,
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
        <TableContainer
          className={cx(styles.optionsTable, 'overflow-x-hidden bg-cod-gray')}
        >
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
                        exercisableAmount={exercisableAmount}
                        isExercisable={isExercisable}
                        isPastEpoch={isPastEpoch}
                      />
                    );
                  }
                )}
            </TableBody>
          </Table>
        </TableContainer>
        {userExercisableOptions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
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
