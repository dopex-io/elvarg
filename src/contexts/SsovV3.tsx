import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  SsovV3__factory,
  SsovV3,
  SSOVOptionPricing,
  SsovV3Viewer__factory,
  SSOVOptionPricing__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';

import { WalletContext } from './Wallet';

import { AssetsContext } from './Assets';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

export interface SsovV3Interface {
  underlying?: string;
  symbol?: string;
  type?: 'CALL' | 'PUT';
}

export interface SsovV3Signer {
  ssovContractWithSigner?: SsovV3;
}

export interface SsovV3Data {
  tokenName?: string;
  ssovContract?: any;
  currentEpoch?: number;
  tokenPrice?: BigNumber;
  lpPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  isCurrentEpochExpired?: boolean;
}

export interface SsovV3EpochData {
  epochTimes: {};
  isEpochExpired: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  availableCollateralForStrikes: BigNumber[];
  settlementPrice: BigNumber;
  epochStrikeTokens: string[];
  APY: string;
  TVL: number;
}

export interface WritePositionInterface {
  collateralAmount: BigNumber;
  strike: BigNumber;
  accruedRewards: BigNumber[];
  accruedPremiums: BigNumber;
  epoch: number;
  tokenId: BigNumber;
}
export interface SsovV3UserData {
  writePositions: WritePositionInterface[];
}

interface SsovV3ContextInterface {
  ssovData?: SsovV3Data;
  ssovEpochData?: SsovV3EpochData;
  ssovUserData?: SsovV3UserData;
  ssovSigner: SsovV3Signer;
  selectedEpoch?: number;
  selectedSsovV3?: SsovV3Interface;
  updateSsovV3EpochData?: Function;
  updateSsovV3UserData?: Function;
  setSelectedSsovV3?: Function;
  setSelectedEpoch?: Function;
  isPut?: boolean;
}

const initialSsovV3UserData = {
  writePositions: [],
};

const initialSsovV3Signer = {
  token: null,
  ssovContractWithSigner: null,
};

export const SsovV3Context = createContext<SsovV3ContextInterface>({
  ssovUserData: initialSsovV3UserData,
  ssovSigner: initialSsovV3Signer,
  selectedSsovV3: {},
});

export const SsovV3Provider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);
  const { tokenPrices } = useContext(AssetsContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [selectedSsovV3, setSelectedSsovV3] = useState<SsovV3Interface>({
    symbol: 'ETH',
    type: 'CALL',
  });

  const [ssovData, setSsovV3Data] = useState<SsovV3Data>();
  const [ssovEpochData, setSsovV3EpochData] = useState<SsovV3EpochData>();
  const [ssovUserData, setSsovV3UserData] = useState<SsovV3UserData>();
  const [ssovSigner, setSsovV3Signer] = useState<SsovV3Signer>({
    ssovContractWithSigner: null,
  });

  const updateSsovV3UserData = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !selectedEpoch ||
      !selectedSsovV3
    )
      return;

    const ssovAddress = '0x376bEcbc031dd53Ffc62192043dE43bf491988FD';

    const ssov = SsovV3__factory.connect(ssovAddress, provider);

    let _ssovUserData;

    const ssovViewerContract = SsovV3Viewer__factory.connect(
      '0x14333cae9BAF41AE093Bbd37899E08b21226F2C9',
      provider
    );

    const writePositions = await ssovViewerContract.walletOfOwner(
      accountAddress,
      ssovAddress
    );

    const data = await Promise.all(
      writePositions.map((i) => {
        return ssov.writePosition(i);
      })
    );

    const moreData = await Promise.all(
      writePositions.map((i) => {
        return ssovViewerContract.getWritePositionValue(i, ssovAddress);
      })
    );

    setSsovV3UserData({
      writePositions: data.map((o, i) => {
        return {
          tokenId: writePositions[i],
          collateralAmount: o.collateralAmount,
          epoch: o.epoch.toNumber(),
          strike: o.strike,
          accruedRewards: moreData[i].rewardTokenWithdrawAmounts,
          accruedPremiums: moreData[i].collateralTokenWithdrawAmount.sub(
            o.collateralAmount
          ),
        };
      }),
    });
  }, [
    accountAddress,
    contractAddresses,
    provider,
    selectedEpoch,
    selectedSsovV3,
  ]);

  const updateSsovV3EpochData = useCallback(async () => {
    if (!contractAddresses || !selectedEpoch || !selectedSsovV3) return;

    const ssovAddress = '0x376bEcbc031dd53Ffc62192043dE43bf491988FD';

    const ssovContract = SsovV3__factory.connect(ssovAddress, provider);
    const ssovViewerContract = SsovV3Viewer__factory.connect(
      '0x426eDe8BF1A523d288470e245a343B599c2128da',
      provider
    );

    const [
      epochTimes,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      epochData,
      epochStrikeTokens,
    ] = await Promise.all([
      ssovContract.getEpochTimes(selectedEpoch),
      ssovContract.getEpochStrikes(selectedEpoch),
      ssovViewerContract.getTotalEpochStrikeDeposits(
        selectedEpoch,
        ssovContract.address
      ),
      ssovViewerContract.getTotalEpochOptionsPurchased(
        selectedEpoch,
        ssovContract.address
      ),
      ssovViewerContract.getTotalEpochPremium(
        selectedEpoch,
        ssovContract.address
      ),
      ssovContract.getEpochData(selectedEpoch),
      ssovViewerContract.getEpochStrikeTokens(
        selectedEpoch,
        ssovContract.address
      ),
    ]);

    const epochStrikeDataArray = await Promise.all(
      epochStrikes.map((strike) =>
        ssovContract.getEpochStrikeData(selectedEpoch, strike)
      )
    );

    const availableCollateralForStrikes = epochStrikeDataArray.map((item) => {
      return item.lastVaultCheckpoint.totalCollateral.sub(
        item.lastVaultCheckpoint.activeCollateral
      );
    });

    const totalEpochDeposits = totalEpochStrikeDeposits.reduce(
      (acc, deposit) => {
        return acc.add(deposit);
      },
      BigNumber.from(0)
    );

    const totalRewardsInUSD =
      2.5 * 365 * tokenPrices.find((token) => token.name === 'DPX').price;

    const totalEpochDepositsInUSD =
      getUserReadableAmount(totalEpochDeposits, 18) *
      tokenPrices.find((token) => token.name === 'ETH').price;

    const APY = (
      (Math.abs(totalEpochDepositsInUSD - totalRewardsInUSD) /
        totalEpochDepositsInUSD) *
      100
    ).toFixed(2);

    const _ssovEpochData = {
      isEpochExpired: epochData.expired,
      settlementPrice: epochData.settlementPrice,
      epochTimes,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      availableCollateralForStrikes,
      APY,
      epochStrikeTokens,
      TVL: totalEpochDepositsInUSD,
    };

    setSsovV3EpochData(_ssovEpochData);
  }, [contractAddresses, selectedEpoch, provider, selectedSsovV3, tokenPrices]);

  useEffect(() => {
    if (
      !provider ||
      !contractAddresses ||
      !contractAddresses.SSOV ||
      !selectedSsovV3
    )
      return;

    async function update() {
      let _ssovData: SsovV3Data;

      const ssovAddress = '0x376bEcbc031dd53Ffc62192043dE43bf491988FD';

      const _ssovContract = SsovV3__factory.connect(ssovAddress, provider);

      try {
        const [currentEpoch, tokenPrice] = await Promise.all([
          _ssovContract.currentEpoch(),
          _ssovContract.getUnderlyingPrice(),
        ]);

        setSelectedEpoch(Number(currentEpoch) === 0 ? 1 : Number(currentEpoch));

        _ssovData = {
          tokenName: 'WETH',
          ssovContract: _ssovContract,
          currentEpoch: Number(currentEpoch),
          isCurrentEpochExpired: false,
          tokenPrice,
          ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
            '0x2b99e3d67dad973c1b9747da742b7e26c8bdd67b',
            provider
          ),
        };
      } catch (err) {
        console.log(err);
      }

      setSsovV3Data(_ssovData);
    }

    update();
  }, [contractAddresses, provider, selectedSsovV3]);

  useEffect(() => {
    if (!contractAddresses || !signer || !selectedSsovV3) return;

    let _ssovSigner;

    const ssovAddress = '0x376bEcbc031dd53Ffc62192043dE43bf491988FD';

    const _ssovContractWithSigner = SsovV3__factory.connect(
      ssovAddress,
      signer
    );

    _ssovSigner = {
      ssovContractWithSigner: _ssovContractWithSigner,
    };

    setSsovV3Signer(_ssovSigner);
  }, [contractAddresses, signer, accountAddress, selectedSsovV3]);

  useEffect(() => {
    updateSsovV3UserData();
  }, [updateSsovV3UserData]);

  useEffect(() => {
    updateSsovV3EpochData();
  }, [updateSsovV3EpochData]);

  const contextValue = {
    ssovData,
    ssovEpochData,
    ssovUserData,
    ssovSigner,
    selectedSsovV3,
    selectedEpoch,
    updateSsovV3EpochData,
    // updateSsovV3UserData,
    setSelectedSsovV3,
    setSelectedEpoch,
    isPut: selectedSsovV3?.type === 'PUT',
  };

  return (
    <SsovV3Context.Provider value={contextValue}>
      {props.children}
    </SsovV3Context.Provider>
  );
};
