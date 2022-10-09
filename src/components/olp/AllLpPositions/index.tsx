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
import { BigNumber } from 'ethers';

import { useBoundStore } from 'store';
import AllPositionsTable from './AllPositionsTable';
import { getHeaderCell, StyleTable } from 'components/common/LpCommon/Table';
import CustomMenuBox from 'components/common/CustomMenuBox';

const AllLpPositions = () => {
  const { olpEpochData, selectedPoolName, setSelectedPositionIdx } =
    useBoundStore();

  const [selectedStrikeIdx, setSelectedStrikeIdx] = useState<number>(0);
  const [isFillModalOpen, setIsFillModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const handleFill = (positionIdx: number) => {
    if (!setSelectedPositionIdx) {
      return;
    }
    setSelectedPositionIdx(positionIdx);
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
    return filterStrikes.map((strike, idx) => {
      return (
        <MenuItem value={idx} key={idx} className="text-stieglitz text-center">
          {strike}
        </MenuItem>
      );
    });
  }, [olpEpochData]);

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
      <CustomMenuBox
        data={'Filter Strikes'}
        values={getStrikes}
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
                      positionIdx={p.idx}
                      strikePrice={p.strike}
                      usdLiquidity={p.usdLiquidity}
                      underlyingLiquidity={p.underlyingLiquidity}
                      discount={p.discount}
                      isFillModalOpen={isFillModalOpen}
                      isEpochExpired={olpEpochData!.isEpochExpired!}
                      handleFill={() => handleFill(p.idx)}
                      closeFillModal={closeFillModal}
                      selectedPoolName={selectedPoolName}
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
