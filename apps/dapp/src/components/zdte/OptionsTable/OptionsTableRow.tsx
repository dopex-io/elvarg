import { Box, TableRow } from '@mui/material';

import { ISpreadPair, OptionsTableData } from 'store/Vault/zdte';

import { Typography } from 'components/UI';
import {
  StyleCell,
  StyleLeftCell,
  StyleLeftTableCell,
  StyleRightCell,
  StyleRightTableCell,
  StyleTableCellHeader,
} from 'components/common/LpCommon/Table';
import OptionsTableButton from 'components/zdte/OptionsTable/OptionsTableButton';

import { formatAmount } from 'utils/general';

export const FormatDollarColor = ({ value }: { value: number }) => {
  const formatedVal = Number(formatAmount(Math.abs(value), 2));
  if (value > 0) {
    return (
      <Typography variant="h6" color="up-only">
        {`$${formatedVal}`}
      </Typography>
    );
  } else if (value < 0) {
    return (
      <Typography variant="h6" color="down-bad">
        {`-$${Math.abs(formatedVal)}`}
      </Typography>
    );
  } else {
    return (
      <Typography variant="h6" color="white">
        {`$${formatedVal}`}
      </Typography>
    );
  }
};

export const FormatPercentColor = ({ value }: { value: number }) => {
  if (value > 0) {
    return (
      <Typography variant="h6" color="up-only">
        {`${value}%`}
      </Typography>
    );
  } else if (value < 0) {
    return (
      <Typography variant="h6" color="down-bad">
        {`-${Math.abs(value)}%`}
      </Typography>
    );
  } else {
    return (
      <Typography variant="h6" color="white">
        {`${value}%`}
      </Typography>
    );
  }
};

export const OptionsTableRow = ({
  tokenPrice,
  optionsStats,
  selectedSpreadPair,
  idx,
  handleSelectLongStrike,
}: {
  tokenPrice: number;
  optionsStats: OptionsTableData;
  selectedSpreadPair: ISpreadPair | undefined;
  idx: number;
  handleSelectLongStrike: (longStrike: number) => void;
}) => {
  return (
    <TableRow key={idx} className="text-white mb-2 rounded-lg">
      <StyleLeftCell align="left">
        <Box className="flex flex-row items-center w-max">
          <Typography variant="h6" color="white" className="capitalize">
            ${formatAmount(optionsStats.strike)}
          </Typography>
        </Box>
      </StyleLeftCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          ${formatAmount(optionsStats.breakeven)}
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          {optionsStats.breakevenPercentage}%
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <FormatPercentColor value={optionsStats.changePercentage} />
      </StyleCell>
      <StyleCell align="left">
        <FormatDollarColor value={optionsStats.change} />
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          ${optionsStats.premium}
        </Typography>
      </StyleCell>
      <StyleRightCell align="right" className="pt-2">
        <OptionsTableButton
          tokenPrice={tokenPrice}
          optionsStats={optionsStats}
          selectedSpreadPair={selectedSpreadPair}
          handleSelectLongStrike={handleSelectLongStrike}
        />
      </StyleRightCell>
    </TableRow>
  );
};

export const OptionsTableRowLower = ({
  tokenPrice,
  optionsStats,
  selectedSpreadPair,
  idx,
  handleSelectLongStrike,
}: {
  tokenPrice: number;
  optionsStats: OptionsTableData;
  selectedSpreadPair: ISpreadPair | undefined;
  idx: number;
  handleSelectLongStrike: (longStrike: number) => void;
}) => {
  return (
    <TableRow key={idx} className="text-white mb-2 rounded-lg">
      <StyleLeftTableCell align="left">
        <Box className="flex flex-row items-center w-max">
          <Typography variant="h6" color="white" className="capitalize">
            ${formatAmount(optionsStats.strike)}
          </Typography>
        </Box>
      </StyleLeftTableCell>
      <StyleTableCellHeader>
        <Typography variant="h6" color="white">
          ${formatAmount(optionsStats.breakeven)}
        </Typography>
      </StyleTableCellHeader>
      <StyleTableCellHeader>
        <Typography variant="h6" color="white">
          {optionsStats.breakevenPercentage}%
        </Typography>
      </StyleTableCellHeader>
      <StyleTableCellHeader>
        <FormatPercentColor value={optionsStats.changePercentage} />
      </StyleTableCellHeader>
      <StyleTableCellHeader>
        <FormatDollarColor value={optionsStats.change} />
      </StyleTableCellHeader>
      <StyleTableCellHeader>
        <Typography variant="h6" color="white">
          ${optionsStats.premium}
        </Typography>
      </StyleTableCellHeader>
      <StyleRightTableCell align="right" className="pt-2">
        <OptionsTableButton
          tokenPrice={tokenPrice}
          optionsStats={optionsStats}
          selectedSpreadPair={selectedSpreadPair}
          handleSelectLongStrike={handleSelectLongStrike}
        />
      </StyleRightTableCell>
    </TableRow>
  );
};
