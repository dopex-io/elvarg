import { useCallback, useContext, useState, useMemo } from 'react';
import { BigNumber } from 'ethers';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { SsovV3Context } from 'contexts/SsovV3';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import InfoPopover from 'components/UI/InfoPopover';
import Transfer from '../Dialogs/Transfer';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

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
  SETTLE: Transfer,
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

  const { ssovData, ssovEpochData, selectedSsovV3 } = useContext(SsovV3Context);

  const isPut = useMemo(() => selectedSsovV3.type === 'PUT', [selectedSsovV3]);

  const tokenSymbol = 'WETH';

  const { isEpochExpired } = ssovEpochData;

  const [dialogState, setDialogState] = useState({
    open: false,
    type: 'SETTLE',
    ssovData,
  });

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

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const settleableBooleans = useMemo(() => {
    if (isEpochExpired) {
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
  }, [isEpochExpired, isSettleable]);

  const Dialog = DIALOGS[dialogState.type];

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <Dialog
        open={dialogState.open}
        handleClose={handleClose}
        strikeIndex={strikeIndex}
        ssovData={ssovData}
        token={tokenSymbol}
        settleableAmount={settleableAmount}
        className="rounded-xl"
      />
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img src={'/assets/eth.svg'} alt={tokenSymbol} />
          </Box>
          <Typography variant="h5" className="text-white">
            WETH
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
            ? `${formatAmount(
                getUserReadableAmount(pnlAmount, 18),
                5
              )} ${tokenSymbol}`
            : `0 ${tokenSymbol}`}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box className="flex justify-end">
          {!isEpochExpired && (
            <InfoPopover
              className="my-auto"
              id="settle-info"
              infoText="Settle is available only after expiry of this epoch."
            />
          )}
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
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ExerciseTableData;
