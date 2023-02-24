import React, { useState, useCallback, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

import { useBoundStore } from 'store';
import { IDebtPosition } from 'store/Vault/lending';

import {
  TablePaginationActions,
  Typography,
  CustomButton,
} from 'components/UI';

import formatAmount from 'utils/general/formatAmount';
import { getUserReadableAmount } from 'utils/contracts';

import { DECIMALS_TOKEN, ROWS_PER_PAGE } from 'constants/index';

import RepayDialog from './RepayDialog';
import {
  StyleCell,
  StyleLeftCell,
  StyleLeftTableCell,
  StyleRightCell,
  StyleRightTableCell,
  StyleTable,
  StyleTableCell,
} from 'components/common/LpCommon/Table';

interface IDebtPositionTableData {
  selectedIndex: number;
  debt: IDebtPosition;
}

const DebtPositionTableData = ({
  selectedIndex,
  debt,
}: IDebtPositionTableData) => {
  const { underlyingSymbol, supplied, borrowed } = debt;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(supplied, DECIMALS_TOKEN), 2)}{' '}
          {underlyingSymbol}
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(borrowed, DECIMALS_TOKEN), 2)}{' '}
          2CRV
        </Typography>
      </StyleCell>
      <StyleRightCell align="right">
        <CustomButton
          className="cursor-pointer text-white"
          color="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Repay
        </CustomButton>
        {anchorEl && (
          <RepayDialog
            key={selectedIndex}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            debt={debt}
          />
        )}
      </StyleRightCell>
    </TableRow>
  );
};

export const DebtPositions = () => {
  const { userDebtPositions } = useBoundStore();

  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const debts: IDebtPositionTableData[] = useMemo(() => {
    return userDebtPositions.map((debt, idx) => {
      return {
        selectedIndex: idx,
        debt: {
          id: debt?.id,
          epoch: debt?.epoch,
          expiry: debt?.expiry,
          underlyingSymbol: debt?.underlyingSymbol,
          strike: debt?.strike,
          supplied: debt?.supplied,
          borrowed: debt?.borrowed,
        },
      } as IDebtPositionTableData;
    });
  }, [userDebtPositions]);

  return (
    <Box className="flex flex-col w-full">
      <Typography variant="h4" color="white" className="my-2 mb-4">
        Debt Positions
      </Typography>
      <Box>
        {isEmpty(userDebtPositions) ? (
          <Box className="text-stieglitz text-center p-10">
            Your debt positions will appear here.
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
                      Supplied
                    </Typography>
                  </StyleTableCell>
                  <StyleTableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Borrowed
                    </Typography>
                  </StyleTableCell>
                  <StyleRightTableCell align="right" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Action
                    </Typography>
                  </StyleRightTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="rounded-lg bg-umbra w-full">
                {debts
                  .slice(
                    page * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE + ROWS_PER_PAGE
                  )
                  ?.map((debt: IDebtPositionTableData, i: number) => (
                    <DebtPositionTableData
                      key={i}
                      selectedIndex={i}
                      debt={debt.debt}
                    />
                  ))}
              </TableBody>
            </Table>
          </StyleTable>
        )}
        {userDebtPositions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={userDebtPositions?.length}
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
