import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
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
import BasicInput from 'components/UI/BasicInput';
import DepositOpen from 'assets/icons/DepositOpen';
import DepositClosed from 'assets/icons/DepositClosed';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext, SsovProperties } from 'contexts/Ssov';
import { AssetsContext } from 'contexts/Assets';

import sendTx from 'utils/contracts/sendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, SSOV_MAP } from 'constants/index';

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

const Deposit = ({ ssovProperties }: { ssovProperties: SsovProperties }) => {
  const {
    updateSsovData,
    updateUserSsovData,
    selectedSsov,
    ssovDataArray,
    userSsovDataArray,
    ssovSignerArray,
  } = useContext(SsovContext);
  const { accountAddress } = useContext(WalletContext);
  const { updateAssetBalances, userAssetBalances } = useContext(AssetsContext);

  const { selectedEpoch, tokenName } = ssovProperties;
  const { ssovContractWithSigner, token, ssovRouter } =
    ssovSignerArray[selectedSsov];
  const { userEpochStrikeDeposits, userEpochDeposits } =
    userSsovDataArray[selectedSsov];
  const {
    epochTimes,
    isVaultReady,
    epochStrikes,
    totalEpochStrikeDeposits,
    totalEpochDeposits,
  } = ssovDataArray[selectedSsov];

  const [selectedStrikeIndexes, setSelectedStrikeIndexes] = useState<number[]>(
    []
  );
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: BigNumber;
  }>({});
  const [error, setError] = useState('');
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [maxApprove, setMaxApprove] = useState(false);

  const isDepositWindowOpen = useMemo(() => {
    if (isVaultReady) return false;
    return true;
  }, [isVaultReady]);

  const totalDepositAmount = useMemo(
    () =>
      selectedStrikeIndexes.reduce(
        (accumulator, currentIndex) =>
          accumulator.add(
            strikeDepositAmounts[currentIndex] || BigNumber.from(0)
          ),
        BigNumber.from(0)
      ),
    [selectedStrikeIndexes, strikeDepositAmounts]
  );

  const tokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;

  const strikes = epochStrikes.map((strike) =>
    getUserReadableAmount(strike, 8).toString()
  );

  const totalEpochStrikeDepositsAmounts = totalEpochStrikeDeposits.map(
    (deposit) =>
      tokenSymbol === 'BNB'
        ? getUserReadableAmount(deposit, 8).toString()
        : getUserReadableAmount(deposit, 18).toString()
  );

  const totalEpochDepositsAmount =
    tokenSymbol === 'BNB'
      ? getUserReadableAmount(totalEpochDeposits, 8).toString()
      : getUserReadableAmount(totalEpochDeposits, 18).toString();

  const userEpochStrikeDepositsAmounts = userEpochStrikeDeposits.map(
    (deposit) =>
      tokenSymbol === 'BNB'
        ? getUserReadableAmount(deposit, 8).toString()
        : getUserReadableAmount(deposit, 18).toString()
  );

  const userEpochDepositsAmount =
    tokenSymbol === 'BNB'
      ? getUserReadableAmount(userEpochDeposits, 8).toString()
      : getUserReadableAmount(userEpochDeposits, 18).toString();

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
        [index]: getContractReadableAmount(e.target.value, 18),
      }));
    },
    []
  );

  const handleApprove = useCallback(async () => {
    const finalAmount = getContractReadableAmount(
      totalDepositAmount.toString(),
      18
    );
    try {
      await sendTx(
        token[0].approve(
          ssovContractWithSigner.address,
          maxApprove ? MAX_VALUE : finalAmount.toString()
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [totalDepositAmount, maxApprove, token, ssovContractWithSigner]);

  const handleMax = useCallback(
    (index: number) => {
      setStrikeDepositAmounts((prevState) => ({
        ...prevState,
        [index]: BigNumber.from(
          userAssetBalances[tokenSymbol.toLocaleUpperCase()]
        ),
      }));
    },
    [userAssetBalances, tokenSymbol]
  );

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    try {
      const strikeIndexes = selectedStrikeIndexes.filter(
        (index) =>
          strikeDepositAmounts[index] && strikeDepositAmounts[index].gt('0')
      );

      if (tokenName === 'ETH' || tokenName === 'AVAX') {
        await sendTx(
          ssovContractWithSigner.depositMultiple(
            strikeIndexes,
            strikeIndexes.map((index) => strikeDepositAmounts[index]),
            accountAddress,
            {
              value: totalDepositAmount,
            }
          )
        );
      } else if (tokenName === 'BNB' && ssovRouter) {
        await sendTx(
          ssovRouter.depositMultiple(
            strikeIndexes,
            strikeIndexes.map((index) => strikeDepositAmounts[index]),
            accountAddress,
            {
              value: totalDepositAmount,
            }
          )
        );
      } else {
        await sendTx(
          ssovContractWithSigner.depositMultiple(
            strikeIndexes,
            strikeIndexes.map((index) => strikeDepositAmounts[index]),
            accountAddress
          )
        );
      }
      setStrikeDepositAmounts(() => ({}));
      setSelectedStrikeIndexes(() => []);
      updateAssetBalances();
      updateSsovData();
      updateUserSsovData();
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
    accountAddress,
    tokenName,
    totalDepositAmount,
    ssovRouter,
  ]);

  useEffect(() => {
    if (totalDepositAmount.gt(userTokenBalance)) {
      setError(`Deposit amount exceeds your current ${tokenSymbol} balance.`);
    } else if (
      tokenSymbol === 'ETH' &&
      totalEpochDeposits
        .add(totalDepositAmount)
        .gt(getContractReadableAmount(25000, 18))
    ) {
      setError(`Deposit amount exceeds deposit limit.`);
    } else {
      setError('');
    }
  }, [totalDepositAmount, totalEpochDeposits, userTokenBalance, tokenSymbol]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      const finalAmount = getContractReadableAmount(
        totalDepositAmount.toString(),
        18
      );
      let allowance;
      if (token[0] == null) {
        allowance = BigNumber.from(MAX_VALUE);
      } else {
        allowance = await token[0].allowance(
          accountAddress,
          ssovContractWithSigner.address
        );
      }
      setApproved(allowance.gte(finalAmount) ? true : false);
    })();
  }, [
    token,
    accountAddress,
    ssovContractWithSigner,
    approved,
    totalDepositAmount,
  ]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner || !accountAddress) return;
    (async function () {
      const finalAmount = getContractReadableAmount(
        totalDepositAmount.toString(),
        18
      );

      let userAmount = BigNumber.from(
        userAssetBalances[tokenName.toLocaleUpperCase()]
      );

      setUserTokenBalance(userAmount);

      let allowance;
      if (token[0] == null) {
        allowance = BigNumber.from(MAX_VALUE);
      } else {
        allowance = await token[0].allowance(
          accountAddress,
          ssovContractWithSigner.address
        );
      }

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (tokenName === 'ETH' || tokenName === 'BNB' || tokenName == 'AVAX') {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    totalDepositAmount,
    token,
    ssovContractWithSigner,
    userAssetBalances.ETH,
    tokenName,
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
          {formatAmount(getUserReadableAmount(userTokenBalance, 18), 3)}{' '}
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
              <Box className="flex border-umbra rounded-xl border w-36 space-x-2">
                <BasicInput
                  disableUnderline={true}
                  value={getUserReadableAmount(strikeDepositAmounts[index], 18)}
                  placeholder="0"
                  inputProps={{
                    min: 0,
                    type: 'number',
                  }}
                  onChange={(e) => inputStrikeDepositAmount(index, e)}
                  className="h-10 text-sm text-white ml-2 border-mineshaft border rounded-md"
                  classes={{ input: 'text-center' }}
                />
                <Typography
                  variant="h6"
                  className="text-wave-blue my-auto"
                  role="button"
                  onClick={(e) => handleMax(index)}
                >
                  MAX
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box>
          <Select
            className="bg-mineshaft rounded-md px-2 text-white"
            fullWidth
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
            classes={{ icon: 'absolute right-16 text-white' }}
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
      {tokenSymbol !== 'BNB' ? (
        <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-2">
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz text-left"
          >
            Allocation
          </Typography>
          <Typography variant="caption" component="div">
            {tokenSymbol === 'BNB'
              ? getUserReadableAmount(totalDepositAmount, 8).toString()
              : getUserReadableAmount(totalDepositAmount, 18).toString()}{' '}
            {tokenSymbol === 'BNB' && 'vBNB'}
          </Typography>
        </Box>
      ) : null}
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
            {isDepositWindowOpen
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
                    } else if (days < 1 && hours < 1) {
                      return (
                        <span className="text-down-bad">
                          Exercise window is now open.
                          <br />
                          Time remaining: {minutes}m {seconds}s
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
            ) : null}
          </Typography>
        </Box>
      </Box>
      <Box>
        {isVaultReady || totalDepositAmount.isZero() ? (
          <CustomButton size="large" className="w-full" disabled>
            {isVaultReady ? 'Closed' : 'Enter an amount'}
          </CustomButton>
        ) : tokenSymbol === 'BNB' || approved ? (
          <CustomButton
            size="large"
            className="w-full"
            disabled={Boolean(error)}
            onClick={handleDeposit}
          >
            Deposit
          </CustomButton>
        ) : (
          <Box className="flex flex-col">
            {tokenSymbol !== 'BNB' ? (
              <MaxApprove value={maxApprove} setValue={setMaxApprove} />
            ) : null}
            <Box className="flex flex-row mt-2">
              {tokenSymbol !== 'BNB' ? (
                <CustomButton
                  size="large"
                  className="w-11/12 mr-1"
                  onClick={handleApprove}
                >
                  Approve
                </CustomButton>
              ) : null}
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
              / {formatAmount(totalEpochDepositsAmount, 5)}{' '}
              {tokenSymbol === 'BNB' && 'vBNB'}
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
                  {strike}
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
