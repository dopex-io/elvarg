import React, { useContext, useState, useCallback, useMemo } from 'react';
import { BigNumber } from 'ethers';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import WritePositionTableData from './WritePositionData';
import TransferDialog from './Dialogs/TransferDialog';
import WithdrawDialog from './Dialogs/WithdrawDialog';

import {
  SsovV3Context,
  SsovV3Data,
  WritePositionInterface,
} from 'contexts/SsovV3';

import styles from './styles.module.scss';

const ROWS_PER_PAGE = 5;
const TableColumnHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <TableCell
      align="left"
      className="text-stieglitz bg-cod-gray border-0 pb-0"
    >
      <Typography variant="h6" className="text-stieglitz">
        {children}
      </Typography>
    </TableCell>
  );
};

const COLUMN_HEADERS = [
  'Strike Price',
  'Epoch',
  'Deposit Amount',
  'Accrued Premiums',
  'Accrued Rewards',
  'Estimated Return',
  'Actions',
];

const WritePositions = (props: { className?: string }) => {
  const { className } = props;

  const { selectedEpoch, ssovUserData, ssovData, ssovEpochData } =
    useContext(SsovV3Context);

  const { collateralSymbol, isCurrentEpochExpired } = ssovData as SsovV3Data;

  const [page, setPage] = useState(0);

  // Filtered out positions with zero collateral
  const filteredWritePositions = useMemo(() => {
    return (
      ssovUserData?.writePositions.filter(
        (position) => !position.collateralAmount.isZero()
      ) || []
    );
  }, [ssovUserData]);

  const [dialog, setDialog] = useState<null | {
    open: boolean;
    type: 'WITHDRAW' | 'TRANSFER';
    data: WritePositionInterface;
  }>({
    open: false,
    type: 'WITHDRAW',
    data: {
      collateralAmount: BigNumber.from(0),
      strike: BigNumber.from(0),
      accruedRewards: [BigNumber.from(0)],
      accruedPremiums: BigNumber.from(0),
      estimatedPnl: BigNumber.from(0),
      epoch: 0,
      tokenId: BigNumber.from(0),
    },
  });

  const handleClose = useCallback(() => {
    setDialog(null);
  }, []);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  return Number(selectedEpoch) > 0 ? (
    <Box className={cx('bg-cod-gray w-full p-4 rounded-xl', className)}>
      {dialog ? (
        dialog.type === 'WITHDRAW' ? (
          <WithdrawDialog {...dialog} handleClose={handleClose} />
        ) : (
          <TransferDialog {...dialog} handleClose={handleClose} />
        )
      ) : null}
      <Box className="flex flex-row justify-between mb-1">
        <Typography variant="h5" className="text-stieglitz">
          Write Positions
        </Typography>
      </Box>
      <Box className="balances-table text-white pb-4">
        <TableContainer className={cx(styles['optionsTable'], 'bg-cod-gray')}>
          {isEmpty(filteredWritePositions) ? (
            <Box className="text-stieglitz text-center">
              Your write positions will appear here.
            </Box>
          ) : (
            <Table>
              <TableHead className="bg-umbra">
                <TableRow className="bg-umbra">
                  {COLUMN_HEADERS.map((header) => {
                    return (
                      <TableColumnHeader key={header}>
                        {header}
                      </TableColumnHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody className={cx('rounded-lg')}>
                {filteredWritePositions
                  .slice(
                    page * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE + ROWS_PER_PAGE
                  )
                  ?.map((o: WritePositionInterface, i: number) => {
                    const openTransfer = () => {
                      setDialog({ open: true, type: 'TRANSFER', data: o });
                    };
                    const openWithdraw = () => {
                      setDialog({ open: true, type: 'WITHDRAW', data: o });
                    };
                    return (
                      <WritePositionTableData
                        key={i}
                        {...o}
                        collateralSymbol={collateralSymbol || ''}
                        openTransfer={openTransfer}
                        openWithdraw={openWithdraw}
                        rewardTokens={ssovEpochData?.rewardTokens || []}
                        isExpired={isCurrentEpochExpired || false}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {filteredWritePositions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={filteredWritePositions?.length}
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

export default WritePositions;
