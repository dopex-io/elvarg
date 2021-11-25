import { useCallback, useContext, useState, useEffect } from 'react';
import { SSOVDelegator__factory } from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import InfoPopover from 'components/UI/InfoPopover';
import Exercise from '../Dialogs/Exercise';
import AutoExercise from '../Dialogs/AutoExercise';
import Withdraw from '../Dialogs/Withdraw';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

type DelegatedType = 'NONE' | 'PARTIAL' | 'ALL';
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

const DIALOGS = {
  EXERCISE: Exercise,
  AUTO_EXERCISE: AutoExercise,
  WITHDRAW: Withdraw,
};

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

  const { contractAddresses, signer } = useContext(WalletContext);

  const context = useContext(SsovContext);

  const tokenSymbol = ssov === 'dpx' ? 'DPX' : 'rDPX';

  const {
    selectedEpoch,
    ssovData: { epochStrikes },
  } = context[tokenSymbol.toLocaleLowerCase()];

  const [dialogState, setDialogState] = useState({
    open: false,
    type: 'EXERCISE',
    token: '',
  });

  const [delegated, setDelegated] = useState<DelegatedType>('NONE');

  const [delegatedAmount, setDelegatedAmount] = useState(BigNumber.from(0));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = useCallback(
    () => setDialogState((prevState) => ({ ...prevState, open: false })),
    []
  );

  const handleExercise = useCallback(
    () => setDialogState({ open: true, type: 'EXERCISE', token: tokenSymbol }),
    [tokenSymbol]
  );

  const handleAutoExercise = useCallback(
    () =>
      setDialogState({ open: true, type: 'AUTO_EXERCISE', token: tokenSymbol }),
    [tokenSymbol]
  );

  const handleWithdraw = useCallback(
    () => setDialogState({ open: true, type: 'WITHDRAW', token: tokenSymbol }),
    [tokenSymbol]
  );

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const Dialog = DIALOGS[dialogState.type];

  useEffect(() => {
    const updateDelegatedState = async () => {
      const delegatorAddress =
        tokenSymbol === 'DPX'
          ? contractAddresses.SSOV.DPX.SSOVDelegator
          : contractAddresses.SSOV.RDPX.SSOVDelegator;

      const delegator = SSOVDelegator__factory.connect(
        delegatorAddress,
        signer
      );

      const userStrike = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [await signer.getAddress(), epochStrikes[strikeIndex]]
      );

      const delegatedAmount = await delegator
        .connect(signer)
        .balances(userStrike, selectedEpoch);

      let _delegated: DelegatedType = 'NONE';

      if (delegatedAmount.gt(0) && exercisableAmount.eq(0)) {
        _delegated = 'ALL';
      } else if (delegatedAmount.gt(0) && exercisableAmount.gt(0)) {
        _delegated = 'PARTIAL';
      }

      setDelegated(_delegated);

      if (!delegatedAmount.eq(0)) {
        setDelegatedAmount(delegatedAmount);
      }
    };
    updateDelegatedState();
  }, [
    contractAddresses,
    epochStrikes,
    selectedEpoch,
    setDelegated,
    setDelegatedAmount,
    signer,
    strikeIndex,
    tokenSymbol,
    exercisableAmount,
  ]);

  const menuItems = {
    NONE: [
      <MenuItem
        key="auto-exercise"
        onClick={handleAutoExercise}
        className="text-white"
        disabled={exercisableAmount.eq(BigNumber.from(0))}
      >
        Auto-Exercise
      </MenuItem>,
    ],
    PARTIAL: [
      <MenuItem
        key="auto-exercise"
        onClick={handleAutoExercise}
        className="text-white"
        disabled={exercisableAmount.eq(BigNumber.from(0))}
      >
        Auto-Exercise
      </MenuItem>,
      <MenuItem key="withdraw" onClick={handleWithdraw} className="text-white">
        Withdraw
      </MenuItem>,
    ],
    ALL: [
      <MenuItem key="withdraw" onClick={handleWithdraw} className="text-white">
        Withdraw
      </MenuItem>,
    ],
  };

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <Dialog
        open={dialogState.open}
        handleClose={handleClose}
        strikeIndex={strikeIndex}
        ssov={ssov}
        token={tokenSymbol}
        exercisableAmount={exercisableAmount}
        delegatedAmount={delegatedAmount}
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
          {formatAmount(
            getUserReadableAmount(exercisableAmount.add(delegatedAmount), 18),
            5
          )}
        </Typography>
      </TableCell>
      <TableCell align="left" className="px-6 pt-2">
        <Typography variant="h6">
          {pnlAmount > 0 ? `${formatAmount(pnlAmount, 5)} ${tokenSymbol}` : 0}
        </Typography>
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
                {'Exercise'}
              </CustomButton>
            </span>
          ) : (
            <Box className="flex space-x-1">
              <InfoPopover
                className="my-auto"
                id="exercise-info"
                infoText={`Exercise is available only one hour before expiry of this epoch. ${
                  delegated
                    ? 'Delegated options will be auto-exercised on your behalf during the exercise window.'
                    : ''
                }`}
              />
              <CustomButton
                size="medium"
                disabled
                className="px-2"
                color={'cod-gray'}
              >
                {delegated === 'ALL' ? 'Delegated' : 'Exercise'}
              </CustomButton>
            </Box>
          )}
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClickMenu}
            className="long-menu rounded-md bg-mineshaft mx-1 p-0 hover:bg-opacity-80 hover:bg-mineshaft flex"
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
              {menuItems[delegated]}
            </Menu>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ExerciseTableData;
