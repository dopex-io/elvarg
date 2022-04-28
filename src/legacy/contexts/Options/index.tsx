import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ethers } from 'ethers';
import {
  OptionPoolBroker__factory,
  OptionPoolFactory__factory,
  OptionPricingCustom__factory,
  ERC20__factory,
  Margin__factory,
  DopexOracle__factory,
} from '@dopex-io/sdk';
import addDays from 'date-fns/addDays';

import { AssetsContext } from '../Assets';
import { WalletContext } from '../Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getOptionPoolId from 'utils/contracts/getOptionPoolId';
import isValidStrike from 'utils/contracts/isValidStrike';
import getAssetMapWithAddress from 'utils/general/getAssetMapWithAddress';
import isDailyExpired from 'utils/date/isDailyExpired';

import { PRICE_INCREMENTS } from 'constants/index';

import makeData from './makeData';
import ivGetter from './ivGetter';

export enum OptionTypeEnum {
  Put = 0,
  Call = 1,
}

export interface SelectedOptionData {
  strikePrice?: number;
  optionPrice?: number;
  optionType?: OptionTypeEnum;
  breakEven?: number;
}

export interface OptionDataItem {
  strikePrice: number;
  isCallItm: boolean;
  isPutItm: boolean;
  callBreakEven: number;
  putBreakEven: number;
  callOptionPrice: number;
  putOptionPrice: number;
  callGreeks: {
    delta: number;
    theta: number;
    gamma: number;
    vega: number;
  };
  putGreeks: {
    delta: number;
    theta: number;
    gamma: number;
    vega: number;
  };
  callIv: number;
  putIv: number;
}

export interface MarginData {
  maxLeverage: string;
  minLeverage: string;
  collaterals: {
    token: string;
    symbol: string;
    collateralizationRatio: string;
    liquidationRatio: string;
    price: string;
    decimals: number;
  }[];
}

const defaultMarginData: MarginData = {
  maxLeverage: '0',
  minLeverage: '0',
  collaterals: [],
};

export const OptionsContext = createContext<{
  selectedOptionData: SelectedOptionData;
  optionData: OptionDataItem[];
  optionType: OptionTypeEnum;
  marginData: MarginData;
  loading: boolean;
  expiry?: number;
  setSelectedOptionData?: Function;
  setOptionType?: Function;
  setExpiry?: Function;
  setOptionData?: Function;
  setLoading?: Function;
}>({
  selectedOptionData: {},
  optionData: [],
  optionType: OptionTypeEnum.Call,
  marginData: defaultMarginData,
  expiry: 0,
  loading: true,
});

export const OptionsProvider = (props: React.ComponentProps<any>) => {
  const [selectedOptionData, setSelectedOptionData] =
    useState<SelectedOptionData>({});
  const [optionData, setOptionData] = useState<OptionDataItem[]>([]);
  const [marginData, setMarginData] = useState<MarginData>(defaultMarginData);
  const [optionType, setOptionType] = useState(OptionTypeEnum.Call);
  const [loading, setLoading] = useState(true);
  const [expiry, setExpiry] = useState(0);

  const { provider, contractAddresses, blockTime, epochInitTime } =
    useContext(WalletContext);

  useEffect(() => {
    if (blockTime > 0) {
      let _expiry = addDays(
        new Date(blockTime * 1000),
        isDailyExpired() ? 1 : 0
      ).setUTCHours(8, 0, 0, 0);

      setExpiry(_expiry);
    }
  }, [blockTime, epochInitTime]);

  const { selectedBaseAsset, baseAssetsWithPrices } = useContext(AssetsContext);

  const loadOptionData = useCallback(async () => {
    if (
      !provider ||
      !selectedBaseAsset ||
      !baseAssetsWithPrices ||
      !baseAssetsWithPrices[selectedBaseAsset] ||
      !expiry
    )
      return;

    const optionPoolFactory = OptionPoolFactory__factory.connect(
      contractAddresses.OptionPoolFactory,
      provider
    );

    const assetMap = getAssetMapWithAddress(contractAddresses);
    const baseAssetAddress = assetMap[selectedBaseAsset].address;
    const quoteAssetAddress = assetMap['USDT'].address;

    const optionPoolId = getOptionPoolId(
      baseAssetAddress,
      quoteAssetAddress,
      'weekly'
    );

    const optionPoolAddress = await optionPoolFactory.optionPools(optionPoolId);

    const optionPricing = OptionPricingCustom__factory.connect(
      contractAddresses.OptionPricingCustom,
      provider
    );

    const optionPoolBroker = OptionPoolBroker__factory.connect(
      contractAddresses.OptionPoolBroker,
      provider
    );

    const optionPoolVars = await optionPoolBroker.optionPoolVars(
      optionPoolAddress
    );

    const strikeRange = optionPoolVars.strikeRange.toNumber();

    const currentPrice = getUserReadableAmount(
      baseAssetsWithPrices[selectedBaseAsset].price,
      8
    );

    const basePrice: number =
      PRICE_INCREMENTS[selectedBaseAsset].getBasePrice(currentPrice);

    // +ve increments
    let incrementedPrice = basePrice;

    const calls: Promise<ethers.BigNumber>[][] = [];
    const fullData: {
      strikePrice: number;
      currentPrice: number;
      expiryDate: number;
    }[] = [];

    while (true) {
      if (isValidStrike(strikeRange, currentPrice, incrementedPrice)) {
        calls.push(
          ivGetter({
            strikePrice: incrementedPrice,
            currentPrice,
            expiryDate: expiry,
            optionPoolAddress,
            optionPricing,
          })
        );
        fullData.push({
          strikePrice: incrementedPrice,
          currentPrice,
          expiryDate: expiry,
        });
        incrementedPrice += PRICE_INCREMENTS[selectedBaseAsset].increment;
      } else {
        break;
      }
    }

    // -ve increments
    incrementedPrice =
      basePrice - PRICE_INCREMENTS[selectedBaseAsset].increment;

    while (true) {
      if (isValidStrike(strikeRange, currentPrice, incrementedPrice)) {
        calls.push(
          ivGetter({
            strikePrice: incrementedPrice,
            currentPrice,
            expiryDate: expiry,
            optionPoolAddress,
            optionPricing,
          })
        );
        fullData.push({
          strikePrice: incrementedPrice,
          currentPrice,
          expiryDate: expiry,
        });
        incrementedPrice -= PRICE_INCREMENTS[selectedBaseAsset].increment;
      } else {
        break;
      }
    }

    const ivs = await Promise.all(calls.flat());

    let i = 0;

    const optionsData = fullData.map(
      ({ strikePrice, currentPrice, expiryDate }) => {
        const data = makeData({
          strikePrice,
          currentPrice,
          expiryDate,
          callIv: ivs[i].toNumber(),
          putIv: ivs[i + 1].toNumber(),
        });
        i += 2;
        return data;
      }
    );

    setOptionData((prevState) => {
      if (
        prevState.length > 1 &&
        prevState[0].strikePrice - prevState[1].strikePrice < 0
      ) {
        return optionsData.sort((a, b) => a.strikePrice - b.strikePrice);
      } else {
        return optionsData.sort((a, b) => b.strikePrice - a.strikePrice);
      }
    });

    setLoading(false);
  }, [
    selectedBaseAsset,
    baseAssetsWithPrices,
    expiry,
    contractAddresses,
    provider,
  ]);

  const loadMarginData = useCallback(async () => {
    if (
      !provider ||
      !contractAddresses?.Margin ||
      !contractAddresses?.DopexOracle
    )
      return;
    const margin = Margin__factory.connect(contractAddresses.Margin, provider);
    const [maxLeverage, minLeverage, collaterals] = await Promise.all([
      margin.maxLeverage(),
      margin.minLeverage(),
      margin.getCollaterals(),
    ]);
    const collateralsInfo = await Promise.all(
      collaterals.map(async (collateral) => margin.collateralAssets(collateral))
    );
    const collateralsSymbols = await Promise.all(
      collaterals.map(async (collateral) =>
        ERC20__factory.connect(collateral, provider).symbol()
      )
    );
    const collateralsDecimals = await Promise.all(
      collaterals.map(async (collateral) =>
        ERC20__factory.connect(collateral, provider).decimals()
      )
    );
    const collateralsPrices = await Promise.all(
      collaterals.map(async (collateral, index) => {
        if (collateralsSymbols[index] === 'USDT') {
          return ethers.utils
            .parseUnits(
              '1',
              await ERC20__factory.connect(collateral, provider).decimals()
            )
            .toString();
        } else {
          return (
            await DopexOracle__factory.connect(
              contractAddresses.DopexOracle,
              provider
            ).getLastPrice(collateralsSymbols[index], 'USDT')
          ).toString();
        }
      })
    );
    const newCollaterals = collaterals.map((collateral, index) => ({
      token: collateral,
      symbol: collateralsSymbols[index],
      price: collateralsPrices[index],
      decimals: collateralsDecimals[index],
      collateralizationRatio:
        collateralsInfo[index].collateralizationRatio.toString(),
      liquidationRatio: collateralsInfo[index].liquidationRatio.toString(),
    }));
    setMarginData((prevState) => ({
      ...prevState,
      maxLeverage: maxLeverage.toString(),
      minLeverage: minLeverage.toString(),
      collaterals: newCollaterals,
    }));
  }, [provider, contractAddresses]);

  useEffect(() => {
    loadOptionData();
  }, [loadOptionData]);

  useEffect(() => {
    loadMarginData();
  }, [loadMarginData]);

  return (
    <OptionsContext.Provider
      value={{
        selectedOptionData,
        optionData,
        optionType,
        marginData,
        loading,
        expiry,
        setSelectedOptionData,
        setOptionType,
        setOptionData,
        setExpiry,
        setLoading,
      }}
    >
      {props.children}
    </OptionsContext.Provider>
  );
};
