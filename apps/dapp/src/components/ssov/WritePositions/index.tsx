import React, { useCallback, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import isEmpty from 'lodash/isEmpty';
import { useBoundStore } from 'store';

import { SsovV3Data, WritePositionInterface } from 'store/Vault/ssov';

import TablePaginationActions from 'components/UI/TablePaginationActions';
import Typography from 'components/UI/Typography';

import ClaimDialog from './Dialogs/ClaimDialog';
import TransferDialog from './Dialogs/TransferDialog';
import WithdrawDialog from './Dialogs/WithdrawDialog';
import WritePositionTableData from './WritePositionData';

const StyledContainer = styled(TableContainer)`
  td {
    border: none !important;
  }

  table {
    border-collapse: separate !important;
    border-spacing: 0 0.5em !important;
  }

  td {
    border: solid 1px #000;
    border-style: solid none;
    padding: 10px 16px;
  }

  td:first-child {
    border-left-style: solid;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  td:last-child {
    border-right-style: solid;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
`;

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
  'Utilization',
  // 'Estimated Return',
  'Actions',
];

const WritePositions = (props: { className?: string }) => {
  const { className } = props;

  const {
    selectedEpoch,
    ssovV3UserData: ssovUserData,
    ssovData,
    ssovEpochData,
    ssovSigner,
  } = useBoundStore();

  const { collateralSymbol } = ssovData as SsovV3Data;

  const [page, setPage] = useState(0);

  const sendTx = useSendTx();

  // Filtered out positions with zero collateral
  const filteredWritePositions = useMemo(() => {
    return (
      ssovUserData?.writePositions.filter(
        (position) =>
          !position.collateralAmount.isZero() &&
          selectedEpoch === position.epoch
      ) || []
    );
  }, [ssovUserData, selectedEpoch]);

  const [dialog, setDialog] = useState<null | {
    open: boolean;
    type: 'WITHDRAW' | 'TRANSFER' | 'CLAIM';
    data: WritePositionInterface;
  }>({
    open: false,
    type: 'WITHDRAW',
    data: {
      collateralAmount: BigNumber.from(0),
      strike: BigNumber.from(0),
      accruedRewards: [BigNumber.from(0)],
      accruedPremiums: BigNumber.from(0),
      epoch: 0,
      tokenId: BigNumber.from(0),
      utilization: BigNumber.from(0),
      stakeRewardAmounts: [],
      stakeRewardTokens: [],
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

  const handleStake = useCallback(
    async (tokenId: BigNumber) => {
      if (
        ssovSigner?.ssovStakingRewardsWithSigner &&
        ssovSigner?.ssovContractWithSigner
      ) {
        await sendTx(ssovSigner?.ssovStakingRewardsWithSigner, 'stake', [
          ssovSigner?.ssovContractWithSigner.address,
          tokenId,
        ]);
        try {
        } catch (err) {
          console.error(err);
        }
      }
    },
    [
      ssovSigner?.ssovStakingRewardsWithSigner,
      sendTx,
      ssovSigner?.ssovContractWithSigner,
    ]
  );

  return Number(selectedEpoch) > 0 ? (
    <Box className={cx('bg-cod-gray w-full p-4 rounded-xl', className)}>
      {dialog && dialog.type === 'WITHDRAW' && (
        <WithdrawDialog {...dialog} handleClose={handleClose} />
      )}
      {dialog && dialog.type === 'TRANSFER' && (
        <TransferDialog {...dialog} handleClose={handleClose} />
      )}
      {dialog && dialog.type === 'CLAIM' && (
        <ClaimDialog {...dialog} handleClose={handleClose} />
      )}

      <Box className="flex flex-row justify-between mb-1">
        <Typography variant="h5" className="text-stieglitz">
          Write Positions
        </Typography>
      </Box>
      <Box className="balances-table text-white pb-4">
        <StyledContainer className="bg-cod-gray">
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

                    const openClaim = () => {
                      setDialog({ open: true, type: 'CLAIM', data: o });
                    };

                    const _handleStake = () => {
                      handleStake(o.tokenId);
                    };

                    // only display positions for selected epoch
                    return o.epoch === selectedEpoch ? (
                      <WritePositionTableData
                        key={i}
                        {...o}
                        ssovAddress={ssovData?.ssovContract?.address}
                        collateralSymbol={collateralSymbol || ''}
                        openTransfer={openTransfer}
                        openWithdraw={openWithdraw}
                        handleStakedPosition={
                          o.stakingRewardsPosition?.staked
                            ? openClaim
                            : _handleStake
                        }
                        rewardTokens={ssovEpochData?.rewardTokens || []}
                        epochExpired={ssovEpochData?.isEpochExpired || false}
                      />
                    ) : null;
                  })}
              </TableBody>
            </Table>
          )}
        </StyledContainer>
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
