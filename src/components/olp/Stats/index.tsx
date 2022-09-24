import React, { useCallback, useMemo } from 'react';
import { Select, Box, Button, MenuItem } from '@mui/material';
import { BigNumber } from 'ethers';
import { zipWith } from 'lodash';
import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';
import Typography from 'components/UI/Typography';
import {
  getExtendedLogoFromChainId,
  formatAmount,
  displayAddress,
  getExplorerUrl,
} from 'utils/general';
import { getUserReadableAmount, getReadableTime } from 'utils/contracts';
import { OptionTokenInfoInterface } from 'store/Vault/olp';
import { useBoundStore } from 'store';

const CHAIN_ID = 5;

const Stats = () => {
  const {
    getOlpContract,
    olpData,
    olpEpochData,
    selectedEpoch,
    selectedIsPut,
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
        <MenuItem value={index + 1} key={index + 1} className="text-stieglitz">
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

  function expiriesMenuBox(expiries: JSX.Element[]) {
    return (
      <Box className="border rounded border-transparent p-2 ml-3">
        <Typography variant="h6" className="mb-1 text-gray-400 text-center">
          SSOV Expiry
        </Typography>
        <Select
          className="text-white text-md h-8 bg-gradient-to-r from-cyan-500 to-blue-700"
          MenuProps={{
            sx: {
              '.MuiMenu-paper': {
                background: 'black',
                color: 'white',
                fill: 'white',
              },
              '.Mui-selected': {
                background:
                  'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
              },
            },
          }}
          displayEmpty
          autoWidth
          value={selectedEpoch! || 0}
          onChange={handleSelectChange}
        >
          {expiries}
        </Select>
      </Box>
    );
  }

  function getTotalLiquidityProvidedBox(
    optionsInfo: OptionTokenInfoInterface[],
    strikes: BigNumber[]
  ) {
    return (
      <Box className="border rounded border-transparent p-2 ml-3">
        <Typography variant="h6" className="text-gray-400 text-center">
          Total Liquidity Provided
        </Typography>
        {zipWith(
          optionsInfo,
          strikes,
          [...Array(strikes.length).keys()],
          function (info, strike, idx) {
            return (
              <Box key={idx} className="flex justify-between">
                <Typography variant="h6" className="text-white text-right mt-3">
                  $
                  {formatAmount(
                    getUserReadableAmount(strike, DECIMALS_STRIKE),
                    2
                  )}
                </Typography>
                <Typography variant="h6" className="text-white text-right mt-3">
                  $
                  {formatAmount(
                    getUserReadableAmount(info.tokenLiquidity, DECIMALS_USD)
                  )}
                </Typography>
              </Box>
            );
          }
        )}
      </Box>
    );
  }

  const handleIsPut = useCallback(
    async (isPut: boolean) => {
      if (!setSelectedIsPut || !updateOlpEpochData) return;
      setSelectedIsPut(isPut);
      await updateOlp();
      await updateOlpEpochData();
      await updateOlpUserData();
    },
    [setSelectedIsPut, updateOlp, updateOlpEpochData, updateOlpUserData]
  );

  function isPutBox(selectedPut: boolean, handleIsPut: Function) {
    return (
      <Box className="flex flex-row border rounded border-transparent p-3">
        <Box>
          <Button
            size="medium"
            className={`text-center mt-1 p-1 cursor-pointer group rounded hover:bg-emerald-500 hover:opacity-80 ${
              !selectedPut ? 'bg-emerald-500' : ''
            }`}
            onClick={() => handleIsPut(false)}
          >
            <Typography variant="h6" className="rounded-lg">
              Call
            </Typography>
          </Button>
        </Box>
        <Box>
          <Button
            size="medium"
            className={`text-center mt-1 p-1 cursor-pointer group rounded hover:bg-down-bad hover:opacity-80 ${
              selectedPut ? ' bg-down-bad' : ''
            }`}
            onClick={() => handleIsPut(true)}
          >
            <Typography variant="h6" className="rounded-lg">
              Put
            </Typography>
          </Button>
        </Box>
      </Box>
    );
  }

  function getContract() {
    return (
      <Box className="border rounded border-transparent p-2">
        <Typography variant="h6" className="mb-1 text-gray-400">
          Contract
        </Typography>
        <Button
          size="medium"
          color="secondary"
          className="text-white text-md h-8 p-2 hover:text-gray-200 hover:bg-slate-800 bg-slate-700"
        >
          <img
            className="w-auto h-6 mr-2"
            src={getExtendedLogoFromChainId(CHAIN_ID)}
            alt={'Arbitrum'}
          />
          <a
            className={'cursor-pointer'}
            href={`${getExplorerUrl(CHAIN_ID)}/address/${olpContract?.address}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Typography variant="h5" className="text-white text-[11px]">
              {displayAddress(olpContract?.address, undefined)}
            </Typography>
          </a>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="flex">
      <Box className="flex flex-col">
        {getContract()}
        {isPutBox(selectedIsPut!, handleIsPut)}
      </Box>
      <Box className="flex">
        {expiriesMenuBox(expiries)}
        {getTotalLiquidityProvidedBox(
          olpEpochData?.optionTokens!,
          olpEpochData?.strikes!
        )}
      </Box>
    </Box>
  );
};

export default Stats;
