import React, { useCallback, useState, useMemo } from 'react';
import {
  Table,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  MenuItem,
  Select,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_STRIKE, ROWS_PER_PAGE } from 'constants/index';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { Typography, TablePaginationActions } from 'components/UI';
import { BigNumber } from 'ethers';

import { useBoundStore } from 'store';

import AllPositionsTable from './AllPositionsTable';
import { getHeaderCell } from '../common/Table';

const AllLpPositions = () => {
  const { olpEpochData } = useBoundStore();

  const [selectedStrikeIdx, setSelectedStrikeIdx] = useState(0);
  const [_, setSelectedPositionIdx] = useState(0);
  const [isFillModalOpen, setIsFillModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);

  const handleFill = (originalIdxBeforeSort: number) => {
    if (!setSelectedPositionIdx) {
      return;
    }
    setSelectedPositionIdx(originalIdxBeforeSort);
    setIsFillModalOpen(true);
  };

  const closeFillModal = () => {
    setIsFillModalOpen(false);
  };

  const getStrikes = useMemo(() => {
    if (!olpEpochData) return [];
    let filterStrikes: string[] = ['-'];
    olpEpochData.strikes.map((strike) => {
      filterStrikes.push(
        `$${formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}`
      );
    });
    return filterStrikes;
  }, [olpEpochData]);

  const getMenuStrikes = getStrikes.map((strike, idx) => {
    return (
      <MenuItem value={idx} key={idx} className="text-stieglitz text-center">
        {strike}
      </MenuItem>
    );
  });

  const handleSelectStrike = useCallback(
    (e: SelectChangeEvent<number>) => {
      setPage(0);
      setSelectedStrikeIdx!(Number(e.target.value));
    },
    [setSelectedStrikeIdx]
  );

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  function strikesMenuBox(strikes: JSX.Element[]) {
    return (
      <Box className="flex flex-col mb-3 w-32">
        <Typography variant="h6" className="mb-1 text-gray-400 text-center">
          Filter SSOV Strikes
        </Typography>
        <Select
          className="text-white text-center text-md h-8 bg-gradient-to-r from-cyan-500 to-blue-700"
          MenuProps={{
            sx: {
              '.MuiMenu-paper': {
                background: 'black',
                color: 'white',
                fill: 'white',
              },
              '.Mui-selected': {
                background:
                  'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
              },
            },
          }}
          displayEmpty
          autoWidth
          value={selectedStrikeIdx || 0}
          onChange={handleSelectStrike}
        >
          {strikes}
        </Select>
      </Box>
    );
  }

  function filterStrikes(
    strike: BigNumber,
    selectedStrikeIdx: number,
    strikes: BigNumber[]
  ) {
    return (
      selectedStrikeIdx === 0 || strike.eq(strikes[selectedStrikeIdx - 1]!)
    );
  }

  const filterSortStrike = useMemo(() => {
    return olpEpochData!.lpPositions.filter((p) => {
      return filterStrikes(
        p.strike,
        selectedStrikeIdx || 0,
        olpEpochData!.strikes
      );
    });
  }, [olpEpochData, selectedStrikeIdx]);

  return (
    <Box>
      {strikesMenuBox(getMenuStrikes)}
      <Box className="balances-table text-white pb-4">
        <TableContainer className="rounded-xl">
          <Table>
            <TableHead className="bg-umbra">
              <TableRow className="bg-umbra">
                {getHeaderCell('Strike Price')}
                {getHeaderCell('Liquidity Available')}
                {getHeaderCell('Discount')}
                {getHeaderCell('Actions')}
              </TableRow>
            </TableHead>
            <TableBody className="rounded-lg">
              {filterSortStrike
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                ?.map((p, idx) => {
                  return (
                    <AllPositionsTable
                      key={idx}
                      originalIdxBeforeSort={idx}
                      strikePrice={p.strike}
                      liquidityProvided={p.liquidity}
                      discount={p.discount}
                      isFillModalOpen={isFillModalOpen}
                      isEpochExpired={olpEpochData!.isEpochExpired!}
                      handleFill={() => handleFill(idx)}
                      closeFillModal={closeFillModal}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {filterSortStrike.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={filterSortStrike?.length}
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

export default AllLpPositions;
