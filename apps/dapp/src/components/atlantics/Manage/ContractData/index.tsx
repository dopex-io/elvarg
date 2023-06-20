import { useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';

import formatDistance from 'date-fns/formatDistance';
import { useBoundStore } from 'store';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import EpochSelector from 'components/atlantics/EpochSelector';
import ContractDataItem from 'components/atlantics/Manage/ContractData/ContractDataItem';
import ExplorerLink from 'components/atlantics/Manage/ContractData/ExplorerLink';
import PoolStrategies from 'components/atlantics/Manage/ContractData/PoolStrategies';
import Typography from 'components/UI/Typography';

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

    if (!atlanticPoolEpochData.isVaultExpired)
      return formatDistance(
        Number(atlanticPoolEpochData.expiry) * 1000,
        Number(new Date())
      );
    else return 'Expired';
  }, [atlanticPoolEpochData]);

  const depositSymbol =
    atlanticPool?.tokens.depositToken === 'USDC'
      ? 'USDC.e'
      : atlanticPool?.tokens.depositToken;

  const renderValues = useMemo(() => {
    if (!atlanticPool || !atlanticPoolEpochData)
      return {
        epochDuration: '...',
        fundingRate: '...',
        fundingAccrued: '...',
        apr: '...',
        utilization: '...',
        premiaAccrued: '...',
        durationType: '...',
      };

    return {
      epochDuration,
      fundingRate: `${
        Number(atlanticPool?.vaultConfig.fundingFee ?? 0) / 100000
      }% / Hour`,
      fundingAccrued: `${formatAmount(
        atlanticPoolEpochData.fundingAccrued,
        3
      )} ${depositSymbol}`,
      apr: `~${formatAmount(atlanticPoolEpochData?.apr, 3)}%`,
      utilization: `${formatAmount(
        atlanticPoolEpochData?.utilizationRate,
        3
      )}%`,
      premiaAccrued: `${formatAmount(
        getUserReadableAmount(atlanticPoolEpochData.premiaAccrued, 6),
        3,
        true
      )} ${depositSymbol}`,
      durationType: `${atlanticPool.durationType[0]}${atlanticPool?.durationType
        .substring(1)
        .toLowerCase()}`,
    };
  }, [atlanticPool, atlanticPoolEpochData, depositSymbol, epochDuration]);

  useEffect(() => {
    if (currentEpoch === 0) return;
    setSelectedEpoch(currentEpoch);
  }, [currentEpoch, setSelectedEpoch]);

  useEffect(() => {
    if (!atlanticPool || Number(atlanticPool.currentEpoch) > selectedEpoch)
      return;
    updateAtlanticPoolEpochData();
  }, [atlanticPool, selectedEpoch, updateAtlanticPoolEpochData]);

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
    <Box className="grid grid-cols-1 divide-umbra border border-umbra rounded-md">
      <Box className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-umbra">
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
                className="my-auto font-semibold font-mono"
                color="stieglitz"
              >
                {renderValues.epochDuration}
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
          value={
            <PoolStrategies
              pair={[atlanticPool?.tokens.underlying, depositSymbol]}
            />
          }
          variant="col"
        />
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-umbra border-t border-umbra">
        <ContractDataItem
          description="Funding Rate"
          value={
            <Typography variant="h6" className="font-semibold">
              {renderValues.fundingRate}
            </Typography>
          }
          variant="row"
        />
        <ContractDataItem
          description="APR"
          value={<Typography variant="h6">{renderValues.apr}</Typography>}
          variant="row"
        />
        <ContractDataItem
          description="Epoch Length"
          value={
            <Typography variant="h6">{renderValues.durationType}</Typography>
          }
          variant="row"
        />
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-umbra border-t border-umbra">
        <ContractDataItem
          description="Utilization"
          value={
            <Typography variant="h6">{renderValues.utilization}</Typography>
          }
          variant="row"
        />
        <ContractDataItem
          description="Funding"
          value={
            <Typography variant="h6">{renderValues.fundingAccrued}</Typography>
          }
          variant="row"
        />
        <ContractDataItem
          description="Premiums"
          value={
            <Typography variant="h6">{renderValues.premiaAccrued}</Typography>
          }
          variant="row"
        />
      </Box>
    </Box>
  );
};

export default ContractData;
