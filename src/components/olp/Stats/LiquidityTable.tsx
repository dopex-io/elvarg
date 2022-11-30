import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { BigNumber } from 'ethers';
import { styled } from '@mui/material/styles';

import { NumberDisplay, Typography } from 'components/UI';

import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';

const StyleCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleLeftCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-left: 1px solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleRightCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-right: solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

interface LiquidityTableProps {
  strike: BigNumber;
  liquidity: BigNumber;
  utilization: BigNumber;
}

export const LiquidityTable = (props: LiquidityTableProps) => {
  const { strike, liquidity, utilization } = props;

  return (
    <TableRow
      sx={{
        marginBottom: '0.5rem',
        borderRadius: '0.5rem',
      }}
    >
      <StyleLeftCell align="left">
        <Typography variant="caption" color="white">
          <Box className="bg-umbra w-14 p-2 border-radius rounded-lg flex justify-around">
            $<NumberDisplay n={strike} decimals={DECIMALS_STRIKE} />
          </Box>
        </Typography>
      </StyleLeftCell>
      <StyleCell align="center">
        <Typography variant="caption" color="white">
          $<NumberDisplay n={liquidity} decimals={DECIMALS_USD} />
        </Typography>
      </StyleCell>
      <StyleRightCell align="right">
        <Typography variant="caption" color="white">
          $<NumberDisplay n={utilization} decimals={DECIMALS_USD} />
        </Typography>
      </StyleRightCell>
    </TableRow>
  );
};
