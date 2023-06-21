import { useCallback, useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';

import { IosShare } from '@mui/icons-material';

import graphSdk from 'graphql/graphSdk';
import useShare from 'hooks/useShare';
import { reverse } from 'lodash';
import queryClient from 'queryClient';
import { useBoundStore } from 'store';

import { TableHeader } from 'components/straddles/Deposits/DepositsTable';
import { TablePaginationActions } from 'components/UI';

import { formatAmount, smartTrim } from 'utils/general';
import getPercentageDifference from 'utils/math/getPercentageDifference';

const POLYGON_CHAIN_ID = 137;

const ROWS_PER_PAGE = 5;

interface ClosedPositionProps {
  pnl: string;
  txId: string;
  amount?: string;
  strikePrice?: string;
  epoch?: string;
  cost?: string;
}

const ClosedPositionsTable = () => {
  const share = useShare((state) => state.open);

  const [page, setPage] = useState<number>(0);
  const [settled, setSettled] = useState<any>([]);
  const [purchases, setPurchases] = useState<any>([]);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const {
    straddlesData,
    accountAddress,
    tokenPrices,
    getStraddlesContract,
    chainId,
  } = useBoundStore();

  const handleShare = useCallback(
    async (position: ClosedPositionProps) => {
      const straddlesContract = getStraddlesContract();

      const [contractName, epochData] = await Promise.all([
        straddlesData?.straddlesContract?.name(),
        straddlesContract?.epochData(position.epoch),
      ]);
      const tokenName = contractName?.split(' ')[0];
      const tokenPrice =
        tokenPrices.find((token) => token.name === tokenName)?.price || 0;

      share({
        title: (
          <div>
            <h4 className="text-white font-bold shadow-2xl">
              <span>{tokenName} Straddle</span>
            </h4>
            <span className="text-sm">
              <a href={`https://arbiscan.io/tx/${position.txId}`}>
                {smartTrim(position.txId, 12)}
              </a>
            </span>
          </div>
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
          {
            name: 'Expiry Mark Price',
            value: `$${formatAmount(
              utils.formatUnits(epochData.settlementPrice, 8),
              2
            )}`,
          },
          {
            name: 'Epoch',
            value: position.epoch!,
          },
        ],
      });
    },
    [share, tokenPrices, straddlesData?.straddlesContract]
  );

  useEffect(() => {
    async function getRecords() {
      if (chainId === POLYGON_CHAIN_ID) {
        const payloadPolygon = await queryClient.fetchQuery({
          queryKey: ['settled-data-polygon'],
          queryFn: () =>
            graphSdk.getStraddlesUserSettleDataPolygon({
              user: accountAddress,
            }),
        });
        setSettled(payloadPolygon?.straddles_polygonsettles);
        setPurchases(payloadPolygon?.straddles_polygonstraddlePurchases);
      } else {
        const payloadArb = await queryClient.fetchQuery({
          queryKey: ['settled-data-arb'],
          queryFn: () =>
            graphSdk.getStraddlesUserSettleData({
              user: accountAddress,
              vault: straddlesData?.straddlesContract?.address,
            }),
        });
        setSettled(payloadArb?.straddles_settles);
        setPurchases(payloadArb?.straddles_straddlePurchases);
      }
    }
    getRecords();
  }, []);

  const records: Record<string, ClosedPositionProps> = {};

  if (settled) {
    settled.forEach(
      (item: { id: string; pnl: string; transaction: { id: string } }) => {
        const nftId = item.id.split('#')[2];
        const txId = item.transaction.id;
        records[nftId] = {
          pnl: Number(utils.formatUnits(BigNumber.from(item.pnl), 6)).toFixed(
            2
          ),
          txId: txId,
        };
      }
    );
  }

  if (purchases) {
    purchases.forEach(
      (item: {
        id: string;
        amount: string;
        strikePrice: string;
        cost: string;
        epoch: string;
      }) => {
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
      }
    );
  }

  return (
    <div>
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
                      <div>
                        <div
                          className={`rounded-md flex items-center px-2 py-2 w-fit`}
                        >
                          <h6 className="text-white pr-7 pt-[2px]">
                            {records[position].amount}
                          </h6>
                        </div>
                      </div>
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
                      <div className="flex justify-end">
                        <IconButton
                          aria-label="share"
                          aria-haspopup="true"
                          onClick={() => handleShare(records[position])}
                          className="flex"
                          size="small"
                        >
                          <IosShare className="fill-current text-white opacity-90 hover:opacity-100 text-lg" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex">
        {Object.keys(records).length === 0 || accountAddress == undefined ? (
          <div className="text-center mt-3 mb-3 ml-auto w-full">-</div>
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
      </div>
    </div>
  );
};

export default ClosedPositionsTable;
