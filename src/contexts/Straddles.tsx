import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

import { BigNumber } from 'ethers';
import { AtlanticStraddle__factory, ERC721__factory } from '@dopex-io/sdk';

import { WalletContext } from './Wallet';
import getContractReadableAmount from '../utils/contracts/getContractReadableAmount';


export interface StraddlesData {
  straddlesContract: any;
  straddlePositionsMinter: any;
  writePositionsMinter: any;
  currentEpoch: number;
  underlying: string;
  usd: string;
  isVaultReady: boolean;
  isEpochExpired: boolean;
}

export interface StraddlesEpochData {
  startTime: BigNumber;
  expiry: BigNumber;
  usdDeposits: BigNumber;
  activeUsdDeposits: BigNumber;
  strikes: number[];
  settlementPrice: BigNumber;
  underlyingPurchased: BigNumber;
  usdPremiums: BigNumber;
  usdFunding: BigNumber;
  totalSold: BigNumber;
  currentPrice: BigNumber;
  straddlePrice: BigNumber;
}

export interface WritePosition {
  epoch: number;
  usdDeposit: BigNumber;
  rollover: BigNumber;
  pnl: BigNumber;
  withdrawn: boolean;
  id: number;
}

export interface StraddlePosition {
  epoch: number;
  amount: BigNumber;
  apStrike: BigNumber;
  exercised: boolean;
  id: number;
  pnl: BigNumber;
}

export interface StraddlesUserData {
  writePositions?: WritePosition[];
  straddlePositions?: StraddlePosition[];
}

interface StraddlesContextInterface {
  straddlesData?: StraddlesData | undefined;
  straddlesEpochData?: StraddlesEpochData | undefined;
  straddlesUserData?: StraddlesUserData | undefined;
  selectedPoolName?: string | null;
  selectedEpoch?: number | null;
  updateStraddlesEpochData?: Function;
  updateStraddlesUserData?: Function;
  setSelectedEpoch?: Function;
  setSelectedPoolName?: Function;
}

const initialStraddlesUserData = {};
const initialStraddlesEpochData = {
  startTime: BigNumber.from(new Date().getTime()),
  expiry: BigNumber.from('0'),
  usdDeposits: BigNumber.from('0'),
  activeUsdDeposits: BigNumber.from('0'),
  strikes: [],
  settlementPrice: BigNumber.from('0'),
  underlyingPurchased: BigNumber.from('0'),
  usdFunding: BigNumber.from('0'),
  usdPremiums: BigNumber.from('0'),
  totalSold: BigNumber.from('0'),
  currentPrice: BigNumber.from('0'),
  straddlePrice: BigNumber.from('0'),
};

export const StraddlesContext = createContext<StraddlesContextInterface>({
  straddlesUserData: initialStraddlesUserData,
  straddlesEpochData: initialStraddlesEpochData,
});

export const StraddlesProvider = (props: { children: ReactNode }) => {
  const { accountAddress, contractAddresses, provider } =
    useContext(WalletContext);

  const [selectedPoolName, setSelectedPoolName] = useState<string | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(1);
  const [straddlesData, setStraddlesData] = useState<
    StraddlesData | undefined
  >();
  const [straddlesEpochData, setStraddlesEpochData] =
    useState<StraddlesEpochData>();
  const [straddlesUserData, setStraddlesUserData] =
    useState<StraddlesUserData>();

  const straddlesContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else return AtlanticStraddle__factory.connect(
        "0x269Af6744C612c099Fb0e614f0e28f0825498969",
        provider
    )
  }, [provider, selectedPoolName]);

  const straddlePositionsMinterContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else return ERC721__factory.connect(
        "0x46B852311c561A8274D5c4671c79D90F6aDf0234",
        provider
    )
  }, [provider, selectedPoolName]);

  const writePositionsMinterContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else return ERC721__factory.connect(
        "0x44a7bd59628F86c2773B2c531c0f7dDa1f7D4539",
        provider
    )
  }, [provider, selectedPoolName]);

  const getStraddlePosition = useCallback(
    async (id: number) => {
      try {
        const data = await straddlesContract!['straddlePositions'](id);
        const pnl = await straddlesContract!['getPnl'](id);
        return {
          id: id,
          epoch: data['epoch'],
          amount: data['amount'],
          apStrike: data['apStrike'],
          exercised: data['exercised'],
          pnl: pnl,
        };
      } catch {
        return {
          amount: BigNumber.from('0'),
          exercised: false
        };
      }
    },
    [straddlesContract, straddlePositionsMinterContract]
  );

  const getWritePosition = useCallback(
    async (id: number) => {
      try {
        const data = await straddlesContract!['writePositions'](id);

        return {
          id: id,
          epoch: data['epoch'],
          usdDeposit: data['usdDeposit'],
          rollover: data['rollover'],
          pnl: data['pnl'],
          withdrawn: data['withdrawn'],
        };
      } catch {
        return {
          usdDeposit: BigNumber.from('0'),
        };
      }
    },
    [straddlesContract]
  );

  const updateStraddlesUserData = useCallback(async () => {
    if (
      selectedEpoch === null ||
      !selectedPoolName ||
      !accountAddress ||
      !straddlesContract
    )
      return;

    const straddlePositionsPromises: any[] = [];
    const writePositionsPromises: any[] = [];

    const straddlePositionsIndexes: number[] = await straddlesContract[
      'straddlePositionsOfOwner'
    ](accountAddress);
    const writePositionsIndexes: number[] = await straddlesContract[
      'writePositionsOfOwner'
    ](accountAddress);

    straddlePositionsIndexes.map((straddlePositionsIndex) =>
      straddlePositionsPromises.push(
        getStraddlePosition(straddlePositionsIndex)
      )
    );
    writePositionsIndexes.map((writePositionsIndex) =>
      writePositionsPromises.push(getWritePosition(writePositionsIndex))
    );

    const straddlePositions: StraddlePosition[] = await Promise.all(
      straddlePositionsPromises
    );
    const writePositions: WritePosition[] = await Promise.all(
      writePositionsPromises
    );

    setStraddlesUserData({
      straddlePositions: straddlePositions.filter(function (el) {
        return !el['amount'].eq(0) && !el['exercised'];
      }),
      writePositions: writePositions.filter(function (el) {
        return !el['usdDeposit'].eq(0) && !el['withdrawn'];
      }),
    });
  }, [
    straddlesContract,
    contractAddresses,
    selectedEpoch,
    provider,
    accountAddress,
    getStraddlePosition,
    getWritePosition,
    selectedPoolName
  ]);

  const updateStraddlesEpochData = useCallback(async () => {
    if (selectedEpoch === null || !selectedPoolName) return;

    const epochData = await straddlesContract!['epochData'](
      Math.max(selectedEpoch || 0, 1)
    );

    const epochCollectionsData = await straddlesContract![
      'epochCollectionsData'
    ](selectedEpoch);
    const currentPrice = await straddlesContract!['getUnderlyingPrice']();
    const usdFunding = epochCollectionsData['usdFunding'];
    const usdPremiums = epochCollectionsData['usdPremiums'];
    const totalSold = epochCollectionsData['totalSold'];

    let straddlePrice;

    try {
      straddlePrice = await straddlesContract!['calculatePremium'](
        false,
        currentPrice,
        getContractReadableAmount(1, 18),
        epochData['expiry']
      );
    } catch (e) {
      straddlePrice = BigNumber.from('0');
    }

    const timeToExpiry =
      epochData['expiry'].toNumber() - new Date().getTime() / 1000;

    const straddlePriceFunding = currentPrice
      .mul(getContractReadableAmount(16, 18))
      .mul(BigNumber.from(Math.round(timeToExpiry)))
      .div(BigNumber.from(365 * 86400));

    straddlePrice = straddlePrice.add(straddlePriceFunding);

    if (straddlePrice.lt(0)) straddlePrice = BigNumber.from(0);

    setStraddlesEpochData({
      activeUsdDeposits: epochData['activeUsdDeposits'],
      expiry: epochData['expiry'],
      strikes: epochData['strikes'],
      settlementPrice: epochData['settlementPrice'],
      startTime: epochData['startTime'],
      underlyingPurchased: epochData['underlyingPurchased'],
      usdDeposits: epochData['usdDeposits'],
      usdFunding: usdFunding,
      totalSold: totalSold,
      usdPremiums: usdPremiums,
      currentPrice: currentPrice,
      straddlePrice: straddlePrice,
    });
  }, [straddlesContract, contractAddresses, selectedEpoch, provider, selectedPoolName]);

  useEffect(() => {
    async function update() {
      let currentEpoch = 0;
      let isEpochExpired;

      try {
        currentEpoch = await straddlesContract!['currentEpoch']();

        isEpochExpired = await straddlesContract!['isEpochExpired'](
          currentEpoch
        );
        if (isEpochExpired) currentEpoch = Number(isEpochExpired) + 1;
      } catch (err) {
        console.log(err);
        return;
      }

      const underlying = await straddlesContract!['underlying']();
      const usd = await straddlesContract!['usd']();

      const isVaultReady = await straddlesContract!['isVaultReady'](
        currentEpoch
      );

      setSelectedEpoch(currentEpoch);

      setStraddlesData({
        usd: usd,
        underlying: underlying,
        currentEpoch: Number(currentEpoch),
        straddlesContract: straddlesContract,
        straddlePositionsMinter: straddlePositionsMinterContract,
        writePositionsMinter: writePositionsMinterContract,
        isVaultReady: isVaultReady,
        isEpochExpired: isEpochExpired,
      });
    }

    if (straddlesContract) update();
  }, [contractAddresses, provider, selectedPoolName, straddlesContract, straddlePositionsMinterContract, writePositionsMinterContract]);

  useEffect(() => {
    updateStraddlesUserData();
  }, [updateStraddlesUserData]);

  useEffect(() => {
    updateStraddlesEpochData();
  }, [updateStraddlesEpochData]);

  const contextValue = {
    straddlesData,
    straddlesEpochData,
    straddlesUserData,
    selectedPoolName,
    selectedEpoch,
    updateStraddlesEpochData,
    updateStraddlesUserData,
    setSelectedEpoch,
    setSelectedPoolName,
  };

  return (
    <StraddlesContext.Provider value={contextValue}>
      {props.children}
    </StraddlesContext.Provider>
  );
};
