import { formatUnits } from 'viem';

import { Menu } from '@dopex-io/ui';

import useStrikesData from 'hooks/option-amm/useStrikesData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE } from 'constants/index';
import { MARKETS_MENU } from 'constants/optionAmm/markets';
import { aggregatedStats } from 'constants/optionAmm/placeholders';

interface Props {
  market: string;
  handleSelectMarket: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleBar = (props: Props) => {
  const { market, handleSelectMarket } = props;

  const vault = useVaultStore((store) => store.vault);

  const { expiryData } = useStrikesData({
    ammAddress: vault.address,
    isPut: vault.isPut,
    duration: vault.duration,
  });

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
            showArrow
          />
        </div>
      </div>
      <div className="flex space-x-6 place-items-end justify-around">
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Mark Price"
          value={formatAmount(
            formatUnits(expiryData?.markPrice || 0n, DECIMALS_STRIKE),
            3,
          )}
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
