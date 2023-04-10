import InfoTooltip from 'components/UI/InfoTooltip';
import { StatsType } from 'pages/rdpx-v2/perpetual-pools';

import { smartTrim } from 'utils/general';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

interface Props {
  statsObject: Record<string, StatsType>;
  chainId?: number;
}

const Stats = (props: Props) => {
  const { statsObject, chainId = 42161 } = props;

  return (
    <div className="grid grid-flow-row grid-cols-2">
      {Object.keys(statsObject).map((key: string, index) => {
        let cornerCurve;
        let border;

        const len = Object.keys(statsObject).length;

        if (index === 0) cornerCurve = 'tl';
        else if (index === 1) cornerCurve = 'tr';
        else if (index === len - 1) cornerCurve = 'br';
        else if (index === len - 2) cornerCurve = 'bl';

        if (index % 2 === 0 && index !== len - 2) border = 'border-l';
        else if (index === len - 2) border = 'border-b border-l';
        else if (index === len - 1) border = 'border-b';

        return (
          <div
            className={`flex justify-between border-t border-r ${border} border-umbra rounded-${cornerCurve}-xl px-3 py-4`}
            key={index}
          >
            <p className="text-sm text-stieglitz">
              {key}
              {Object(statsObject[key])['tooltip'] ? (
                <InfoTooltip
                  id={key}
                  title={Object(statsObject[key])['tooltip']}
                  className="p-1"
                  arrow
                />
              ) : null}
            </p>
            {key.includes('Contract') ? (
              <a
                href={`${CHAIN_ID_TO_EXPLORER[chainId]}/address/${String(
                  Object(statsObject[key])['value'] || ''
                )}`}
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-sm">
                  {smartTrim(
                    String(Object(statsObject[key])['value'] || ''),
                    10
                  )}
                </p>
              </a>
            ) : (
              <p className="text-sm">{Object(statsObject[key])?.['value']}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
