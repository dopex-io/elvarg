import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import _ from 'lodash';
import { isEmpty, sortBy } from 'lodash';

import Typography from 'components/UI/Typography';
import {
  StyleTable,
  StyleTableCell,
  StyleLeftTableCell,
  StyleRightTableCell,
  StyleLeftCell,
  StyleCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';
import {
  Input,
  Select,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';
import SsovFilter from 'components/ssov/SsovFilter';
import { DEFAULT_CHAIN_ID } from 'constants/env';
import { useCallback, useMemo, useState } from 'react';
import { IOlpApi } from '.';
import { getReadableTime } from 'utils/contracts';
import { CHAIN_ID_TO_NETWORK_DATA, ROWS_PER_PAGE } from 'constants/index';
import {
  CustomButton,
  NumberDisplay,
  TablePaginationActions,
} from 'components/UI';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

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

export const AssetTable = ({ olps }: { olps: Record<string, IOlpApi[]> }) => {
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

  const FeaturedAsset = ({ olp }: { olp: IOlpApi | undefined }) => {
    if (olp === undefined) return null;

    const splitSymbol = olp.symbol.split('-');

    return (
      <Box className="border border-wave-blue rounded-lg flex-1 p-2">
        <Box className="flex flex-row">
          <Box className="w-7 h-7 border border-gray-500 rounded-full mr-2">
            <img
              src={`/images/tokens/${olp.underlyingSymbol.toLowerCase()}.svg`}
              alt={olp.underlyingSymbol}
            />
          </Box>
          <Typography variant="h6" color="white" className="capitalize my-auto">
            {`${splitSymbol[0]} ${splitSymbol[1]?.toLowerCase()}`}
          </Typography>
          <Box className="ml-auto">
            <img
              src={CHAIN_ID_TO_NETWORK_DATA[olp.chainId]?.icon}
              alt={CHAIN_ID_TO_NETWORK_DATA[olp.chainId]?.name}
              className="w-6 h-6 "
            />
          </Box>
        </Box>
        <Box className="flex flex-row justify-between ">
          <Box className=" flex flex-col flex-1 items-center">
            <Typography variant="h6" color="white">
              $
              <NumberDisplay n={BigNumber.from(olp.tvl)} decimals={0} />
            </Typography>
            <Typography variant="h6" color="stieglitz">
              TVL
            </Typography>
          </Box>
          <Box className=" flex flex-col flex-1 items-center">
            <Typography variant="h6" color="white">
              $
              <NumberDisplay n={BigNumber.from(olp.utilization)} decimals={0} />
            </Typography>
            <Typography variant="h6" color="stieglitz">
              Utilization
            </Typography>
          </Box>
          <Box className=" flex flex-col flex-1 items-center">
            <Typography variant="h6">{getReadableTime(olp.expiry)}</Typography>
            <Typography variant="h6" color="stieglitz">
              Expiry
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const featuredOlps: string[] = [
    'DPX-MONTHLY',
    'RDPX-MONTHLY',
    'STETH-MONTHLY',
  ];

  return (
    <Box className="flex flex-col flex-grow w-full">
      <Typography variant="h5" color="white">
        Featured
      </Typography>

      <Box className="flex flex-row space-x-1 mt-2">
        <FeaturedAsset
          olp={olps[DEFAULT_CHAIN_ID]?.find(
            (o) => o?.symbol === featuredOlps[0]
          )}
        />
        <FeaturedAsset
          olp={olps[DEFAULT_CHAIN_ID]?.find(
            (o) => o?.symbol === featuredOlps[1]
          )}
        />
        <FeaturedAsset
          olp={olps[DEFAULT_CHAIN_ID]?.find(
            (o) => o?.symbol === featuredOlps[2]
          )}
        />
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
        <TableBody></TableBody>
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
              ?.map((f, idx) => {
                const splitSymbol = f.symbol.split('-');
                return (
                  <TableRow key={idx} className="text-white mb-2 rounded-lg">
                    <StyleLeftCell align="left">
                      <Box className="flex flex-row items-center">
                        <Box className="w-7 h-7 border border-gray-500 rounded-full mr-2">
                          <img
                            src={`/images/tokens/${f.underlyingSymbol.toLowerCase()}.svg`}
                            alt={f.underlyingSymbol}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          color="white"
                          className="capitalize"
                        >
                          {`${splitSymbol[0]} ${splitSymbol[1]?.toLowerCase()}`}
                        </Typography>
                      </Box>
                    </StyleLeftCell>
                    <StyleCell align="left">
                      <Typography variant="h6" color="white">
                        $
                        <NumberDisplay n={BigNumber.from(f.tvl)} decimals={0} />
                      </Typography>
                    </StyleCell>
                    <StyleCell align="left">
                      <Typography variant="h6" color="white">
                        $
                        <NumberDisplay
                          n={BigNumber.from(f.utilization)}
                          decimals={0}
                        />
                      </Typography>
                    </StyleCell>
                    <StyleCell align="left">
                      <Typography
                        variant="h6"
                        color="white"
                        className="capitalize"
                      >
                        <img
                          src={CHAIN_ID_TO_NETWORK_DATA[f.chainId]?.icon}
                          alt={CHAIN_ID_TO_NETWORK_DATA[f.chainId]?.name}
                          className="w-6 h-6"
                        />
                      </Typography>
                    </StyleCell>
                    <StyleRightCell align="right" className="pt-2">
                      <CustomButton className="cursor-pointer text-white">
                        <Link
                          href={`/olp/${f.symbol}`}
                          passHref
                          target="_blank"
                        >
                          View
                        </Link>
                      </CustomButton>
                    </StyleRightCell>
                  </TableRow>
                );
              })}
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
