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
import {
  AtlanticStraddle__factory,
  Addresses,
  AtlanticStraddle,
  SSOVOptionPricing__factory,
} from '@dopex-io/sdk';

import { WalletContext } from './Wallet';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

export interface StraddlesData {
  straddlesContract: AtlanticStraddle | undefined;
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
  purchaseFee: BigNumber;
  straddlePremium: BigNumber;
  straddleFunding: BigNumber;
  aprPremium: string;
  aprFunding: string;
  volatility: BigNumber;
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
  selectedPoolName: string;
  straddlesData?: StraddlesData | undefined;
  straddlesEpochData?: StraddlesEpochData | undefined;
  straddlesUserData?: StraddlesUserData | undefined;
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
  purchaseFee: BigNumber.from('0'),
  straddlePremium: BigNumber.from('0'),
  straddleFunding: BigNumber.from('0'),
  aprPremium: '',
  aprFunding: '',
  volatility: BigNumber.from('0'),
};

export const StraddlesContext = createContext<StraddlesContextInterface>({
  selectedPoolName: 'ETH',
  straddlesUserData: initialStraddlesUserData,
  straddlesEpochData: initialStraddlesEpochData,
});

export const StraddlesProvider = (props: { children: ReactNode }) => {
  const { accountAddress, provider } = useContext(WalletContext);

  const [selectedPoolName, setSelectedPoolName] = useState<string>('ETH');
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
    else
      return AtlanticStraddle__factory.connect(
        Addresses[42161].STRADDLES[selectedPoolName].Vault,
        provider
      );
  }, [provider, selectedPoolName]);

  const optionsPricingContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else
      return SSOVOptionPricing__factory.connect(
        Addresses[42161].STRADDLES[selectedPoolName].OptionPricing,
        provider
      );
  }, [provider, selectedPoolName]);

  const getStraddlePosition = useCallback(
    async (id: BigNumber) => {
      try {
        const owner = await straddlesContract!['ownerOf'](id);
        if (owner !== accountAddress) throw 'Invalid owner';

        const data = await straddlesContract!['straddlePositions'](id);

        const currentPrice = straddlesEpochData!.currentPrice;
        const volatility = straddlesEpochData!.volatility;
        const timeToExpiry = straddlesEpochData!.expiry;
        const strike = data['apStrike'];
        const amount = data['amount'];

        let [callPnl, putPnl] = await Promise.all([
          optionsPricingContract?.getOptionPrice(
            false,
            currentPrice,
            strike,
            timeToExpiry,
            volatility
          ),
          optionsPricingContract?.getOptionPrice(
            true,
            currentPrice,
            strike,
            timeToExpiry,
            volatility
          ),
        ]);

        // live pnl = 0.5 * BS(call) + 0.5 * BS(put)
        callPnl = callPnl ? callPnl.div(BigNumber.from(2)) : BigNumber.from(0);
        putPnl = putPnl ? putPnl.div(BigNumber.from(2)) : BigNumber.from(0);
        const pnl: BigNumber = callPnl.add(putPnl).mul(amount.div(1e18));

        return {
          id: id,
          epoch: data['epoch'],
          amount: data['amount'],
          apStrike: strike,
          pnl: pnl,
        };
      } catch (err) {
        console.log(err);
        return {
          amount: BigNumber.from('0'),
        };
      }
    },
    [
      straddlesContract,
      accountAddress,
      straddlesEpochData,
      optionsPricingContract,
    ]
  );

  const getWritePosition = useCallback(
    async (id: BigNumber) => {
      try {
        const owner = await straddlesContract!['ownerOf'](id);
        if (owner !== accountAddress) throw 'Invalid owner';

        const data = await straddlesContract!['writePositions'](id);
        const pnl = await straddlesContract!['calculateWritePositionPnl'](id);
        return {
          id: id,
          epoch: data['epoch'],
          usdDeposit: data['usdDeposit'],
          rollover: data['rollover'],
          pnl: pnl,
        };
      } catch {
        return {
          usdDeposit: BigNumber.from('0'),
        };
      }
    },
    [straddlesContract, accountAddress]
  );

  const updateStraddlesUserData = useCallback(async () => {
    if (selectedEpoch === null || !accountAddress || !straddlesContract) return;

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
        return el && el['epoch'];
      }),
      writePositions: writePositions.filter(function (el) {
        return el && el['epoch'];
      }),
    });
  }, [
    straddlesContract,
    selectedEpoch,
    accountAddress,
    getStraddlePosition,
    getWritePosition,
  ]);

  const updateStraddlesEpochData = useCallback(async () => {
    if (selectedEpoch === null || !straddlesContract) return;

    const epochData = await straddlesContract!['epochData'](
      Math.max(selectedEpoch || 1, 1)
    );

    const epochCollectionsData = await straddlesContract![
      'epochCollectionsData'
    ](selectedEpoch);
    const currentPrice = await straddlesContract!['getUnderlyingPrice']();
    const usdFunding = epochCollectionsData['usdFunding'];
    const usdPremiums = epochCollectionsData['usdPremiums'];
    const totalSold = epochCollectionsData['totalSold'];

    let straddlePrice;
    let aprFunding: BigNumber | string;
    let volatility: BigNumber | string;
    let purchaseFee: BigNumber | string;
    let straddlePremium: BigNumber | string;
    let straddleFunding: BigNumber | string;

    try {
      straddlePremium = await straddlesContract!['calculatePremium'](
        true,
        currentPrice,
        getContractReadableAmount(1, 18),
        epochData['expiry']
      );
    } catch (e) {
      straddlePremium = BigNumber.from('0');
    }

    try {
      aprFunding = await straddlesContract!['apFundingPercent']();
      aprFunding = aprFunding.div(1e6);
    } catch (e) {
      aprFunding = BigNumber.from('0');
    }

    aprFunding = aprFunding.toString();

    try {
      purchaseFee = await straddlesContract!['purchaseFeePercent']();
      purchaseFee = purchaseFee.mul(currentPrice).mul(1e10);
    } catch (e) {
      purchaseFee = BigNumber.from('0');
    }

    try {
      volatility = await straddlesContract!['getVolatility'](currentPrice);
    } catch (e) {
      volatility = BigNumber.from('0');
    }

    const timeToExpiry =
      epochData['expiry'].toNumber() - new Date().getTime() / 1000;

    const normApr = usdPremiums
      .mul(BigNumber.from(365))
      .mul(BigNumber.from(100))
      .div(
        epochData['activeUsdDeposits'].isZero()
          ? 1
          : epochData['activeUsdDeposits']
      )
      .div(BigNumber.from(3))
      .toNumber();
    const aprPremium = normApr.toFixed(0);

    straddleFunding = currentPrice
      .mul(getContractReadableAmount(16, 18))
      .mul(BigNumber.from(Math.round(timeToExpiry)))
      .div(BigNumber.from(365 * 86400))
      .div(1e2);

    straddlePrice = straddlePremium.add(straddleFunding).add(purchaseFee);

    if (straddlePrice.lt(0)) straddlePrice = BigNumber.from(0);

    setStraddlesEpochData({
      activeUsdDeposits: epochData['activeUsdDeposits'],
      expiry: epochData['expiry'],
      settlementPrice: epochData['settlementPrice'],
      startTime: epochData['startTime'],
      underlyingPurchased: epochData['underlyingPurchased'],
      usdDeposits: epochData['usdDeposits'],
      usdFunding,
      totalSold,
      usdPremiums,
      currentPrice,
      straddlePrice,
      purchaseFee,
      straddlePremium,
      straddleFunding,
      aprPremium,
      aprFunding,
      volatility,
    });
  }, [straddlesContract, selectedEpoch]);

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
        isVaultReady: isVaultReady,
        isEpochExpired: isEpochExpired,
      });
    }

    if (straddlesContract) update();
  }, [straddlesContract]);

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
