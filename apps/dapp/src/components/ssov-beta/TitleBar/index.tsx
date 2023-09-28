import { useRouter } from 'next/router';

import { Menu } from '@dopex-io/ui';

import useVaultsData from 'hooks/ssov/useVaultsData';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import formatAmount from 'utils/general/formatAmount';

import { MARKETS_MENU } from 'constants/ssov/markets';

import { SsovMenuItem } from 'types/ssov';

interface Props {
  market: SsovMenuItem;
  setSelection: (value: SsovMenuItem) => void;
}

const TitleBar = (props: Props) => {
  const { market, setSelection } = props;

  const router = useRouter();

  const { aggregatedStats } = useVaultsData({ market: market.textContent });

  return (
    <div className="flex space-x-4 mb-4 relative z-10">
      <img
        src={`/images/tokens/${market.textContent.toLowerCase()}.svg`}
        className="w-[32px] h-[32px] my-auto border rounded-full border-carbon"
        alt={market.textContent}
      />
      <Menu
        color="mineshaft"
        dropdownVariant="icon"
        setSelection={(v: SsovMenuItem) => {
          setSelection(v);
          router.push(`/ssov-beta/${v.textContent}`);
        }}
        selection={market}
        data={MARKETS_MENU}
        showArrow
        className="bg-umbra rounded-[10px] w-[100px] h-[200px] overflow-auto"
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
