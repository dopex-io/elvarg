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
  StyleLeftTableCell,
  StyleRightTableCell,
  StyleTableCellHeader,
} from 'components/common/LpCommon/Table';
import { OpenPositionsRow } from 'components/zdte/OpenPositions/OpenPositionsRow';

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
  const {
    signer,
    provider,
    getZdteContract,
    zdteData,
    updateZdteData,
    staticZdteData,
    userZdtePurchaseData,
  } = useBoundStore();
  const zdteContract = getZdteContract();

  return (
    <Box className="flex flex-col flex-grow w-full whitespace-nowrap">
      <span className="h5 mb-4">Open Positions</span>
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
              <StyleTableCellHeader>Profit & Loss</StyleTableCellHeader>
              <StyleTableCellHeader>Time to Expiry</StyleTableCellHeader>
              <StyleRightTableCell align="right" className="rounded-tr-xl">
                <span className="text-sm text-stieglitz">Action</span>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {userZdtePurchaseData && userZdtePurchaseData?.length > 0
              ? userZdtePurchaseData?.map((position, index) => (
                  <OpenPositionsRow
                    key={index}
                    position={position}
                    idx={index}
                    signer={signer}
                    zdteContract={zdteContract}
                    zdteData={zdteData}
                    staticZdteData={staticZdteData}
                    provider={provider}
                    updateZdteData={updateZdteData}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </StyleHeaderTable>
    </Box>
  );
};

export default OpenPositions;
