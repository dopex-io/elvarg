import { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import formatDistance from 'date-fns/formatDistance';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import EpochSelector from 'components/atlantics/EpochSelector';
import ExplorerLink from 'components/atlantics/Manage/ContractData/ExplorerLink';
import PoolStrategies from 'components/atlantics/Manage/ContractData/PoolStrategies/PoolStrategies';
import ContractDataItem from 'components/atlantics/Manage/ContractData/ContractDataItem';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import { AtlanticsContext } from 'contexts/Atlantics';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const ContractData = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [utilizationRate, setUtilizationRate] = useState(BigNumber.from(0));

  const { selectedPool, selectedEpoch, setSelectedEpoch } =
    useContext(AtlanticsContext);

  const epochDuration = useMemo(() => {
    if (selectedPool.state.expiryTime.eq(BigNumber.from(0))) return '...';

    if (!selectedPool.state.isVaultExpired)
      return formatDistance(
        Number(selectedPool.state.expiryTime) * 1000,
        Number(new Date())
      );
    else return 'Expired';
  }, [selectedPool]);

  useEffect(() => {
    (async () => {
      if (!selectedPool || !selectedPool.contracts) return;
      const epoch = await selectedPool.contracts.atlanticPool.currentEpoch();
      setCurrentEpoch(Number(epoch));

      const _utilRate =
        await selectedPool.contracts?.atlanticPool.getUtilizationRate(
          selectedEpoch
        );

      setUtilizationRate(_utilRate);
    })();
  }, [selectedPool, selectedEpoch]);

  const vaultStatusMessage = useMemo(() => {
    const expired = selectedPool.state.isVaultExpired;
    const ongoing = selectedPool.state.isVaultReady;
    if (expired) return 'Expired';
    if (ongoing) return 'In Progress';
    return 'In Progress';
  }, [selectedPool.state.isVaultExpired, selectedPool.state.isVaultReady]);

  return (
    <Box className="grid grid-cols-2 md:grid-cols-3 grid-row-4 divide-x divide-y divide-umbra border border-umbra rounded-md">
      <Box className="p-3 space-y-3">
        <Box className="flex space-x-2">
          <Typography variant="h6" color="stieglitz">
            Epoch
          </Typography>
          {selectedEpoch === Number(selectedPool?.state.epoch) ? (
            <Typography variant="h6" color="wave-blue">
              ({vaultStatusMessage})
            </Typography>
          ) : null}
        </Box>
        <Box className="flex space-x-2">
          <EpochSelector
            currentEpoch={currentEpoch}
            selectedEpoch={selectedEpoch}
            setSelectedEpoch={setSelectedEpoch}
          />
          <Box className="flex space-x-3 p-2 rounded-lg bg-umbra">
            <AlarmIcon fill="#8E8E8E" />
            <Typography
              variant="h6"
              className="my-auto font-semibold"
              color="stieglitz"
            >
              {epochDuration === 'less than a minute' ? '...' : epochDuration}
            </Typography>
          </Box>
        </Box>
      </Box>
      <ContractDataItem
        description="Contract"
        value={
          <ExplorerLink
            address={selectedPool?.contracts?.atlanticPool.address ?? '...'}
          />
        }
        variant="col"
      />
      <ContractDataItem
        description="Strategies (1)"
        value={<PoolStrategies />}
        variant="col"
      />
      <ContractDataItem
        description="Funding Rate"
        value={
          <Typography variant="h6" className="font-semibold">
            {!selectedPool?.config.baseFundingRate.isZero()
              ? `${getUserReadableAmount(
                  selectedPool?.config.baseFundingRate.toNumber()! * 100,
                  6
                )}%`
              : '...'}
          </Typography>
        }
        variant="row"
      />
      <ContractDataItem
        description="APR"
        value={<Typography variant="h6">~{selectedPool.apy}%</Typography>}
        variant="row"
      />
      <ContractDataItem
        description="Epoch Length"
        value={
          <Typography variant="h6">
            {selectedPool?.duration
              ? selectedPool?.duration[0] +
                selectedPool?.duration.substring(1).toLowerCase()
              : '...'}
          </Typography>
        }
        variant="row"
      />
      <ContractDataItem
        description="Utilization"
        value={
          <Typography variant="h6">
            {getUserReadableAmount(utilizationRate, 18)}%
          </Typography>
        }
        variant="row"
      />
      <ContractDataItem
        description="Options Sold"
        value={<Typography variant="h6">{'...'}</Typography>}
        variant="row"
      />
      <ContractDataItem
        description="Premiums"
        value={<Typography variant="h6">{'...'}</Typography>}
        variant="row"
      />
    </Box>
  );
};

export default ContractData;
