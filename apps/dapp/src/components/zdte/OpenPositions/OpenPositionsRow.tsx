import { ReactNode, SetStateAction, useCallback, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem, TableRow } from '@mui/material';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import useShare from 'hooks/useShare';
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
}: {
  position: IZdtePurchaseData;
  idx: number;
}) => {
  const sendTx = useSendTx();
  const share = useShare((state) => state.open);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    signer,
    provider,
    getZdteContract,
    zdteData,
    updateZdteData,
    staticZdteData,
  } = useBoundStore();

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

  const handleClickMenu = useCallback(
    (event: { currentTarget: SetStateAction<HTMLElement | null> }) =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const handleShare = useCallback(
    async (position: IZdtePurchaseData) => {
      const tokenSymbol = staticZdteData?.baseTokenSymbol.toUpperCase();

      const livePnl = getUserReadableAmount(position.livePnl, DECIMALS_USD);
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
        customPath: '/zdte',
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
            name: 'Current Price',
            value: `$${formatAmount(zdteData!.tokenPrice, 2)}`,
          },
        ],
      });
    },
    [share, zdteData, staticZdteData]
  );

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
        <Box className="flex justify-end">
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
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClickMenu}
            disabled={isPositionExpired}
            className="long-menu rounded-md bg-mineshaft mx-1 p-0 hover:bg-opacity-80 hover:bg-mineshaft flex"
            size="large"
          >
            <MoreVertIcon className="fill-current text-white" />
          </IconButton>
          <Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              classes={{ paper: 'bg-umbra' }}
            >
              <MenuItem
                key="share"
                onClick={() => handleShare(position)}
                className="text-white"
              >
                Share
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </StyleRightCell>
    </TableRow>
  );
};
