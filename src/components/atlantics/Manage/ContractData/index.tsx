import { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import formatDistance from 'date-fns/formatDistance';

import Typography from 'components/UI/Typography';
import EpochSelector from 'components/atlantics/EpochSelector';
import ExplorerLink from 'components/atlantics/Manage/ContractData/ExplorerLink';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import { AtlanticsContext } from 'contexts/Atlantics';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const ContractData = () => {
  const [currentEpoch, setCurrentEpoch] = useState(0);

  const { selectedPool, selectedEpoch, setSelectedEpoch } =
    useContext(AtlanticsContext);

  const epochDuration = useMemo(() => {
    if (!selectedPool) return;
    return formatDistance(
      Number(selectedPool?.state.expiryTime) * 1000,
      Number(selectedPool?.state.startTime) * 1000
    );
  }, [selectedPool]);

  useEffect(() => {
    (async () => {
      if (!selectedPool || !selectedPool.contracts) return;
      const epoch = await selectedPool.contracts.atlanticPool.currentEpoch();
      setCurrentEpoch(Number(epoch));
    })();
  }, [selectedPool]);

  const vaultStatusMessage = useMemo(() => {
    const expired = selectedPool.state.isVaultExpired;
    const ongoing = selectedPool.state.isVaultReady;
    if (expired) return 'Expired';
    if (ongoing) return 'In Progress';
    return 'In Progress';
  }, [selectedPool.state.isVaultExpired, selectedPool.state.isVaultReady]);

  return (
    <Box className="flex flex-col flex-wrap sm:flex-col md:flex-row p-3 border border-umbra rounded-xl w-auto sm:space-x-0 md:space-x-8 space-y-3 sm:space-y-3 lg:space-y-0">
      <Box className="space-y-3">
        <Box className="flex space-x-1">
          <Typography variant="h6" className="text-stieglitz">
            Epoch
          </Typography>
          {selectedEpoch === Number(selectedPool?.state.epoch) ? (
            <Typography variant="h6" className="text-wave-blue">
              ({vaultStatusMessage})
            </Typography>
          ) : null}
        </Box>
        <Box className="flex space-x-2 h-[2.2rem]">
          <EpochSelector
            currentEpoch={currentEpoch}
            selectedEpoch={selectedEpoch}
            setSelectedEpoch={setSelectedEpoch}
          />
          <Box className="flex space-x-3 p-2 rounded-lg bg-umbra">
            <AlarmIcon fill="#8E8E8E" />
            <Typography variant="h6" className="my-auto font-semibold">
              {epochDuration === 'less than a minute' ? '...' : epochDuration}
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
            {!selectedPool?.config.baseFundingRate.isZero()
              ? getUserReadableAmount(
                  selectedPool?.config.baseFundingRate.toNumber()! * 100,
                  6
                ) + '%'
              : '...'}
          </Typography>
        </Box>
      </Box>
      <Box className="space-y-3">
        <Typography variant="h6" className="text-stieglitz">
          Current price
        </Typography>
        <Typography variant="h6" className="my-auto p-2 font-semibold">
          ${formatAmount(selectedPool?.underlyingPrice, 3)}
        </Typography>
      </Box>
      <Box className="space-y-3">
        <Typography variant="h6" className="text-stieglitz">
          Contract
        </Typography>
        <ExplorerLink
          address={selectedPool?.contracts?.atlanticPool.address ?? '...'}
        />
      </Box>
    </Box>
  );
};

export default ContractData;
