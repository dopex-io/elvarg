import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  Addresses,
  ERC20__factory,
  ERC20SSOV1inchRouter__factory,
  NativeSSOV1inchRouter__factory,
  Aggregation1inchRouterV4__factory,
  Curve2PoolSsovPut,
  Curve2PoolSsovPut1inchRouter__factory,
} from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Slide from '@mui/material/Slide';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import format from 'date-fns/format';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import cx from 'classnames';

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

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import get1inchQuote from 'utils/general/get1inchQuote';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext, IS_NATIVE, CHAIN_ID_TO_NATIVE } from 'contexts/Assets';
import {
  SsovContext,
  SsovData,
  SsovUserData,
  SsovEpochData,
} from 'contexts/Ssov';

import { CURRENCIES_MAP, MAX_VALUE, SSOV_MAP } from 'constants/index';

import styles from './styles.module.scss';
import { BnbConversionContext } from 'contexts/BnbConversion';
import Curve2PoolSelector from './components/Curve2PoolSelector';

export interface Props {
  activeSsovContextSide: string;
  strikeIndex: number;
  setStrikeIndex: Function;
}

const PurchaseCard = ({
  activeSsovContextSide,
  strikeIndex,
  setStrikeIndex,
}: Props) => {
  const ssovContext = useContext(SsovContext);
  const { updateSsovEpochData, updateSsovUserData, selectedSsov, ssovSigner } =
    ssovContext[activeSsovContextSide];

  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const { accountAddress, provider, chainId, signer, contractAddresses } =
    useContext(WalletContext);
  const { convertToVBNB } = useContext(BnbConversionContext);

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

  const ssovToken = useMemo(() => ssovSigner.token[0], [ssovSigner]);
  const { tokenPrice, ssovOptionPricingContract, volatilityOracleContract } =
    ssovContext[activeSsovContextSide].ssovData;
  const { ssovContractWithSigner, ssovRouter } = ssovSigner;

  const { epochStrikes } = ssovContext[activeSsovContextSide].ssovEpochData;

  const [state, setState] = useState({
    volatility: 0,
    optionPrice: BigNumber.from(0),
    fees: BigNumber.from(0),
    premium: BigNumber.from(0),
    expiry: 0,
    totalCost: BigNumber.from(0),
  });
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

  const ssovTokenName = useMemo(
    () => ssovContext[activeSsovContextSide].ssovData.tokenName,
    [ssovContext]
  );

  const [purchaseTokenName, setPurchaseTokenName] = useState<string>(
    activeSsovContextSide === 'PUT' ? '2CRV' : ssovTokenName
  );
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});

  const isZapActive: boolean = useMemo(() => {
    if (activeSsovContextSide === 'PUT')
      return !['2CRV', 'USDC', 'USDT'].includes(
        purchaseTokenName.toUpperCase()
      );
    return purchaseTokenName.toUpperCase() !== ssovTokenName.toUpperCase();
  }, [purchaseTokenName, ssovTokenName, activeSsovContextSide]);

  const spender = useMemo(() => {
    if (activeSsovContextSide === 'PUT') {
      if (purchaseTokenName === 'USDC' || purchaseTokenName === 'USDT')
        return '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564';
      return ssovContext[activeSsovContextSide].ssovData.ssovContract.address;
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
    activeSsovContextSide,
    isZapActive,
    nativeSSOV1inchRouter,
    ssovContractWithSigner,
    ssovContext,
    ssovRouter,
    ssovTokenName,
    purchaseTokenName,
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
          userAssetBalances[purchaseTokenName],
          getTokenDecimals(purchaseTokenName, chainId)
        )
      );
    } else {
      return parseFloat(
        getUserReadableAmount(
          userTokenBalance,
          getTokenDecimals(purchaseTokenName, chainId)
        ).toString()
      );
    }
  }, [
    isZapActive,
    path,
    quote,
    userAssetBalances,
    purchaseTokenName,
    userTokenBalance,
    chainId,
  ]);

  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const sendTx = useSendTx();

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const { epochStrikeTokens } = ssovContext[activeSsovContextSide].ssovUserData;

  const epochStrikeToken = useMemo(
    () => (strikeIndex !== null ? epochStrikeTokens[strikeIndex] : null),
    [strikeIndex, epochStrikeTokens]
  );

  // Updates the 1inch quote
  useEffect(() => {
    async function updateQuote() {
      const fromTokenAddress: string = IS_NATIVE(purchaseTokenName)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : contractAddresses[purchaseTokenName];
      const toTokenAddress: string =
        activeSsovContextSide === 'PUT'
          ? Addresses[chainId]['USDC']
          : IS_NATIVE(ssovTokenName)
          ? ssovTokenName === 'BNB'
            ? contractAddresses['VBNB']
            : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : ssovToken.address;

      if (fromTokenAddress === toTokenAddress) return;
      if (
        activeSsovContextSide === 'PUT' &&
        fromTokenAddress === contractAddresses['2CRV']
      )
        return;

      const amount: number = 10 ** getTokenDecimals(purchaseTokenName, chainId);

      try {
        const quote = await get1inchQuote({
          fromTokenAddress,
          toTokenAddress,
          amount,
          chainId,
          accountAddress,
        });

        setQuote(quote);
      } catch (err) {
        console.log(err);
      }
    }

    updateQuote();
  }, [
    accountAddress,
    contractAddresses,
    ssovToken,
    ssovTokenName,
    purchaseTokenName,
    chainId,
    activeSsovContextSide,
  ]);

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
        getTokenDecimals(ssovTokenName, chainId)
      ) / price
    );
  }, [path, quote, state.totalCost, ssovTokenName, chainId]);

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
      if (record['name'] === purchaseTokenName) price = record['price'];
    });
    return price;
  }, [tokenPrices, purchaseTokenName]);

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
  const isPurchasePowerEnough =
    activeSsovContextSide === 'CALL'
      ? purchasePower >= getUserReadableAmount(state.totalCost, 18)
      : true;

  const debouncedIsChartVisible = useDebounce(isChartVisible, 200);

  const getPath = useCallback(async () => {
    if (!isZapActive) return;
    setIsFetchingPath(true);
    const fromTokenAddress: string = IS_NATIVE(purchaseTokenName)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : contractAddresses[purchaseTokenName];
    const toTokenAddress: string =
      activeSsovContextSide === 'PUT'
        ? Addresses[chainId]['USDC']
        : IS_NATIVE(ssovTokenName)
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
          ssovTokenName === 'BNB' ? 'vBNB' : ssovTokenName,
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
    if (ssovTokenName === 'BNB') minAmount = Math.round(minAmount / 10 ** 10);

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
    ssovToken,
    ssovTokenName,
    state.totalCost,
    contractAddresses,
    purchaseTokenName,
    activeSsovContextSide,
  ]);

  const getValueInUsd = (symbol) => {
    let value = 0;
    tokenPrices.map((record) => {
      if (record['name'] === symbol) {
        value =
          (record['price'] * parseInt(userAssetBalances[symbol])) /
          10 ** getTokenDecimals(symbol, chainId);
      }
    });
    return value;
  };

  const openZapIn = () => {
    if (isZapActive) {
      setIsZapInVisible(true);
    } else {
      const filteredTokens = [CHAIN_ID_TO_NATIVE[chainId]]
        .concat(tokens)
        .filter(function (item) {
          return (
            item !== ssovTokenName &&
            (Addresses[chainId][item] || CHAIN_ID_TO_NATIVE[chainId] === item)
          );
        })
        .sort((a, b) => {
          return getValueInUsd(b) - getValueInUsd(a);
        });

      setPurchaseTokenName(filteredTokens[0]);
      setIsZapInVisible(true);
    }
  };

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        ERC20__factory.connect(
          contractAddresses[purchaseTokenName],
          signer
        ).approve(spender, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, spender, contractAddresses, purchaseTokenName]);

  const handlePurchase = useCallback(async () => {
    const _amount = getContractReadableAmount(optionsAmount, 18);

    try {
      if (activeSsovContextSide === 'PUT') {
        if (purchaseTokenName === '2CRV') {
          await sendTx(
            (ssovContractWithSigner as Curve2PoolSsovPut).purchase(
              strikeIndex,
              _amount,
              accountAddress
            )
          );
        } else if (
          purchaseTokenName === 'USDC' ||
          purchaseTokenName === 'USDT'
        ) {
          const curve2PoolSsovPut1inchRouter =
            Curve2PoolSsovPut1inchRouter__factory.connect(
              '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564',
              signer
            );

          let cost = state.totalCost
            .mul(ssovContext[activeSsovContextSide].ssovData.lpPrice)
            .div(oneEBigNumber(30));

          const slippage = cost.mul(1).div(100);

          cost = cost.add(slippage);

          await sendTx(
            curve2PoolSsovPut1inchRouter.swapAndPurchaseFromSingle(
              cost,
              contractAddresses[purchaseTokenName],
              {
                strikeIndex: strikeIndex,
                amount: _amount,
                to: accountAddress,
              },
              ssovContext[activeSsovContextSide].ssovData.ssovContract.address
            )
          );
        }
      } else if (ssovTokenName === purchaseTokenName) {
        if (purchaseTokenName === 'BNB') {
          await sendTx(
            ssovRouter.purchase(strikeIndex, _amount, accountAddress, {
              value: state.totalCost,
            })
          );
        } else if (IS_NATIVE(ssovTokenName)) {
          await sendTx(
            ssovContractWithSigner.purchase(
              strikeIndex,
              _amount,
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
              _amount,
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

        if (IS_NATIVE(purchaseTokenName)) {
          const value = bestPath['fromTokenAmount'];

          await sendTx(
            erc20SSOV1inchRouter.swapNativeAndPurchase(
              ssovContext[activeSsovContextSide].ssovData.ssovContract.address,
              ssovToken.address,
              decoded[0],
              decoded[1],
              decoded[2],
              {
                strikeIndex: strikeIndex,
                amount: _amount,
                to: accountAddress,
              },
              {
                value,
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
                    amount: _amount,
                    to: accountAddress,
                  }
                )
              : erc20SSOV1inchRouter.swapAndPurchase(
                  ssovContext[activeSsovContextSide].ssovData.ssovContract
                    .address,
                  ssovTokenName === 'BNB'
                    ? Addresses[chainId]['VBNB']
                    : ssovToken.address,
                  decoded[0],
                  decoded[1],
                  decoded[2],
                  {
                    strikeIndex: strikeIndex,
                    amount: _amount,
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
    activeSsovContextSide,
    nativeSSOV1inchRouter,
    optionsAmount,
    sendTx,
    ssovContractWithSigner,
    ssovContext,
    ssovRouter,
    ssovToken,
    ssovTokenName,
    state.totalCost,
    strikeIndex,
    purchaseTokenName,
    updateAssetBalances,
    updateSsovEpochData,
    updateSsovUserData,
    signer,
    contractAddresses,
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
        if (activeSsovContextSide === 'PUT') {
          volatility = (
            await ssovContext[
              activeSsovContextSide
            ].ssovData.ssovContract.getVolatility(strike)
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
          activeSsovContextSide === 'PUT',
          expiry,
          strike,
          tokenPrice,
          volatility
        );

        let premium = optionPrice
          .mul(ethersUtils.parseEther(String(optionsAmount)))
          .div(
            activeSsovContextSide === 'PUT'
              ? ssovContext[activeSsovContextSide].ssovData.lpPrice
              : tokenPrice
          );

        if (activeSsovContextSide === 'PUT') {
          premium = premium.mul(BigNumber.from(1e10));
        }

        let fees = await ssovContractWithSigner.calculatePurchaseFees(
          tokenPrice,
          strike,
          ethersUtils.parseEther(String(optionsAmount))
        );

        if (ssovTokenName === 'BNB') {
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
        if (isZapActive && ssovTokenName === 'BNB') {
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
    activeSsovContextSide === 'PUT',
    ssovContext,
    ssovTokenName,
    isZapActive,
    convertToVBNB,
  ]);

  // Updates the approved and user balance state
  useEffect(() => {
    (async function () {
      const finalAmount = state.totalCost;
      if (activeSsovContextSide === 'PUT') {
        const _token = ERC20__factory.connect(
          contractAddresses[purchaseTokenName],
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
        if (IS_NATIVE(purchaseTokenName)) {
          const userAmount = BigNumber.from(
            userAssetBalances[purchaseTokenName]
          );
          setUserTokenBalance(userAmount);
          setApproved(true);
        } else {
          const _token = ERC20__factory.connect(
            contractAddresses[purchaseTokenName],
            provider
          );

          const userAmount = await _token.balanceOf(accountAddress);

          setUserTokenBalance(userAmount);

          let allowance = await _token.allowance(accountAddress, spender);

          if (finalAmount.lte(allowance)) {
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
    activeSsovContextSide === 'PUT',
    provider,
    spender,
    contractAddresses,
    purchaseTokenName,
  ]);

  useEffect(() => {
    if (rawOptionsAmount === '')
      setPurchaseTokenName(
        activeSsovContextSide === 'PUT' ? '2CRV' : ssovTokenName
      );
  }, [activeSsovContextSide, ssovTokenName]);

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

  const handleZapOut = useCallback(
    () =>
      setPurchaseTokenName(
        activeSsovContextSide === 'PUT' ? '2CRV' : ssovTokenName
      ),
    [ssovTokenName, activeSsovContextSide === 'PUT']
  );

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl lg:pt-4 text-center',
        styles.cardWidth
      )}
    >
      {isZapInVisible ? (
        <Box className={styles.zapIn}>
          <ZapIn
            setOpen={setIsZapInVisible}
            fromTokenSymbol={
              purchaseTokenName === '2CRV' ? 'DPX' : purchaseTokenName
            }
            toTokenSymbol={
              activeSsovContextSide === 'PUT' ? 'USDC' : ssovTokenName
            }
            userTokenBalance={userTokenBalance}
            setFromTokenSymbol={setPurchaseTokenName}
            quote={quote}
            setSlippageTolerance={setSlippageTolerance}
            slippageTolerance={slippageTolerance}
            purchasePower={purchasePower}
            selectedTokenPrice={selectedTokenPrice}
            isInDialog={true}
            isPut={activeSsovContextSide === 'PUT'}
            tokensToExclude={
              activeSsovContextSide === 'PUT' ? ['USDC', 'USDT', '2CRV'] : []
            }
            lpPrice={
              activeSsovContextSide === 'PUT'
                ? getUserReadableAmount(
                    ssovContext[activeSsovContextSide].ssovData.lpPrice,
                    18
                  )
                : 1
            }
          />
        </Box>
      ) : (
        <Box>
          <Box className="flex flex-row items-center mb-4">
            <Typography variant="h5">Buy Options</Typography>
            <ZapOutButton
              isZapActive={isZapActive}
              handleClick={handleZapOut}
            />
            <IconButton
              className={
                isZapActive
                  ? 'p-0 pb-1 mr-0 mt-0.5 ml-4'
                  : 'p-0 pb-1 mr-0 mt-0.5 ml-auto'
              }
              size="large"
            >
              <BigCrossIcon className="" />
            </IconButton>
          </Box>
          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
            <Box className="flex flex-row justify-between">
              <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
                <Box className="flex flex-row h-10 w-10">
                  <img
                    src={
                      SSOV_MAP[
                        ssovContext[activeSsovContextSide].ssovData.tokenName
                      ].imageSrc
                    }
                    alt={ssovTokenName}
                  />
                </Box>
              </Box>
              {activeSsovContextSide === 'CALL' ? (
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
          {activeSsovContextSide === 'PUT' && !isZapInVisible ? (
            <Curve2PoolSelector
              className="mb-2 ml-1"
              token={purchaseTokenName}
              setToken={setPurchaseTokenName}
            />
          ) : null}
          <Box>
            {isChartVisible ? (
              <Box className="p-3 bg-cod-gray rounded-md border border-neutral-800">
                <PnlChart
                  breakEven={
                    activeSsovContextSide === 'PUT'
                      ? Number(strikes[strikeIndex]) -
                        getUserReadableAmount(state.optionPrice, 8)
                      : Number(strikes[strikeIndex]) +
                        getUserReadableAmount(state.optionPrice, 8)
                  }
                  optionPrice={getUserReadableAmount(state.optionPrice, 8)}
                  amount={optionsAmount}
                  isPut={activeSsovContextSide === 'PUT'}
                  price={getUserReadableAmount(tokenPrice, 8)}
                  symbol={ssovTokenName}
                />
              </Box>
            ) : (
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
                        size="large"
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
                    <Typography
                      variant="h6"
                      className="text-stieglitz pb-1 pr-2"
                    >
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
                        {activeSsovContextSide === 'PUT'
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
                        {activeSsovContextSide}
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
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Purchasing with
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {purchaseTokenName}
                  </Typography>
                </Box>
              </Box>
              <Box className={'flex mb-2'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Option Size
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {formatAmount(optionsAmount, 3)}
                  </Typography>
                </Box>
              </Box>
              <Box className={'flex mb-2'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Fees
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {formatAmount(
                      activeSsovContextSide === 'PUT'
                        ? purchaseTokenName === '2CRV'
                          ? getUserReadableAmount(state.fees, 18)
                          : getUserReadableAmount(
                              state.fees.mul(
                                ssovContext[activeSsovContextSide].ssovData
                                  .lpPrice
                              ),
                              36
                            )
                        : getUserReadableAmount(state.fees, 18),
                      6
                    )}{' '}
                    {activeSsovContextSide === 'PUT'
                      ? purchaseTokenName
                      : ssovTokenName}
                  </Typography>
                </Box>
              </Box>
              <Box className={'flex mb-2'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Premium
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {formatAmount(
                      activeSsovContextSide === 'PUT'
                        ? purchaseTokenName === '2CRV'
                          ? getUserReadableAmount(state.premium, 18)
                          : getUserReadableAmount(
                              state.premium.mul(
                                ssovContext[activeSsovContextSide].ssovData
                                  .lpPrice
                              ),
                              36
                            )
                        : getUserReadableAmount(state.premium, 18),
                      6
                    )}{' '}
                    {activeSsovContextSide === 'PUT'
                      ? purchaseTokenName
                      : ssovTokenName}
                  </Typography>
                </Box>
              </Box>
              {activeSsovContextSide === 'CALL' ? (
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Purchase Power
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(
                        isZapActive ? zapInPurchasePower : purchasePower,
                        5
                      )}{' '}
                      {isZapActive
                        ? purchaseTokenName
                        : ssovTokenName === 'BNB'
                        ? 'vBNB'
                        : ssovTokenName}
                    </Typography>
                  </Box>
                </Box>
              ) : null}
              {isZapActive ? (
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Total
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(zapInTotalCost, 5)} {purchaseTokenName}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    You will pay
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(
                        getUserReadableAmount(state.totalCost, 18),
                        5
                      )}{' '}
                      {activeSsovContextSide === 'PUT'
                        ? purchaseTokenName
                        : ssovTokenName === 'BNB'
                        ? 'vBNB'
                        : ssovTokenName}
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
              fromTokenSymbol={purchaseTokenName}
              toTokenSymbol={
                activeSsovContextSide === 'PUT' ? 'USDC' : ssovTokenName
              }
              selectedTokenPrice={selectedTokenPrice}
              isZapInAvailable={
                activeSsovContextSide === 'PUT' ? false : isZapInAvailable
              }
              chainId={chainId}
            />
            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <AlarmIcon />
              </Box>
              <Typography variant="h6" className="text-stieglitz">
                This option will{' '}
                <span className="text-white">Auto Exercise</span> and can be
                settled anytime after expiry.
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
        </Box>
      )}
    </Box>
  );
};

export default PurchaseCard;
