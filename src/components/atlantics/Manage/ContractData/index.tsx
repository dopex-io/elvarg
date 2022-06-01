import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import formatDistance from 'date-fns/formatDistance';

import Typography from 'components/UI/Typography';
import EpochSelector from 'components/atlantics/EpochSelector';
import ArbiscanLink from 'components/atlantics/Manage/ContractData/ArbiscanLink';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import { AtlanticsContext } from 'contexts/Atlantics';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const ContractData = () => {
  const {
    atlanticPoolData,
    atlanticPoolEpochData,
    selectedEpoch,
    setSelectedEpoch,
  } = useContext(AtlanticsContext);

  const [epochDuration, setEpochDuration] = useState('');

  useEffect(() => {
    (async () => {
      if (!atlanticPoolEpochData) return;
      const epochTimes = atlanticPoolEpochData.epochTimes;

      const duration = formatDistance(
        epochTimes['expiryTime']!.toNumber() * 1000,
        epochTimes['startTime']!.toNumber() * 1000
      );

      setEpochDuration(duration);
    })();
  }, [atlanticPoolEpochData]);

  return (
    <Box className="flex p-3 border border-umbra rounded-xl w-full space-x-8">
      <Box className="space-y-1">
        <Typography variant="h6" className="text-stieglitz">
          Epoch
        </Typography>
        <Box className="flex space-x-2 h-[2.2rem]">
          <EpochSelector
            currentEpoch={atlanticPoolData.currentEpoch}
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
      <Box className="space-y-1">
        <Typography variant="h6" className="text-stieglitz">
          Funding Rate
        </Typography>
        <Box className="flex">
          <Typography
            variant="h6"
            className="font-semibold p-2 bg-umbra rounded-lg"
          >
            {getUserReadableAmount(atlanticPoolData.fundingRate, 18)}%
          </Typography>
        </Box>
      </Box>
      <Box className="space-y-1">
        <Typography variant="h6" className="text-stieglitz">
          Contract
        </Typography>
        <ArbiscanLink address={atlanticPoolData.poolContract} />
      </Box>
      <Box className="space-y-1 h-full">
        <Typography variant="h6" className="text-stieglitz">
          Strategy
        </Typography>
        <Typography
          variant="h6"
          className="flex space-x-2 bg-umbra rounded-lg p-2"
        >
          {atlanticPoolData.expiryType[0]?.toUpperCase() +
            atlanticPoolData.expiryType.substring(1)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ContractData;
