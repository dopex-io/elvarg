import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  AtlanticStraddle__factory,
  ERC721__factory,
  Addresses,
  AtlanticStraddle,
} from '@dopex-io/sdk';

import { WalletContext } from './Wallet';

import getContractReadableAmount from '../utils/contracts/getContractReadableAmount';

export interface StraddlesData {
  straddlesContract: AtlanticStraddle;
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
  const { accountAddress, provider } = useContext(WalletContext);

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
    if (!selectedPoolName || !provider)
      return AtlanticStraddle__factory.connect('', ethers.getDefaultProvider());
    else
      return AtlanticStraddle__factory.connect(
        Addresses[42161].STRADDLES.ETH.Vault,
        provider
      );
  }, [provider, selectedPoolName]);

  const straddlePositionsMinterContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else
      return ERC721__factory.connect(
        Addresses[42161].STRADDLES.ETH.StraddlesPositionsMinter,
        provider
      );
  }, [provider, selectedPoolName]);

  const writePositionsMinterContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else
      return ERC721__factory.connect(
        Addresses[42161].STRADDLES.ETH.WritePositionsMinter,
        provider
      );
  }, [provider, selectedPoolName]);

  const getStraddlePosition = useCallback(
    async (id: BigNumber) => {
      try {
        const data = await straddlesContract!['straddlePositions'](id);
        const pnl = await straddlesContract!['calculateStraddlePositionPnl'](
          id
        );
        return {
          id: id,
          epoch: data['epoch'],
          amount: data['amount'],
          apStrike: data['apStrike'],
          pnl: pnl,
        };
      } catch {
        return {
          amount: BigNumber.from('0'),
        };
      }
    },
    [straddlesContract]
  );

  const getWritePosition = useCallback(
    async (id: BigNumber) => {
      try {
        const data = await straddlesContract!['writePositions'](id);

        return {
          id: id,
          epoch: data['epoch'],
          usdDeposit: data['usdDeposit'],
          rollover: data['rollover'],
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

    const straddlePositionsIndexes: BigNumber[] = await straddlesContract[
      'straddlePositionsOfOwner'
    ](accountAddress);
    const writePositionsIndexes: BigNumber[] = await straddlesContract[
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
        return !el['amount'].eq(0);
      }),
      writePositions: writePositions.filter(function (el) {
        return !el['usdDeposit'].eq(0);
      }),
    });
  }, [
    straddlesContract,
    selectedEpoch,
    accountAddress,
    getStraddlePosition,
    getWritePosition,
    selectedPoolName,
  ]);

  const updateStraddlesEpochData = useCallback(async () => {
    if (selectedEpoch === null || !selectedPoolName || !straddlesContract)
      return;

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
      .div(BigNumber.from(365 * 86400))
      .div(1e8);

    straddlePrice = straddlePrice.add(straddlePriceFunding);

    if (straddlePrice.lt(0)) straddlePrice = BigNumber.from(0);

    setStraddlesEpochData({
      activeUsdDeposits: epochData['activeUsdDeposits'],
      expiry: epochData['expiry'],
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
  }, [straddlesContract, selectedEpoch, selectedPoolName]);

  useEffect(() => {
    async function update() {
      let currentEpoch = 0;
      let isEpochExpired;

      try {
        currentEpoch = Number(await straddlesContract!['currentEpoch']());

        isEpochExpired = await straddlesContract!['isEpochExpired'](
          currentEpoch
        );
        if (isEpochExpired) currentEpoch = currentEpoch + 1;
      } catch (err) {
        console.log(err);
        return;
      }

      const addresses = await straddlesContract!['addresses']();

      const underlying = addresses['underlying'];

      const usd = addresses['usd'];

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
  }, [
    selectedPoolName,
    straddlesContract,
    straddlePositionsMinterContract,
    writePositionsMinterContract,
  ]);

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
