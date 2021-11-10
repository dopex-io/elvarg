import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import cx from 'classnames';
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
import { BigNumber, utils as ethersUtils } from 'ethers';
import Countdown from 'react-countdown';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import MaxApprove from 'components/MaxApprove';
import DepositOpen from 'assets/icons/DepositOpen';
import DepositClosed from 'assets/icons/DepositClosed';
import BasicInput from 'components/UI/BasicInput';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';
import { AssetsContext } from 'contexts/Assets';

import { newEthersTransaction } from 'utils/contracts/transactions';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

import styles from './styles.module.scss';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      width: 279,
    },
  })
);

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-cod-gray',
  },
};

const Deposit = ({ ssov }: { ssov: string }) => {
  const classes = useStyles();
  const context = useContext(SsovContext);
  const {
    ssovContractWithSigner,
    selectedEpoch,
    token,
    ssovData: {
      epochTimes,
      isVaultReady,
      isEpochExpired,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochDeposits,
    },
    userSsovData: { userEpochStrikeDeposits, userEpochDeposits },
  } = context[ssov];
  const { updateSsovData, updateUserSsovData } = context;
  const { updateAssetBalances } = useContext(AssetsContext);
  const { accountAddress } = useContext(WalletContext);

  const [selectedStrikeIndexes, setSelectedStrikeIndexes] = useState<number[]>(
    []
  );
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: string;
  }>({});
  const [error, setError] = useState('');

  const tokenSymbol = ssov === 'ssovDpx' ? 'DPX' : 'rDPX';

  const isDepositWindowOpen = useMemo(() => {
    if (isVaultReady || !isEpochExpired) return false;
    return true;
  }, [isVaultReady, isEpochExpired]);

  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [maxApprove, setMaxApprove] = useState(false);

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

  // Handles strikes & deposit amounts
  const handleSelectStrikes = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelectedStrikeIndexes((event.target.value as number[]).sort());
    },
    []
  );

  const inputStrikeDepositAmount = useCallback(
    (
      index: number,
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setStrikeDepositAmounts((prevState) => ({
        ...prevState,
        [index]: e.target.value,
      }));
    },
    []
  );

  const totalDepositAmount = useMemo(
    () =>
      selectedStrikeIndexes.reduce(
        (accumulator, currentIndex) =>
          accumulator.add(
            ethersUtils.parseUnits(
              strikeDepositAmounts[currentIndex] || '0',
              18
            )
          ),
        BigNumber.from(0)
      ),
    [selectedStrikeIndexes, strikeDepositAmounts]
  );

  useEffect(() => {
    if (totalDepositAmount.gt(userTokenBalance)) {
      setError(`Deposit amount exceeds your current ${tokenSymbol} balance.`);
    } else {
      setError('');
    }
  }, [totalDepositAmount, totalEpochDeposits, userTokenBalance, tokenSymbol]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner || !accountAddress) return;
    (async function () {
      const finalAmount = getContractReadableAmount(
        totalDepositAmount.toString(),
        18
      );

      let userAmount = await token.balanceOf(accountAddress);
      setUserTokenBalance(userAmount);

      let allowance = await token.allowance(
        accountAddress,
        ssovContractWithSigner.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [accountAddress, totalDepositAmount, token, ssovContractWithSigner]);

  const handleApprove = useCallback(async () => {
    const finalAmount = getContractReadableAmount(
      totalDepositAmount.toString(),
      18
    );
    try {
      await newEthersTransaction(
        token.approve(
          ssovContractWithSigner.address,
          maxApprove ? MAX_VALUE : finalAmount.toString()
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [totalDepositAmount, maxApprove, token, ssovContractWithSigner]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    try {
      const strikeIndexes = selectedStrikeIndexes.filter(
        (index) =>
          strikeDepositAmounts[index] &&
          ethersUtils.parseUnits(strikeDepositAmounts[index], 18).gt('0')
      );

      await newEthersTransaction(
        ssovContractWithSigner.depositMultiple(
          strikeIndexes,
          strikeIndexes.map((index) =>
            ethersUtils.parseUnits(strikeDepositAmounts[index], 18)
          )
        )
      );

      setStrikeDepositAmounts(() => ({}));
      setSelectedStrikeIndexes(() => []);
      updateAssetBalances();
      updateSsovData(ssov === 'ssovDpx' ? 'dpx' : 'rdpx');
      updateUserSsovData(ssov === 'ssovDpx' ? 'dpx' : 'rdpx');
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedStrikeIndexes,
    ssovContractWithSigner,
    strikeDepositAmounts,
    updateSsovData,
    updateUserSsovData,
    updateAssetBalances,
    ssov,
  ]);

  return (
    <Box>
      <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-2">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-left"
        >
          Balance
        </Typography>
        <Typography variant="caption" component="div">
          {formatAmount(getUserReadableAmount(userTokenBalance, 18))}{' '}
          {tokenSymbol}
        </Typography>
      </Box>
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
                <BasicInput
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
              MenuProps={SelectMenuProps}
              classes={{ icon: 'absolute right-20 text-white' }}
              label="strikes"
            >
              {strikes.map((strike, index) => (
                <MenuItem key={index} value={index}>
                  <Checkbox
                    color="default"
                    className="p-0 mr-2 text-white"
                    checked={selectedStrikeIndexes.indexOf(index) > -1}
                  />
                  <ListItemText className="text-white" primary={strike} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error ? (
            <Typography
              variant="caption"
              component="div"
              className="text-down-bad text-left mt-5"
            >
              {error}
            </Typography>
          ) : null}
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
          {getUserReadableAmount(totalDepositAmount, 18).toString()}{' '}
          {tokenSymbol}
        </Typography>
      </Box>
      <Box className="`flex flex-row border-umbra rounded-xl border p-4 mb-2">
        <Box className="mr-4 mb-4">
          {isVaultReady ? <DepositClosed /> : <DepositOpen />}
        </Box>
        <Box className="flex flex-col">
          <Typography
            variant="caption"
            component="div"
            className="mb-4 text-left"
          >
            Epoch {selectedEpoch}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            className="mb-4 text-left"
          >
            Duration: 1 Month
          </Typography>
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz text-left"
          >
            {isDepositWindowOpen || ssov === 'ssovRdpx'
              ? `Deposits for this epoch are now open.`
              : `Deposits for this epoch has been closed.`}
            {isVaultReady ? (
              <>
                <br />
                <br />
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
              </>
            ) : ssov === 'ssovRdpx' ? (
              <>
                <br />
                <br />
                <Countdown
                  date={new Date(1636567200000)}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    return (
                      <span className="text-wave-blue">
                        Time left: {days}d {hours}h {minutes}m {seconds}s
                      </span>
                    );
                  }}
                />
              </>
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
          <CustomButton size="large" className="w-full" onClick={handleDeposit}>
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
          <Box className="flex flex-row justify-between w-full items-center">
            <Typography variant="h6" className="text-stieglitz">
              My Deposits
            </Typography>
            <Typography variant="h6">
              <span className="text-wave-blue">
                {formatAmount(userEpochDepositsAmount, 5)}
              </span>{' '}
              / {formatAmount(totalEpochDepositsAmount, 5)} {tokenSymbol}
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
                    {formatAmount(userEpochStrikeDepositsAmounts[index], 5)}
                  </span>{' '}
                  / {formatAmount(totalEpochStrikeDepositsAmounts[index], 5)}
                </Typography>
                <Typography variant="h6" className="text-stieglitz">
                  {tokenSymbol} ${strike}
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
