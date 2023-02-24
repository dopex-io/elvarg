import React, { useState } from 'react';
import { Box, Table, TableBody, TableHead, TableRow } from '@mui/material';
import { max, min } from 'lodash';

import { ISsovLendingData } from 'store/Vault/lending';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import {
  StyleCell,
  StyleLeftCell,
  StyleLeftTableCell,
  StyleRightCell,
  StyleRightTableCell,
  StyleTable,
  StyleTableCell,
} from 'components/common/LpCommon/Table';

import formatAmount from 'utils/general/formatAmount';
import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

import BorrowDialog from './BorrowDialog';
import LendDialog from './LendDialog';

const AssetTableData = ({
  positionIdx,
  assetDatum,
}: {
  positionIdx: number;
  assetDatum: ISsovLendingData;
}) => {
  const { underlyingSymbol, totalSupply, tokenPrice, aprs } = assetDatum;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [lendAnchorEl, setLendAnchorEl] = useState<null | HTMLElement>(null);

  const minApr = min(aprs);
  const maxApr = max(aprs);

  return (
    <TableRow className="text-white bg-cod-gray mb-2 rounded-lg w-full">
      <StyleLeftCell align="left">
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
            <Typography variant="h6" className="ml-3 my-auto">
              {underlyingSymbol}
            </Typography>
          </Box>
        </a>
      </StyleLeftCell>
      <StyleCell align="left">
        <Typography variant="h6">
          ${formatAmount(totalSupply, 0, true)}
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6">${formatAmount(tokenPrice, 2)}</Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6">
          {minApr === 0 && minApr === maxApr ? '-' : `${minApr}% - ${maxApr}%`}
        </Typography>
      </StyleCell>
      <StyleCell align="right">
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
      </StyleCell>
      <StyleRightCell align="right">
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
      </StyleRightCell>
    </TableRow>
  );
};

export const Assets = ({ data }: { data: any[] }) => {
  return (
    <>
      <Typography variant="h4" className="mb-2">
        Markets
      </Typography>
      <StyleTable className="py-2">
        <Table>
          <TableHead className="bg-cod-gray">
            <TableRow>
              <StyleLeftTableCell align="left">
                <Typography variant="h6" color="stieglitz">
                  Asset
                </Typography>
              </StyleLeftTableCell>
              <StyleTableCell align="left">
                <Typography variant="h6" color="stieglitz">
                  Total Supply
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="left">
                <Typography variant="h6" color="stieglitz">
                  Price
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="left">
                <Typography variant="h6" color="stieglitz">
                  Borrow APR
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="left"></StyleTableCell>
              <StyleRightTableCell
                align="right"
                className="border-none"
              ></StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg bg-umbra">
            {data.map((assetDatum, idx) => (
              <AssetTableData
                key={idx}
                positionIdx={idx}
                assetDatum={assetDatum}
              />
            ))}
          </TableBody>
        </Table>
      </StyleTable>
    </>
  );
};
