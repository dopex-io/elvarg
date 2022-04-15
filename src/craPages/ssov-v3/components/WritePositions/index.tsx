import React, { useContext, useState, useCallback } from 'react';
import { BigNumber, utils } from 'ethers';
import cx from 'classnames';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import isEmpty from 'lodash/isEmpty';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';

import { SsovV3Context, WritePositionInterface } from 'contexts/SsovV3';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import styles from './styles.module.scss';

const WritePositionTableData = (props: WritePositionInterface) => {
  const { strike, collateralAmount, epoch, accruedPremiums, accruedRewards } =
    props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img src={'/assets/eth.svg'} alt="WETH" />
          </Box>
          <Typography variant="h5" className="text-white">
            WETH
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">
          ${formatAmount(getUserReadableAmount(strike, 8), 5)}
        </Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(collateralAmount, 18), 5)} WETH
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h6">
          {utils.formatEther(accruedPremiums)} WETH
        </Typography>
      </TableCell>
      <TableCell>
        {accruedRewards.map((rewards, index) => {
          return (
            <Typography variant="h6" key={index}>
              {utils.formatEther(rewards)} DPX
            </Typography>
          );
        })}
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{epoch}</Typography>
      </TableCell>
    </TableRow>
  );
};

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
  'Option',
  'Strike Price',
  'Deposit Amount',
  'Accrued Premiums',
  'Accrued Rewards',
  'Epoch',
];

const WritePositions = (props: { className?: string }) => {
  const { className } = props;

  const { selectedEpoch, ssovUserData } = useContext(SsovV3Context);

  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  return selectedEpoch > 0 ? (
    <Box className={cx('bg-cod-gray w-full p-4 rounded-xl', className)}>
      <Box className="flex flex-row justify-between mb-1">
        <Typography variant="h5" className="text-stieglitz">
          Write Positions
        </Typography>
      </Box>
      <Box className="balances-table text-white pb-4">
        <TableContainer className={cx(styles.optionsTable, 'bg-cod-gray')}>
          {isEmpty(ssovUserData.writePositions) ? (
            <Box className="border-4 border-umbra rounded-lg mt-2 p-3">
              Nothing here
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
                {ssovUserData.writePositions
                  .slice(
                    page * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE + ROWS_PER_PAGE
                  )
                  ?.map((o, i) => {
                    return <WritePositionTableData key={i} {...o} />;
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {ssovUserData.writePositions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={ssovUserData.writePositions.length}
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
