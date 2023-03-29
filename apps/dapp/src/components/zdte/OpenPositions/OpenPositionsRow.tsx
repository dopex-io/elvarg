import { ReactNode, useCallback } from 'react';

import { Box, TableRow } from '@mui/material';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import Countdown from 'react-countdown';
import { useBoundStore } from 'store';

import { IZdtePurchaseData } from 'store/Vault/zdte';

import { CustomButton, Typography } from 'components/UI';
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
  } else if (shortStrike !== undefined && longStrike < shortStrike) {
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
}: {
  position: IZdtePurchaseData;
  idx: number;
}) => {
  const sendTx = useSendTx();

  const { signer, provider, getZdteContract, updateZdteData } = useBoundStore();

  const zdteContract = getZdteContract();

  const handleCloseOpenPosition = useCallback(async () => {
    if (!signer || !provider || !zdteContract || !position) return;
    try {
      await sendTx(zdteContract.connect(signer), 'expireSpreadOptionPosition', [
        position.positionId,
      ]);
      await updateZdteData();
    } catch (e) {
      console.log('fail to close', e);
    }
  }, [signer, provider, zdteContract, updateZdteData, sendTx, position]);

  const isPositionExpired = position.expiry.toNumber() * 1000 < Date.now();

  return (
    <TableRow key={idx} className="text-white mb-2 rounded-lg">
      <StyleLeftCell align="left">
        <span className="text-sm text-white">{getStrikeDisplay(position)}</span>
      </StyleLeftCell>
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
          value={getUserReadableAmount(position.livePnl, DECIMALS_USD)}
        />
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          <Countdown
            date={new Date(position.expiry.toNumber() * 1000)}
            renderer={({ hours, minutes }) => {
              return (
                <Box className="flex space-x-2">
                  <Typography variant="h6">
                    {hours}h {minutes}m
                  </Typography>
                </Box>
              );
            }}
          />
        </Typography>
      </StyleCell>
      <StyleRightCell align="right" className="pt-2">
        <CustomButton
          className={cx(
            'cursor-pointer text-white',
            !isPositionExpired ? 'bg-umbra' : ''
          )}
          disabled={!isPositionExpired}
          onClick={handleCloseOpenPosition}
        >
          Close
        </CustomButton>
      </StyleRightCell>
    </TableRow>
  );
};
