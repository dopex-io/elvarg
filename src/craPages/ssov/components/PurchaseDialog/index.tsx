import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  Addresses,
  ERC20,
  ERC20__factory,
  ERC20SSOV1inchRouter__factory,
  NativeSSOV1inchRouter__factory,
  Aggregation1inchRouterV4__factory,
  Curve2PoolSsovPut,
} from '@dopex-io/sdk';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Slide from '@material-ui/core/Slide';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import format from 'date-fns/format';
import { useDebounce } from 'use-debounce';
import axios from 'axios';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import PnlChart from 'components/PnlChart';
import ZapIn from 'components/ZapIn';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';
import ZapInButton from 'components/ZapInButton';
import ZapOutButton from 'components/ZapOutButton';
import BigCrossIcon from 'components/Icons/BigCrossIcon';
import CircleIcon from 'components/Icons/CircleIcon';
import AlarmIcon from 'components/Icons/AlarmIcon';

import { getValueInUsdFromSymbol } from 'utils/general/getValueInUsdFromSymbol';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import get1inchQuote from 'utils/general/get1inchQuote';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import {
  SsovContext,
  SsovData,
  SsovUserData,
  SsovEpochData,
} from 'contexts/Ssov';

import { CURRENCIES_MAP, MAX_VALUE, SSOV_MAP } from 'constants/index';

import styles from './styles.module.scss';
import { BnbConversionContext } from 'contexts/BnbConversion';

export interface Props {
  open: boolean;
  handleClose: () => {};
  ssovData: SsovData;
  ssovUserData: SsovUserData;
  ssovEpochData: SsovEpochData;
}

const PurchaseDialog = ({
  open,
  handleClose,
  ssovData,
  ssovUserData,
  ssovEpochData,
}: Props) => {
  const { updateSsovEpochData, updateSsovUserData, selectedSsov, ssovSigner } =
    useContext(SsovContext);
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const { accountAddress, provider, chainId, signer, contractAddresses } =
    useContext(WalletContext);
  const { convertToVBNB } = useContext(BnbConversionContext);

  const isPut = useMemo(() => selectedSsov.type === 'PUT', [selectedSsov]);

  const {
    aggregation1inchRouter,
    erc20SSOV1inchRouter,
    nativeSSOV1inchRouter,
  } = useMemo(() => {
    return {
      aggregation1inchRouter: contractAddresses['1inchRouter']
        ? Aggregation1inchRouterV4__factory.connect(
            contractAddresses['1inchRouter'],
            signer
          )
        : null,
      erc20SSOV1inchRouter: contractAddresses['ERC20SSOV1inchRouter']
        ? ERC20SSOV1inchRouter__factory.connect(
            contractAddresses['ERC20SSOV1inchRouter'],
            signer
          )
        : null,
      nativeSSOV1inchRouter: contractAddresses['NativeSSOV1inchRouter']
        ? NativeSSOV1inchRouter__factory.connect(
            contractAddresses['NativeSSOV1inchRouter'],
            signer
          )
        : null,
    };
  }, [contractAddresses, signer]);

  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(false);
  const [token, setToken] = useState<ERC20 | any>(
    IS_NATIVE(ssovData.tokenName) ? ssovData.tokenName : ssovSigner.token[0]
  );
  const ssovToken = useMemo(() => ssovSigner.token[0], [ssovSigner]);
  const { tokenPrice, ssovOptionPricingContract, volatilityOracleContract } =
    ssovData;
  const { ssovContractWithSigner, ssovRouter } = ssovSigner;

  const { epochStrikes } = ssovEpochData;

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

  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);
  const [
    userEpochStrikePurchasableAmount,
    setUserEpochStrikePurchasableAmount,
  ] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const ssovTokenSymbol = useMemo(
    () => SSOV_MAP[ssovData.tokenName].tokenSymbol,
    [ssovData]
  );

  const ssovTokenName = useMemo(() => ssovData.tokenName, [ssovData]);

  const [tokenName, setTokenName] = useState<string>(ssovTokenSymbol);
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});

  const isZapActive: boolean = useMemo(() => {
    return tokenName.toUpperCase() !== ssovTokenSymbol.toUpperCase();
  }, [tokenName, ssovTokenSymbol]);

  const spender = useMemo(() => {
    if (isPut) {
      return ssovData.ssovContract.address;
    } else if (isZapActive) {
      if (IS_NATIVE(ssovTokenName) && ssovTokenName !== 'BNB') {
        return nativeSSOV1inchRouter?.address;
      } else {
        return erc20SSOV1inchRouter?.address;
      }
    } else if (ssovTokenName === 'BNB') {
      return ssovRouter.address;
    } else {
      return ssovContractWithSigner.address;
    }
  }, [
    erc20SSOV1inchRouter,
    isPut,
    isZapActive,
    nativeSSOV1inchRouter,
    ssovContractWithSigner,
    ssovData.ssovContract,
    ssovRouter,
    ssovTokenName,
  ]);

  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);

  const purchasePower: number = useMemo(() => {
    if (isZapActive) {
      let price: number;
      if (path['toToken'])
        price =
          getUserReadableAmount(
            path['toTokenAmount'],
            quote['toToken']['decimals']
          ) /
          getUserReadableAmount(
            path['fromTokenAmount'],
            path['fromToken']['decimals']
          );
      else if (quote['toToken'])
        price =
          getUserReadableAmount(
            quote['toTokenAmount'],
            quote['toToken']['decimals']
          ) /
          getUserReadableAmount(
            quote['fromTokenAmount'],
            quote['fromToken']['decimals']
          );

      return (
        price *
        getUserReadableAmount(
          userAssetBalances[tokenName],
          getTokenDecimals(tokenName, chainId)
        )
      );
    } else {
      return parseFloat(
        getUserReadableAmount(
          userTokenBalance,
          getTokenDecimals(tokenName, chainId)
        ).toString()
      );
    }
  }, [
    isZapActive,
    path,
    quote,
    userAssetBalances,
    tokenName,
    userTokenBalance,
  ]);

  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const sendTx = useSendTx();

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const { epochStrikeTokens } = ssovUserData;

  const epochStrikeToken = useMemo(
    () => (strikeIndex !== null ? epochStrikeTokens[strikeIndex] : null),
    [strikeIndex, epochStrikeTokens]
  );

  // Updates the 1inch quote
  useEffect(() => {
    async function updateQuote() {
      const fromTokenAddress: string = IS_NATIVE(token)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : token.address;
      const toTokenAddress: string = IS_NATIVE(ssovTokenName)
        ? ssovTokenName === 'BNB'
          ? contractAddresses['VBNB']
          : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : ssovToken.address;

      if (fromTokenAddress === toTokenAddress) return;

      const amount: number = 10 ** getTokenDecimals(tokenName, chainId);

      const quote = await get1inchQuote({
        fromTokenAddress,
        toTokenAddress,
        amount,
        chainId,
        accountAddress,
      });

      setQuote(quote);
    }

    updateQuote();
  }, [
    accountAddress,
    chainId,
    contractAddresses,
    ssovToken.address,
    ssovTokenName,
    token,
    tokenName,
  ]);

  const handleTokenChange = useCallback(async () => {
    if (!token) return;
    const symbol = IS_NATIVE(token) ? token : await token.symbol();
    setTokenName(symbol);
  }, [token]);

  const zapInTotalCost: number = useMemo(() => {
    if (!path['toTokenAmount']) return 0;
    const price =
      getUserReadableAmount(
        path['toTokenAmount'],
        quote['toToken']['decimals']
      ) /
      getUserReadableAmount(
        path['fromTokenAmount'],
        path['fromToken']['decimals']
      );
    return (
      getUserReadableAmount(
        state.totalCost,
        getTokenDecimals(ssovTokenSymbol, chainId)
      ) / price
    );
  }, [path, quote, state.totalCost, ssovTokenSymbol]);

  const zapInPurchasePower: number = useMemo(() => {
    if (!path['toTokenAmount']) return 0;
    const price =
      getUserReadableAmount(
        path['toTokenAmount'],
        quote['toToken']['decimals']
      ) /
      getUserReadableAmount(
        path['fromTokenAmount'],
        path['fromToken']['decimals']
      );
    return purchasePower / price;
  }, [path, quote, purchasePower]);

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'] === tokenName) price = record['price'];
    });
    return price;
  }, [tokenPrices, tokenName]);

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

  const [rawOptionsAmount, setRawOptionsAmount] = useState<string>('1');
  const optionsAmount: number = useMemo(() => {
    return parseFloat(rawOptionsAmount) || 0;
  }, [rawOptionsAmount]);

  const isLiquidityEnough = optionsAmount < userEpochStrikePurchasableAmount;
  const isPurchasePowerEnough = !isPut
    ? purchasePower >= getUserReadableAmount(state.totalCost, 18)
    : true;

  const debouncedIsChartVisible = useDebounce(isChartVisible, 200);

  const getPath = useCallback(async () => {
    if (!isZapActive) return;
    setIsFetchingPath(true);
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = IS_NATIVE(ssovTokenName)
      ? ssovTokenName === 'BNB'
        ? Addresses[chainId]['VBNB']
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;

    if (!quote['toToken']) {
      setIsFetchingPath(false);
      return;
    }

    let amount: number =
      parseInt(state.totalCost.toString()) /
      10 **
        getTokenDecimals(
          ssovTokenSymbol === 'BNB' ? 'vBNB' : ssovTokenSymbol,
          chainId
        ) /
      (parseInt(quote['toTokenAmount']) /
        10 ** parseInt(quote['toToken']['decimals']) /
        parseInt(quote['fromTokenAmount']));

    let attempts: number = 0;
    let bestPath: {} = {};
    let minAmount: number = Math.round(
      parseInt(state.totalCost.toString()) * 1.01
    );
    if (ssovTokenSymbol === 'BNB') minAmount = Math.round(minAmount / 10 ** 10);

    while (true) {
      try {
        const { data } = await axios.get(
          `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${Math.round(
            amount
          )}&fromAddress=${spender}&slippage=${slippageTolerance}&disableEstimate=true`
        );
        if (parseInt(data['toTokenAmount']) > minAmount || attempts > 10) {
          bestPath = data;
          break;
        }
      } catch (err) {
        console.log(err);
        setIsFetchingPath(false);
        break;
      }
      attempts += 1;
      amount = Math.round(amount * 1.01);
    }

    setPath(bestPath);
    setIsFetchingPath(false);
    return bestPath;
  }, [
    chainId,
    isZapActive,
    quote,
    slippageTolerance,
    spender,
    ssovToken.address,
    ssovTokenName,
    ssovTokenSymbol,
    state.totalCost,
    token,
  ]);

  const openZapIn = () => {
    if (isZapActive) {
      setIsZapInVisible(true);
    } else {
      const filteredTokens = ['ETH']
        .concat(tokens)
        .filter(function (item) {
          return (
            item !== ssovTokenSymbol &&
            (Addresses[chainId][item] || IS_NATIVE(item))
          );
        })
        .sort((a, b) => {
          return (
            getValueInUsdFromSymbol(
              b,
              tokenPrices,
              userAssetBalances,
              getTokenDecimals(b, chainId)
            ) -
            getValueInUsdFromSymbol(
              a,
              tokenPrices,
              userAssetBalances,
              getTokenDecimals(a, chainId)
            )
          );
        });

      const selectedToken = IS_NATIVE(filteredTokens[0])
        ? filteredTokens[0]
        : ERC20__factory.connect(
            Addresses[chainId][filteredTokens[0]],
            provider
          );

      setToken(selectedToken);
      setIsZapInVisible(true);
    }
  };

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        ERC20__factory.connect(
          isPut ? '0x7f90122bf0700f9e7e1f688fe926940e8839f353' : token.address,
          signer
        ).approve(spender, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, isPut, token, signer, spender]);

  const handlePurchase = useCallback(async () => {
    try {
      if (isPut) {
        await sendTx(
          (ssovContractWithSigner as Curve2PoolSsovPut).purchase(
            strikeIndex,
            getContractReadableAmount(optionsAmount, 18),
            accountAddress
          )
        );
      } else if (ssovTokenName === tokenName) {
        if (tokenName === 'BNB') {
          await sendTx(
            ssovRouter.purchase(
              strikeIndex,
              getContractReadableAmount(optionsAmount, 18),
              accountAddress,
              {
                value: state.totalCost,
              }
            )
          );
        } else if (IS_NATIVE(ssovTokenName)) {
          await sendTx(
            ssovContractWithSigner.purchase(
              strikeIndex,
              getContractReadableAmount(optionsAmount, 18),
              accountAddress,
              {
                value: state.totalCost,
              }
            )
          );
          ``;
        } else {
          await sendTx(
            ssovContractWithSigner.purchase(
              strikeIndex,
              getContractReadableAmount(optionsAmount, 18),
              accountAddress
            )
          );
        }
      } else {
        const bestPath = await getPath();

        const decoded = aggregation1inchRouter.interface.decodeFunctionData(
          'swap',
          bestPath['tx']['data']
        );

        if (IS_NATIVE(tokenName)) {
          const value = bestPath['fromTokenAmount'];

          await sendTx(
            erc20SSOV1inchRouter.swapNativeAndPurchase(
              ssovData.ssovContract.address,
              ssovToken.address,
              decoded[0],
              decoded[1],
              decoded[2],
              {
                strikeIndex: strikeIndex,
                amount: getContractReadableAmount(optionsAmount, 18),
                to: accountAddress,
              },
              {
                value: value,
              }
            )
          );
        } else {
          await sendTx(
            IS_NATIVE(ssovTokenName) && ssovTokenName !== 'BNB'
              ? nativeSSOV1inchRouter.swapAndPurchase(
                  decoded[0],
                  decoded[1],
                  decoded[2],
                  {
                    strikeIndex: strikeIndex,
                    amount: getContractReadableAmount(optionsAmount, 18),
                    to: accountAddress,
                  }
                )
              : erc20SSOV1inchRouter.swapAndPurchase(
                  ssovData.ssovContract.address,
                  ssovTokenSymbol === 'BNB'
                    ? Addresses[chainId]['VBNB']
                    : ssovToken.address,
                  decoded[0],
                  decoded[1],
                  decoded[2],
                  {
                    strikeIndex: strikeIndex,
                    amount: getContractReadableAmount(optionsAmount, 18),
                    to: accountAddress,
                  }
                )
          );
        }
      }

      setRawOptionsAmount('0');
      updateSsovEpochData();
      updateSsovUserData();
      updateAssetBalances();
    } catch (err) {
      console.log(err);
      setRawOptionsAmount('0');
    }
  }, [
    accountAddress,
    aggregation1inchRouter,
    chainId,
    erc20SSOV1inchRouter,
    getPath,
    isPut,
    nativeSSOV1inchRouter,
    optionsAmount,
    sendTx,
    ssovContractWithSigner,
    ssovData,
    ssovRouter,
    ssovToken.address,
    ssovTokenName,
    ssovTokenSymbol,
    state.totalCost,
    strikeIndex,
    tokenName,
    updateAssetBalances,
    updateSsovEpochData,
    updateSsovUserData,
  ]);

  const checkDEXAggregatorStatus = useCallback(async () => {
    try {
      const { status } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/healthcheck`
      );
      setIsZapInAvailable(
        !!(status === 200 && (erc20SSOV1inchRouter || nativeSSOV1inchRouter))
      );
    } catch (err) {
      setIsZapInAvailable(false);
    }
  }, [chainId, erc20SSOV1inchRouter, nativeSSOV1inchRouter]);

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, [checkDEXAggregatorStatus]);

  useEffect(() => {
    getPath();
  }, [getPath]);

  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [updateUserEpochStrikePurchasableAmount]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      if (isPut) {
        const tokenToPay =
          tokenName === ssovTokenName
            ? ERC20__factory.connect(Addresses[chainId]['2CRV'], signer)
            : token;
        if (IS_NATIVE(tokenToPay)) {
          setApproved(true);
        } else {
          const allowance = parseInt(
            (await tokenToPay.allowance(accountAddress, spender)).toString()
          );
          setApproved(allowance > 0);
        }
      } else {
        if (!purchasePower) return;
        if (IS_NATIVE(token)) {
          setApproved(true);
        } else {
          const allowance = parseInt(
            (await token.allowance(accountAddress, spender)).toString()
          );
          setApproved(allowance > 0);
        }
      }
    })();
  }, [
    token,
    accountAddress,
    ssovContractWithSigner,
    approved,
    purchasePower,
    isPut,
    tokenName,
    ssovTokenName,
    chainId,
    signer,
    spender,
  ]);

  const setMaxAmount = useCallback(async () => {
    if (isPurchaseStatsLoading) return;
    const strike: BigNumber = epochStrikes[strikeIndex];
    const fees: BigNumber = await ssovContractWithSigner.calculatePurchaseFees(
      tokenPrice,
      strike,
      ethersUtils.parseEther(String(1))
    );
    let amount: number =
      (purchasePower /
        (getUserReadableAmount(fees, 18) +
          getUserReadableAmount(state.optionPrice, 8) /
            getUserReadableAmount(tokenPrice, 8))) *
      0.97; // margin of safety;
    setRawOptionsAmount(amount.toFixed(2));
  }, [
    epochStrikes,
    isPurchaseStatsLoading,
    purchasePower,
    ssovContractWithSigner,
    state.optionPrice,
    strikeIndex,
    tokenPrice,
  ]);

  useEffect(() => {
    handleTokenChange();
  }, [handleTokenChange]);

  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [updateUserEpochStrikePurchasableAmount]);

  // Calculate the Option Price & Fees
  useEffect(() => {
    if (
      strikeIndex === null ||
      !ssovContractWithSigner ||
      !ssovOptionPricingContract ||
      !volatilityOracleContract ||
      optionsAmount === 0 ||
      optionsAmount.toString() === ''
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
        if (isPut) {
          volatility = (
            await ssovData.ssovContract.getVolatility(strike)
          ).toNumber();
        } else if (ssovTokenName === 'ETH') {
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
          isPut,
          expiry,
          strike,
          tokenPrice,
          volatility
        );

        let premium = optionPrice
          .mul(ethersUtils.parseEther(String(optionsAmount)))
          .div(isPut ? ssovData.lpPrice : tokenPrice);

        if (isPut) {
          premium = premium.mul(BigNumber.from(1e10));
        }

        let fees = await ssovContractWithSigner.calculatePurchaseFees(
          tokenPrice,
          strike,
          ethersUtils.parseEther(String(optionsAmount))
        );

        if (ssovTokenSymbol === 'BNB') {
          const abi = [
            ' function vbnbToBnb(uint256 vbnbAmount) public view returns (uint256)',
          ];
          const bnbSsov = new ethers.Contract(
            '0x43a5cfb83d0decaaead90e0cc6dca60a2405442b',
            abi,
            provider
          );
          fees = await bnbSsov.vbnbToBnb(fees);
        }

        let totalCost = premium.add(fees);
        if (isZapActive && ssovTokenSymbol === 'BNB') {
          const bnbToVBnb =
            parseInt(
              convertToVBNB(BigNumber.from('100000000000000000000')).toString()
            ) / 99.5; // keep 0.5% of extra margin for the router
          totalCost = BigNumber.from(
            Math.round(
              parseInt(premium.add(fees).toString()) * bnbToVBnb
            ).toString()
          );
        }

        setState({
          volatility,
          optionPrice,
          premium,
          fees,
          expiry,
          totalCost,
        });

        setIsPurchaseStatsLoading(false);
      } catch (err) {
        console.log(err);
        setIsPurchaseStatsLoading(false);
      }
    }
    updateOptionPrice();
  }, [
    strikeIndex,
    epochStrikes,
    optionsAmount,
    ssovContractWithSigner,
    ssovOptionPricingContract,
    volatilityOracleContract,
    tokenPrice,
    provider,
    ssovTokenName,
    isPut,
    ssovData,
    ssovTokenSymbol,
    isZapActive,
    convertToVBNB,
  ]);

  // Handles isApproved
  useEffect(() => {
    if (!ssovContractWithSigner) return;
    (async function () {
      const finalAmount = state.totalCost;
      if (isPut) {
        const _token = ERC20__factory.connect(
          Addresses[chainId]['2CRV'],
          provider
        );

        const userAmount = await _token.balanceOf(accountAddress);
        setUserTokenBalance(userAmount);

        const allowance = await _token.allowance(accountAddress, spender);
        if (finalAmount.lte(allowance)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      } else {
        if (!token) return;
        const userAmount = IS_NATIVE(token)
          ? BigNumber.from(
              userAssetBalances[CURRENCIES_MAP[chainId.toString()]]
            )
          : await token.balanceOf(accountAddress);

        setUserTokenBalance(userAmount);

        let allowance = IS_NATIVE(token)
          ? BigNumber.from(0)
          : await token.allowance(
              accountAddress,
              ssovContractWithSigner.address
            );

        if (finalAmount.lte(allowance) && !allowance.eq(0)) {
          setApproved(true);
        } else {
          if (IS_NATIVE(token)) {
            setApproved(true);
          } else {
            setApproved(false);
          }
        }
      }
    })();
  }, [
    accountAddress,
    state.totalCost,
    token,
    ssovContractWithSigner,
    userAssetBalances,
    chainId,
    isPut,
    provider,
    spender,
  ]);

  useEffect(() => {
    getPath();
  }, [getPath]);

  const purchaseButtonProps = useMemo(() => {
    const disabled = Boolean(
      optionsAmount <= 0 ||
        isFetchingPath ||
        !isPurchasePowerEnough ||
        isPurchaseStatsLoading ||
        getUserReadableAmount(state.totalCost, 18) > purchasePower ||
        !isLiquidityEnough
    );

    let onClick = () => {};

    if (optionsAmount > 0 && isPurchasePowerEnough) {
      if (approved) {
        if (userEpochStrikePurchasableAmount >= optionsAmount) {
          onClick = handlePurchase;
        }
      } else {
        onClick = handleApprove;
      }
    }

    let children = 'Enter an amount';

    if (isLiquidityEnough) {
      if (isPurchaseStatsLoading) {
        children = 'Loading prices...';
      } else if (optionsAmount > 0) {
        if (isFetchingPath) {
          children = 'Loading Swap Path....';
        } else if (getUserReadableAmount(state.totalCost, 18) > purchasePower) {
          children = 'Insufficient Balance';
        } else if (approved) {
          children = 'Purchase';
        } else {
          children = 'Approve';
        }
      } else {
        children = 'Enter an amount';
      }
    } else {
      children = 'Not enough liquidity';
    }

    return {
      disabled,
      children,
      color: disabled ? 'mineshaft' : 'primary',
      onClick,
    };
  }, [
    approved,
    handleApprove,
    handlePurchase,
    isFetchingPath,
    isLiquidityEnough,
    isPurchasePowerEnough,
    isPurchaseStatsLoading,
    optionsAmount,
    purchasePower,
    state.totalCost,
    userEpochStrikePurchasableAmount,
  ]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{
        paper: 'rounded m-0',
        paperScrollPaper: 'overflow-x-hidden',
      }}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Buy Options</Typography>
        <ZapOutButton
          isZapActive={isZapActive}
          handleClick={() => {
            if (IS_NATIVE(ssovTokenName)) setToken(ssovTokenName);
            else setToken(ssovToken);
          }}
        />
        <IconButton
          className={
            isZapActive
              ? 'p-0 pb-1 mr-0 mt-0.5 ml-4'
              : 'p-0 pb-1 mr-0 mt-0.5 ml-auto'
          }
          onClick={handleClose}
        >
          <BigCrossIcon className="" />
        </IconButton>
      </Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-10">
              <img
                src={SSOV_MAP[ssovData.tokenName].imageSrc}
                alt={ssovTokenSymbol}
              />
            </Box>
          </Box>
          {!isPut ? (
            <Box
              className="bg-mineshaft hover:bg-neutral-700 flex-row ml-4 mt-2 mb-2 rounded-md items-center hidden lg:flex cursor-pointer"
              onClick={setMaxAmount}
            >
              <Typography variant="caption" component="div">
                <span className="text-stieglitz pl-2.5 pr-2.5">MAX</span>
              </Typography>
            </Box>
          ) : (
            ''
          )}
          <Input
            disableUnderline
            id="optionsAmount"
            name="optionsAmount"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawOptionsAmount}
            onChange={(e) => setRawOptionsAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2"
            >
              Available:{' '}
              <span className="text-white">
                {formatAmount(userEpochStrikePurchasableAmount, 3)}{' '}
              </span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              Option Size
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        {debouncedIsChartVisible[0] && (
          <Slide direction="left" in={isChartVisible}>
            <Box className="p-3 bg-cod-gray rounded-md border border-neutral-800">
              <PnlChart
                breakEven={
                  isPut
                    ? Number(strikes[strikeIndex]) -
                      getUserReadableAmount(state.optionPrice, 8)
                    : Number(strikes[strikeIndex]) +
                      getUserReadableAmount(state.optionPrice, 8)
                }
                optionPrice={getUserReadableAmount(state.optionPrice, 8)}
                amount={optionsAmount}
                isPut={isPut}
                price={getUserReadableAmount(tokenPrice, 8)}
                symbol={ssovTokenSymbol}
              />
            </Box>
          </Slide>
        )}
        {!debouncedIsChartVisible[0] && (
          <Slide direction="left" in={!isChartVisible}>
            <Box className="h-[12.88rem]">
              <Box className={'flex'}>
                <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
                  <Box className={'w-5/6'}>
                    <Typography variant="h5" className="text-white pb-1 pr-2">
                      ${strikes[strikeIndex]}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-stieglitz pb-1 pr-2"
                    >
                      Strike Price
                    </Typography>
                  </Box>
                  <Box className="bg-mineshaft hover:bg-neutral-700 rounded-md items-center w-1/6 h-fit clickable">
                    <IconButton
                      className="p-0"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      {anchorEl ? (
                        <ArrowDropUpIcon
                          className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
                        />
                      ) : (
                        <ArrowDropDownIcon
                          className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
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
                          className="capitalize text-white hover:bg-mineshaft cursor-pointer"
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
                    {state.expiry
                      ? format(new Date(state.expiry * 1000), 'd LLL yyyy')
                      : '-'}
                  </Typography>
                  <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                    Expiry
                  </Typography>
                </Box>
              </Box>
              <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-4 p-3 border border-neutral-800 w-full">
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Breakeven
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      $
                      {isPut
                        ? formatAmount(
                            Number(strikes[strikeIndex]) -
                              getUserReadableAmount(state.optionPrice, 8),
                            2
                          )
                        : formatAmount(
                            Number(strikes[strikeIndex]) +
                              getUserReadableAmount(state.optionPrice, 8),
                            2
                          )}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Option Price
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      ${ethers.utils.formatUnits(state.optionPrice, 8)}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Side
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {selectedSsov.type}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    IV
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {state.volatility}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Slide>
        )}
      </Box>
      <Box className="flex mt-5 mb-5">
        <CircleIcon
          className={
            isChartVisible
              ? 'ml-auto mr-3 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
              : 'ml-auto mr-3 h-5 w-5 fill-white stroke-white cursor-pointer'
          }
          onClick={() => setIsChartVisible(false)}
        />
        <CircleIcon
          className={
            isChartVisible
              ? 'mr-auto ml-0 h-5 w-5 fill-white stroke-white cursor-pointer'
              : 'mr-auto ml-0 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
          }
          onClick={() => setIsChartVisible(true)}
        />
      </Box>
      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-4 p-4 border border-neutral-800 w-full bg-neutral-800">
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Option Size
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(optionsAmount, 3)}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Fees ($)
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                $
                {formatAmount(
                  isPut
                    ? getUserReadableAmount(
                        state.fees.mul(ssovData.lpPrice),
                        36
                      )
                    : getUserReadableAmount(state.fees.mul(tokenPrice), 26),
                  6
                )}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Total ($)
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                $
                {ethers.utils.formatUnits(
                  state.optionPrice.mul(
                    ethers.utils.parseEther(String(optionsAmount))
                  ),
                  26
                )}
              </Typography>
            </Box>
          </Box>
          {!isPut ? (
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Purchase Power
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(
                    isZapActive ? zapInPurchasePower : purchasePower,
                    5
                  )}{' '}
                  {isZapActive
                    ? tokenName
                    : ssovTokenSymbol === 'BNB'
                    ? 'vBNB'
                    : ssovTokenSymbol}
                </Typography>
              </Box>
            </Box>
          ) : null}
          {isZapActive ? (
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Total
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(zapInTotalCost, 5)} {tokenName}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Total
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(getUserReadableAmount(state.totalCost, 18), 5)}{' '}
                  {isPut
                    ? '2CRV'
                    : ssovTokenSymbol === 'BNB'
                    ? 'vBNB'
                    : ssovTokenSymbol}
                </Typography>
              </Box>
            </Box>
          )}
          <EstimatedGasCostButton gas={700000} chainId={chainId} />
        </Box>
        <ZapInButton
          openZapIn={openZapIn}
          isZapActive={isZapActive}
          quote={quote}
          path={path}
          isFetchingPath={isFetchingPath}
          tokenName={tokenName}
          ssovTokenSymbol={ssovTokenSymbol}
          selectedTokenPrice={selectedTokenPrice}
          isZapInAvailable={isPut ? false : isZapInAvailable}
          chainId={chainId}
        />
        <Box className="flex">
          <Box className="flex text-center p-2 mr-2 mt-1">
            <AlarmIcon />
          </Box>
          <Typography variant="h6" className="text-stieglitz">
            This option will <span className="text-white">Auto Exercise</span>{' '}
            and can be settled anytime after expiry.
          </Typography>
        </Box>
        <CustomButton
          size="medium"
          className="w-full mt-4 !rounded-md"
          color={purchaseButtonProps.color}
          disabled={purchaseButtonProps.disabled}
          onClick={purchaseButtonProps.onClick}
        >
          {purchaseButtonProps.children}
        </CustomButton>
      </Box>
      <Slide direction="left" in={isZapInVisible} mountOnEnter unmountOnExit>
        <Box className={styles.zapIn}>
          <ZapIn
            setOpen={setIsZapInVisible}
            ssovTokenName={ssovTokenName}
            tokenName={tokenName}
            setToken={setToken}
            token={token}
            userTokenBalance={userTokenBalance}
            quote={quote}
            setSlippageTolerance={setSlippageTolerance}
            slippageTolerance={slippageTolerance}
            purchasePower={purchasePower}
            selectedTokenPrice={selectedTokenPrice}
            isInDialog={true}
            ssovToken={ssovToken}
          />
        </Box>
      </Slide>
    </Dialog>
  );
};

export default PurchaseDialog;
