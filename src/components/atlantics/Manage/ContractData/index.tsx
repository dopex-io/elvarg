import { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import formatDistance from 'date-fns/formatDistance';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Typography from 'components/UI/Typography';
import EpochSelector from 'components/atlantics/EpochSelector';
import ArbiscanLink from 'components/atlantics/Manage/ContractData/ArbiscanLink';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import { AtlanticsContext } from 'contexts/Atlantics';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const ContractData = () => {
  const { selectedPool, selectedEpoch, setSelectedEpoch } =
    useContext(AtlanticsContext);

  const epochDuration = useMemo(() => {
    return formatDistance(
      Number(selectedPool?.state.expiryTime) * 1000,
      Number(selectedPool?.state.startTime) * 1000
    );
  }, [selectedPool?.state.startTime, selectedPool?.state.expiryTime]);

  return (
    <Box className="flex flex-col flex-wrap sm:flex-col md:flex-row p-3 border border-umbra rounded-xl w-auto sm:space-x-0 md:space-x-8 space-y-3 sm:space-y-3 lg:space-y-0">
      <Box className="space-y-3">
        <Box className="flex space-x-1">
          <Typography variant="h6" className="text-stieglitz">
            Epoch
          </Typography>
          {selectedEpoch === Number(selectedPool?.state.epoch!) ? (
            <Typography variant="h6" className="text-wave-blue">
              (In Progress)
            </Typography>
          ) : null}
        </Box>
        <Box className="flex space-x-2 h-[2.2rem]">
          <EpochSelector
            currentEpoch={Number(selectedPool?.state.epoch!)}
            selectedEpoch={selectedEpoch}
            setSelectedEpoch={setSelectedEpoch}
          />
          <Box className="flex space-x-3 p-2 rounded-lg bg-umbra">
            <AlarmIcon fill="#8E8E8E" />
            <Typography variant="h6" className="my-auto font-semibold">
              {epochDuration}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="space-y-3">
        <Typography variant="h6" className="text-stieglitz">
          Funding Rate
        </Typography>
        <Box className="flex">
          <Typography
            variant="h6"
            className="font-semibold p-2 bg-umbra rounded-lg"
          >
            {getUserReadableAmount(
              selectedPool?.config.baseFundingRate.toNumber()! * 100,
              6
            )}
            %
          </Typography>
        </Box>
      </Box>
      <Box className="space-y-3">
        <Typography variant="h6" className="text-stieglitz">
          Contract
        </Typography>
        <ArbiscanLink address={selectedPool?.contracts?.withReader.address!} />
      </Box>
    </Box>
  );
};

export default ContractData;
