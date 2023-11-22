import { useCallback, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import {
  Box,
  Input,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useBoundStore } from 'store';

import {
  StyleLeftTableCell,
  StyleRightTableCell,
  StyleTable,
  StyleTableCell,
} from 'components/common/LpCommon/Table';
import AllPositionsTable from 'components/olp/AllLpPositions/AllPositionsTable';
import { Typography } from 'components/UI';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE } from 'constants/index';

const AllLpPositions = () => {
  const { olpData, olpEpochData, setSelectedPositionIdx } = useBoundStore();

  const [selectedStrikeIdx, setSelectedStrikeIdx] = useState<number>(0);

  const handleFill = (positionIdx: number) => {
    if (!setSelectedPositionIdx) {
      return;
    }
    setSelectedPositionIdx(positionIdx);
  };

  const getStrikes = useMemo(() => {
    if (!olpEpochData) return [];
    let filterStrikes: string[] = ['Filter strikes'];
    olpEpochData.strikes.map((strike) => {
      filterStrikes.push(
        `$${formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}`,
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
      setSelectedStrikeIdx!(Number(e.target.value));
    },
    [setSelectedStrikeIdx],
  );

  function filterStrikes(
    strike: BigNumber,
    selectedStrikeIdx: number,
    strikes: BigNumber[],
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
        olpEpochData!.strikes,
      );
    });
  }, [olpEpochData, selectedStrikeIdx]);

  return (
    <Box>
      <Typography variant="h5">All LP Positions</Typography>
      <Box className="mt-2 border-radius rounded-lg">
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
                <StyleLeftTableCell align="left" className="flex flex-row">
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
                </StyleLeftTableCell>
                <StyleTableCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Liquidity Available
                  </Typography>
                </StyleTableCell>
                <StyleTableCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Discount
                  </Typography>
                </StyleTableCell>
                <StyleRightTableCell align="right">
                  <Typography variant="caption" color="stieglitz">
                    Action
                  </Typography>
                </StyleRightTableCell>
              </TableRow>
            </TableHead>
            <TableBody className="rounded-lg">
              {filterSortStrike?.map((p, idx) => {
                return (
                  <AllPositionsTable
                    key={idx}
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
      </Box>
    </Box>
  );
};

export default AllLpPositions;
