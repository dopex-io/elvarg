import { useCallback, useState, useMemo } from 'react';
import { BigNumber } from 'ethers';
import {
  Table,
  Box,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  MenuItem,
  Typography,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { HeaderCell, StyleTable } from 'components/common/LpCommon/Table';
import { TablePaginationActions } from 'components/UI';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DECIMALS_STRIKE, ROWS_PER_PAGE } from 'constants/index';

import AllPositionsTable from './AllPositionsTable';

const AllLpPositions = () => {
  const { olpData, olpEpochData, setSelectedPositionIdx } = useBoundStore();

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
        <MenuItem
          value={idx}
          key={idx}
          className="flex justify-center text-white text-center"
        >
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
    return olpEpochData!.lpPositions.filter(({ strike }) => {
      return filterStrikes(
        strike,
        selectedStrikeIdx || 0,
        olpEpochData!.strikes
      );
    });
  }, [olpEpochData, selectedStrikeIdx]);

  const strikesFilter = () => {
    return (
      <Box className="flex flex-col mb-3 w-32">
        <Typography
          variant="h6"
          className="mb-1 text-center text-md text-stieglitz"
        >
          <span className="text-sm">Filter Strikes</span>
        </Typography>
        <Select
          className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-1 text-white text-center text-md h-8 bg-gradient-to-r from-cyan-500 to-blue-700"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 224,
                width: 130,
              },
            },
            sx: {
              '.Mui-selected': {
                background:
                  'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
              },
            },
            classes: {
              paper: 'bg-mineshaft',
            },
            disableScrollLock: true,
          }}
          autoWidth
          value={getStrikes.length ? selectedStrikeIdx : ''}
          onChange={handleSelectStrike}
        >
          {getStrikes}
        </Select>
      </Box>
    );
  };

  return (
    <Box>
      {strikesFilter()}
      <Box className="balances-table text-white pb-4">
        <StyleTable>
          <Table>
            <TableHead className="bg-umbra">
              <TableRow className="bg-umbra">
                <HeaderCell title={'Strike Price'} />
                <HeaderCell title={'Liquidity Available'} />
                <HeaderCell title={'Discount'} />
                <HeaderCell title={'Actions'} />
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
                      underlyingSymbol={olpData?.underlyingSymbol!}
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
