import { ReactNode, useCallback, useMemo } from 'react';

import useStore, { rdpxV2Actions } from 'hooks/rdpx/useStore';

import TitleItem from 'components/rdpx-v2/TitleBar/TitleItem';

export const rdpxStateToLabelMapping: {
  [key in (typeof rdpxV2Actions)[number]]: string;
} = {
  bond: 'Bonding',
  lp: 'Strategy Vault',
  stake: 'Rewards',
};

const Stat = ({
  name,
  value,
  prefix,
}: {
  name: ReactNode;
  value: ReactNode;
  prefix?: ReactNode;
}) => (
  <div className="flex flex-col text-center">
    <span className="text-white text-[0.5rem] sm:text-[0.8rem]">
      <span className="text-stieglitz">{prefix} </span>
      {value}
    </span>
    <span className="text-stieglitz text-[0.5rem] sm:text-[0.8rem]">
      {name}
    </span>
  </div>
);

const TitleBar = () => {
  const state = useStore((store) => store.state);
  const update = useStore((store) => store.update);

  const onClick = useCallback(
    (index: number) => {
      update(rdpxV2Actions[index]);
    },
    [update],
  );

  const titleBarContent = useMemo(() => {
    const defaultIndex = 0;
    switch (state) {
      case 'bond':
        return {
          index: 0,
          renderComponent: (
            <div className="flex space-x-6 mx-auto mt-3">
              <Stat name="Current Discount" value={'1813.16'} prefix="$" />
              <Stat name="APR" value={'13.1%'} />
              <Stat name="DPXETH Price" value={'1732.55'} prefix="$" />
              <Stat name="RDPX Price" value={'21.5'} prefix="$" />
            </div>
          ),
        };
      case 'lp':
        return {
          index: 1,
          renderComponent: (
            <div className="flex space-x-6 mx-auto mt-3">
              <Stat name="Funding" value={'1.1%'} />
              <Stat name="APR" value={'13.1%'} />
              <Stat name="Utilization" value={'87%'} />
              <Stat name="TVL" value={'2.1m'} prefix="$" />
            </div>
          ),
        };
      case 'stake':
        return { index: 2, renderComponent: <></> };
      default:
        return { index: defaultIndex, renderComponent: <></> };
    }
  }, [state]);

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2 bg-umbra rounded-lg p-1">
        {rdpxV2Actions.map((action, index) => (
          <TitleItem
            onClick={() => onClick(index)}
            key={action}
            active={index === titleBarContent.index}
            label={rdpxStateToLabelMapping[action]}
          />
        ))}
      </div>
      {titleBarContent.renderComponent}
    </div>
  );
};

export default TitleBar;
