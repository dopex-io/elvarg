import { Menu } from '@dopex-io/ui';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import formatAmount from 'utils/general/formatAmount';

import { MARKETS_MENU } from 'constants/optionAmm/markets';
import { aggregatedStats } from 'constants/optionAmm/placeholders';

interface Props {
  market: string;
  handleSelectMarket: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleBar = (props: Props) => {
  const { market, handleSelectMarket } = props;

  return (
    <div className="flex space-x-4 my-auto">
      <img
        src={`/images/tokens/${market.toLowerCase()}.svg`}
        className="w-[45px] h-[45px] my-auto border-carbon"
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
          value={formatAmount(aggregatedStats.currentPrice, 3)}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Open Interest"
          value={formatAmount(aggregatedStats.oi, 3, true)}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="24h Volume"
          value={formatAmount(aggregatedStats.volume, 3, true)}
        />
      </div>
    </div>
  );
};

export default TitleBar;
