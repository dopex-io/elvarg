import {
  Box,
  Button,
  TableHead,
  TableRow,
  Table,
  TableBody,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { BigNumber } from 'ethers';
import { zipWith } from 'lodash';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import { formatAmount, displayAddress, getExplorerUrl } from 'utils/general';
import { getUserReadableAmount } from 'utils/contracts';
import {
  StyleTable,
  StyleTableCell,
  StyleLeftTableCell,
  StyleRightTableCell,
} from 'components/common/LpCommon/Table';

import { DECIMALS_USD } from 'constants/index';

import { LiquidityTable } from './LiquidityTable';

const Stats = () => {
  const { getOlpContract, chainId, olpEpochData } = useBoundStore();

  const olpContract = getOlpContract();

  const tvl: BigNumber = olpEpochData?.totalLiquidityPerStrike.reduce(
    (acc, cur) => acc.add(cur),
    BigNumber.from(0)
  ) as BigNumber;

  return (
    <Box>
      <Box className=" border border-umbra rounded-lg p-1 mb-2">
        <Box className="p-2">
          <Typography variant="h6" color="stieglitz">
            About OLP
          </Typography>
          <Typography variant="h6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Typography>
        </Box>

        <Box className="flex flex-row justify-between mt-2 border border-umbra border-x-0 border-b-0">
          {/* tvl */}
          <Box className="flex flex-grow flex-row w-1/2 justify-between p-2 mt-1 pb-0 h-10 border-y-0 border-l-0 border border-umbra">
            <Typography variant="h6" color="stieglitz">
              TVL
            </Typography>
            <Typography variant="h6">
              ${formatAmount(getUserReadableAmount(tvl, DECIMALS_USD))}
            </Typography>
          </Box>

          {/* contract */}
          <Box className="flex flex-grow flex-row w-1/2 justify-between p-2 pb-0 h-10 mt-1 pr-0">
            <Typography variant="h6" color="stieglitz">
              Contract
            </Typography>
            <Box>
              <Button>
                <a
                  className={'cursor-pointer'}
                  href={`${getExplorerUrl(chainId)}/address/${
                    olpContract?.address
                  }`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Box className="flex flex-row -mt-3">
                    <Typography variant="h6" color="white" className="mr-1">
                      {displayAddress(olpContract?.address, undefined)}
                    </Typography>
                    <LaunchIcon
                      sx={{
                        height: '18px',
                        width: '18px',
                        color: '#8E8E8E',
                        marginTop: '2px',
                      }}
                    />
                  </Box>
                </a>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography variant="h5" color="white">
        Liquidity
      </Typography>

      <Box className="mt-3">
        <StyleTable>
          <Table className="border-collapse" size="medium">
            <TableHead
              sx={{
                borderRight: '1px solid #ffffff',
              }}
            >
              <TableRow
                sx={{
                  borderRight: '1px solid #ffffff',
                  height: '5px',
                }}
              >
                <StyleLeftTableCell align="left" className="flex flex-row">
                  <ArrowDownwardIcon
                    sx={{
                      width: '1.25rem',
                      marginTop: '0.125rem',
                      marginLeft: '-8px',
                      color: '#8E8E8E',
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="stieglitz"
                    className="mt-1.5"
                  >
                    Strike
                  </Typography>
                </StyleLeftTableCell>
                <StyleTableCell align="center">
                  <Typography variant="caption" color="stieglitz">
                    Liquidity
                  </Typography>
                </StyleTableCell>
                <StyleRightTableCell align="right">
                  <Typography variant="caption" color="stieglitz">
                    Utilization
                  </Typography>
                </StyleRightTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zipWith(
                olpEpochData?.totalLiquidityPerStrike!,
                olpEpochData?.strikes!,
                [...Array(olpEpochData?.strikes!.length).keys()],
                function (liquidity, strike, idx) {
                  return (
                    <LiquidityTable
                      key={idx}
                      liquidity={liquidity}
                      strike={strike}
                      utilization={BigNumber.from(0)}
                    />
                  );
                }
              )}
            </TableBody>
          </Table>
        </StyleTable>
      </Box>
    </Box>
  );
};

export default Stats;
