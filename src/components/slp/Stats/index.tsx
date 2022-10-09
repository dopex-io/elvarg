import React, { useCallback, useMemo } from 'react';
import { Box, MenuItem } from '@mui/material';
import CustomMenuBox from 'components/common/CustomMenuBox';
import ContractBox from 'components/common/ContractBox';
import { useBoundStore } from 'store';
import { getReadableTime } from 'utils/contracts';

const CHAIN_ID = 5;

const Stats = () => {
  const { getSlpContract, slpData, selectedEpoch, setSelectedEpoch } =
    useBoundStore();

  const slpContract = getSlpContract();

  const expiries = useMemo(() => {
    if (!slpData?.expiries) return [];
    return slpData.expiries.map((expiry, index) => {
      return (
        <MenuItem value={index + 1} key={index + 1} className="text-stieglitz">
          {getReadableTime(expiry)}
        </MenuItem>
      );
    });
  }, [slpData?.expiries]);

  const handleSelectEpoch = useCallback(
    (e: { target: { value: any } }) => {
      if (setSelectedEpoch) setSelectedEpoch(Number(e.target.value));
    },
    [setSelectedEpoch]
  );

  return (
    <Box className="flex">
      <Box className="mb-3 mr-2">
        <ContractBox
          chainId={CHAIN_ID}
          contractAddress={slpContract?.address}
        />
      </Box>
      <Box className="mt-2">
        <CustomMenuBox
          data={'Straddles Expiry'}
          values={expiries}
          selectedValue={selectedEpoch}
          handleOnChange={handleSelectEpoch}
        />
      </Box>
    </Box>
  );
};

export default Stats;
