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
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import axios from 'axios';

import formatAmount from 'utils/general/formatAmount';

import { WalletContext } from './Wallet';

import { SSOV_MAP } from 'constants/index';

export interface Ssov {
  token: string;
  type: 'CALL' | 'PUT';
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
  ssovOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
}

export interface SsovEpochData {
  epochTimes: {};
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochCallsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  totalEpochDeposits: BigNumber;
  settlementPrice: BigNumber;
  APY: string;
}

export interface SsovUserData {
  userEpochDeposits: string;
  epochStrikeTokens: ERC20[];
  userEpochStrikeDeposits: BigNumber[];
  userEpochCallsPurchased: BigNumber[];
}

interface SsovContextInterface {
  ssovData?: SsovData;
  ssovEpochData?: SsovEpochData;
  ssovUserData?: SsovUserData;
  ssovSigner: SsovSigner;
  selectedEpoch?: number;
  selectedSsov?: Ssov;
  updateSsovData?: Function;
  updateSsovUserData?: Function;
  setSelectedSsov?: Function;
  setSelectedEpoch?: Function;
}

const initialSsovUserData = {
  userEpochStrikeDeposits: [],
  userEpochDeposits: '0',
  userEpochCallsPurchased: [],
  epochStrikeTokens: [],
};

const initialSsovSigner = {
  token: null,
  ssovContractWithSigner: null,
};

export const SsovContext = createContext<SsovContextInterface>({
  ssovUserData: initialSsovUserData,
  ssovSigner: initialSsovSigner,
  selectedSsov: { token: 'DPX', type: 'CALL' },
});

export const SsovProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [selectedSsov, setSelectedSsov] = useState<{
    token: string;
    type: 'CALL' | 'PUT';
  }>({ token: 'DPX', type: 'CALL' });

  const [ssovData, setSsovData] = useState<SsovData>();
  const [ssovEpochData, setSsovEpochData] = useState<SsovEpochData>();
  const [ssovUserData, setSsovUserData] = useState<SsovUserData>();
  const [ssovSigner, setSsovSigner] = useState<SsovSigner>();

  const updateSsovUserData = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !selectedEpoch) return;

    const SSOVAddresses = contractAddresses.SSOV;

    let _ssovUserData;

    const ssovContract =
      selectedSsov.token === 'ETH'
        ? NativeSSOV__factory.connect(
            SSOVAddresses[selectedSsov.token].Vault,
            provider
          )
        : ERC20SSOV__factory.connect(
            SSOVAddresses[selectedSsov.token].Vault,
            provider
          );

    const [
      userEpochStrikeDeposits,
      userEpochCallsPurchased,
      epochStrikeTokens,
    ] = await Promise.all([
      ssovContract.getUserEpochDeposits(selectedEpoch, accountAddress),
      ssovContract.getUserEpochCallsPurchased(selectedEpoch, accountAddress),
      ssovContract.getEpochStrikeTokens(selectedEpoch),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    _ssovUserData = {
      userEpochStrikeDeposits: userEpochStrikeDeposits,
      userEpochCallsPurchased: userEpochCallsPurchased,
      epochStrikeTokens: epochStrikeTokens.map((token) =>
        ERC20__factory.connect(token, provider)
      ),
      userEpochDeposits: userEpochDeposits,
    };

    setSsovUserData(_ssovUserData);
  }, [
    accountAddress,
    contractAddresses,
    provider,
    selectedEpoch,
    selectedSsov.token,
  ]);

  const updateSsovEpochData = useCallback(async () => {
    if (!contractAddresses || !selectedEpoch) return;

    const SSOVAddresses = contractAddresses.SSOV;

    let _ssovEpochData: SsovEpochData;

    const ssovContract =
      selectedSsov.token === 'ETH'
        ? NativeSSOV__factory.connect(
            SSOVAddresses[selectedSsov.token].Vault,
            provider
          )
        : ERC20SSOV__factory.connect(
            SSOVAddresses[selectedSsov.token].Vault,
            provider
          );

    const [
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      totalEpochDeposits,
      totalEpochStrikeDeposits,
      totalEpochCallsPurchased,
      totalEpochPremium,
      settlementPrice,
    ] = await Promise.all([
      ssovContract.getEpochTimes(selectedEpoch),
      ssovContract.isEpochExpired(selectedEpoch),
      ssovContract.isVaultReady(selectedEpoch),
      ssovContract.getEpochStrikes(selectedEpoch),
      ssovContract.totalEpochDeposits(selectedEpoch),
      ssovContract.getTotalEpochStrikeDeposits(selectedEpoch),
      ssovContract.getTotalEpochCallsPurchased(selectedEpoch),
      ssovContract.getTotalEpochPremium(selectedEpoch),
      ssovContract.settlementPrices(selectedEpoch),
    ]);

    const APY = await axios
      .get(`https://api.dopex.io/api/v1/ssov/apy?asset=${selectedSsov.token}`)
      .then((res) => formatAmount(res.data.apy, 2))
      .catch(() => '0');

    _ssovEpochData = {
      epochTimes: epochTimes,
      isEpochExpired: isEpochExpired,
      isVaultReady: isVaultReady,
      epochStrikes: epochStrikes,
      totalEpochDeposits: totalEpochDeposits,
      totalEpochStrikeDeposits: totalEpochStrikeDeposits,
      totalEpochCallsPurchased: totalEpochCallsPurchased,
      totalEpochPremium: totalEpochPremium,
      settlementPrice,
      APY,
    };

    setSsovEpochData(_ssovEpochData);
  }, [contractAddresses, selectedEpoch, provider, selectedSsov.token]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    async function update() {
      let _ssovData: SsovData;

      const SSOVAddresses = contractAddresses.SSOV;

      const _ssovContract =
        selectedSsov.token === 'ETH' || selectedSsov.token === 'AVAX'
          ? NativeSSOV__factory.connect(
              SSOVAddresses[selectedSsov.token].Vault,
              provider
            )
          : ERC20SSOV__factory.connect(
              SSOVAddresses[selectedSsov.token].Vault,
              provider
            );

      // Epoch
      try {
        const [currentEpoch, tokenPrice] = await Promise.all([
          _ssovContract.currentEpoch(),
          _ssovContract.getUsdPrice(),
        ]);

        if (Number(currentEpoch) === 0) {
          setSelectedEpoch(1);
        } else {
          setSelectedEpoch(Number(currentEpoch));
        }
        _ssovData = {
          tokenName: selectedSsov.token.toUpperCase(),
          ssovContract: _ssovContract,
          currentEpoch: Number(currentEpoch),
          tokenPrice,
          ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
            SSOVAddresses[selectedSsov.token].OptionPricing,
            provider
          ),
          volatilityOracleContract: VolatilityOracle__factory.connect(
            SSOVAddresses[selectedSsov.token].VolatilityOracle,
            provider
          ),
        };
      } catch (err) {
        console.log(err);
      }

      setSsovData(_ssovData);
    }

    update();
  }, [contractAddresses, provider, selectedEpoch, selectedSsov.token]);

  useEffect(() => {
    if (!contractAddresses || !signer || !contractAddresses.SSOV) return;

    const SSOVAddresses = contractAddresses.SSOV;

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

    const _ssovContractWithSigner =
      selectedSsov.token === 'ETH' || selectedSsov.token === 'AVAX'
        ? NativeSSOV__factory.connect(
            SSOVAddresses[selectedSsov.token].Vault,
            signer
          )
        : ERC20SSOV__factory.connect(
            SSOVAddresses[selectedSsov.token].Vault,
            signer
          );
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
  }, [contractAddresses, signer, accountAddress, selectedSsov.token]);

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
  };

  return (
    <SsovContext.Provider value={contextValue}>
      {props.children}
    </SsovContext.Provider>
  );
};
