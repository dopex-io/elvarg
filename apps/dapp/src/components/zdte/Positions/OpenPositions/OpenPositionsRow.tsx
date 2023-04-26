import { ReactNode, useCallback } from 'react';

import IosShare from '@mui/icons-material/IosShare';
import { IconButton, TableRow } from '@mui/material';
import useShare from 'hooks/useShare';
import Countdown from 'react-countdown';

import { IZdteExpiredData, IZdtePurchaseData } from 'store/Vault/zdte';

import { Typography } from 'components/UI';
import {
  StyleCell,
  StyleLeftCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';
import { FormatDollarColor } from 'components/zdte/OptionsTable/OptionsTableRow';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

function getStrikeDisplay(position: IZdtePurchaseData): ReactNode {
  const longStrike = formatAmount(
    getUserReadableAmount(position.longStrike, DECIMALS_STRIKE)
  );
  const shortStrike = formatAmount(
    getUserReadableAmount(position.shortStrike, DECIMALS_STRIKE)
  );

  let prefix = '';
  let suffix = '';
  if (!position.isSpread) {
    return <span>unknown position</span>;
  } else if (shortStrike !== undefined && longStrike > shortStrike) {
    prefix = `${longStrike}-P`;
    suffix = `${shortStrike}-P`;
  } else {
    prefix = `${longStrike}-C`;
    suffix = `${shortStrike}-C`;
  }
  return (
    <span className="text-sm text-up-only">
      {prefix}
      <span className="text-sm text-white"> / </span>
      <span className="text-sm text-down-bad">{suffix}</span>
    </span>
  );
}

export const OpenPositionsRow = ({
  position,
  idx,
  zdteData,
  staticZdteData,
}: {
  position: IZdtePurchaseData;
  idx: number;
  zdteData: any;
  staticZdteData: any;
}) => {
  const share = useShare((state) => state.open);

  const handleShare = useCallback(
    async (position: IZdtePurchaseData | IZdteExpiredData) => {
      const tokenSymbol = staticZdteData?.baseTokenSymbol.toUpperCase();

      const livePnl = getUserReadableAmount(
        typeof position === 'object' && 'livePnl' in position
          ? position.livePnl
          : position.pnl,
        DECIMALS_USD
      );
      const cost = getUserReadableAmount(position.cost, DECIMALS_USD);
      const pnl = (livePnl / cost - 1) * 100;
      const prefix = position.isPut ? 'Put' : 'Call';

      share({
        title: (
          <Typography variant="h4" className="font-bold shadow-2xl">
            {`${tokenSymbol} ${prefix} Spread ZDTE`}
          </Typography>
        ),
        percentage: pnl,
        customPath: '/zdte/eth',
        stats: [
          {
            name: 'Long Strike Price',
            value: `$${formatAmount(
              getUserReadableAmount(position.longStrike, DECIMALS_STRIKE),
              2
            )}`,
          },
          {
            name: 'Short Strike Price',
            value: `$${formatAmount(
              getUserReadableAmount(position.shortStrike, DECIMALS_STRIKE),
              2
            )}`,
          },
          {
            name: 'Mark Price',
            value: `$${formatAmount(
              getUserReadableAmount(position.markPrice, DECIMALS_STRIKE),
              2
            )}`,
          },
        ],
      });
    },
    [share, zdteData, staticZdteData]
  );

  return (
    <TableRow key={idx} className="text-white mb-2 rounded-lg">
      <StyleLeftCell align="left">
        <span className="text-sm text-white">{getStrikeDisplay(position)}</span>
      </StyleLeftCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          {`$${formatAmount(
            getUserReadableAmount(position.markPrice, DECIMALS_STRIKE),
            2
          )}`}
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          {`${formatAmount(
            getUserReadableAmount(position.positions, DECIMALS_TOKEN),
            2
          )}`}
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <FormatDollarColor
          value={getUserReadableAmount(
            position.livePnl.sub(position.cost),
            DECIMALS_USD
          )}
        />
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          <Countdown
            date={new Date(position.expiry.toNumber() * 1000)}
            renderer={({ hours, minutes }) => {
              return (
                <div className="flex space-x-2">
                  <Typography variant="h6">
                    {hours}h {minutes}m
                  </Typography>
                </div>
              );
            }}
          />
        </Typography>
      </StyleCell>
      <StyleRightCell align="right">
        <div className="flex justify-end">
          <IconButton
            aria-label="share"
            aria-haspopup="true"
            onClick={() => handleShare(position)}
            className="flex"
            size="small"
          >
            <IosShare className="fill-current text-white opacity-90 hover:opacity-100 text-lg" />
          </IconButton>
        </div>
      </StyleRightCell>
    </TableRow>
  );
};
