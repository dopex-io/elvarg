import { useCallback, useEffect, useContext, useState, useMemo } from 'react';
import { useFormik } from 'formik';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import * as yup from 'yup';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SearchIcon from '@material-ui/icons/Search';
import debounce from 'lodash/debounce';
import Skeleton from '@material-ui/lab/Skeleton';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import { Scrollbars } from 'react-custom-scrollbars';
import PnlChart from 'components/PnlChart';

import { WalletContext } from 'contexts/Wallet';
import {
  SsovContext,
  SsovProperties,
  SsovData,
  UserSsovData,
} from 'contexts/Ssov';
import { AssetsContext } from 'contexts/Assets';

import sendTx from 'utils/contracts/sendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, SSOV_MAP } from 'constants/index';
import format from 'date-fns/format';
import Menu from '@material-ui/core/Menu';
import { ERC20, ERC20__factory } from '@dopex-io/sdk';

export interface Props {
  open: boolean;
  handleClose: () => {};
  ssovProperties: SsovProperties;
  userSsovData: UserSsovData;
  ssovData: SsovData;
}

export interface Token {
  address: string;
  name: string;
  symbol: string;
  icon: string;
}

const CustomSkeleton = ({ width, height = 4 }) => (
  <Skeleton
    variant="text"
    animation="wave"
    className={`bg-mineshaft w-${width} ml-8 h-${height} ounded-md opacity-30`}
  />
);

const BASE_TOKEN_LIST: Token[] = [
  {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    name: 'Ether',
    symbol: 'ETH',
    icon: '/assets/eth.svg',
  },
  {
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    icon: '/assets/btc.svg',
  },
  {
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    name: 'Dopex',
    symbol: 'DPX',
    icon: '/assets/dpx.svg',
  },
  {
    address: '0x32Eb7902D4134bf98A28b963D26de779AF92A212',
    name: 'Dopex Rebate',
    symbol: 'rDPX',
    icon: '/assets/rdpx.svg',
  },
  {
    address: '0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1',
    name: 'Tether USD',
    symbol: 'USDT',
    icon: '/assets/usdt.svg',
  },
  {
    address: '0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1',
    name: 'Olympus DAO',
    symbol: 'gOHM',
    icon: '/assets/gohm.svg',
  },
];

const PurchaseDialog = ({
  open,
  handleClose,
  ssovProperties,
  ssovData,
  userSsovData,
}: Props) => {
  const { updateSsovData, updateUserSsovData, selectedSsov, ssovSignerArray } =
    useContext(SsovContext);
  const { updateAssetBalances, userAssetBalances } = useContext(AssetsContext);
  const { accountAddress, provider } = useContext(WalletContext);
  const [isStrikesMenuVisible, setIsStrikeMenuVisible] =
    useState<boolean>(false);
  const [isChoosingToken, setIsChoosingToken] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [token, setToken] = useState<ERC20>(
    ssovSignerArray[selectedSsov].token
  );

  const {
    currentEpoch,
    tokenPrice,
    ssovOptionPricingContract,
    volatilityOracleContract,
    tokenName,
  } = ssovProperties;
  const { ssovContractWithSigner } =
    ssovSignerArray !== undefined
      ? ssovSignerArray[selectedSsov]
      : { ssovContractWithSigner: null };

  const { epochStrikes } = ssovData;
  const { epochStrikeTokens } = userSsovData;

  const [state, setState] = useState({
    volatility: 0,
    optionPrice: BigNumber.from(0),
    fees: BigNumber.from(0),
    premium: BigNumber.from(0),
    expiry: 0,
    totalCost: BigNumber.from(0),
  });
  const [strikeIndex, setStrikeIndex] = useState<number | null>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [
    userEpochStrikePurchasableAmount,
    setUserEpochStrikePurchasableAmount,
  ] = useState(0);
  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const tokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const epochStrikeToken = useMemo(
    () => (strikeIndex !== null ? epochStrikeTokens[strikeIndex] : null),
    [strikeIndex, epochStrikeTokens]
  );

  const updateUserEpochStrikePurchasableAmount = useCallback(async () => {
    if (!epochStrikeToken || !ssovContractWithSigner) {
      setUserEpochStrikePurchasableAmount(0);
      return;
    }
    const vaultEpochStrikeTokenBalance = await epochStrikeToken.balanceOf(
      ssovContractWithSigner.address
    );
    setUserEpochStrikePurchasableAmount(
      getUserReadableAmount(vaultEpochStrikeTokenBalance, 18)
    );
  }, [epochStrikeToken, ssovContractWithSigner]);

  const formik = useFormik({
    initialValues: {
      amount: 1,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      amount: yup
        .number()
        .min(0, 'Amount has to be greater than 0')
        .required('Amount is required'),
    }),
    validate: () => {
      const errors: any = {};
      if (state.totalCost.gt(userTokenBalance)) {
        errors.amount = `Insufficient ${tokenSymbol} balance to pay for premium.`;
      }
      return errors;
    },
    onSubmit: noop,
  });

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner) return;
    (async function () {
      const finalAmount = state.totalCost;

      const userAmount =
        tokenName === 'ETH'
          ? BigNumber.from(userAssetBalances.ETH)
          : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = await token.allowance(
        accountAddress,
        ssovContractWithSigner.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (tokenName === 'ETH') {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    state.totalCost,
    token,
    ssovContractWithSigner,
    tokenName,
    userAssetBalances.ETH,
  ]);

  const updateTokenList = async () => {
    const updatedList: Token[] = [];
    BASE_TOKEN_LIST.map(async (option) => {
      if (!option['erc20'])
        option['erc20'] = ERC20__factory.connect(option['address'], provider);
      console.log(accountAddress);
      option['balance'] =
        option['symbol'] === 'ETH'
          ? await provider.getBalance(accountAddress)
          : await option['erc20'].balanceOf(accountAddress);
      option['decimals'] = await option['erc20'].decimals();
      console.log(option);
      updatedList.push(option);
    });
    setTokens(updatedList);
  };

  useEffect(() => {
    updateTokenList();
  }, [accountAddress]);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(token.approve(ssovContractWithSigner.address, MAX_VALUE));
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [token, ssovContractWithSigner]);

  const setMaxAmount = () => {
    const amount = state.optionPrice;
    formik.setValues({ amount: amount });
  };

  // Handle Purchase
  const handlePurchase = useCallback(async () => {
    const finalAmount = ethersUtils.parseEther(String(formik.values.amount));
    try {
      if (tokenName === 'ETH') {
        await sendTx(
          ssovContractWithSigner.purchase(
            strikeIndex,
            finalAmount,
            accountAddress,
            {
              value: state.totalCost,
            }
          )
        );
      } else {
        await sendTx(
          ssovContractWithSigner.purchase(
            strikeIndex,
            finalAmount,
            accountAddress
          )
        );
      }
      updateSsovData();
      updateUserSsovData();
      updateUserEpochStrikePurchasableAmount();
      updateAssetBalances();
      formik.setFieldValue('amount', 0);
    } catch (err) {
      console.log(err);
    }
  }, [
    ssovContractWithSigner,
    strikeIndex,
    updateSsovData,
    updateUserSsovData,
    updateUserEpochStrikePurchasableAmount,
    updateAssetBalances,
    formik,
    accountAddress,
    tokenName,
    state.totalCost,
  ]);

  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [updateUserEpochStrikePurchasableAmount]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner) return;
    (async function () {
      const finalAmount = state.totalCost;

      const userAmount =
        tokenName === 'ETH'
          ? BigNumber.from(userAssetBalances.ETH)
          : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = await token.allowance(
        accountAddress,
        ssovContractWithSigner.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (tokenName === 'ETH') {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    state.totalCost,
    token,
    ssovContractWithSigner,
    tokenName,
    userAssetBalances.ETH,
  ]);

  // Calculate the Option Price & Fees
  useEffect(() => {
    if (
      strikeIndex === null ||
      !ssovContractWithSigner ||
      !ssovOptionPricingContract ||
      !volatilityOracleContract ||
      formik.values.amount === 0 ||
      formik.values.amount.toString() === ''
    ) {
      setState((prev) => ({
        ...prev,
        volatility: 0,
        optionPrice: BigNumber.from(0),
        fees: BigNumber.from(0),
        premium: BigNumber.from(0),
        expiry: 0,
        totalCost: BigNumber.from(0),
      }));
      return;
    }

    setIsPurchaseStatsLoading(true);

    async function updateOptionPrice() {
      const strike = epochStrikes[strikeIndex];
      try {
        const expiry =
          await ssovContractWithSigner.getMonthlyExpiryFromTimestamp(
            Math.floor(Date.now() / 1000)
          );

        let volatility;
        if (tokenName === 'ETH') {
          const _abi = [
            'function getVolatility(uint256) view returns (uint256)',
          ];
          const _temp = new ethers.Contract(
            '0x87209686d0f085fD35B084410B99241Dbc03fb4f',
            _abi,
            provider
          );
          volatility = (await _temp.getVolatility(strike)).toNumber();
        } else {
          volatility = (
            await volatilityOracleContract.getVolatility()
          ).toNumber();
        }

        const optionPrice = await ssovOptionPricingContract.getOptionPrice(
          false,
          expiry,
          strike,
          tokenPrice,
          volatility
        );

        const premium = optionPrice
          .mul(ethersUtils.parseEther(String(formik.values.amount)))
          .div(tokenPrice);

        const fees = await ssovContractWithSigner.calculatePurchaseFees(
          tokenPrice,
          strike,
          ethersUtils.parseEther(String(formik.values.amount))
        );

        setState({
          volatility,
          optionPrice,
          premium,
          fees,
          expiry,
          totalCost: premium.add(fees),
        });

        setIsPurchaseStatsLoading(false);
      } catch (err) {
        console.log(err);
        setIsPurchaseStatsLoading(false);
      }
    }
    debounce(async () => await updateOptionPrice(), 500)();
  }, [
    strikeIndex,
    epochStrikes,
    ssovContractWithSigner,
    ssovOptionPricingContract,
    volatilityOracleContract,
    tokenPrice,
    formik.values.amount,
    provider,
    tokenName,
  ]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded m-0' }}
    >
      {!isChoosingToken && (
        <Box>
          <Box className="flex flex-row items-center mb-4">
            <Typography variant="h5">Buy {tokenSymbol} Call Options</Typography>
            <Tooltip
              title="Go to advanced mode"
              aria-label="add"
              placement="top"
            >
              <IconButton
                className="p-0 pb-1 mr-0 ml-auto"
                onClick={handleClose}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="group"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 15C0 15.55 0.45 16 1 16H6V14H1C0.45 14 0 14.45 0 15ZM0 3C0 3.55 0.45 4 1 4H10V2H1C0.45 2 0 2.45 0 3ZM10 17V16H17C17.55 16 18 15.55 18 15C18 14.45 17.55 14 17 14H10V13C10 12.45 9.55 12 9 12C8.45 12 8 12.45 8 13V17C8 17.55 8.45 18 9 18C9.55 18 10 17.55 10 17ZM4 7V8H1C0.45 8 0 8.45 0 9C0 9.55 0.45 10 1 10H4V11C4 11.55 4.45 12 5 12C5.55 12 6 11.55 6 11V7C6 6.45 5.55 6 5 6C4.45 6 4 6.45 4 7ZM18 9C18 8.45 17.55 8 17 8H8V10H17C17.55 10 18 9.55 18 9ZM13 6C13.55 6 14 5.55 14 5V4H17C17.55 4 18 3.55 18 3C18 2.45 17.55 2 17 2H14V1C14 0.45 13.55 0 13 0C12.45 0 12 0.45 12 1V5C12 5.55 12.45 6 13 6Z"
                    fill="#3E3E3E"
                    className="group-hover:fill-gray-400"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          </Box>
          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3">
            <Box className="flex flex-row justify-between">
              <Box
                className="h-12 bg-cod-gray rounded-full pl-1.5 pr-1.5 pt-0 pb-0 flex flex-row items-center cursor-pointer group"
                onClick={() => setIsChoosingToken(true)}
              >
                <Box className="flex flex-row h-9 w-9 mr-2">
                  <img
                    src={SSOV_MAP[ssovProperties.tokenName].imageSrc}
                    alt={tokenSymbol}
                  />
                </Box>
                <Typography variant="h5" className="text-white pb-1 pr-3">
                  {tokenSymbol}
                </Typography>
                <IconButton className="opacity-40 p-0 group-hover:opacity-70">
                  <ArrowDropDownIcon className={'fill-gray-100 mr-2'} />
                </IconButton>
              </Box>
              <Box
                className="bg-mineshaft flex-row ml-4 mt-2 mb-2 rounded-md items-center hidden lg:flex cursor-pointer"
                onClick={setMaxAmount}
              >
                <Typography variant="caption" component="div">
                  <span className="text-stieglitz pl-2.5 pr-2.5">MAX</span>
                </Typography>
              </Box>
              <Input
                disableUnderline
                id="amount"
                name="amount"
                placeholder="0"
                type="number"
                className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                value={formik.values.amount}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                classes={{ input: 'text-right' }}
              />
            </Box>
            <Box className="flex flex-row justify-between">
              <Box>
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-2"
                >
                  Balance:{' '}
                  {formatAmount(getUserReadableAmount(userTokenBalance, 18), 3)}{' '}
                </Typography>
              </Box>
              <Box className="ml-auto mr-0">
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-2"
                >
                  Option Size
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className={'flex'}>
            <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
              <Box className={'w-5/6'}>
                <Typography variant="h5" className="text-white pb-1 pr-2">
                  ${strikes[strikeIndex]}
                </Typography>
                <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                  Strike Price
                </Typography>
              </Box>
              <Box className="bg-mineshaft rounded-md items-center w-1/6 h-fit clickable">
                <IconButton
                  className="p-0"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  {anchorEl ? (
                    <ArrowDropUpIcon className={'fill-gray-100 h-50 pl-0.5'} />
                  ) : (
                    <ArrowDropDownIcon
                      className={'fill-gray-100 h-50 pl-0.5'}
                    />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  classes={{ paper: 'bg-umbra' }}
                  className="mt-12"
                >
                  {strikes.map((strike, strikeIndex) => (
                    <MenuItem
                      key={strikeIndex}
                      className="capitalize text-white cursor-default hover:bg-mineshaft cursor-pointer"
                      onClick={() => {
                        setStrikeIndex(strikeIndex);
                        setAnchorEl(null);
                      }}
                    >
                      ${strike}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
            <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
              <Typography variant="h5" className="text-white pb-1 pr-2">
                {format(new Date(state.expiry * 1000), 'MM/dd/yyyy')}
              </Typography>
              <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                Expiry
              </Typography>
            </Box>
          </Box>

          <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-4 p-3 border border-neutral-800 w-full">
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Breakeven
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  $
                  {formatAmount(
                    Number(strikes[strikeIndex]) +
                      getUserReadableAmount(state.optionPrice, 8),
                    2
                  )}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Option Price
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  $
                  {formatAmount(getUserReadableAmount(state.optionPrice, 8), 2)}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Side
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  Call
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="flex mt-2 mb-2">
            <svg className="ml-auto mr-3 h-5 w-5 fill-white stroke-white">
              <circle cx="5" cy="5" r="4" />
            </svg>
            <svg className="mr-auto ml-0 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10">
              <circle cx="5" cy="5" r="4" />
            </svg>
          </Box>

          <Box className="rounded-xl flex flex-col mt-2 mb-2 p-3 border border-neutral-800 w-full">
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Amount
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  20
                </Typography>
              </Box>
            </Box>
            <Box className={'flex'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Total
              </Typography>
              <Box className={'text-right flex'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz opacity-70 mr-auto ml-0"
                >
                  ~$16,321
                </Typography>
                <Typography variant="h6" className="text-white mr-auto ml-3">
                  5 DPX
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="rounded-xl mt-2 p-3 border border-neutral-800 w-full">
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
                This option will{' '}
                <span className="text-white">Auto Exercise</span> and can be
                settled anytime after expiry.
              </Typography>
            </Box>
            <CustomButton
              size="medium"
              className="w-full mt-4 !rounded-xl"
              color="mineshaft"
              disabled
            >
              Select payment
            </CustomButton>
          </Box>

          <Box className="justify-between mt-4 text-center">
            <Typography variant="h6" component="div" className="text-stieglitz">
              Balance:{' '}
              {formatAmount(getUserReadableAmount(userTokenBalance, 18), 3)}{' '}
              {tokenSymbol}
            </Typography>
          </Box>
        </Box>
      )}

      {isChoosingToken && (
        <Box className="overflow-hidden">
          <Box className="flex flex-row items-center mb-4">
            <Typography variant="h5">Pay with</Typography>
            <IconButton className="p-0 pb-1 mr-0 ml-auto" onClick={handleClose}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3002 0.709727C12.9102 0.319727 12.2802 0.319727 11.8902 0.709727L7.00022 5.58973L2.11022 0.699727C1.72022 0.309727 1.09021 0.309727 0.700215 0.699727C0.310215 1.08973 0.310215 1.71973 0.700215 2.10973L5.59022 6.99973L0.700215 11.8897C0.310215 12.2797 0.310215 12.9097 0.700215 13.2997C1.09021 13.6897 1.72022 13.6897 2.11022 13.2997L7.00022 8.40973L11.8902 13.2997C12.2802 13.6897 12.9102 13.6897 13.3002 13.2997C13.6902 12.9097 13.6902 12.2797 13.3002 11.8897L8.41021 6.99973L13.3002 2.10973C13.6802 1.72973 13.6802 1.08973 13.3002 0.709727Z"
                  fill="#3E3E3E"
                />
              </svg>
            </IconButton>
          </Box>
          <Box className="mb-2">
            <Input
              disableUnderline={true}
              name="address"
              value={''}
              onChange={() => null}
              className="h-11 text-lg text-white w-full text-base bg-umbra pl-3 pr-3 rounded-md"
              placeholder="Search or paste token addresses"
              classes={{ input: 'text-white' }}
              startAdornment={
                <Box className="mr-3 opacity-30 w-18">
                  <SearchIcon />
                </Box>
              }
            />
          </Box>
          <Slide direction="up" in={isChoosingToken} mountOnEnter unmountOnExit>
            <Scrollbars style={{ height: 400 }}>
              {tokens.map((option) => (
                <Box
                  key={option['symbol']}
                  className="flex mt-2 mb-2 hover:bg-mineshaft pb-2 pt-2 pr-3 pl-2 mr-4 rounded-md cursor-pointer"
                  onClick={() => {
                    setToken(option['erc20']);
                    setIsChoosingToken(false);
                  }}
                >
                  <Box className="flex">
                    {' '}
                    <Box className="flex flex-row h-11 w-11 mr-2">
                      <img
                        src={option['icon']}
                        alt={option['name']}
                        className="border-0.5 border-gray-200 pb-0.5 pt-0.5 w-auto"
                      />
                    </Box>
                    <Box className="ml-1">
                      <Typography
                        variant="h5"
                        className="text-white font-medium"
                      >
                        {option['symbol']}
                      </Typography>
                      <Typography variant="h6" className="text-gray-400">
                        {option['name']}
                      </Typography>
                    </Box>{' '}
                  </Box>
                  <Box className="ml-auto mr-0">
                    <Typography variant="h5" className="text-white font-medium">
                      {formatAmount(
                        getUserReadableAmount(
                          option['balance'],
                          option['decimals']
                        ),
                        3
                      )}{' '}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Scrollbars>
          </Slide>
        </Box>
      )}
    </Dialog>
  );
};

export default PurchaseDialog;
