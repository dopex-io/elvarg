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

import useBnbSsovConversion from 'hooks/useBnbSsovConversion';

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

const BnbSsovDeposit = ({
  ssovProperties,
}: {
  ssovProperties: SsovProperties;
}) => {
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
  const { convertToVBNB } = useBnbSsovConversion();

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
  const [selected, setSelected] = useState({
    bnb: true,
    vbnb: false,
  });

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
    (deposit) => getUserReadableAmount(deposit, 8).toString()
  );

  const totalEpochDepositsAmount = getUserReadableAmount(
    totalEpochDeposits,
    8
  ).toString();

  const userEpochStrikeDepositsAmounts = userEpochStrikeDeposits.map(
    (deposit) => getUserReadableAmount(deposit, 8).toString()
  );

  const userEpochDepositsAmount = getUserReadableAmount(
    userEpochDeposits,
    8
  ).toString();

  const selectBnb = () => {
    setSelected({
      bnb: true,
      vbnb: false,
    });
  };
  const selectVbnb = () => {
    setSelected({
      bnb: false,
      vbnb: true,
    });
  };

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
        [index]: selected.vbnb
          ? getContractReadableAmount(e.target.value, 8)
          : getContractReadableAmount(e.target.value, 18),
      }));
    },
    [selected.vbnb]
  );

  const handleApprove = useCallback(async () => {
    const finalAmount = getContractReadableAmount(
      totalDepositAmount.toString(),
      8
    );
    try {
      await sendTx(
        token[1].approve(
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
        [index]: selected.bnb
          ? BigNumber.from(userAssetBalances['BNB'])
          : BigNumber.from(userAssetBalances['VBNB']),
      }));
    },
    [userAssetBalances, selected.bnb]
  );

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    try {
      const strikeIndexes = selectedStrikeIndexes.filter(
        (index) =>
          strikeDepositAmounts[index] && strikeDepositAmounts[index].gt('0')
      );

      if (selected.bnb) {
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
      } else if (selected.vbnb) {
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
    totalDepositAmount,
    ssovRouter,
    selected.vbnb,
    selected.bnb,
  ]);

  useEffect(() => {
    if (totalDepositAmount.gt(userTokenBalance)) {
      setError(
        `Deposit amount exceeds your current ${
          selected.bnb ? 'BNB' : 'vBNB'
        } balance.`
      );
    } else {
      setError('');
    }
  }, [totalDepositAmount, totalEpochDeposits, userTokenBalance, selected.bnb]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      console.log('toatals', totalDepositAmount.toString());
      const finalAmount = BigNumber.from(totalDepositAmount.toString());
      if (selected.vbnb) {
        const allowance = await token[1].allowance(
          accountAddress,
          ssovContractWithSigner.address
        );
        setApproved(allowance.gte(finalAmount) ? true : false);
      } else {
        setApproved(true);
      }
    })();
  }, [
    token,
    accountAddress,
    ssovContractWithSigner,
    approved,
    selected.vbnb,
    totalDepositAmount,
  ]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner || !accountAddress) return;
    (async function () {
      const finalAmount = selected.vbnb
        ? getContractReadableAmount(totalDepositAmount.toString(), 8)
        : getContractReadableAmount(totalDepositAmount.toString(), 18);

      let userAmount = selected.vbnb
        ? await token[1].balanceOf(accountAddress)
        : BigNumber.from(userAssetBalances.BNB);

      setUserTokenBalance(userAmount);

      let allowance = selected.vbnb
        ? await token[1].allowance(
            accountAddress,
            ssovContractWithSigner.address
          )
        : await token[0].allowance(
            accountAddress,
            ssovContractWithSigner.address
          );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (!selected.vbnb) {
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
    selected.vbnb,
    userAssetBalances.BNB,
  ]);

  return (
    <Box>
      <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-left"
        >
          Balance
        </Typography>

        {selected.bnb ? (
          <Typography variant="caption" component="div">
            {' '}
            {formatAmount(
              getUserReadableAmount(userTokenBalance, 18),
              3
            )} BNB{' '}
          </Typography>
        ) : (
          <Typography variant="caption" component="div">
            {' '}
            {formatAmount(
              getUserReadableAmount(userTokenBalance, 8),
              3
            )} vBNB{' '}
          </Typography>
        )}
      </Box>
      <Box className="h-10 p-1 rounded-lg bg-umbra my-2 flex items-center justify-center">
        <Box
          onClick={selectBnb}
          className={`text-center flex-1 w-4 transition ease-in-out ${
            selected.bnb && 'border-b-2'
          } hover:bg-mineshaft duration-300 p-2 rounded-sm`}
        >
          <Typography variant="h6">BNB</Typography>
        </Box>
        <Box
          onClick={selectVbnb}
          className={`text-center flex-1 transition ease-in-out ${
            selected.vbnb && 'border-b-2'
          } hover:bg-mineshaft duration-300 p-2 rounded-sm`}
        >
          <Typography variant="h6">vBNB</Typography>
        </Box>
      </Box>
      <Box className="bg-umbra flex flex-col p-4 rounded-xl justify-between mb-2">
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
                  value={getUserReadableAmount(
                    strikeDepositAmounts[index],
                    selected.bnb ? 18 : 8
                  )}
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
      <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-2">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-left"
        >
          Allocation
        </Typography>
        <Typography variant="caption" component="div">
          {selected.bnb
            ? formatAmount(
                convertToVBNB(Number(totalDepositAmount.toString())),
                5
              )
            : getUserReadableAmount(totalDepositAmount, 8).toString()}{' '}
          {tokenSymbol === 'BNB' && 'vBNB'}
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
        ) : approved ? (
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
            {selected.vbnb ? (
              <MaxApprove value={maxApprove} setValue={setMaxApprove} />
            ) : null}
            <Box className="flex flex-row mt-2">
              {selected.bnb ? null : (
                <CustomButton
                  size="large"
                  className="w-11/12 mr-1"
                  onClick={handleApprove}
                  disabled={approved}
                >
                  Approve
                </CustomButton>
              )}

              <CustomButton
                size="large"
                className={selected.bnb ? 'w-full' : 'w-11/12'}
                disabled={selected.bnb ? false : !approved}
              >
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

export default BnbSsovDeposit;
