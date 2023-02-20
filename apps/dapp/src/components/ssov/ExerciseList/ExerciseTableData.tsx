import { useCallback, useState, useMemo, SetStateAction } from 'react';
import { BigNumber } from 'ethers';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { format } from 'date-fns';

import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import Settle from './Dialogs/Settle';
import Transfer from './Dialogs/Transfer';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import ShareDialog from 'components/common/ShareDialog/ShareDialog';
import getPercentageDifference from 'utils/math/getPercentageDifference';

interface ExerciseTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  purchasedAmount: number;
  settleableAmount: BigNumber;
  pnlAmount: BigNumber;
  isSettleable: boolean;
  isPastEpoch: boolean;
}

const DIALOGS = {
  SETTLE: Settle,
  TRANSFER: Transfer,
};

const ExerciseTableData = (props: ExerciseTableDataProps) => {
  const {
    strikeIndex,
    strikePrice,
    purchasedAmount,
    settleableAmount,
    pnlAmount,
    isSettleable,
  } = props;

  const { ssovData, ssovEpochData } = useBoundStore();

  const [dialogState, setDialogState] = useState({
    open: false,
    type: 'SETTLE',
    ssovData,
  });
  const [share, setShare] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = useCallback(
    () => setDialogState((prevState) => ({ ...prevState, open: false })),
    []
  );

  const handleTransfer = useCallback(
    () =>
      setDialogState({
        open: true,
        type: 'TRANSFER',
        ssovData,
      }),
    [ssovData]
  );
  const handleSettle = useCallback(
    () =>
      setDialogState({
        open: true,
        type: 'SETTLE',
        ssovData,
      }),
    [ssovData]
  );

  const handleShare = () => {
    setShare(true);
  };

  const handleClickMenu = useCallback(
    (event: { currentTarget: SetStateAction<HTMLElement | null> }) =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const settleableBooleans = useMemo(() => {
    // @ts-ignore TODO: FIX
    if (ssovEpochData.isEpochExpired) {
      if (isSettleable) {
        return {
          settleButtonDisable: false,
          settleButtonPrimaryColor: true,
        };
      } else {
        return {
          settleButtonDisable: true,
          settleButtonPrimaryColor: false,
        };
      }
    } else
      return {
        settleButtonDisable: true,
        settleButtonPrimaryColor: false,
      };
  }, [ssovEpochData, isSettleable]);

  // @ts-ignore TODO: FIX
  const Dialog = DIALOGS[dialogState.type];

  const tokenPrice = getUserReadableAmount(ssovData?.tokenPrice || 0, 8);

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <ShareDialog
        open={share}
        handleClose={() => {
          setShare(false);
        }}
        shareImageProps={{
          title: (
            <Typography variant="h4" className="font-bold shadow-2xl">
              {ssovData?.underlyingSymbol} {ssovData?.isPut ? 'PUT' : 'CALL'}{' '}
              Options
            </Typography>
          ),
          percentage: ssovData?.isPut
            ? getPercentageDifference(tokenPrice, strikePrice)
            : getPercentageDifference(strikePrice, tokenPrice),
          customPath: '/ssov',
          stats: [
            { name: 'Strike Price', value: formatAmount(strikePrice, 2) },
            { name: 'Mark Price', value: formatAmount(tokenPrice, 2) },
            {
              name: 'Expiry',
              value: format(
                (ssovEpochData?.epochTimes[1]?.toNumber() || 0) * 1000,
                'do MMM'
              ),
            },
          ],
        }}
      />
      <Dialog
        open={dialogState.open}
        handleClose={handleClose}
        strikeIndex={strikeIndex}
      />
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img
              src={`/images/tokens/${
                ssovData?.underlyingSymbol?.toLowerCase() || 'unknown'
              }.svg`}
              alt={ssovData?.underlyingSymbol || 'token'}
            />
          </Box>
          <Typography variant="h5" className="text-white">
            {ssovData?.underlyingSymbol}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">${formatAmount(strikePrice, 5)}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{formatAmount(purchasedAmount, 5)}</Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(settleableAmount, 18), 5)}
        </Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {pnlAmount.gte(0)
            ? `${formatAmount(getUserReadableAmount(pnlAmount, 18), 5)} ${
                ssovData?.collateralSymbol
              }`
            : `0 ${ssovData?.collateralSymbol}`}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box className="flex justify-end">
          <CustomButton
            size="medium"
            className="px-2"
            onClick={handleSettle}
            disabled={settleableBooleans.settleButtonDisable}
            color={
              settleableBooleans.settleButtonPrimaryColor
                ? 'primary'
                : 'cod-gray'
            }
          >
            Settle
          </CustomButton>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClickMenu}
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
                key="transfer-options"
                onClick={handleTransfer}
                className="text-white"
                disabled={settleableAmount.eq(BigNumber.from(0))}
              >
                Transfer
              </MenuItem>
            </Menu>
          </Box>
          <Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              classes={{ paper: 'bg-umbra' }}
            >
              <MenuItem
                key="share"
                onClick={handleShare}
                className="text-white"
              >
                Share
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ExerciseTableData;
