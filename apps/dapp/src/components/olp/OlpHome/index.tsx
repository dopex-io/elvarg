import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  TableBody,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { isEmpty } from 'lodash';

import { Typography, TablePaginationActions } from 'components/UI';
import {
  StyleTableCell,
  StyleLeftTableCell,
  StyleRightTableCell,
} from 'components/common/LpCommon/Table';
import SsovFilter from 'components/ssov/SsovFilter';

import { getReadableTime } from 'utils/contracts';

import { DEFAULT_CHAIN_ID } from 'constants/env';
import { CHAIN_ID_TO_NETWORK_DATA, ROWS_PER_PAGE } from 'constants/index';

import { IOlpApi } from '../../../pages/olp';
import { FeaturedAsset } from './FeaturedAsset';
import { AssetTableRow } from './AssetTableRow';

const StyleSecondHeaderTable = styled(TableContainer)`
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

const FEATURED_OLPS: string[] = [
  'DPX-MONTHLY',
  'RDPX-MONTHLY',
  'STETH-MONTHLY',
];

export const OlpHome = ({ olps }: { olps: Record<string, IOlpApi[]> }) => {
  const chainIds: string[] = Object.keys(olps ?? []);

  const [selectedOlpMarkets, setSelectedOlpMarkets] = useState<string[]>([]);
  const [olpExpiry, setOlpExpiry] = useState<string>('');
  const [olpNetwork, setOlpNetwork] = useState<string>(`${DEFAULT_CHAIN_ID}`);
  const [page, setPage] = useState<number>(0);

  const olpMarkets = useMemo(() => {
    if (!olps) return [];
    return [
      ...new Set(
        Object.keys(olps)
          .map((chainId) => olps[chainId]?.map((o) => o.underlyingSymbol) ?? '')
          .flat()
      ),
    ];
  }, [olps]);

  const olpExpiries = useMemo(() => {
    if (!olps) return [];
    const expiries = [
      ...new Set(chainIds?.map((c) => olps[c]?.map((o) => o.expiry)).flat()),
    ];

    if (!expiries || expiries === undefined) return [];

    return _.sortBy(expiries)?.map((o) => getReadableTime(o ?? 0));
  }, [olps, chainIds]);

  const olpNetworks = useMemo(() => {
    if (!olps) return [];
    return chainIds.map((c) => CHAIN_ID_TO_NETWORK_DATA[Number(c)]?.name || '');
  }, [olps, chainIds]);

  const filteredMarket = useMemo(() => {
    if (!olps) return [];

    return olps[olpNetwork]?.filter((o) => {
      return (
        (isEmpty(selectedOlpMarkets) ||
          selectedOlpMarkets.includes(o.underlyingSymbol)) &&
        (olpExpiry === '' || olpExpiry === getReadableTime(o.expiry)) &&
        (Number(olpNetwork) === o.chainId || DEFAULT_CHAIN_ID === o.chainId)
      );
    });
  }, [olps, selectedOlpMarkets, olpExpiry, olpNetwork]);

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  return (
    <Box className="flex flex-col flex-grow w-full">
      <Typography variant="h5" color="white">
        Featured
      </Typography>

      <Box className="flex mt-2 flex-col space-x-0 space-y-1 lg:flex-row lg:space-x-1 lg:space-y-0">
        {olps[DEFAULT_CHAIN_ID]?.filter((o) =>
          FEATURED_OLPS.includes(o.symbol)
        ).map((o, idx) => (
          <FeaturedAsset key={idx} olp={o} />
        ))}
      </Box>

      <Typography variant="h5" color="white my-3">
        All Options LP
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              className="flex flex-row"
              sx={{
                border: '1px solid #1e1e1e',
                borderRadius: '10px 10px 0 0',
                borderBottom: '0px',
                padding: '1px',
              }}
            >
              <SsovFilter
                activeFilters={selectedOlpMarkets}
                setActiveFilters={setSelectedOlpMarkets}
                text="All"
                options={olpMarkets}
                multiple={true}
                showImages={true}
              />
              <SsovFilter
                activeFilters={olpExpiry}
                setActiveFilters={setOlpExpiry}
                text="Expiry"
                options={olpExpiries}
                multiple={false}
                showImages={false}
              />
              <SsovFilter
                activeFilters={olpNetwork}
                setActiveFilters={setOlpNetwork}
                text="Network"
                options={olpNetworks}
                multiple={false}
                showImages={false}
              />
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>

      <StyleSecondHeaderTable>
        <Table className="border-collapse" size="medium">
          <TableHead>
            <TableRow>
              <StyleLeftTableCell align="left" className="flex space-x-1">
                <ArrowDownwardIcon className="fill-current text-stieglitz w-4 my-auto" />
                <Typography variant="h6" color="stieglitz" className="my-auto">
                  Market
                </Typography>
              </StyleLeftTableCell>
              <StyleTableCell align="left">
                <Typography variant="h6" color="stieglitz">
                  TVL
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="left">
                <Typography variant="h6" color="stieglitz">
                  Utilization
                </Typography>
              </StyleTableCell>
              <StyleTableCell align="left">
                <Typography variant="h6" color="stieglitz">
                  Network
                </Typography>
              </StyleTableCell>
              <StyleRightTableCell align="right">
                <Typography variant="h6" color="stieglitz">
                  Action
                </Typography>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {filteredMarket
              ?.slice(
                page * ROWS_PER_PAGE,
                page * ROWS_PER_PAGE + ROWS_PER_PAGE
              )
              ?.map((f, idx) => (
                <AssetTableRow key={idx} f={f} idx={idx} />
              ))}
          </TableBody>
        </Table>
      </StyleSecondHeaderTable>
      {filteredMarket?.length ?? 0 > ROWS_PER_PAGE ? (
        <TablePagination
          component="div"
          id="stats"
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          count={filteredMarket?.length ?? 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={ROWS_PER_PAGE}
          className="text-stieglitz border-0 flex flex-grow justify-center"
          ActionsComponent={TablePaginationActions}
        />
      ) : null}
    </Box>
  );
};

export default OlpHome;
