import React, { useCallback, useState, useMemo } from 'react';
import {
  Table,
  Box,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_STRIKE, ROWS_PER_PAGE } from 'constants/index';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { TablePaginationActions } from 'components/UI';

import { useBoundStore } from 'store';
import CustomMenuBox from 'components/common/CustomMenuBox';
import AllPositionsTable from './AllPositionsTable';
import { StyleTable, getHeaderCell } from 'components/common/LpCommon/Table';

const AllLpPositions = () => {
  const { slpEpochData, setSelectedPositionIdx } = useBoundStore();

  const [selectedStrikeIdx, setSelectedStrikeIdx] = useState(0);
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

  const filterSortStrike = useMemo(() => {
    return slpEpochData!.lpPositions.filter(
      (pos) =>
        selectedStrikeIdx === 0 ||
        pos.strike.eq(slpEpochData?.strikes[selectedStrikeIdx - 1]!)
    );
  }, [slpEpochData, selectedStrikeIdx]);

  const getDescStrikes = useMemo(() => {
    if (!slpEpochData) return [];
    let strikes: string[] = ['-'];
    slpEpochData.strikes.map((strike) => {
      strikes.push(
        `$${formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}`
      );
    });
    return strikes.map((strike, idx) => {
      return (
        <MenuItem
          value={idx}
          key={idx}
          className="text-stieglitz justify-around w-32"
        >
          {strike}
        </MenuItem>
      );
    });
  }, [slpEpochData]);

  return (
    <Box>
      <CustomMenuBox
        data={'Filter Strikes'}
        values={getDescStrikes}
        selectedValue={selectedStrikeIdx}
        handleOnChange={handleSelectStrike}
      />
      <Box className="balances-table text-white pb-4">
        <StyleTable>
          <Table>
            <TableHead className="bg-umbra">
              <TableRow className="bg-umbra">
                {getHeaderCell('Strike Price')}
                {getHeaderCell('Liquidity Available')}
                {getHeaderCell('Markup')}
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
                      strike={p.strike}
                      liquidity={p.liquidity}
                      markup={p.markup}
                      isFillModalOpen={isFillModalOpen}
                      isEpochExpired={slpEpochData!.isEpochExpired!}
                      handleFill={() => handleFill(idx)}
                      closeFillModal={closeFillModal}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </StyleTable>
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
