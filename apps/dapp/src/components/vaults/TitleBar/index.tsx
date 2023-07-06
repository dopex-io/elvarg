import { useEffect, useMemo } from 'react';

import { Menu } from '@dopex-io/ui';

import useVaultQuery from 'hooks/vaults/query';
import useVaultStore from 'hooks/vaults/useVaultStore';

import TitleItem from 'components/vaults/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import { MARKETS_MENU } from 'constants/vaults/markets';

interface Props {
  market?: string;
  handleSelectMarket: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleBar = (props: Props) => {
  const { market = 'ARB', handleSelectMarket } = props;

  const update = useVaultStore((state) => state.update);
  const vault = useVaultStore((state) => state.vault);

  const { vaults, aggregatedStats } = useVaultQuery({
    vaultSymbol: market,
  });

  const selectedVault = useMemo(() => {
    const selected = vaults.find(
      (_vault) =>
        vault.duration === _vault.duration && vault.isPut === _vault.isPut
    );

    return selected;
  }, [vaults, vault]);

  useEffect(() => {
    if (!selectedVault) return;
    update({
      base: selectedVault.underlyingSymbol,
      duration: selectedVault.duration,
      currentEpoch: selectedVault.currentEpoch,
      address: selectedVault.contractAddress,
      underlyingPrice: aggregatedStats?.currentPrice || 0,
      isPut: selectedVault.isPut,
    });
  }, [selectedVault, update, aggregatedStats]);

  return (
    <div className="flex space-x-4 mb-4">
      <img
        src={`/images/tokens/${market.toLowerCase()}.svg`}
        className="w-[32px] h-[32px] my-auto border rounded-full border-carbon"
        alt={market}
      />
      <Menu
        color="mineshaft"
        dropdownVariant="icon"
        handleSelection={handleSelectMarket}
        selection={market}
        data={MARKETS_MENU}
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
