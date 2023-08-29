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
    <div className="flex flex-grow flex-col space-y-3 md:flex-row md:space-y-0 space-x-0 md:space-x-4 my-auto">
      <div className="flex flex-col space-y-2">
        <p className="text-xs text-stieglitz">Select Market</p>
        <div className="flex space-x-3">
          <div className="relative flex my-auto w-[50px] h-[32px]">
            <img
              src={`/images/tokens/${market.split('-')[0].toLowerCase()}.svg`}
              className="absolute w-[32px] h-[32px] z-10 border border-carbon rounded-full"
              alt={market}
            />
            <img
              src={`/images/tokens/${market.split('-')[1].toLowerCase()}.svg`}
              className="absolute left-[18px] w-[32px] h-[32px] border border-carbon rounded-full"
              alt={market}
            />
          </div>
          <Menu
            color="mineshaft"
            dropdownVariant="icon"
            handleSelection={handleSelectMarket}
            selection={market}
            data={MARKETS_MENU}
            className="z-20"
            showArrow
          />
        </div>
      </div>
      <div className="flex space-x-6 place-items-end justify-around">
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
