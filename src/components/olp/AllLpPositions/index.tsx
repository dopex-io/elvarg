import { useCallback, useState, useMemo } from 'react';
import { BigNumber } from 'ethers';
import {
  Box,
  TableHead,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  MenuItem,
  Input,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { HeaderCell, StyleTable } from 'components/common/LpCommon/Table';
import { TablePaginationActions, Typography } from 'components/UI';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DECIMALS_STRIKE, ROWS_PER_PAGE } from 'constants/index';

import AllPositionsTable from './AllPositionsTable';

const StyleCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-bottom: 1px solid #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleLeftCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-left: 1px solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleRightCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-right: 1px solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const AllLpPositions = () => {
  const { olpData, olpEpochData, setSelectedPositionIdx } = useBoundStore();

  const [selectedStrikeIdx, setSelectedStrikeIdx] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState<number>(0);

  const handleFill = (positionIdx: number) => {
    if (!setSelectedPositionIdx) {
      return;
    }
    setAnchorEl(true);
    setSelectedPositionIdx(positionIdx);
  };

  const getStrikes = useMemo(() => {
    if (!olpEpochData) return [];
    let filterStrikes: string[] = ['Filter strikes'];
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
          className="flex justify-around text-white text-center"
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

  return (
    <Box>
      <Typography variant="h5">All LP Positions</Typography>
      <Box className="bg-cod-gray p-2 mt-2 border-radius rounded-lg">
        <Box className="flex flex-col w-[140px] mb-3">
          <Select
            className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-1 text-white text-center text-sm h-8"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 224,
                  width: 130,
                },
              },
              classes: {
                paper: 'bg-mineshaft',
              },
            }}
            classes={{
              icon: 'text-white text-md',
              select: 'overflow-hidden',
            }}
            autoWidth
            fullWidth
            input={<Input />}
            variant="outlined"
            disableUnderline
            value={getStrikes.length ? selectedStrikeIdx : ''}
            onChange={handleSelectStrike}
          >
            {getStrikes}
          </Select>
        </Box>
        <StyleTable>
          <Table>
            <TableHead className="bg-cod-gray">
              <TableRow>
                <StyleLeftCell align="left" className="flex flex-row">
                  <ArrowDownwardIcon
                    sx={{
                      width: '1.25rem',
                      marginTop: '0.125rem',
                      marginLeft: '-8px',
                      color: '#8E8E8E',
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="stieglitz"
                    className="mt-1.5"
                  >
                    Strike
                  </Typography>
                </StyleLeftCell>
                <StyleCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Liquidity Available
                  </Typography>
                </StyleCell>
                <StyleCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Discount
                  </Typography>
                </StyleCell>
                <StyleRightCell align="right">
                  <Typography variant="caption" color="stieglitz">
                    Action
                  </Typography>
                </StyleRightCell>
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
                      anchorEl={anchorEl}
                      setAnchorEl={setAnchorEl}
                      positionIdx={p.idx}
                      strikePrice={p.strike}
                      usdLiquidity={p.usdLiquidity}
                      underlyingLiquidity={p.underlyingLiquidity}
                      discount={p.discount}
                      isEpochExpired={olpEpochData!.isEpochExpired!}
                      handleFill={() => handleFill(p.idx)}
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
