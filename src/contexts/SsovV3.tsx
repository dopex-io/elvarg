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
  ERC20__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import axios from 'axios';

import { WalletContext } from './Wallet';
import { AssetsContext } from './Assets';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DOPEX_API_BASE_URL } from 'constants/index';

export interface SsovV3Signer {
  ssovContractWithSigner?: SsovV3;
}

export interface SsovV3Data {
  collateralSymbol?: string;
  underlyingSymbol?: string;
  collateralAddress?: string;
  ssovContract?: SsovV3;
  currentEpoch?: number;
  tokenPrice?: BigNumber;
  lpPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  isCurrentEpochExpired?: boolean;
  isPut?: boolean;
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
  selectedSsovV3?: string;
  updateSsovV3EpochData?: Function;
  updateSsovV3UserData?: Function;
  setSelectedSsovV3?: Function;
  setSelectedEpoch?: Function;
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
  selectedSsovV3: '',
});

export const SsovV3Provider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);
  const { tokenPrices } = useContext(AssetsContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [selectedSsovV3, setSelectedSsovV3] = useState<string>('');

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

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedSsovV3];

    const ssov = SsovV3__factory.connect(ssovAddress, provider);

    const ssovViewerContract = SsovV3Viewer__factory.connect(
      contractAddresses['SSOV-V3'].VIEWER,
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

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedSsovV3];

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
      // apyPayload,
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
      // axios.get(`${DOPEX_API_BASE_URL}/v2/ssov/apy?symbol=${selectedSsovV3}`),
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

    const totalEpochDepositsInUSD =
      getUserReadableAmount(totalEpochDeposits, 18) *
      tokenPrices.find((token) => token.name === 'ETH').price;

    const _ssovEpochData = {
      isEpochExpired: epochData.expired,
      settlementPrice: epochData.settlementPrice,
      epochTimes,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      availableCollateralForStrikes,
      APY: '0',
      epochStrikeTokens,
      TVL: totalEpochDepositsInUSD,
    };

    setSsovV3EpochData(_ssovEpochData);
  }, [contractAddresses, selectedEpoch, provider, selectedSsovV3, tokenPrices]);

  useEffect(() => {
    if (
      !provider ||
      !contractAddresses ||
      !contractAddresses['SSOV-V3'] ||
      !selectedSsovV3
    )
      return;

    async function update() {
      let _ssovData: SsovV3Data;

      const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedSsovV3];

      const _ssovContract = SsovV3__factory.connect(ssovAddress, provider);

      try {
        const [
          currentEpoch,
          tokenPrice,
          underlyingSymbol,
          collateralToken,
          isPut,
        ] = await Promise.all([
          _ssovContract.currentEpoch(),
          _ssovContract.getUnderlyingPrice(),
          _ssovContract.underlyingSymbol(),
          _ssovContract.collateralToken(),
          _ssovContract.isPut(),
        ]);

        const _currentEpoch =
          Number(currentEpoch) === 0 ? 1 : Number(currentEpoch);

        const [epochData, collateralSymbol] = await Promise.all([
          _ssovContract.getEpochData(_currentEpoch),
          ERC20__factory.connect(collateralToken, provider).symbol(),
        ]);

        setSelectedEpoch(_currentEpoch);

        _ssovData = {
          underlyingSymbol,
          collateralSymbol,
          collateralAddress: collateralToken,
          isPut,
          ssovContract: _ssovContract,
          currentEpoch: Number(currentEpoch),
          isCurrentEpochExpired: epochData.expired,
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

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedSsovV3];

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
    updateSsovV3UserData,
    setSelectedSsovV3,
    setSelectedEpoch,
  };

  return (
    <SsovV3Context.Provider value={contextValue}>
      {props.children}
    </SsovV3Context.Provider>
  );
};
