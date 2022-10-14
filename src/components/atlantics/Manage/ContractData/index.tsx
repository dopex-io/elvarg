import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import formatDistance from 'date-fns/formatDistance';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import EpochSelector from 'components/atlantics/EpochSelector';
import ExplorerLink from 'components/atlantics/Manage/ContractData/ExplorerLink';
import PoolStrategy from 'components/atlantics/Manage/ContractData/PoolStrategy';
import ContractDataItem from 'components/atlantics/Manage/ContractData/ContractDataItem';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const ContractData = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);

  const {
    atlanticPool,
    updateAtlanticPoolEpochData,
    atlanticPoolEpochData,
    selectedEpoch,
    setSelectedEpoch,
  } = useBoundStore();

  const epochDuration = useMemo(() => {
    if (!atlanticPoolEpochData) return;

    if (atlanticPoolEpochData.expiry.eq(BigNumber.from(0))) return '...';

    const settlementPrice = atlanticPoolEpochData.settlementPrice;

    if (!atlanticPoolEpochData.isVaultExpired)
      return formatDistance(
        Number(atlanticPoolEpochData.expiry) * 1000,
        Number(new Date())
      );
    else
      return `Expired at $${formatAmount(
        getUserReadableAmount(settlementPrice, 8),
        3
      )}`;
  }, [atlanticPoolEpochData]);

  useEffect(() => {
    updateAtlanticPoolEpochData();
  }, [updateAtlanticPoolEpochData, selectedEpoch]);

  useEffect(() => {
    (async () => {
      if (!atlanticPool) return;
      const epoch = await atlanticPool.contracts.atlanticPool.currentEpoch();
      setCurrentEpoch(Number(epoch));
    })();
  }, [atlanticPool, selectedEpoch]);

  const vaultStatusMessage = useMemo(() => {
    if (!atlanticPoolEpochData) return;
    const expired = atlanticPoolEpochData.isVaultExpired;
    const ongoing = atlanticPoolEpochData.isVaultReady;
    if (expired) return 'Expired';
    if (ongoing) return 'In Progress';
    return 'In Progress';
  }, [atlanticPoolEpochData]);

  return (
    <Box className="grid grid-cols-2 md:grid-cols-3 grid-row-4 divide-x divide-y divide-umbra border border-umbra rounded-md">
      <Box className="p-3 space-y-3">
        <Box className="flex space-x-2">
          <Typography variant="h6" color="stieglitz">
            Epoch
          </Typography>
          {selectedEpoch === Number(atlanticPoolEpochData?.epoch) ? (
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
            address={atlanticPool?.contracts.atlanticPool.address ?? '...'}
          />
        }
        variant="col"
      />
      <ContractDataItem
        description="Strategy"
        value={<PoolStrategy strategyLabel={'Insured Long Perps'} />}
        variant="col"
      />
      <ContractDataItem
        description="Funding Rate"
        value={
          <Typography variant="h6" className="font-semibold">
            {!atlanticPool?.vaultConfig.baseFundingRate.isZero()
              ? `${getUserReadableAmount(
                  atlanticPool?.vaultConfig.baseFundingRate.toNumber()! * 100,
                  6
                )}%`
              : '...'}
          </Typography>
        }
        variant="row"
      />
      <ContractDataItem
        description="APR"
        value={
          <Typography variant="h6">
            ~{formatAmount(atlanticPoolEpochData?.apr, 3)}%
          </Typography>
        }
        variant="row"
      />
      <ContractDataItem
        description="Epoch Length"
        value={
          <Typography variant="h6">
            {atlanticPool?.durationType
              ? atlanticPool?.durationType[0] +
                atlanticPool?.durationType.substring(1).toLowerCase()
              : '...'}
          </Typography>
        }
        variant="row"
      />
      <ContractDataItem
        description="Utilization"
        value={
          <Typography variant="h6">
            {formatAmount(atlanticPoolEpochData?.utilizationRate, 3)}%
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
        value={
          <Typography variant="h6">
            {formatAmount(
              getUserReadableAmount(
                atlanticPoolEpochData?.premiaAccrued ?? '0',
                6
              ),
              3,
              true
            )}{' '}
            {atlanticPool?.tokens.depositToken}
          </Typography>
        }
        variant="row"
      />
    </Box>
  );
};

export default ContractData;
