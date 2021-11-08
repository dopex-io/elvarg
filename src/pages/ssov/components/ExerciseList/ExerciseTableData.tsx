import { useCallback, useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import formatAmount from 'utils/general/formatAmount';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import dpxIcon from 'assets/tokens/dpx.svg';
import rdpxIcon from 'assets/tokens/rdpx.svg';
import Exercise from './Exercise';

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
  ssov: string;
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
  });

  const MODALS = {
    EXERCISE: Exercise,
  };

  const handleClose = useCallback(
    () => setModalState((prevState) => ({ ...prevState, open: false })),
    []
  );

  const handleExercise = useCallback(
    () => setModalState({ open: true, type: 'EXERCISE' }),
    []
  );

  const Modal = MODALS[modalState.type];
  const tokenSymbol = ssov === 'ssovDpx' ? 'DPX' : 'rDPX';

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <Modal
        open={modalState.open}
        handleClose={handleClose}
        strikeIndex={strikeIndex}
        ssov={ssov}
        className="rounded-xl"
      />
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img
              src={ssov === 'ssovDpx' ? dpxIcon : rdpxIcon}
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
          {formatAmount(depositedAmount, 5)}
          {' DPX'}
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
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ExerciseTableData;
