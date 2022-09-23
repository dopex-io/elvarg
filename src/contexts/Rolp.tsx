import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
// import { Addresses } from '@dopex-io/sdk';
import { ReverseOptionLP__factory } from 'mocks/factories/ReverseOptionLP__factory';
import { ReverseOptionLP } from 'mocks/ReverseOptionLP';
import { BigNumber } from 'ethers';
import noop from 'lodash/noop';
import { WalletContext } from './Wallet';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/index';
import oneEBigNumber from 'utils/math/oneEBigNumber';

// For Goerli test net
const ROLP: string = '0xf1d2aacbdd0e0ab74cb990169652b802fe95f02d';
const TOKEN: string = '0xf54fcf65ada818b878eb9119d7ab38c708af8fa5';

export interface LpPositionInterface {
  lpId: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  numTokensProvided: BigNumber;
  numTokensSold: BigNumber;
  markup: BigNumber;
  usdReceived: BigNumber;
  seller: string;
  killed: boolean;
}

export interface OptionTokenInfoInterface {
  ssov: string;
  strike: BigNumber;
  tokenLiquidity: BigNumber;
}

export interface OlpEpochDataInterface {
  totalLiquidityPerStrike: BigNumber[];
  lpPositions: LpPositionInterface[];
  strikes: BigNumber[];
  strikeTokens: string[];
  strikeTokenPrices: BigNumber[];
  optionTokens: OptionTokenInfoInterface[];
}

export interface OlpDataInterface {
  tokenName: string;
  underlying: string;
  ssov: string;
  usd: string;
  currentEpoch: BigNumber;
  expiry: BigNumber;
  expiries: BigNumber[];
}

export interface OlpUserDataInterface {
  userPositions: LpPositionInterface[];
}

export interface OlpStrikeTokensInterface {
  strikeTokens: string[];
}

interface OlpContextInterface {
  olpContract?: ReverseOptionLP;
  olpData?: OlpDataInterface;
  olpEpochData?: OlpEpochDataInterface;
  olpUserData?: OlpUserDataInterface;
  selectedPoolName: string;
  selectedStrikeToken: string;
  selectedEpoch?: number;
  selectedIsPut?: boolean;
  selectedStrikeIdx?: number;
  selectedPositionIdx?: number;
  updateOlpEpochData?: Function;
  updateOlpUserData?: Function;
  setSelectedPoolName?: Function;
  setSelectedStrikeToken?: Function;
  setSelectedEpoch?: Function;
  setSelectedIsPut?: Function;
  setSelectedStrikeIdx?: Function;
  setSelectedPositionIdx?: Function;
}

const initOlpData = {
  tokenName: '',
  underlying: '',
  usd: '',
  ssov: '',
  currentEpoch: BigNumber.from(0),
  expiry: BigNumber.from(0),
  expiries: [],
  totalLiquidityPerStrike: [],
  lpPositions: [],
  strikes: [],
  strikeTokens: [],
  optionTokens: [],
};

const initOlpEpochData = {
  totalLiquidityPerStrike: [],
  lpPositions: [],
  strikes: [],
  strikeTokens: [],
  strikeTokenPrices: [],
  optionTokens: [],
};

const initOlpUserData = {
  userPositions: [],
};

export const OlpContext = createContext<OlpContextInterface>({
  olpData: initOlpData,
  olpEpochData: initOlpEpochData,
  olpUserData: initOlpUserData,
  selectedPoolName: '',
  selectedStrikeToken: '',
  selectedEpoch: 0,
  selectedIsPut: false,
  selectedStrikeIdx: 0,
  selectedPositionIdx: 0,
  updateOlpEpochData: noop,
  updateOlpUserData: noop,
  setSelectedPoolName: noop,
  setSelectedStrikeToken: noop,
  setSelectedEpoch: noop,
  setSelectedIsPut: noop,
  setSelectedStrikeIdx: noop,
  setSelectedPositionIdx: noop,
});

export const OlpProvider = (props: { children: ReactNode }) => {
  const { accountAddress, provider } = useContext(WalletContext);
  const [olpData, setOlpData] = useState<OlpDataInterface>(initOlpData);
  const [olpEpochData, setOlpEpochData] =
    useState<OlpEpochDataInterface>(initOlpEpochData);
  const [olpUserData, setOlpUserData] =
    useState<OlpUserDataInterface>(initOlpUserData);
  const [selectedPoolName, setSelectedPoolName] = useState<string>('');
  const [selectedStrikeToken, setSelectedStrikeToken] = useState<string>('');
  const [selectedEpoch, setSelectedEpoch] = useState<number>(1);
  const [selectedIsPut, setSelectedIsPut] = useState<boolean>(false);
  const [selectedStrikeIdx, setSelectedStrikeIdx] = useState<number>(0);
  const [selectedPositionIdx, setSelectedPositionIdx] = useState<number>(0);

  const olpContract = useMemo(() => {
    if (!selectedPoolName || !provider) {
      return null;
    }
    // TODO: Addresses[CHAIN_ID].OLP[selectedPoolName].Vault
    return ReverseOptionLP__factory.connect(ROLP, provider);
  }, [provider, selectedPoolName]);

  const updateOlpUserData = useCallback(async () => {
    if (
      selectedEpoch === null ||
      !accountAddress ||
      !olpContract ||
      !olpEpochData
    ) {
      return;
    }

    const lpPositionsPromise: Promise<LpPositionInterface[]>[] = [];
    olpEpochData?.strikeTokens?.map((token) => {
      lpPositionsPromise.push(
        olpContract.getUserLpPositions(accountAddress, token)
      );
    });

    const currentPositions: LpPositionInterface[] = (
      await Promise.all(lpPositionsPromise)
    ).flat();

    setOlpUserData({
      userPositions: currentPositions.filter((position) => !position.killed),
    });
  }, [olpContract, olpEpochData, selectedEpoch, accountAddress]);

  const updateOlpEpochData = useCallback(async () => {
    if (selectedEpoch === null || !olpContract) {
      return;
    }
    try {
      const ssov = await olpContract.getTokenVaultRegistry(
        TOKEN,
        selectedIsPut
      );

      const [strikes, strikeTokens] = await Promise.all([
        olpContract.getSsovEpochStrikes(ssov, selectedEpoch),
        olpContract.getSsovOptionTokens(ssov, selectedEpoch),
      ]);

      const strikeTokensInfoPromise: Promise<OptionTokenInfoInterface>[] = [];
      const lpPositionsPromise: Promise<LpPositionInterface[]>[] = [];
      const tokenPricesPromise: Promise<BigNumber>[] = [];

      strikeTokens.map((token) => {
        strikeTokensInfoPromise.push(olpContract.getOptionTokenInfo(token));
        lpPositionsPromise.push(olpContract.getAllLpPositions(token));
      });

      strikes.map((strike) => {
        tokenPricesPromise.push(
          olpContract.getSsovPremiumCalculation(
            ssov,
            strike,
            oneEBigNumber(DEFAULT_TOKEN_DECIMALS)
          )
        );
      });

      const strikeTokenLpPositions = await Promise.all(lpPositionsPromise);
      const strikeTokensInfo = await Promise.all(strikeTokensInfoPromise);
      const strikeTokensPrices = await Promise.all(tokenPricesPromise);

      const totalLiquidityPerStrike: BigNumber[] = [];
      strikeTokenLpPositions.map((tokens) => {
        const totalLpLiquidity = tokens.reduce(
          (prev, position) => prev.add(position.numTokensProvided),
          BigNumber.from(0)
        );
        totalLiquidityPerStrike.push(totalLpLiquidity);
      });

      setOlpEpochData({
        totalLiquidityPerStrike: totalLiquidityPerStrike,
        lpPositions: strikeTokenLpPositions
          .flat()
          .filter((position) => !position.killed),
        strikes: strikes,
        strikeTokens: strikeTokens,
        strikeTokenPrices: strikeTokensPrices,
        optionTokens: strikeTokensInfo,
      });
    } catch (err) {
      console.log(err);
    }
  }, [olpContract, selectedEpoch, selectedIsPut]);

  useEffect(() => {
    async function update() {
      if (!olpContract) return;
      try {
        const ssov = await olpContract.getTokenVaultRegistry(
          TOKEN,
          selectedIsPut
        );

        const [usd, expiry, expiries, currentEpoch] = await Promise.all([
          olpContract.addresses(),
          olpContract.getSsovExpiry(ssov),
          olpContract.getSsovEpochExpiries(ssov),
          olpContract.getSsovEpoch(ssov),
        ]);

        setSelectedEpoch(expiries.length > 0 ? expiries.length : 0);

        setOlpData({
          tokenName: selectedPoolName,
          underlying: TOKEN,
          ssov: ssov,
          usd: usd,
          currentEpoch: currentEpoch,
          expiry: expiry,
          expiries: expiries,
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (olpContract) update();
  }, [olpContract, selectedPoolName, selectedIsPut]);

  useEffect(() => {
    updateOlpUserData();
    updateOlpEpochData();
  }, [updateOlpUserData, updateOlpEpochData]);

  const contextValue = {
    olpContract,
    olpData,
    olpEpochData,
    olpUserData,
    selectedPoolName,
    selectedStrikeToken,
    selectedEpoch,
    selectedIsPut,
    selectedStrikeIdx,
    selectedPositionIdx,
    updateOlpEpochData,
    updateOlpUserData,
    setSelectedIsPut,
    setSelectedPoolName,
    setSelectedStrikeToken,
    setSelectedEpoch,
    setSelectedStrikeIdx,
    setSelectedPositionIdx,
  };

  return (
    <OlpContext.Provider value={contextValue}>
      {props.children}
    </OlpContext.Provider>
  );
};
