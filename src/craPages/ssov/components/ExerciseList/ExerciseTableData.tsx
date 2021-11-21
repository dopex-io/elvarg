import { useCallback, useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BigNumber } from 'ethers';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import InfoPopover from 'components/UI/InfoPopover';
import Exercise from './Exercise';
import Delegate from 'craPages/ssov/components/Delegate';
import Withdraw from 'craPages/ssov/components/Withdraw';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

interface ExerciseTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  depositedAmount: number;
  purchasedAmount: number;
  exercisableAmount: BigNumber;
  pnlAmount: number;
  isExercisable: boolean;
  isPastEpoch: boolean;
  ssov: 'dpx' | 'rdpx';
}

const ExerciseTableData = (props: ExerciseTableDataProps) => {
  const {
    strikeIndex,
    strikePrice,
    depositedAmount,
    purchasedAmount,
    exercisableAmount,
    pnlAmount,
    isExercisable,
    isPastEpoch,
    ssov,
  } = props;

  const [modalState, setModalState] = useState({
    open: false,
    type: 'EXERCISE',
    token: '',
  });

  const [delegated, setDelegated] = useState(false);

  const DIALOGS = {
    EXERCISE: Exercise,
    DELEGATE: Delegate,
    WITHDRAW: Withdraw,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const tokenSymbol = ssov === 'dpx' ? 'DPX' : 'rDPX';

  const handleClose = useCallback(
    () => setModalState((prevState) => ({ ...prevState, open: false })),
    []
  );

  const handleExercise = useCallback(
    () => setModalState({ open: true, type: 'EXERCISE', token: tokenSymbol }),
    [tokenSymbol]
  );

  const handleDelegate = useCallback(
    () => setModalState({ open: true, type: 'DELEGATE', token: tokenSymbol }),
    [tokenSymbol]
  );

  const handleWithdraw = useCallback(
    () => setModalState({ open: true, type: 'WITHDRAW', token: tokenSymbol }),
    [tokenSymbol]
  );

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const Dialog = DIALOGS[modalState.type];

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <Dialog
        open={modalState.open}
        handleClose={handleClose}
        strikeIndex={strikeIndex}
        ssov={ssov}
        token={tokenSymbol}
        exercisableAmount={exercisableAmount}
        setDelegated={setDelegated}
        className="rounded-xl"
      />
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img
              src={ssov === 'dpx' ? '/assets/dpx.svg' : '/assets/rdpx.svg'}
              alt={tokenSymbol}
            />
          </Box>
          <Typography variant="h5" className="text-white">
            {tokenSymbol}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">${formatAmount(strikePrice, 5)}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(depositedAmount, 5)} {tokenSymbol}
        </Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{formatAmount(purchasedAmount, 5)}</Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(exercisableAmount, 18), 5)}
        </Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">{formatAmount(pnlAmount, 5)}</Typography>
      </TableCell>
      <TableCell align="right">
        <Box className="flex justify-end">
          {isPastEpoch ? (
            <span>
              <CustomButton
                size="medium"
                className="px-2"
                onClick={handleExercise}
                disabled={!isExercisable || delegated}
                color={isExercisable ? 'primary' : 'cod-gray'}
              >
                {'Exercise'}
              </CustomButton>
            </span>
          ) : (
            <Box className="flex space-x-1">
              <InfoPopover
                className="my-auto"
                id="exercise-info"
                infoText={`Exercise is available only one hour before expiry of this epoch.`}
              />
              <CustomButton
                size="medium"
                disabled
                className="px-2"
                color={'cod-gray'}
              >
                {delegated ? 'Delegated' : 'Exercise'}
              </CustomButton>
            </Box>
          )}
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClickMenu}
            className="long-menu rounded-md bg-mineshaft mx-1 p-0 hover:bg-opacity-80 hover:bg-mineshaft hidden sm:flex"
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
              {delegated ? (
                <MenuItem onClick={handleWithdraw} className="text-white">
                  {'Withdraw'}
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={handleDelegate}
                  className="text-white"
                  disabled={exercisableAmount.eq(BigNumber.from(0))}
                >
                  {'Auto-Exercise'}
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ExerciseTableData;
