import { Menu } from '@dopex-io/ui';

import useVaultsData from 'hooks/ssov/useVaultsData';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import { MARKETS_MENU } from 'constants/ssov/markets';

interface Props {
  market: string;
  handleSelectMarket: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleBar = (props: Props) => {
  const { market, handleSelectMarket } = props;

  const { aggregatedStats } = useVaultsData({ market });

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
          symbol="$"
          symbolPrefixed
          label="Open Interest"
          value={formatAmount(aggregatedStats?.oi, 3, true)}
        />
        {/* TODO: 24h Volume <TitleItem
          symbol="$"
          symbolPrefixed
          label="24h Volume"
          value={formatAmount(aggregatedStats?.volume || 0, 3, true)}
        /> */}
      </div>
    </div>
  );
};

export default TitleBar;
