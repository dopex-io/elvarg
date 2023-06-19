import { useCallback, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import {
  TablePagination,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { IosShare } from '@mui/icons-material';

import { useQuery } from '@tanstack/react-query';
import graphSdk from 'graphql/graphSdk';
import useShare from 'hooks/useShare';
import { reverse } from 'lodash';
import queryClient from 'queryClient';
import { useBoundStore } from 'store';

import { TablePaginationActions } from 'components/UI';
import { TableHeader } from 'components/straddles/Deposits/DepositsTable';

import formatAmount from 'utils/general/formatAmount';
import getPercentageDifference from 'utils/math/getPercentageDifference';

const ROWS_PER_PAGE = 5;

interface ClosedPositionProps {
  pnl: string;
  amount?: string;
  strikePrice?: string;
  epoch?: string;
  cost?: string;
}

const ClosedPositionsTable = () => {
  const share = useShare((state) => state.open);

  const [page, setPage] = useState<number>(0);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const { straddlesData, accountAddress, tokenPrices } = useBoundStore();

  const handleShare = useCallback(
    async (position: ClosedPositionProps) => {
      const contractName = await straddlesData?.straddlesContract?.name();
      const tokenName = contractName?.split(' ')[0];
      const tokenPrice =
        tokenPrices.find((token) => token.name === tokenName)?.price || 0;

      share({
        title: (
          <h4 className="text-white font-bold shadow-2xl">
            {tokenName} Straddle
          </h4>
        ),
        percentage: getPercentageDifference(
          tokenPrice,
          Number(position.strikePrice)
        ),
        customPath: '/straddles',
        stats: [
          {
            name: 'Strike Price',
            value: `$${formatAmount(Number(position.strikePrice), 2)}`,
          },
          { name: 'Mark Price', value: `$${formatAmount(tokenPrice, 2)}` },
          {
            name: 'Epoch',
            value: position.epoch!,
          },
        ],
      });
    },
    [share, tokenPrices, straddlesData?.straddlesContract]
  );

  const payload = useQuery({
    queryKey: ['getStraddlesUserSettleData'],
    queryFn: () =>
      queryClient.fetchQuery({
        queryKey: ['getStraddlesUserSettleData'],
        queryFn: () =>
          graphSdk.getStraddlesUserSettleData({
            user: accountAddress,
            vault: straddlesData?.straddlesContract?.address,
          }),
      }),
  });

  const settled = payload.data?.straddles_settles;
  const purchases = payload.data?.straddles_straddlePurchases;

  const records: Record<string, ClosedPositionProps> = {};

  if (settled) {
    settled.forEach((item) => {
      const nftId = item.id.split('#')[2];
      records[nftId] = {
        pnl: Number(utils.formatUnits(BigNumber.from(item.pnl), 6)).toFixed(2),
      };
    });
  }

  if (purchases) {
    purchases.forEach((item) => {
      const nftId = item.id.split('#')[2];
      if (records[nftId])
        records[nftId] = {
          ...records[nftId],
          amount: formatAmount(
            Number(
              utils.formatUnits(
                BigNumber.from(item.amount).div(BigNumber.from(2)),
                18
              )
            ),
            8
          ),
          strikePrice: Number(
            utils.formatUnits(BigNumber.from(item.strikePrice), 8)
          ).toFixed(2),
          cost: Number(utils.formatUnits(item.cost, 18)).toFixed(2),
          epoch: item.epoch,
        };
    });
  }

  return (
    <Box>
      <TableContainer className="rounded-xl">
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow>
              <TableHeader label="Amount" showArrowIcon />
              <TableHeader label="AP Strike" />
              <TableHeader label="PnL" />
              <TableHeader label="Epoch" />
              <TableHeader label="Action" variant="text-end" />
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {Object.keys(records)?.length > 0 &&
              reverse(Object.keys(records))
                ?.slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                .map((position, i) => (
                  <TableRow key={i}>
                    <TableCell className="pt-2 border-0">
                      <Box>
                        <Box
                          className={`rounded-md flex items-center px-2 py-2 w-fit`}
                        >
                          <h6 className="text-white pr-7 pt-[2px]">
                            {records[position].amount}
                          </h6>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell className="pt-1 border-0">
                      <h6 className="text-white">
                        <span>${records[position].strikePrice}</span>
                      </h6>
                    </TableCell>
                    <TableCell className="pt-1 border-0">
                      <h6 className="text-white text-left">
                        <span>${records[position].pnl}</span>
                      </h6>
                    </TableCell>
                    <TableCell className="pt-1 border-0">
                      <h6 className="text-white text-left">
                        <span>{records[position].epoch}</span>
                      </h6>
                    </TableCell>
                    <TableCell className="flex justify-end border-0">
                      <Box className="flex justify-end">
                        <IconButton
                          aria-label="share"
                          aria-haspopup="true"
                          onClick={() => handleShare(records[position])}
                          className="flex"
                          size="small"
                        >
                          <IosShare className="fill-current text-white opacity-90 hover:opacity-100 text-lg" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="flex">
        {Object.keys(records).length === 0 || accountAddress == undefined ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
        {Object.keys(records).length! > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            id="stats"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={Object.keys(records).length!}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            className="text-stieglitz border-0 flex flex-grow justify-center"
            ActionsComponent={TablePaginationActions}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default ClosedPositionsTable;
