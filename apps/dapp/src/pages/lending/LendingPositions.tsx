import React, { useState, useCallback, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

import { useBoundStore } from 'store';
import { IDebtPosition, ISsovPosition } from 'store/Vault/lending';

import {
  TablePaginationActions,
  Typography,
  CustomButton,
} from 'components/UI';

import formatAmount from 'utils/general/formatAmount';
import { getUserReadableAmount } from 'utils/contracts';

import {
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  ROWS_PER_PAGE,
} from 'constants/index';

import RepayDialog from './RepayDialog';
import {
  BodyCell,
  StyleCell,
  StyleLeftCell,
  StyleLeftTableCell,
  StyleRightCell,
  StyleRightTableCell,
  StyleTable,
  StyleTableCell,
} from 'components/common/LpCommon/Table';
import { StyleContainer } from './Assets';

const SsovPositionTableData = ({ pos }: ISsovPosition) => {
  const { epoch, underlyingSymbol, strike, collateralAmount } = pos;

  return (
    <TableRow className="text-white bg-cod-gray mb-2 rounded-lg w-full">
      <StyleLeftCell align="left">
        <Box className="flex flex-row">
          <img
            className="-ml-1 w-7 h-7"
            src={`/images/tokens/${underlyingSymbol?.toLowerCase()}.svg`}
            alt={`${underlyingSymbol}`}
          />
          <Typography variant="h6" color="white" className="ml-3 my-auto">
            {underlyingSymbol}
          </Typography>
        </Box>
      </StyleLeftCell>
      <StyleCell align="left">
        <Typography variant="h6">{epoch}</Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6">${formatAmount(strike, 2)}</Typography>
      </StyleCell>
      <StyleRightCell align="right">
        <Typography variant="h6">
          ${formatAmount(collateralAmount, 2)}
        </Typography>
      </StyleRightCell>
    </TableRow>
  );
};

export const LendingPositions = () => {
  const { userSsovPositions } = useBoundStore();

  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  return (
    <Box className="flex flex-col w-full">
      <Typography variant="h4" color="white" className="my-2 mb-4">
        Lending Positions
      </Typography>
      {/* className="bg-cod-gray px-2 mt-2 border-radius rounded-lg w-full" */}
      <Box>
        {isEmpty(userSsovPositions) ? (
          <Box className="text-stieglitz text-center p-10">
            Your lending positions will appear here.
          </Box>
        ) : (
          <StyleTable className="py-2">
            <Table>
              <TableHead className="bg-cod-gray">
                <TableRow>
                  <StyleLeftTableCell align="left">
                    <Typography variant="h6" color="stieglitz">
                      Asset
                    </Typography>
                  </StyleLeftTableCell>
                  <StyleTableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Epoch
                    </Typography>
                  </StyleTableCell>
                  <StyleTableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Strike
                    </Typography>
                  </StyleTableCell>
                  <StyleRightTableCell align="right" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Collateral Amount
                    </Typography>
                  </StyleRightTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="rounded-lg bg-umbra w-full">
                {userSsovPositions
                  .slice(
                    page * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE + ROWS_PER_PAGE
                  )
                  ?.map((pos, i: number) => (
                    <SsovPositionTableData key={i} pos={pos} />
                  ))}
              </TableBody>
            </Table>
          </StyleTable>
        )}
        {userSsovPositions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={userSsovPositions?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            className="text-stieglitz border-0 flex flex-grow justify-center"
            ActionsComponent={TablePaginationActions}
          />
        ) : null}
      </Box>
    </Box>
  );
};
