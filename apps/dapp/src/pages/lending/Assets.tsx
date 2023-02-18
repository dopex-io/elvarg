import React, { useCallback, useState } from 'react';
import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { max, min } from 'lodash';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

import formatAmount from 'utils/general/formatAmount';

import { ISsovLendingData } from 'store/Vault/lending';

import BorrowDialog from './BorrowDialog';
import LendDialog from './LendDialog';
import { CHAIN_ID_TO_EXPLORER } from 'constants';

export const StyleContainer = styled(TableContainer)`
  table {
    border-collapse: separate !important;
    border-spacing: 0 0.5em !important;
  }
  td {
    border: none !important;
  }
  tr:last-child td:first-of-type {
    border-bottom-left-radius: 10px;
  }
  tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }
`;

export const StyleRow = styled(TableRow)`
  td:first-of-type {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  td:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const AssetTableData = ({
  positionIdx,
  assetDatum,
}: {
  positionIdx: number;
  assetDatum: ISsovLendingData;
}) => {
  const {
    underlyingSymbol,
    address,
    totalSupply,
    totalBorrow,
    tokenPrice,
    aprs,
  } = assetDatum;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [lendAnchorEl, setLendAnchorEl] = useState<null | HTMLElement>(null);

  const minApr = min(aprs);
  const maxApr = max(aprs);

  return (
    <>
      <StyleRow key={`main-${underlyingSymbol}`}>
        <TableCell align="left">
          <a
            href={`${CHAIN_ID_TO_EXPLORER[assetDatum.chainId]}address/${
              assetDatum.address
            }`}
            rel="noopener noreferrer"
            target={'_blank'}
          >
            <Box className="flex flex-row">
              <img
                className="-ml-1 w-7 h-7"
                src={`/images/tokens/${underlyingSymbol}.svg`}
                alt={`${underlyingSymbol}`}
              />
              <Typography variant="h6" color="white" className="ml-3 my-auto">
                {underlyingSymbol}
              </Typography>
            </Box>
          </a>
        </TableCell>
        <TableCell align="left">
          <Typography variant="h6" color="white">
            ${formatAmount(totalSupply, 0, true)}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="h6" color="white">
            ${formatAmount(tokenPrice, 2)}
          </Typography>
        </TableCell>
        {/* <TableCell align="left">
          <Typography variant="h6" color="white">
            83%
          </Typography>
        </TableCell> */}
        <TableCell align="left">
          <Typography variant="h6" color="white">
            {minApr === 0 && minApr === maxApr
              ? '-'
              : `${minApr}% - ${maxApr}%`}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <CustomButton
            className="cursor-pointer text-white"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Borrow
          </CustomButton>
          {anchorEl && (
            <BorrowDialog
              key={positionIdx}
              assetDatum={assetDatum}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <CustomButton onClick={(e) => setLendAnchorEl(e.currentTarget)}>
            Lend
          </CustomButton>
          {lendAnchorEl && (
            <LendDialog
              key={positionIdx}
              assetDatum={assetDatum}
              anchorEl={lendAnchorEl}
              setAnchorEl={setLendAnchorEl}
            />
          )}
        </TableCell>
      </StyleRow>
    </>
  );
};

export const Assets = ({ data }: { data: any[] }) => {
  return (
    <>
      <Typography variant="h4" color="white" className="mb-2">
        Assets
      </Typography>
      <Box className="bg-cod-gray px-2 mt-2 border-radius rounded-lg">
        <StyleContainer>
          <Table>
            <TableHead className="bg-cod-gray">
              <TableRow>
                <TableCell align="left" className="border-none">
                  <Typography variant="h6" color="stieglitz">
                    Collateral Asset
                  </Typography>
                </TableCell>
                <TableCell align="left" className="border-none">
                  <Typography variant="h6" color="stieglitz">
                    Total Supply
                  </Typography>
                </TableCell>
                <TableCell align="left" className="border-none">
                  <Typography variant="h6" color="stieglitz">
                    Price
                  </Typography>
                </TableCell>
                {/* <TableCell align="left" className="border-none">
                <Typography variant="h6" color="stieglitz">
                  Utilization
                </Typography>
              </TableCell> */}
                <TableCell align="left" className="border-none">
                  <Typography variant="h6" color="stieglitz">
                    Borrow APR
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {data.map((assetDatum, idx) => (
              <TableBody key={idx} className="rounded-lg bg-umbra">
                <AssetTableData
                  key={idx}
                  positionIdx={idx}
                  assetDatum={assetDatum}
                />
              </TableBody>
            ))}
          </Table>
        </StyleContainer>
      </Box>
    </>
  );
};
