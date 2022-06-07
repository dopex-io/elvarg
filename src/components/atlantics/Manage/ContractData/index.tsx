import { useContext, useEffect, useState } from 'react';
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
  const {
    atlanticPoolData,
    atlanticPoolEpochData,
    selectedEpoch,
    setSelectedEpoch,
    selectedStrategy,
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
    <Box className="flex flex-col flex-wrap sm:flex-col md:flex-row p-3 border border-umbra rounded-xl w-auto sm:space-x-0 md:space-x-8 space-y-3 sm:space-y-3 lg:space-y-0">
      <Box className="space-y-3">
        <Box className="flex space-x-1">
          <Typography variant="h6" className="text-stieglitz">
            Epoch
          </Typography>
          {selectedEpoch === atlanticPoolData.currentEpoch ? (
            <Typography variant="h6" className="text-wave-blue">
              (In Progress)
            </Typography>
          ) : null}
        </Box>
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
      <Box className="space-y-3">
        <Typography variant="h6" className="text-stieglitz">
          Funding Rate
        </Typography>
        <Box className="flex">
          <Typography
            variant="h6"
            className="font-semibold p-2 bg-umbra rounded-lg"
          >
            {getUserReadableAmount(atlanticPoolData.fundingRate, 6)}%
          </Typography>
        </Box>
      </Box>
      <Box className="space-y-3">
        <Typography variant="h6" className="text-stieglitz">
          Contract
        </Typography>
        <ArbiscanLink address={atlanticPoolData.poolContract} />
      </Box>
      <a
        href={`https://arbiscan.io`}
        target="_blank"
        rel="noopener noreferrer"
        className="space-y-3 h-full"
      >
        <Typography variant="h6" className="text-stieglitz">
          Strategy
        </Typography>
        <Box className="flex space-x-2 bg-mineshaft rounded-lg p-2">
          <OpenInNewIcon className="my-auto h-[1rem] w-[1rem]" />

          <Typography variant="h6" className="my-auto">
            {selectedStrategy[0]?.toUpperCase() + selectedStrategy.substring(1)}
          </Typography>
        </Box>
      </a>
    </Box>
  );
};

export default ContractData;
