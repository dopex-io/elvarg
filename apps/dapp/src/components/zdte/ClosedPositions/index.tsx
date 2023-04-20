import { useEffect } from 'react';

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
import { ClosedPositionsRow } from 'components/zdte/ClosedPositions/ClosedPositionsRow';
import Loading from 'components/zdte/Loading';

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

export const ClosedPositions = () => {
  const {
    zdteData,
    staticZdteData,
    userZdteExpiredData,
    updateUserZdteExpiredData,
  } = useBoundStore();

  useEffect(() => {
    updateUserZdteExpiredData();
  }, [updateUserZdteExpiredData]);

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
              <StyleTableCellHeader>Settlement Price</StyleTableCellHeader>
              <StyleTableCellHeader>Profit & Loss</StyleTableCellHeader>
              <StyleTableCellHeader>Settled</StyleTableCellHeader>
              <StyleRightTableCell align="right" className="rounded-tr-xl">
                <span className="text-sm text-stieglitz">Share</span>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {userZdteExpiredData && userZdteExpiredData?.length > 0 ? (
              userZdteExpiredData?.map((position, index) => (
                <ClosedPositionsRow
                  key={index}
                  position={position}
                  idx={index}
                  zdteData={zdteData}
                  staticZdteData={staticZdteData}
                />
              ))
            ) : (
              <span className="ml-auto mr-auto text-[0.8rem] h-full mb-10">
                Your closed positions will appear here
              </span>
            )}
          </TableBody>
        </Table>
      </StyleHeaderTable>
    </Box>
  );
};

export default ClosedPositions;
