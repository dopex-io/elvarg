import { useEffect, useState } from 'react';

import { Menu } from '@dopex-io/ui';
import useVaultQuery from 'hooks/vaults/query';
import useVaultState, { DurationType } from 'hooks/vaults/state';

import TitleItem from 'components/vaults/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import { VAULTS_V2_DROPDOWN_LIST } from 'constants/tokens';

interface Props {
  selectedToken?: string;
  handleSelectToken: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleBar = (props: Props) => {
  const { selectedToken = 'ETH', handleSelectToken } = props;
  const update = useVaultState((state) => state.update);
  const vault = useVaultState((state) => state.vault);
  const { selectedVault, vaults, updateSelectedVault } = useVaultQuery({
    vaultSymbol: selectedToken,
  });

  const [vaultStats, setVaultStats] = useState<{
    tvl: string;
    apy: string;
    currentPrice: string;
  }>({
    tvl: '0',
    apy: '0',
    currentPrice: '0',
  });

  // set default as index 0 of queried vaults
  // note: bugged
  useEffect(() => {
    if (!selectedVault) return;

    setVaultStats({
      tvl: selectedVault.tvl,
      apy: selectedVault.apy,
      currentPrice: selectedVault.currentPrice,
    });
  }, [selectedToken, selectedVault, vaults]);

  useEffect(() => {
    if (!vault || !vaults[0] || selectedVault) return;
    updateSelectedVault(vaults[0].durationType, vaults[0].isPut);
  }, [vaults, selectedVault, updateSelectedVault, vault]);

  useEffect(() => {
    if (!selectedVault) return;
    update({
      base: selectedVault.underlyingSymbol,
      isPut: selectedVault.isPut,
      durationType: selectedVault.durationType as DurationType,
      currentEpoch: selectedVault.currentEpoch,
      address: selectedVault.contractAddress,
    });
  }, [selectedVault, update]);

  return (
    <div className="flex space-x-4 mb-4">
      <img
        src={`/images/tokens/${selectedToken.toLowerCase()}.svg`}
        className="w-[32px] h-[32px] my-auto border rounded-full border-carbon"
        alt={selectedToken}
      />
      <Menu
        color="mineshaft"
        dropdownVariant="icon"
        handleSelection={handleSelectToken}
        selection={selectedToken?.toUpperCase()}
        data={VAULTS_V2_DROPDOWN_LIST}
      />
      <div className="flex space-x-8">
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="TVL"
          value={formatAmount(vaultStats.tvl, 3, true)}
        />
        <TitleItem symbol="%" label="APY" value={vaultStats.apy} />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Price"
          value={formatAmount(vaultStats.currentPrice, 3)}
        />
      </div>
    </div>
  );
};

export default TitleBar;
