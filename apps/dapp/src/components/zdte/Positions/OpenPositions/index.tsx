import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBoundStore } from 'store';

import {
  StyleLeftTableCell,
  StyleRightTableCell,
  StyleTableCellHeader,
} from 'components/common/LpCommon/Table';
import Loading from 'components/zdte/Loading';
import { OpenPositionsRow } from 'components/zdte/Positions/OpenPositions/OpenPositionsRow';

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

export const OpenPositions = () => {
  const { zdteData, staticZdteData, userZdtePurchaseData } = useBoundStore();

  if (!zdteData || !staticZdteData) {
    return <Loading />;
  }

  return (
    <Box className="flex flex-col flex-grow w-full whitespace-nowrap">
      <StyleHeaderTable>
        <Table>
          <TableHead>
            <TableRow>
              <StyleLeftTableCell align="left" className="rounded-tl-xl">
                <span className="text-sm text-stieglitz my-auto min-w-width">
                  Strike
                </span>
              </StyleLeftTableCell>
              <StyleTableCellHeader>Amount</StyleTableCellHeader>
              {/* <StyleTableCellHeader>Mark Price</StyleTableCellHeader> */}
              <StyleTableCellHeader>Profit & Loss</StyleTableCellHeader>
              <StyleTableCellHeader>Time to Expiry</StyleTableCellHeader>
              <StyleRightTableCell align="right" className="rounded-tr-xl">
                <span className="text-sm text-stieglitz">Share</span>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {userZdtePurchaseData && userZdtePurchaseData?.length > 0 ? (
              userZdtePurchaseData?.map((position, index) => (
                <OpenPositionsRow
                  key={index}
                  position={position}
                  idx={index}
                  zdteData={zdteData}
                  staticZdteData={staticZdteData}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" className="border-none">
                  <div className="py-3">
                    <span className="text-white">
                      Your open positions will appear here
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyleHeaderTable>
    </Box>
  );
};

export default OpenPositions;
