import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
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
    <Box className="grid grid-flow-row grid-cols-2">
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
          <Box
            className={`flex justify-between border-t border-r ${border} border-umbra rounded-${cornerCurve}-xl px-3 py-4`}
            key={index}
          >
            <Typography variant="h6" color="stieglitz">
              {key}
              {Object(statsObject[key])['tooltip'] ? (
                <InfoTooltip
                  id={key}
                  title={Object(statsObject[key])['tooltip']}
                  className="p-1"
                  arrow
                />
              ) : null}
            </Typography>
            {key.includes('Contract') ? (
              <a
                href={`${CHAIN_ID_TO_EXPLORER[chainId]}/address/${String(
                  Object(statsObject[key])['value'] || ''
                )}`}
                className="cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography variant="h6">
                  {smartTrim(
                    String(Object(statsObject[key])['value'] || ''),
                    10
                  )}
                </Typography>
              </a>
            ) : (
              <Typography variant="h6">
                {Object(statsObject[key])?.['value']}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Stats;
