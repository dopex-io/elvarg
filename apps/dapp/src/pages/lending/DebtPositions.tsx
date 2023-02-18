import React, { useState, useCallback, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import Box from '@mui/material/Box';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import { CustomButton } from 'components/UI';

import { useBoundStore } from 'store';
import { IDebtPosition } from 'store/Vault/lending';

import {
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  ROWS_PER_PAGE,
} from 'constants/index';

import { StyleContainer, StyleRow } from './Assets';
import RepayDialog from './RepayDialog';
import { getUserReadableAmount } from 'utils/contracts';

interface IDebtPositionTableData {
  selectedIndex: number;
  debt: IDebtPosition;
}

const DebtPositionTableData = ({
  selectedIndex,
  debt,
}: IDebtPositionTableData) => {
  const { epoch, underlyingSymbol, strike, supplied, borrowed } = debt;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <StyleRow>
      <TableCell align="left">
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
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">{epoch}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">
          ${formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(supplied, DECIMALS_TOKEN), 2)}{' '}
          {underlyingSymbol}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(borrowed, DECIMALS_TOKEN))} 2CRV
        </Typography>
      </TableCell>
      <TableCell align="right">
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
      </TableCell>
    </StyleRow>
  );
};

const DebtPositions = () => {
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
    <>
      <Typography variant="h4" color="white" className="my-2 mb-4">
        Debt Positions
      </Typography>
      <Box className="bg-cod-gray px-2 mt-2 border-radius rounded-lg">
        <StyleContainer>
          {isEmpty(userDebtPositions) ? (
            <Box className="text-stieglitz text-center p-10">
              Your debt positions will appear here.
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Collateral Asset
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Epoch
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Strike
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Supplied
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Borrowed
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              {debts
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                ?.map((debt: IDebtPositionTableData, i: number) => (
                  <TableBody key={i} className="rounded-lg bg-umbra">
                    <DebtPositionTableData
                      key={i}
                      selectedIndex={i}
                      debt={debt.debt}
                    />
                  </TableBody>
                ))}
            </Table>
          )}
        </StyleContainer>
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
    </>
  );
};

export default DebtPositions;
