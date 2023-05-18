import { ReactNode, useCallback } from 'react';

import { BigNumber } from 'ethers';

import IosShare from '@mui/icons-material/IosShare';
import { IconButton, TableRow } from '@mui/material';
import useShare from 'hooks/useShare';
import Countdown from 'react-countdown';

import { IZdteClosedPositions, IZdteOpenPositions } from 'store/Vault/zdte';

import {
  StyleCell,
  StyleLeftCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';
import {
  FormatDollarColor,
  addZeroes,
} from 'components/zdte/OptionsTable/OptionsTableRow';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

export function roundOrPad(num: number | BigNumber) {
  if (typeof num === 'number') {
    return num.toFixed(2);
  }
  return num.lt(getContractReadableAmount(10, DECIMALS_STRIKE))
    ? addZeroes(formatAmount(getUserReadableAmount(num, DECIMALS_STRIKE), 2))
    : formatAmount(getUserReadableAmount(num, DECIMALS_STRIKE));
}

function getStrikeDisplay(position: IZdteOpenPositions): ReactNode {
  const longStrike = roundOrPad(position.longStrike);
  const shortStrike = roundOrPad(position.shortStrike);

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
  staticZdteData,
}: {
  position: IZdteOpenPositions;
  idx: number;
  staticZdteData: any;
}) => {
  const share = useShare((state) => state.open);

  const handleShare = useCallback(
    async (position: IZdteOpenPositions | IZdteClosedPositions) => {
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
          <h4 className="font-bold shadow-2xl">
            {`${tokenSymbol} ${prefix} Spread ZDTE`}
          </h4>
        ),
        percentage: pnl,
        customPath: '/zdte/eth',
        stats: [
          {
            name: 'Long Strike Price',
            value: `$${roundOrPad(position.longStrike)}`,
          },
          {
            name: 'Short Strike Price',
            value: `$${roundOrPad(position.shortStrike)}`,
          },
          {
            name: 'Entry Price',
            value: `$${roundOrPad(position.markPrice)}`,
          },
        ],
      });
    },
    [share, staticZdteData]
  );

  return (
    <TableRow key={idx} className="text-white mb-2 rounded-lg">
      <StyleLeftCell align="left">
        <span className="text-sm text-white">{getStrikeDisplay(position)}</span>
      </StyleLeftCell>
      <StyleLeftCell align="left">
        <span className="text-sm text-white">{`$${formatAmount(
          getUserReadableAmount(position.breakeven, DECIMALS_STRIKE),
          2
        )}`}</span>
      </StyleLeftCell>
      <StyleCell align="left">
        <h6 className="text-white">
          {`$${formatAmount(
            getUserReadableAmount(position.markPrice, DECIMALS_STRIKE),
            2
          )}`}
        </h6>
      </StyleCell>
      <StyleCell align="left">
        <h6 className="text-white">
          {`${formatAmount(
            getUserReadableAmount(position.positions, DECIMALS_TOKEN),
            2
          )}`}
        </h6>
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
        <h6 className="text-white">
          <Countdown
            date={new Date(position.expiry.toNumber() * 1000)}
            renderer={({ hours, minutes }) => {
              return (
                <div className="flex space-x-2">
                  <h6 className="text-white">
                    {hours}h {minutes}m
                  </h6>
                </div>
              );
            }}
          />
        </h6>
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
