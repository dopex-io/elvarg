import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBoundStore } from 'store';

import {
  StyleCell,
  StyleLeftCell,
  StyleLeftTableCell,
  StyleRightCell,
  StyleRightTableCell,
  StyleTableCellHeader,
} from 'components/common/LpCommon/Table';
import Loading from 'components/zdte/Loading';

import { getReadableTime } from 'utils/contracts';

const StyleHeaderTable = styled(TableContainer)`
  table {
    border-collapse: separate !important;
    border-spacing: 0;
    border-radius: 0.5rem;
  }
  tr:last-of-type td:first-of-type {
    border-radius: 0 0 0 10px;
  }
  tr:last-of-type td:last-of-type {
    border-radius: 0 0 10px 0;
  }
`;

export const ExpiryStats = () => {
  const { expireStats } = useBoundStore();

  if (!expireStats) return <Loading />;

  return (
    <Box className="flex flex-col flex-grow w-full whitespace-nowrap">
      <StyleHeaderTable>
        <Table>
          <TableHead>
            <TableRow>
              <StyleLeftTableCell
                align="left"
                className="flex space-x-1 rounded-tl-xl"
              >
                <ArrowDownwardIcon className="fill-current text-stieglitz w-4 my-auto" />
                <span className="text-sm text-stieglitz my-auto min-w-width">
                  Begin
                </span>
              </StyleLeftTableCell>
              <StyleTableCellHeader>Expired</StyleTableCellHeader>
              <StyleTableCellHeader>Expiry</StyleTableCellHeader>
              <StyleTableCellHeader>Start ID</StyleTableCellHeader>
              <StyleRightTableCell align="right" className="rounded-tr-xl">
                <span className="text-sm text-stieglitz">Count</span>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          {expireStats
            ? expireStats.map((stats, idx) => (
                <TableBody className="rounded-lg " key={idx}>
                  <TableRow key={idx} className="mb-2 rounded-lg">
                    <StyleLeftCell align="left">
                      <span className="text-white">
                        {stats.begin ? 'Yes' : 'No'}
                      </span>
                    </StyleLeftCell>
                    <StyleCell align="left">
                      <span className="text-white">
                        {stats.expired ? 'Expired' : 'Not Expired'}
                      </span>
                    </StyleCell>
                    <StyleCell align="left">
                      <span className="text-white">
                        {getReadableTime(stats.expiry)}
                      </span>
                    </StyleCell>
                    <StyleCell align="left">
                      <span className="text-white">
                        {stats.startId.toNumber()}
                      </span>
                    </StyleCell>
                    <StyleRightCell align="right">
                      <span className="text-white">
                        {stats.count.toNumber()}
                      </span>
                    </StyleRightCell>
                  </TableRow>
                </TableBody>
              ))
            : null}
        </Table>
      </StyleHeaderTable>
    </Box>
  );
};

export default ExpiryStats;
