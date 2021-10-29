import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import cx from 'classnames';
import format from 'date-fns/format';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BigNumber } from 'ethers';
import Countdown from 'react-countdown';
import { ethers } from 'ethers';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import MaxApprove from 'components/MaxApprove';
import DepositOpen from 'assets/icons/DepositOpen';
import DepositClosed from 'assets/icons/DepositClosed';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';
import { AssetsContext } from 'contexts/Assets';

import { newEthersTransaction } from 'utils/contracts/transactions';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { MAX_VALUE } from 'constants/index';

import styles from './styles.module.scss';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      width: 279,
    },
  })
);

const Deposit = () => {
  const classes = useStyles();
  const {
    ssovSdk,
    nextEpoch,
    dpxToken,
    currentEpochSsovData: {
      epochTimes,
      isVaultReady,
      isEpochExpired,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochDeposits,
      userEpochStrikeDeposits,
      userEpochDeposits,
    },
    updateNextEpochSsovData,
  } = useContext(SsovContext);
  const { updateAssetBalances } = useContext(AssetsContext);
  const { accountAddress } = useContext(WalletContext);

  console.log(isVaultReady);

  const [selectedStrikeIndexes, setSelectedStrikeIndexes] = useState<number[]>(
    []
  );
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: string;
  }>({});

  const isDepositWindowOpen = useMemo(() => {
    if (isVaultReady || !isEpochExpired) return false;
    return true;
  }, [isVaultReady, isEpochExpired]);

  const totalDepositAmount = selectedStrikeIndexes.reduce(
    (accumulator, currentIndex) =>
      accumulator.add(
        ethers.utils.parseUnits(strikeDepositAmounts[currentIndex] || '0', 8)
      ),
    BigNumber.from(0)
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [maxApprove, setMaxApprove] = useState(false);
  const [error, setError] = useState('');

  // Ssov data for next epoch
  const epochEndTime = epochTimes[1]
    ? format(new Date(epochTimes[1] * 1000), 'MM/dd')
    : 'N/A';

  const epochStartTime = epochTimes[0]
    ? format(new Date(epochTimes[0] * 1000), 'MM/dd')
    : 'N/A';

  const strikes = epochStrikes.map((strike) =>
    getUserReadableAmount(strike, 8).toString()
  );

  const totalEpochStrikeDepositsAmounts = totalEpochStrikeDeposits.map(
    (deposit) => getUserReadableAmount(deposit, 18)
  );

  const totalEpochDepositsAmount = getUserReadableAmount(
    totalEpochDeposits,
    18
  );

  const userEpochStrikeDepositsAmounts = userEpochStrikeDeposits.map(
    (deposit) => getUserReadableAmount(deposit, 18)
  );

  const userEpochDepositsAmount = getUserReadableAmount(userEpochDeposits, 18);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
    classes: {
      paper: '',
    },
  };

  // Handles strikes & deposit amounts
  const handleSelectStrikes = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedStrikeIndexes((event.target.value as number[]).sort());
  };

  const inputStrikeDepositAmount = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStrikeDepositAmounts((prevState) => ({
      ...prevState,
      [index]: e.target.value,
    }));
  };

  useEffect(() => {
    if (totalDepositAmount.gte(BigNumber.from(10000000000))) {
      setError('Deposit amount cannot exceed 100 DPX');
    } else if (totalEpochDeposits.lte(BigNumber.from(2500000000000))) {
      console.log(totalDepositAmount.toString());
      setError('Max deposits have been met. Deposits are no longer possible.');
    } else {
      setError('');
    }
  }, [totalDepositAmount, totalEpochDeposits]);

  // Handles isApproved
  useEffect(() => {
    if (!dpxToken || !ssovSdk) return;
    (async function () {
      const finalAmount = getContractReadableAmount(
        totalDepositAmount.toString(),
        18
      );

      let allowance = await dpxToken.allowance(
        accountAddress,
        ssovSdk.call.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [accountAddress, totalDepositAmount, dpxToken, ssovSdk]);

  const handleApprove = useCallback(async () => {
    const finalAmount = getContractReadableAmount(
      totalDepositAmount.toString(),
      18
    );
    try {
      await newEthersTransaction(
        dpxToken.approve(
          ssovSdk.call.address,
          maxApprove ? MAX_VALUE : finalAmount.toString()
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [totalDepositAmount, maxApprove, dpxToken, ssovSdk]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    try {
      if (totalDepositAmount.gte(BigNumber.from(10000000000))) {
        return;
      }
      const strikeIndexes = selectedStrikeIndexes.filter(
        (index) =>
          strikeDepositAmounts[index] &&
          BigNumber.from(strikeDepositAmounts[index]).gt('0')
      );

      await newEthersTransaction(
        ssovSdk.send.depositMultiple(
          strikeIndexes,
          strikeIndexes.map((index) =>
            getContractReadableAmount(
              strikeDepositAmounts[index],
              18
            ).toString()
          )
        )
      );
      setStrikeDepositAmounts(() => ({}));
      setSelectedStrikeIndexes(() => []);
      updateAssetBalances();
      updateNextEpochSsovData();
    } catch (err) {
      console.log(err);
    }
  }, [
    totalDepositAmount,
    selectedStrikeIndexes,
    ssovSdk,
    strikeDepositAmounts,
    updateNextEpochSsovData,
    updateAssetBalances,
  ]);

  return (
    <Box>
      <Box className="bg-umbra flex flex-col p-4 rounded-xl justify-between mb-2">
        <Box className="flex flex-row mb-4">
          <Typography variant="h6" className="mr-2 text-stieglitz">
            Select Strike Prices
          </Typography>
        </Box>
        <Box>
          {selectedStrikeIndexes.map((index) => (
            <Box key={index} className="flex flex-row justify-between pb-3">
              <Box className="bg-mineshaft py-2 px-4 rounded-md h-10 w-24">
                <Typography variant="h6" className="text-center">
                  ${strikes[index]}
                </Typography>
              </Box>
              <Box className="border-umbra rounded-xl border w-24">
                <Input
                  disableUnderline={true}
                  value={strikeDepositAmounts[index] || ''}
                  placeholder="0"
                  inputProps={{
                    min: 0,
                    type: 'number',
                  }}
                  onChange={(e) => inputStrikeDepositAmount(index, e)}
                  className="h-10 text-sm text-white ml-2 border-mineshaft border rounded-md"
                  classes={{ input: 'text-center' }}
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Box>
          <FormControl variant="outlined" className={cx(classes.formControl)}>
            <Select
              className={cx(
                styles.SelectSize,
                'bg-mineshaft rounded-md px-2 text-white'
              )}
              multiple
              displayEmpty
              disableUnderline
              value={selectedStrikeIndexes}
              onChange={handleSelectStrikes}
              input={<Input />}
              variant="outlined"
              renderValue={() => {
                return (
                  <Typography
                    variant="h6"
                    className="text-white text-center w-full relative"
                  >
                    Strike Prices
                  </Typography>
                );
              }}
              MenuProps={MenuProps}
              inputProps={{
                style: {
                  color: '#3E3E3E',
                },
              }}
              classes={{ icon: 'absolute right-20 text-white' }}
              label="strikes"
            >
              {strikes.map((strike, index) => (
                <MenuItem key={index} value={index}>
                  <Checkbox
                    color="default"
                    checked={selectedStrikeIndexes.indexOf(index) > -1}
                  />
                  <ListItemText primary={strike} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography
            variant="caption"
            component="div"
            className="text-down-bad text-left mt-5"
          >
            {error}
          </Typography>
        </Box>
      </Box>

      <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-2">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-left"
        >
          Allocation
        </Typography>
        <Typography variant="caption" component="div">
          {getUserReadableAmount(totalDepositAmount, 8).toString()} DPX
        </Typography>
      </Box>
      <Box className="`flex flex-row border-umbra rounded-xl border p-4 mb-2">
        <Box className="mr-4">
          {isVaultReady ? <DepositClosed /> : <DepositOpen />}
        </Box>
        <Box className="flex flex-col">
          <Typography
            variant="caption"
            component="div"
            className="mb-4 text-left"
          >
            Epoch {nextEpoch}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz text-left"
          >
            {isDepositWindowOpen
              ? `Deposits for this epoch has been closed.`
              : `Deposits for this epoch are now open.`}
            <br />
            <br />
            {isVaultReady ? (
              <Countdown
                date={new Date(epochTimes[1] * 1000)}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return (
                      <span className="text-wave-blue">
                        This epoch has expired.
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-wave-blue">
                        Time left: {days}d {hours}h {minutes}m {seconds}s
                      </span>
                    );
                  }
                }}
              />
            ) : null}
          </Typography>
        </Box>
      </Box>
      <Box>
        {isVaultReady || totalDepositAmount.isZero() ? (
          <CustomButton size="large" className="w-full" disabled>
            {isVaultReady ? 'Closed' : 'Enter an amount'}
          </CustomButton>
        ) : approved ? (
          <CustomButton
            size="large"
            className="w-full"
            onClick={handleDeposit}
            disabled={Boolean(error)}
          >
            Deposit
          </CustomButton>
        ) : (
          <Box className="flex flex-col">
            <MaxApprove value={maxApprove} setValue={setMaxApprove} />
            <Box className="flex flex-row mt-2">
              <CustomButton
                size="large"
                className="w-11/12 mr-1"
                onClick={handleApprove}
              >
                Approve
              </CustomButton>
              <CustomButton size="large" className="w-11/12 ml-1" disabled>
                Deposit
              </CustomButton>
            </Box>
          </Box>
        )}
      </Box>
      <Accordion className="bg-umbra shadow-none rounded-xl mt-4">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-stieglitz" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          `
          <Box className="flex flex-row justify-between w-full items-center">
            <Typography variant="h6" className="text-stieglitz">
              My Deposits
            </Typography>
            <Typography variant="h6">
              <span className="text-wave-blue">
                {userEpochDepositsAmount.toFixed(3)}
              </span>{' '}
              / {totalEpochDepositsAmount.toFixed(3)} DPX
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="flex flex-col w-full">
            {strikes.map((strike, index) => (
              <Box
                key={strike}
                className="bg-cod-gray flex flex-col py-2 rounded-xl text-center mb-4"
              >
                <Typography variant="h6">
                  <span className="text-wave-blue">
                    {userEpochStrikeDepositsAmounts[index].toFixed(3)}
                  </span>{' '}
                  / {totalEpochStrikeDepositsAmounts[index].toFixed(3)}
                </Typography>
                <Typography variant="h6" className="text-stieglitz">
                  DPX ${strike}
                </Typography>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Deposit;
