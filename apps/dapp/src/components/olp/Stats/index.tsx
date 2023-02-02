import { BigNumber } from 'ethers';
import { zipWith } from 'lodash';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import Typography from 'components/UI/Typography';
import {
  StyleTable,
  StyleTableCell,
  StyleLeftTableCell,
  StyleRightTableCell,
} from 'components/common/LpCommon/Table';
import { LiquidityTable } from 'components/olp/Stats/LiquidityTable';

import { useBoundStore } from 'store';

import { formatAmount, displayAddress, getExplorerUrl } from 'utils/general';
import { getUserReadableAmount } from 'utils/contracts';

import { DECIMALS_USD } from 'constants/index';

const Stats = () => {
  const { getOlpContract, chainId, olpEpochData } = useBoundStore();

  const olpContract = getOlpContract();

  const tvl: BigNumber = olpEpochData?.totalLiquidityPerStrike.reduce(
    (acc, cur) => acc.add(cur),
    BigNumber.from(0)
  ) as BigNumber;

  return (
    <Box className="space-y-8">
      <Box className=" border border-umbra rounded-lg mb-2">
        <Box className="p-2 space-y-2">
          <Typography variant="h6" color="stieglitz">
            About OLP
          </Typography>
          <Typography variant="h6">
            Users can provide liquidity mid-epoch & purchase SSOV options at
            discounted IV.
          </Typography>
        </Box>
        <Box className="flex flex-row justify-between border border-umbra border-x-0 border-b-0 divide-x divide-umbra">
          {/* tvl */}
          <Box className="flex flex-row w-1/2 justify-between p-2 my-auto">
            <Typography variant="h6" color="stieglitz">
              TVL
            </Typography>
            <Typography variant="h6">
              ${formatAmount(getUserReadableAmount(tvl, DECIMALS_USD))}
            </Typography>
          </Box>
          {/* contract */}
          <Box className="flex flex-row w-1/2 justify-between p-2 my-auto">
            <Typography variant="h6" color="stieglitz">
              Contract
            </Typography>
            <a
              className="flex cursor-pointer space-x-1"
              href={`${getExplorerUrl(chainId)}/address/${
                olpContract?.address
              }`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Typography variant="h6" color="white">
                {displayAddress(olpContract?.address, undefined)}
              </Typography>
              <LaunchIcon className="fill-current text-stieglitz my-auto w-[17px]" />
            </a>
          </Box>
        </Box>
      </Box>
      <Box>
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
                  <StyleLeftTableCell align="left" className="flex space-x-1">
                    <ArrowDownwardIcon className="fill-current text-stieglitz w-4 my-auto" />
                    <Typography
                      variant="caption"
                      color="stieglitz"
                      className="my-auto"
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
                        utilization={
                          olpEpochData?.strikeToUtilization[strike?.toString()]!
                        }
                      />
                    );
                  }
                )}
              </TableBody>
            </Table>
          </StyleTable>
        </Box>
      </Box>
    </Box>
  );
};

export default Stats;
