import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
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
import Button from '@material-ui/core/Button';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Menu from '@material-ui/core/Menu';
import format from 'date-fns/format';
import { LinearProgress } from '@material-ui/core';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const Deposit = ({
  ssovProperties,
  isZapActive,
}: {
  ssovProperties: SsovProperties;
  isZapActive: boolean;
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

  const unselectStrike = (index) => {
    setSelectedStrikeIndexes(
      selectedStrikeIndexes.filter(function (item) {
        return item !== index;
      })
    );
  };

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

      if (tokenName === 'ETH') {
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
      const allowance = await token[0].allowance(
        accountAddress,
        ssovContractWithSigner.address
      );
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

      let userAmount =
        tokenName === 'ETH' || tokenName === 'BNB'
          ? BigNumber.from(userAssetBalances.ETH)
          : await token[0].balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = await token[0].allowance(
        accountAddress,
        ssovContractWithSigner.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (tokenName === 'ETH' || tokenName === 'BNB') {
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
      <Box className="rounded-lg p-3 pt-2 pb-0 border border-neutral-800 w-full bg-umbra">
        <Box className="flex">
          <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
            Balance
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-0">
            {formatAmount(getUserReadableAmount(userTokenBalance, 18), 4)}{' '}
            {tokenSymbol}
          </Typography>
        </Box>
        <Box className="mt-2.5">
          <Select
            className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
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
                  Select Strike Prices
                </Typography>
              );
            }}
            MenuProps={SelectMenuProps}
            classes={{
              icon: 'absolute right-16 text-white',
              select: 'overflow-hidden',
            }}
            label="strikes"
          >
            {strikes.map((strike, index) => (
              <MenuItem key={index} value={index} className="pb-2 pt-2">
                <Checkbox
                  className={
                    selectedStrikeIndexes.indexOf(index) > -1
                      ? 'p-0 text-white'
                      : 'p-0 text-white border'
                  }
                  checked={selectedStrikeIndexes.indexOf(index) > -1}
                />
                <Typography
                  variant="h5"
                  className="text-white text-left w-full relative ml-3"
                >
                  ${formatAmount(strike, 4)}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className="mt-3">
          {selectedStrikeIndexes.map((index) => (
            <Box className="flex mb-3">
              <Button
                className="p-2 pl-4 pr-4 bg-mineshaft text-white hover:bg-mineshaft hover:opacity-80 font-normal cursor-pointer"
                disableRipple
                onClick={() => unselectStrike(index)}
              >
                ${formatAmount(strikes[index], 4)}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2"
                >
                  <path
                    d="M5.99984 0.166748C2.774 0.166748 0.166504 2.77425 0.166504 6.00008C0.166504 9.22592 2.774 11.8334 5.99984 11.8334C9.22567 11.8334 11.8332 9.22592 11.8332 6.00008C11.8332 2.77425 9.22567 0.166748 5.99984 0.166748ZM8.50817 8.50841C8.28067 8.73591 7.91317 8.73591 7.68567 8.50841L5.99984 6.82258L4.314 8.50841C4.0865 8.73591 3.719 8.73591 3.4915 8.50841C3.264 8.28091 3.264 7.91342 3.4915 7.68592L5.17734 6.00008L3.4915 4.31425C3.264 4.08675 3.264 3.71925 3.4915 3.49175C3.719 3.26425 4.0865 3.26425 4.314 3.49175L5.99984 5.17758L7.68567 3.49175C7.91317 3.26425 8.28067 3.26425 8.50817 3.49175C8.73567 3.71925 8.73567 4.08675 8.50817 4.31425L6.82234 6.00008L8.50817 7.68592C8.72984 7.90758 8.72984 8.28091 8.50817 8.50841Z"
                    fill="#8E8E8E"
                  />
                </svg>
              </Button>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-3 mt-2.5"
              >
                <path
                  d="M0.916829 5.58334L7.43266 5.58334L4.586 8.43C4.3585 8.6575 4.3585 9.03084 4.586 9.25834C4.8135 9.48584 5.181 9.48584 5.4085 9.25834L9.25266 5.41417C9.48016 5.18667 9.48016 4.81917 9.25266 4.59167L5.41433 0.74167C5.18683 0.51417 4.81933 0.51417 4.59183 0.74167C4.36433 0.96917 4.36433 1.33667 4.59183 1.56417L7.43266 4.41667L0.916829 4.41667C0.595996 4.41667 0.333496 4.67917 0.333496 5C0.333496 5.32084 0.595996 5.58334 0.916829 5.58334Z"
                  fill="#3E3E3E"
                />
              </svg>

              <Input
                disableUnderline={true}
                name="address"
                className="ml-auto mr-0 w-[5rem] border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pl-2 pr-2"
                classes={{ input: 'text-white text-xs text-right' }}
                value={getUserReadableAmount(strikeDepositAmounts[index], 18)}
                onChange={(e) => inputStrikeDepositAmount(index, e)}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="h-[12.88rem] mt-3">
        <Box className={'flex'}>
          <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
            <Box className={'w-5/6'}>
              <Typography variant="h5" className="text-white pb-1 pr-2">
                -
              </Typography>
              <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                Deposit
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
            <Typography variant="h5" className="text-white pb-1 pr-2">
              -
            </Typography>
            <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
              Vault Share
            </Typography>
          </Box>
        </Box>

        <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-4 p-3 border border-neutral-800 w-full">
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Epoch
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                1
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Withdrawable
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                21 Nov 2021
              </Typography>
            </Box>
          </Box>

          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Deposit Limit
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(1231.2, 4)}{' '}
                <span className="opacity-50">/ {formatAmount(2500, 4)}</span>
              </Typography>
            </Box>
          </Box>

          <Box className="mt-1">
            <LinearProgress
              value={40}
              variant="determinate"
              className="rounded-sm"
            />
          </Box>
        </Box>
      </Box>

      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-1">
        <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
          <Box className={'flex'}>
            <Typography
              variant="h6"
              className="text-stieglitz ml-0 mr-auto flex"
            >
              <svg
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-1.5 mr-2"
              >
                <path
                  d="M11.1801 2.82L11.1867 2.81333L9.06008 0.686667C8.86675 0.493333 8.54675 0.493333 8.35341 0.686667C8.16008 0.88 8.16008 1.2 8.35341 1.39333L9.40675 2.44667C8.70675 2.71333 8.23341 3.42667 8.35341 4.25333C8.46008 4.98667 9.08675 5.58 9.82008 5.66C10.1334 5.69333 10.4067 5.64 10.6667 5.52667V10.3333C10.6667 10.7 10.3667 11 10.0001 11C9.63342 11 9.33342 10.7 9.33342 10.3333V7.33333C9.33342 6.6 8.73341 6 8.00008 6H7.33342V1.33333C7.33342 0.6 6.73342 0 6.00008 0H2.00008C1.26675 0 0.666748 0.6 0.666748 1.33333V11.3333C0.666748 11.7 0.966748 12 1.33341 12H6.66675C7.03341 12 7.33342 11.7 7.33342 11.3333V7H8.33342V10.24C8.33342 11.1133 8.96008 11.9067 9.82675 11.9933C10.8267 12.0933 11.6667 11.3133 11.6667 10.3333V4C11.6667 3.54 11.4801 3.12 11.1801 2.82ZM6.00008 4.66667H2.00008V2C2.00008 1.63333 2.30008 1.33333 2.66675 1.33333H5.33342C5.70008 1.33333 6.00008 1.63333 6.00008 2V4.66667ZM10.0001 4.66667C9.63342 4.66667 9.33342 4.36667 9.33342 4C9.33342 3.63333 9.63342 3.33333 10.0001 3.33333C10.3667 3.33333 10.6667 3.63333 10.6667 4C10.6667 4.36667 10.3667 4.66667 10.0001 4.66667Z"
                  fill="#6DFFB9"
                />
              </svg>{' '}
              Est. Gas Cost
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0 flex">
                ⧫ {formatAmount(0.3434, 5)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          className="rounded-md flex mb-4 p-3 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-700 cursor-pointer hover:bg-neutral-600"
          onClick={null}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3 mt-0.5"
          >
            <path
              d="M7.99989 0.514648C3.86739 0.514648 0.514893 3.86715 0.514893 7.99965C0.514893 12.1321 3.86739 15.4846 7.99989 15.4846C12.1324 15.4846 15.4849 12.1321 15.4849 7.99965C15.4849 3.86715 12.1324 0.514648 7.99989 0.514648Z"
              fill="url(#paint0_linear_1773_40187)"
            />
            <path
              d="M5.46553 11.5537L7.01803 8.86466L5.29031 7.86716C5.04999 7.72841 5.03761 7.37485 5.27827 7.22801L10.3573 3.95096C10.6829 3.73194 11.0803 4.1086 10.8816 4.45285L9.3103 7.17433L10.9601 8.12683C11.2004 8.26558 11.21 8.6089 10.9824 8.76324L6.00008 12.0528C5.66419 12.2746 5.26678 11.8979 5.46553 11.5537Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1773_40187"
                x1="15.4849"
                y1="17.6232"
                x2="0.399917"
                y2="0.616632"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#002EFF" />
                <stop offset="1" stopColor="#22E1FF" />
              </linearGradient>
            </defs>
          </svg>

          <Typography variant="h6" className="text-white">
            {isZapActive ? (
              <span>
                1 {tokenName} = 2 ETH rDPX{' '}
                <span className="opacity-70">
                  (~${formatAmount(getUserReadableAmount(0, 8), 2)})
                </span>
              </span>
            ) : (
              'Zap In'
            )}
          </Typography>

          {isZapActive ? (
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 ml-auto mt-1.5 rotate-90"
            >
              <path
                d="M5.28997 0.70998L0.699971 5.29998C0.309971 5.68998 0.309971 6.31998 0.699971 6.70998C1.08997 7.09998 1.71997 7.09998 2.10997 6.70998L5.99997 2.82998L9.87997 6.70998C10.27 7.09998 10.9 7.09998 11.29 6.70998C11.68 6.31998 11.68 5.68998 11.29 5.29998L6.69997 0.70998C6.31997 0.31998 5.67997 0.31998 5.28997 0.70998Z"
                fill="#8E8E8E"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-0 ml-auto mt-0.5 "
            >
              <path
                d="M8 4.25C7.5875 4.25 7.25 4.5875 7.25 5V7.25H5C4.5875 7.25 4.25 7.5875 4.25 8C4.25 8.4125 4.5875 8.75 5 8.75H7.25V11C7.25 11.4125 7.5875 11.75 8 11.75C8.4125 11.75 8.75 11.4125 8.75 11V8.75H11C11.4125 8.75 11.75 8.4125 11.75 8C11.75 7.5875 11.4125 7.25 11 7.25H8.75V5C8.75 4.5875 8.4125 4.25 8 4.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z"
                fill="white"
              />
            </svg>
          )}
        </Box>

        <Box className="flex">
          <Box className="flex text-center p-2 mr-2 mt-1">
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.16667 8.0833H9.5775L6.1675 12.0708C5.66333 12.6666 6.085 13.5833 6.86417 13.5833H10.8333C11.3375 13.5833 11.75 13.1708 11.75 12.6666C11.75 12.1625 11.3375 11.75 10.8333 11.75H8.4225L11.8325 7.76247C12.3367 7.16663 11.915 6.24997 11.1358 6.24997H7.16667C6.6625 6.24997 6.25 6.66247 6.25 7.16663C6.25 7.6708 6.6625 8.0833 7.16667 8.0833ZM17.525 3.88497C17.2042 4.26997 16.6267 4.32497 16.2325 4.00413L13.4183 1.65747C13.0333 1.32747 12.9783 0.749966 13.3083 0.364966C13.6292 -0.0200341 14.2067 -0.075034 14.6008 0.245799L17.415 2.59247C17.8 2.92247 17.855 3.49997 17.525 3.88497ZM0.475 3.88497C0.795834 4.27913 1.37333 4.32497 1.75833 4.00413L4.5725 1.65747C4.96667 1.32747 5.02167 0.749966 4.69167 0.364966C4.37083 -0.0292008 3.79333 -0.075034 3.40833 0.245799L0.585 2.59247C0.2 2.92247 0.145 3.49997 0.475 3.88497ZM9 3.49997C12.5383 3.49997 15.4167 6.3783 15.4167 9.91663C15.4167 13.455 12.5383 16.3333 9 16.3333C5.46167 16.3333 2.58333 13.455 2.58333 9.91663C2.58333 6.3783 5.46167 3.49997 9 3.49997ZM9 1.66663C4.44417 1.66663 0.75 5.3608 0.75 9.91663C0.75 14.4725 4.44417 18.1666 9 18.1666C13.5558 18.1666 17.25 14.4725 17.25 9.91663C17.25 5.3608 13.5558 1.66663 9 1.66663Z"
                fill="#6DFFB9"
              />
            </svg>
          </Box>
          <Typography variant="h6" className="text-stieglitz">
            This option will <span className="text-white">Auto Exercise</span>{' '}
            and can be settled anytime after expiry.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Deposit;
