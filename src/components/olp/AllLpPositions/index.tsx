import React, { useCallback, useState, useContext, useMemo } from 'react';
import {
  Table,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TablePagination,
  MenuItem,
  Select,
} from '@mui/material';
import { LpPositionInterface, OlpContext } from 'contexts/Olp';
import { SelectChangeEvent } from '@mui/material/Select';
import formatAmount from 'utils/general/formatAmount';
import { DEFAULT_STRIKE_DECIMALS, ROWS_PER_PAGE } from 'constants/index';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { Typography, TablePaginationActions } from 'components/UI';
import { BigNumber } from 'ethers';
import AllPositionsTable from './AllPositionsTable';

const AllLpPositions = () => {
  const {
    olpData,
    olpEpochData,
    selectedEpoch,
    selectedStrikeIdx,
    setSelectedStrikeIdx,
    setSelectedPositionIdx,
  } = useContext(OlpContext);
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
        `$${formatAmount(
          getUserReadableAmount(strike, DEFAULT_STRIKE_DECIMALS),
          2
        )}`
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
      // border rounded-tl-lg border-neutral-800 p-2 ml-3
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
    p: LpPositionInterface,
    selectedEpoch: number,
    selectedStrikeIdx: number,
    strikes: BigNumber[]
  ) {
    if (p.killed) return false;
    else if (p.epoch.toNumber() !== selectedEpoch) return false;
    // return true if user is not filtering any strike or
    // strike selected matches the given position's strike
    return (
      selectedStrikeIdx === 0 || p.strike.eq(strikes[selectedStrikeIdx - 1]!)
    );
  }

  const filterSortStrike = useMemo(() => {
    const filteredPositions = olpEpochData!.lpPositions
      .map((p, idx) => ({ p, idx }))
      .filter((p) => {
        return filterStrikes(
          p.p,
          selectedEpoch || 0,
          selectedStrikeIdx || 0,
          olpEpochData!.strikes
        );
      });
    return filteredPositions.sort(
      (a, b) => a.p.discount.toNumber() - b.p.discount.toNumber()
    );
  }, [olpEpochData, selectedEpoch, selectedStrikeIdx]);

  return (
    <Box>
      {strikesMenuBox(getMenuStrikes)}
      <Box className="balances-table text-white pb-4">
        <TableContainer className="rounded-xl">
          <Table>
            <TableHead className="bg-umbra ">
              <TableRow className="bg-umbra">
                <TableCell
                  align="right"
                  className="text-stieglitz bg-cod-gray border-0 pb-3"
                >
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-center"
                  >
                    Strike Price
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  className="text-stieglitz bg-cod-gray border-0 pb-3"
                >
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-center"
                  >
                    Liquidity Available
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  className="text-stieglitz bg-cod-gray border-0 pb-3"
                >
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-center"
                  >
                    Discount
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className="text-stieglitz bg-cod-gray border-0 pb-3"
                >
                  <Typography variant="h6" className="text-stieglitz">
                    Actions
                  </Typography>
                </TableCell>
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
                      lpId={p.p.lpId.toNumber()}
                      originalIdxBeforeSort={p.idx}
                      option={olpData!.tokenName}
                      strikePrice={p.p.strike}
                      liquidityProvided={p.p.liquidity}
                      liquidityUsed={p.p.liquidityUsed}
                      discount={p.p.discount}
                      purchased={p.p.purchased}
                      isFillModalOpen={isFillModalOpen}
                      handleFill={() => handleFill(p.idx)}
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
