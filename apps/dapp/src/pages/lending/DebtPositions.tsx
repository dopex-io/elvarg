import React, { useState, useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import Box from '@mui/material/Box';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { SsovV4Put__factory } from 'mocks/factories/SsovV4Put__factory';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import { CustomButton } from 'components/UI';

import { useBoundStore } from 'store';
import { IDebtPosition } from 'store/Vault/lending';
import useSendTx from 'hooks/useSendTx';

import {
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  DECIMALS_USD,
  ROWS_PER_PAGE,
} from 'constants/index';

import { StyleContainer, StyleRow } from './Assets';

interface IDebtPositionTableData extends IDebtPosition {
  action: () => void;
}

const DebtPositionTableData = (props: IDebtPositionTableData) => {
  return (
    <StyleRow>
      <TableCell align="left">
        <Box className="flex flex-row">
          <img
            className="-ml-1 w-7 h-7"
            src={`/images/tokens/${props.underlyingSymbol}.svg`}
            alt={`${props.underlyingSymbol}`}
          />
          <Typography variant="h6" color="white" className="ml-3 my-auto">
            {props.underlyingSymbol}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">{props.epoch.toNumber()}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">
          $
          {formatAmount(
            getUserReadableAmount(props.strike, DECIMALS_STRIKE),
            2
          )}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">
          {formatAmount(
            getUserReadableAmount(props.supplied, DECIMALS_TOKEN),
            2
          )}{' '}
          {props.underlyingSymbol}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(props.borrowed, DECIMALS_USD), 2)}{' '}
          2CRV
        </Typography>
      </TableCell>
      <TableCell align="right">
        <CustomButton
          className="cursor-pointer text-white"
          color="primary"
          onClick={() => props.action()}
        >
          Repay
        </CustomButton>
      </TableCell>
    </StyleRow>
  );
};

const DebtPositions = () => {
  const { userDebtPositions, signer, provider, assetToContractAddress } =
    useBoundStore();
  const sendTx = useSendTx();

  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleRepay = useCallback(
    async (selectedIndex: number) => {
      if (
        !signer ||
        !provider ||
        !userDebtPositions ||
        selectedIndex === undefined
      )
        return;

      try {
        const debt: IDebtPosition = userDebtPositions[selectedIndex]!;
        const contract = SsovV4Put__factory.connect(
          assetToContractAddress.get(debt.underlyingSymbol)!,
          provider
        );
        await sendTx(contract.connect(signer), 'repay', [
          debt.tokenId,
          debt.borrowed,
          debt.supplied,
        ]);
        // TODO: update
      } catch (err) {
        console.log(err);
        throw new Error('fail to repay');
      }
    },
    [sendTx, userDebtPositions, provider, signer, assetToContractAddress]
  );

  return (
    <>
      <Typography variant="h4" color="white" className="my-2">
        Debt Positions
      </Typography>
      <Box className="bg-cod-gray px-2 mt-2 border-radius rounded-lg">
        <StyleContainer>
          {isEmpty(userDebtPositions) ? (
            <Box className="text-stieglitz text-center p-10">
              Your debt positions will appear here.
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Collateral Asset
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Epoch
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Strike
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Supplied
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="border-none">
                    <Typography variant="h6" color="stieglitz">
                      Borrowed
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              {userDebtPositions
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                ?.map((o: IDebtPosition, i: number) => (
                  <TableBody key={i} className="rounded-lg bg-umbra">
                    <DebtPositionTableData
                      key={i}
                      {...o}
                      action={() => handleRepay(i)}
                    />
                  </TableBody>
                ))}
            </Table>
          )}
        </StyleContainer>
        {userDebtPositions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={userDebtPositions?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            className="text-stieglitz border-0 flex flex-grow justify-center"
            ActionsComponent={TablePaginationActions}
          />
        ) : null}
      </Box>
    </>
  );
};

export default DebtPositions;
