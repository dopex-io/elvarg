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

import { SSOV_MAP } from 'constants/index';

import formatAmount from 'utils/general/formatAmount';
import isZeroAddress from 'utils/contracts/isZeroAddress';

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
  // isEpochExpired: boolean;
  // isVaultReady: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  // totalEpochDeposits: BigNumber;
  // settlementPrice: BigNumber;
  APY: string;
}

export interface SsovV3UserData {
  // userEpochDeposits: string;
  // epochStrikeTokens: ERC20[];
  // userEpochStrikeDeposits: BigNumber[];
  // userEpochOptionsPurchased: BigNumber[];
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
  userEpochStrikeDeposits: [],
  userEpochDeposits: '0',
  userEpochOptionsPurchased: [],
  epochStrikeTokens: [],
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

  // const updateSsovV3UserData = useCallback(async () => {
  //   if (
  //     !contractAddresses ||
  //     !accountAddress ||
  //     !selectedEpoch ||
  //     !selectedSsovV3
  //   )
  //     return;

  //   const ssovAddresses =
  //     contractAddresses[selectedSsovV3.type === 'PUT' ? '2CRV-SSOV-P' : 'SSOV'][
  //       selectedSsovV3.token
  //     ];

  //   if (!ssovAddresses) return;

  //   let _ssovUserData;

  //   const ssovContract =
  //     selectedSsovV3.type === 'PUT'
  //       ? Curve2PoolSsovV3Put__factory.connect(ssovAddresses.Vault, provider)
  //       : isNativeSsovV3(selectedSsovV3.token)
  //       ? NativeSSOV__factory.connect(ssovAddresses.Vault, provider)
  //       : ERC20SSOV__factory.connect(ssovAddresses.Vault, provider);

  //   const [
  //     userEpochStrikeDeposits,
  //     userEpochOptionsPurchased,
  //     epochStrikeTokens,
  //   ] = await Promise.all([
  //     ssovContract.getUserEpochDeposits(selectedEpoch, accountAddress),
  //     selectedSsovV3.type === 'PUT'
  //       ? (ssovContract as Curve2PoolSsovV3Put).getUserEpochPutsPurchased(
  //           selectedEpoch,
  //           accountAddress
  //         )
  //       : (ssovContract as ERC20SSOV).getUserEpochCallsPurchased(
  //           selectedEpoch,
  //           accountAddress
  //         ),
  //     ssovContract.getEpochStrikeTokens(selectedEpoch),
  //   ]);

  //   const userEpochDeposits = userEpochStrikeDeposits
  //     .reduce(
  //       (accumulator, currentValue) => accumulator.add(currentValue),
  //       BigNumber.from(0)
  //     )
  //     .toString();

  //   _ssovUserData = {
  //     userEpochStrikeDeposits,
  //     userEpochOptionsPurchased,
  //     epochStrikeTokens: epochStrikeTokens
  //       .filter((token) => !isZeroAddress(token))
  //       .map((token) => ERC20__factory.connect(token, provider)),
  //     userEpochDeposits: userEpochDeposits,
  //   };

  //   setSsovV3UserData(_ssovUserData);
  // }, [
  //   accountAddress,
  //   contractAddresses,
  //   provider,
  //   selectedEpoch,
  //   selectedSsovV3,
  // ]);

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
    ]);

    const APY = '10';

    const _ssovEpochData = {
      epochTimes,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      APY,
    };

    setSsovV3EpochData(_ssovEpochData);
  }, [contractAddresses, selectedEpoch, provider, selectedSsovV3]);

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
          // tokenName: selectedSsovV3.token.toUpperCase(),
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

  // useEffect(() => {
  //   updateSsovV3UserData();
  // }, [updateSsovV3UserData]);

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
