import { useCallback, useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import formatAmount from 'utils/general/formatAmount';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Exercise from './Exercise';
import Delegate from 'craPages/ssov/components/Delegate';
import Withdraw from 'craPages/ssov/components/Withdraw';

const CustomizedTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

interface ExerciseTableDataProps {
  strikeIndex: number;
  strikePrice: number;
  depositedAmount: number;
  purchasedAmount: number;
  exercisableAmount: number;
  pnlAmount: number;
  isExercisable: boolean;
  isPastEpoch: boolean;
  ssov: 'dpx' | 'rdpx';
  isDelegated: boolean;
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
    isDelegated,
  } = props;

  const [modalState, setModalState] = useState({
    open: false,
    type: 'EXERCISE',
    token: '',
  });

  const MODALS = {
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

  const Modal = MODALS[modalState.type];

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <Modal
        open={modalState.open}
        handleClose={handleClose}
        strikeIndex={strikeIndex}
        ssov={ssov}
        token={tokenSymbol}
        exercisableAmount={exercisableAmount}
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
          {formatAmount(exercisableAmount, 5)}
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
                disabled={!isExercisable}
                color={isExercisable ? 'primary' : 'cod-gray'}
              >
                Exercise
              </CustomButton>
            </span>
          ) : (
            <CustomizedTooltip title="Exercise is available for past epochs. Please wait until the current epoch expires.">
              <span>
                <CustomButton
                  size="medium"
                  disabled
                  className="px-2"
                  color={'cod-gray'}
                >
                  Exercise
                </CustomButton>
              </span>
            </CustomizedTooltip>
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
              {isDelegated ? (
                <MenuItem onClick={handleWithdraw} className="text-white">
                  {'Withdraw'}
                </MenuItem>
              ) : (
                <MenuItem onClick={handleDelegate} className="text-white">
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
