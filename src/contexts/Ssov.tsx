import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  NativeSSOV__factory,
  ERC20SSOV__factory,
  SSOVOptionPricing__factory,
  VolatilityOracle__factory,
  ERC20__factory,
  ERC20,
  VolatilityOracle,
  SSOVOptionPricing,
  BnbSSOVRouter,
  BnbSSOVRouter__factory,
  Curve2PoolSsovPut__factory,
  Curve2PoolSsovPut,
  ERC20SSOV,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import axios from 'axios';

import { WalletContext } from './Wallet';

import { SSOV_MAP } from 'constants/index';

import formatAmount from 'utils/general/formatAmount';
import isNativeSsov from 'utils/contracts/isNativeSsov';
import getTotalEpochPremium from 'utils/contracts/ssov-p/getTotalEpochPremium';
import isZeroAddress from 'utils/contracts/isZeroAddress';

export interface Ssov {
  token?: string;
  type?: 'CALL' | 'PUT';
}
export interface SsovSigner {
  token: ERC20[];
  ssovContractWithSigner?: any;
  ssovRouter?: BnbSSOVRouter;
}

export interface SsovData {
  tokenName?: string;
  ssovContract?: any;
  currentEpoch?: number;
  tokenPrice?: BigNumber;
  lpPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
  isCurrentEpochExpired?: boolean;
}

export interface SsovEpochData {
  epochTimes: {};
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  totalEpochDeposits: BigNumber;
  settlementPrice: BigNumber;
  APY: string;
}

export interface SsovUserData {
  userEpochDeposits: string;
  epochStrikeTokens: ERC20[];
  userEpochStrikeDeposits: BigNumber[];
  userEpochOptionsPurchased: BigNumber[];
}

interface SsovContextInterface {
  ssovData?: SsovData;
  ssovEpochData?: SsovEpochData;
  ssovUserData?: SsovUserData;
  ssovSigner: SsovSigner;
  selectedEpoch?: number;
  selectedSsov?: Ssov;
  updateSsovEpochData?: Function;
  updateSsovUserData?: Function;
  setSelectedSsov?: Function;
  setSelectedEpoch?: Function;
  isPut?: boolean;
}

const initialSsovUserData = {
  userEpochStrikeDeposits: [],
  userEpochDeposits: '0',
  userEpochOptionsPurchased: [],
  epochStrikeTokens: [],
};

const initialSsovSigner = {
  token: null,
  ssovContractWithSigner: null,
};

export const SsovContext = createContext<SsovContextInterface>({
  ssovUserData: initialSsovUserData,
  ssovSigner: initialSsovSigner,
  selectedSsov: {},
});

export const SsovProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [selectedSsov, setSelectedSsov] = useState<{
    token: string;
    type: 'CALL' | 'PUT';
  }>();

  const [ssovData, setSsovData] = useState<SsovData>();
  const [ssovEpochData, setSsovEpochData] = useState<SsovEpochData>();
  const [ssovUserData, setSsovUserData] = useState<SsovUserData>();
  const [ssovSigner, setSsovSigner] = useState<SsovSigner>({
    token: [],
    ssovContractWithSigner: null,
    ssovRouter: null,
  });

  const updateSsovUserData = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !selectedEpoch ||
      !selectedSsov
    )
      return;

    const ssovAddresses =
      contractAddresses[selectedSsov.type === 'PUT' ? '2CRV-SSOV-P' : 'SSOV'][
        selectedSsov.token
      ];

    if (!ssovAddresses) return;

    let _ssovUserData;

    const ssovContract =
      selectedSsov.type === 'PUT'
        ? Curve2PoolSsovPut__factory.connect(ssovAddresses.Vault, provider)
        : isNativeSsov(selectedSsov.token)
        ? NativeSSOV__factory.connect(ssovAddresses.Vault, provider)
        : ERC20SSOV__factory.connect(ssovAddresses.Vault, provider);

    const [
      userEpochStrikeDeposits,
      userEpochOptionsPurchased,
      epochStrikeTokens,
    ] = await Promise.all([
      ssovContract.getUserEpochDeposits(selectedEpoch, accountAddress),
      selectedSsov.type === 'PUT'
        ? (ssovContract as Curve2PoolSsovPut).getUserEpochPutsPurchased(
            selectedEpoch,
            accountAddress
          )
        : (ssovContract as ERC20SSOV).getUserEpochCallsPurchased(
            selectedEpoch,
            accountAddress
          ),
      ssovContract.getEpochStrikeTokens(selectedEpoch),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    _ssovUserData = {
      userEpochStrikeDeposits,
      userEpochOptionsPurchased,
      epochStrikeTokens: epochStrikeTokens
        .filter((token) => !isZeroAddress(token))
        .map((token) => ERC20__factory.connect(token, provider)),
      userEpochDeposits: userEpochDeposits,
    };

    setSsovUserData(_ssovUserData);
  }, [
    accountAddress,
    contractAddresses,
    provider,
    selectedEpoch,
    selectedSsov,
  ]);

  const updateSsovEpochData = useCallback(async () => {
    if (!contractAddresses || !selectedEpoch || !selectedSsov) return;

    const ssovAddresses =
      contractAddresses[selectedSsov.type === 'PUT' ? '2CRV-SSOV-P' : 'SSOV'][
        selectedSsov.token
      ];

    if (!ssovAddresses) return;

    const ssovContract =
      selectedSsov.type === 'PUT'
        ? Curve2PoolSsovPut__factory.connect(ssovAddresses.Vault, provider)
        : isNativeSsov(selectedSsov.token)
        ? NativeSSOV__factory.connect(ssovAddresses.Vault, provider)
        : ERC20SSOV__factory.connect(ssovAddresses.Vault, provider);

    const [
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      totalEpochDeposits,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      settlementPrice,
    ] = await Promise.all([
      ssovContract.getEpochTimes(selectedEpoch),
      ssovContract.isEpochExpired(selectedEpoch),
      ssovContract.isVaultReady(selectedEpoch),
      ssovContract.getEpochStrikes(selectedEpoch),
      ssovContract.totalEpochDeposits(selectedEpoch),
      ssovContract.getTotalEpochStrikeDeposits(selectedEpoch),
      selectedSsov.type === 'PUT'
        ? (ssovContract as Curve2PoolSsovPut).getTotalEpochPutsPurchased(
            selectedEpoch
          )
        : (ssovContract as ERC20SSOV).getTotalEpochCallsPurchased(
            selectedEpoch
          ),
      selectedSsov.type === 'PUT'
        ? getTotalEpochPremium(ssovContract as Curve2PoolSsovPut, selectedEpoch)
        : (ssovContract as ERC20SSOV).getTotalEpochPremium(selectedEpoch),
      ssovContract.settlementPrices(selectedEpoch),
    ]);

    const APY = await axios
      .get(
        `https://api.dopex.io/api/v1/ssov/apy?asset=${
          selectedSsov.token === 'METIS' ? 'DPX' : selectedSsov.token
        }&type=${selectedSsov.type.toLowerCase()}`
      )
      .then((res) => formatAmount(res.data.apy, 2))
      .catch(() => '0');

    const _ssovEpochData = {
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      totalEpochDeposits,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      settlementPrice,
      APY,
    };

    setSsovEpochData(_ssovEpochData);
  }, [contractAddresses, selectedEpoch, provider, selectedSsov]);

  useEffect(() => {
    if (
      !provider ||
      !contractAddresses ||
      !contractAddresses.SSOV ||
      !selectedSsov
    )
      return;

    async function update() {
      let _ssovData: SsovData;

      const ssovAddresses =
        contractAddresses[selectedSsov.type === 'PUT' ? '2CRV-SSOV-P' : 'SSOV'][
          selectedSsov.token
        ];

      if (!ssovAddresses) return;

      const _ssovContract =
        selectedSsov.type === 'PUT'
          ? Curve2PoolSsovPut__factory.connect(ssovAddresses.Vault, provider)
          : isNativeSsov(selectedSsov.token)
          ? NativeSSOV__factory.connect(ssovAddresses.Vault, provider)
          : ERC20SSOV__factory.connect(ssovAddresses.Vault, provider);

      try {
        const [currentEpoch, tokenPrice] = await Promise.all([
          _ssovContract.currentEpoch(),
          _ssovContract.getUsdPrice(),
        ]);

        const isCurrentEpochExpired = await _ssovContract.isEpochExpired(
          currentEpoch
        );

        setSelectedEpoch(Number(currentEpoch) === 0 ? 1 : Number(currentEpoch));

        _ssovData = {
          tokenName: selectedSsov.token.toUpperCase(),
          ssovContract: _ssovContract,
          currentEpoch: Number(currentEpoch),
          isCurrentEpochExpired,
          tokenPrice,
          ...(selectedSsov.type === 'PUT' && {
            lpPrice: await (_ssovContract as Curve2PoolSsovPut).getLpPrice(),
          }),
          ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
            ssovAddresses.OptionPricing,
            provider
          ),
          volatilityOracleContract: VolatilityOracle__factory.connect(
            ssovAddresses.VolatilityOracle,
            provider
          ),
        };
      } catch (err) {
        console.log(err);
      }

      setSsovData(_ssovData);
    }

    update();
  }, [contractAddresses, provider, selectedSsov]);

  useEffect(() => {
    if (
      !contractAddresses ||
      !signer ||
      !contractAddresses.SSOV ||
      !selectedSsov
    )
      return;

    const SSOVAddresses =
      selectedSsov.type === 'PUT'
        ? contractAddresses['2CRV-SSOV-P']
        : contractAddresses.SSOV;

    let _ssovSigner;

    const tokens = SSOV_MAP[selectedSsov.token].tokens;

    const _tokens = tokens.map((tokenName: string) => {
      if (tokenName === 'ETH' || tokenName === 'AVAX') {
        return null;
      } else {
        return (
          contractAddresses[tokenName] &&
          ERC20__factory.connect(contractAddresses[tokenName], signer)
        );
      }
    });

    const ssovAddresses =
      contractAddresses[selectedSsov.type === 'PUT' ? '2CRV-SSOV-P' : 'SSOV'][
        selectedSsov.token
      ];

    if (!ssovAddresses) return;

    const _ssovContractWithSigner =
      selectedSsov.type === 'PUT'
        ? Curve2PoolSsovPut__factory.connect(ssovAddresses.Vault, signer)
        : isNativeSsov(selectedSsov.token)
        ? NativeSSOV__factory.connect(ssovAddresses.Vault, signer)
        : ERC20SSOV__factory.connect(ssovAddresses.Vault, signer);

    const _ssovRouterWithSigner =
      selectedSsov.token === 'BNB' && SSOVAddresses[selectedSsov.token].Router
        ? BnbSSOVRouter__factory.connect(
            SSOVAddresses[selectedSsov.token].Router,
            signer
          )
        : undefined;

    _ssovSigner = {
      token: _tokens,
      ssovContractWithSigner: _ssovContractWithSigner,
      ssovRouter: _ssovRouterWithSigner,
    };

    setSsovSigner(_ssovSigner);
  }, [contractAddresses, signer, accountAddress, selectedSsov]);

  useEffect(() => {
    updateSsovUserData();
  }, [updateSsovUserData]);

  useEffect(() => {
    updateSsovEpochData();
  }, [updateSsovEpochData]);

  const contextValue = {
    ssovData,
    ssovEpochData,
    ssovUserData,
    ssovSigner,
    selectedSsov,
    selectedEpoch,
    updateSsovEpochData,
    updateSsovUserData,
    setSelectedSsov,
    setSelectedEpoch,
    isPut: selectedSsov?.type === 'PUT',
  };

  return (
    <SsovContext.Provider value={contextValue}>
      {props.children}
    </SsovContext.Provider>
  );
};
