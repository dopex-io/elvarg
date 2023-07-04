import { useEffect } from 'react';

import { Menu } from '@dopex-io/ui';

import useVaultQuery from 'hooks/vaults/query';
import useVaultState, { DurationType } from 'hooks/vaults/state';

import TitleItem from 'components/vaults/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import { VAULTS_MENU } from 'constants/vaults/dropdowns';

interface Props {
  selectedToken?: string;
  handleSelectToken: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleBar = (props: Props) => {
  const { selectedToken = 'wstETH', handleSelectToken } = props;
  const update = useVaultState((state) => state.update);
  const vault = useVaultState((state) => state.vault);
  const { selectedVault, vaults, updateSelectedVault, aggregatedStats } =
    useVaultQuery({
      vaultSymbol: selectedToken,
    });

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
        selection={selectedToken}
        data={VAULTS_MENU}
        className="z-20"
        showArrow
      />
      <div className="flex space-x-6">
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Mark Price"
          value={formatAmount(aggregatedStats?.currentPrice, 3)}
        />
        <TitleItem
          symbol="%"
          label="Open Interest"
          value={formatAmount(aggregatedStats?.oi, 3, true)}
        />
        <TitleItem
          symbol="%"
          label="APY"
          value={(aggregatedStats?.apy || 0).toString()}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Total Volume"
          value={formatAmount(aggregatedStats?.volume || 0, 3, true)}
        />
      </div>
    </div>
  );
};

export default TitleBar;
