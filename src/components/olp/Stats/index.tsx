import { useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TableHead,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from '@mui/material/styles';
import { BigNumber } from 'ethers';
import { zipWith } from 'lodash';

import { useBoundStore } from 'store';

import CustomMenuBox from 'components/common/CustomMenuBox';
import ContractBox from 'components/common/ContractBox';
import Typography from 'components/UI/Typography';
import {
  formatAmount,
  getExtendedLogoFromChainId,
  displayAddress,
  getExplorerUrl,
} from 'utils/general';
import { getUserReadableAmount, getReadableTime } from 'utils/contracts';

import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';
import { LiquidityTable } from './LiquidityTable';

const StyleTable = styled(TableContainer)`
  table {
    border-collapse: separate !important;
    border-spacing: 0;
    border-radius: 0.5rem;
  }
  th:first-of-type {
    border-radius: 10px 0 0 0;
  }
  th:last-of-type {
    border-radius: 0 10px 0 0;
  }
  tr:last-of-type td:first-of-type {
    border-radius: 0 0 0 10px;
  }
  tr:last-of-type td:last-of-type {
    border-radius: 0 0 10px 0;
  }
`;

const StyleCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-bottom: 1px solid #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleLeftCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-left: 1px solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const StyleRightCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-top: 1px solid #1e1e1e;
    border-right: 1px solid #1e1e1e;
    border-bottom: solid 1px #1e1e1e;
    padding: 0.5rem 1rem;
  }
`;

const Stats = () => {
  const {
    getOlpContract,
    olpData,
    chainId,
    olpEpochData,
    selectedEpoch,
    updateOlp,
    updateOlpEpochData,
    updateOlpUserData,
    setSelectedIsPut,
    setSelectedEpoch,
  } = useBoundStore();

  const olpContract = getOlpContract();

  const expiries = useMemo(() => {
    if (!olpData?.expiries) return [];
    return olpData.expiries.map((expiry, index) => {
      return (
        <MenuItem
          value={index + 1}
          key={index}
          className="flex justify-center text-white"
        >
          {getReadableTime(expiry)}
        </MenuItem>
      );
    });
  }, [olpData?.expiries]);

  const handleSelectChange = useCallback(
    async (e: { target: { value: any } }) => {
      if (setSelectedEpoch) {
        setSelectedEpoch(Number(e.target.value));
        await updateOlpEpochData();
        await updateOlpUserData();
      }
    },
    [setSelectedEpoch, updateOlpUserData, updateOlpEpochData]
  );

  function getTotalLiquidityProvidedBox(
    totalLiquidityPerStrike: BigNumber[],
    strikes: BigNumber[]
  ) {
    return (
      <>
        <Typography variant="h5" color="white">
          Liquidity
        </Typography>
        {/* <Box className="border rounded border-transparent p-2 ml-3">*/}

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
                  <StyleLeftCell align="left" className="flex flex-row">
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
                  </StyleLeftCell>
                  <StyleCell align="center">
                    <Typography variant="caption" color="stieglitz">
                      Liquidity
                    </Typography>
                  </StyleCell>
                  <StyleRightCell align="right">
                    <Typography variant="caption" color="stieglitz">
                      Utilization
                    </Typography>
                  </StyleRightCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zipWith(
                  totalLiquidityPerStrike,
                  strikes,
                  [...Array(strikes.length).keys()],
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
      </>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="stieglitz">
        About OLP
      </Typography>
      <Typography variant="h6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Typography>
      <Box className="flex flex-row justify-between mt-1">
        {/* tvl */}
        <Box className="flex flex-row w-1/2 justify-between p-2 pb-0 h-10">
          <Typography variant="h6" color="stieglitz">
            TVL
          </Typography>
          <Typography variant="h6">
            <span>$518</span>
          </Typography>
        </Box>

        {/* contract */}
        <Box className="flex flex-row w-1/2 justify-between p-2 pb-0 h-10">
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

      {getTotalLiquidityProvidedBox(
        olpEpochData?.totalLiquidityPerStrike!,
        olpEpochData?.strikes!
      )}
    </Box>
  );
};

export default Stats;
