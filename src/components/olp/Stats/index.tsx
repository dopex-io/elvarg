import { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { BigNumber } from 'ethers';
import { zipWith } from 'lodash';

import { useBoundStore } from 'store';

import CustomMenuBox from 'components/common/CustomMenuBox';
import ContractBox from 'components/common/ContractBox';
import Typography from 'components/UI/Typography';
import { formatAmount } from 'utils/general';
import { getUserReadableAmount, getReadableTime } from 'utils/contracts';

import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';

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
      <Box className="border rounded border-transparent p-2 ml-3">
        <Typography variant="h6" className="text-gray-400 text-center">
          Total Liquidity Provided
        </Typography>
        {zipWith(
          totalLiquidityPerStrike,
          strikes,
          [...Array(strikes.length).keys()],
          function (liq, strike, idx) {
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
                  ${formatAmount(getUserReadableAmount(liq, DECIMALS_USD))}
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
      if (!setSelectedIsPut) return;
      setSelectedIsPut(isPut);
      await updateOlp();
      await updateOlpEpochData();
      await updateOlpUserData();
    },
    [setSelectedIsPut, updateOlp, updateOlpEpochData, updateOlpUserData]
  );

  function isPutBox(
    isPut: boolean,
    handleIsPut: Function,
    hasPut: boolean,
    hasCall: boolean
  ) {
    return (
      <Box className="flex flex-row border rounded border-transparent p-3">
        <Box>
          <Button
            size="medium"
            className={`text-center mt-1 p-1 cursor-pointer group rounded hover:bg-emerald-500 hover:opacity-80 ${
              !isPut ? 'bg-emerald-500' : ''
            }`}
            disabled={!hasCall}
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
              isPut ? ' bg-down-bad' : ''
            }`}
            disabled={!hasPut}
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

  return (
    <Box className="flex">
      <Box className="flex flex-col">
        <ContractBox chainId={chainId} contractAddress={olpContract?.address} />
        {isPutBox(
          olpData?.isPut!,
          handleIsPut,
          olpData?.hasPut!,
          olpData?.hasCall!
        )}
      </Box>
      <Box className="flex">
        <Box className="border rounded border-transparent p-2 ml-3">
          <CustomMenuBox
            data={'SSOV Expiry'}
            values={expiries}
            selectedValue={selectedEpoch}
            handleOnChange={handleSelectChange}
          />
        </Box>
        {getTotalLiquidityProvidedBox(
          olpEpochData?.totalLiquidityPerStrike!,
          olpEpochData?.strikes!
        )}
      </Box>
    </Box>
  );
};

export default Stats;
