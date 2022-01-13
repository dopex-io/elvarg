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
  CustomPriceOracle__factory,
  ChainlinkAggregator__factory,
  ChainlinkAggregator,
  CustomPriceOracle,
  BnbSSOVRouter,
  BnbSSOVRouter__factory,
} from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';
import axios from 'axios';

import { WalletContext } from './Wallet';

export interface SsovProperties {
  tokenName?: string;
  ssovContract?: any;
  currentEpoch?: number;
  selectedEpoch?: number;
  setSelectedEpoch?: Function;
  tokenPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
}

export interface SsovSigner {
  token: ERC20;
  ssovContractWithSigner?: any;
  ssovRouter?: BnbSSOVRouter;
}

export interface SsovData {
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

export interface UserSsovData {
  userEpochDeposits: string;
  epochStrikeTokens: ERC20[];
  userEpochStrikeDeposits: BigNumber[];
  userEpochCallsPurchased: BigNumber[];
}

interface SsovContextInterface {
  ssovPropertiesArray: SsovProperties[];
  ssovDataArray: SsovData[];
  userSsovDataArray: UserSsovData[];
  ssovSignerArray: SsovSigner[];
  selectedSsov?: number;
  updateSsovData?: Function;
  updateUserSsovData?: Function;
  setSelectedSsov?: Function;
}

const initialUserSsovDataArray = [0, 1, 2, 3].map(() => {
  return {
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
    epochStrikeTokens: [],
  };
});

const initialSsovSignerArray = [0, 1, 2, 3].map(() => {
  return { token: null, ssovContractWithSigner: null };
});

export const SsovContext = createContext<SsovContextInterface>({
  ssovPropertiesArray: [],
  ssovDataArray: [],
  userSsovDataArray: initialUserSsovDataArray,
  ssovSignerArray: initialSsovSignerArray,
  selectedSsov: 0,
});

export const SsovProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [selectedSsov, setSelectedSsov] = useState<number | null>(null);
  const [ssovPropertiesArray, setSsovPropertiesArray] = useState<
    SsovProperties[]
  >([]);
  const [ssovDataArray, setSsovDataArray] = useState<SsovData[]>([]);
  const [ssovSignerArray, setSsovSignerArray] = useState<SsovSigner[]>(
    initialSsovSignerArray
  );
  const [userSsovDataArray, setUserSsovDataArray] = useState<UserSsovData[]>(
    initialUserSsovDataArray
  );

  const updateUserSsovData = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !selectedEpoch) return;

    const SSOVAddresses = contractAddresses.SSOV;
    const userSsovData: UserSsovData[] = [];
    for (const asset in SSOVAddresses) {
      const ssovContract =
        asset === 'ETH'
          ? NativeSSOV__factory.connect(SSOVAddresses[asset].Vault, provider)
          : ERC20SSOV__factory.connect(SSOVAddresses[asset].Vault, provider);

      // current epoch
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
      userSsovData.push({
        userEpochStrikeDeposits: userEpochStrikeDeposits,
        userEpochCallsPurchased: userEpochCallsPurchased,
        epochStrikeTokens: epochStrikeTokens.map((token) =>
          ERC20__factory.connect(token, provider)
        ),
        userEpochDeposits: userEpochDeposits,
      });
    }
    setUserSsovDataArray(userSsovData);
  }, [accountAddress, contractAddresses, provider, selectedEpoch]);

  const updateSsovData = useCallback(async () => {
    if (!contractAddresses || !selectedEpoch) return;
    const SSOVAddresses = contractAddresses.SSOV;
    const ssovData: SsovData[] = [];
    for (const asset in SSOVAddresses) {
      const ssovContract =
        asset === 'ETH'
          ? NativeSSOV__factory.connect(SSOVAddresses[asset].Vault, provider)
          : ERC20SSOV__factory.connect(SSOVAddresses[asset].Vault, provider);
      // current epoch
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

      let bnbVaultAPY = 0;
      if (asset === 'BNB') {
        const vbnb = '0xA07c5b74C9B40447a954e1466938b865b6BBea36';
        const vbnbContract = new ethers.Contract(
          vbnb,
          ['function supplyRatePerBlock() external view returns (uint)'],
          provider
        );
        const blocksPerDay = 20 * 60 * 24;
        const supplyRatePerBlock = await vbnbContract.supplyRatePerBlock();
        bnbVaultAPY =
          (Math.pow(
            (supplyRatePerBlock.toString() / 1e18) * blocksPerDay + 1,
            365 - 1
          ) -
            1) *
          100;
      }
      const APY =
        asset === 'BNB'
          ? bnbVaultAPY.toFixed(2)
          : await axios
              .get(
                `https://api.dopex.io/api/v1/ssov/apy?asset=${
                  asset === 'BNB' ? 'DPX' : asset
                }`
              )
              .then((res) => res.data.apy);

      ssovData.push({
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
      });
    }
    setSsovDataArray(ssovData);
  }, [contractAddresses, selectedEpoch, provider]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    async function update() {
      const ssovPropertiesArray: SsovProperties[] = [];
      const SSOVAddresses = contractAddresses.SSOV;

      for (const asset in SSOVAddresses) {
        const _ssovContract =
          asset === 'ETH'
            ? NativeSSOV__factory.connect(SSOVAddresses[asset].Vault, provider)
            : ERC20SSOV__factory.connect(SSOVAddresses[asset].Vault, provider);

        const oracleContract =
          asset === 'ETH' || asset === 'BNB'
            ? ChainlinkAggregator__factory.connect(
                SSOVAddresses[asset].PriceOracle,
                provider
              )
            : CustomPriceOracle__factory.connect(
                SSOVAddresses[asset].PriceOracle,
                provider
              );

        // Epoch
        try {
          const [currentEpoch, tokenPrice] = await Promise.all([
            _ssovContract.currentEpoch(),
            asset === 'ETH' || asset === 'BNB'
              ? (oracleContract as ChainlinkAggregator).latestAnswer()
              : (oracleContract as CustomPriceOracle).getPriceInUSD(),
          ]);

          if (Number(currentEpoch) === 0) {
            setSelectedEpoch(1);
          } else {
            setSelectedEpoch(Number(currentEpoch));
          }
          let tempSsov = {
            tokenName: asset.toUpperCase(),
            ssovContract: _ssovContract,
            currentEpoch: Number(currentEpoch),
            selectedEpoch:
              Number(currentEpoch) === 0 ? 1 : Number(currentEpoch),
            setSelectedSsov: setSelectedSsov,
            tokenPrice,
            ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
              SSOVAddresses[asset].OptionPricing,
              provider
            ),
            volatilityOracleContract: VolatilityOracle__factory.connect(
              SSOVAddresses[asset].VolatilityOracle,
              provider
            ),
          };
          ssovPropertiesArray.push({
            ...tempSsov,
          });
        } catch (err) {
          console.log(err);
        }
      }
      setSsovPropertiesArray(ssovPropertiesArray);
    }

    update();
  }, [contractAddresses, provider, selectedEpoch]);

  useEffect(() => {
    if (!contractAddresses || !signer || !contractAddresses.SSOV) return;
    const SSOVAddresses = contractAddresses.SSOV;
    const ssovSignerArray = [];

    for (const asset in SSOVAddresses) {
      const tokenAddress =
        asset === 'ETH'
          ? contractAddresses['WETH']
          : asset === 'BNB'
          ? contractAddresses['WBNB']
          : contractAddresses[asset];

      const _token = ERC20__factory.connect(tokenAddress, signer);
      const _ssovContractWithSigner =
        asset === 'ETH'
          ? NativeSSOV__factory.connect(SSOVAddresses[asset].Vault, signer)
          : ERC20SSOV__factory.connect(SSOVAddresses[asset].Vault, signer);
      const _ssovRouterWithSigner =
        asset === 'BNB' && SSOVAddresses[asset].Router
          ? BnbSSOVRouter__factory.connect(SSOVAddresses[asset].Router, signer)
          : undefined;

      ssovSignerArray.push({
        token: _token,
        ssovContractWithSigner: _ssovContractWithSigner,
        ssovRouter: _ssovRouterWithSigner,
      });
    }
    setSsovSignerArray(ssovSignerArray);
  }, [contractAddresses, signer, accountAddress]);

  useEffect(() => {
    updateUserSsovData();
  }, [updateUserSsovData]);

  useEffect(() => {
    updateSsovData();
  }, [updateSsovData]);

  const contextValue = {
    ssovPropertiesArray,
    ssovDataArray,
    userSsovDataArray,
    ssovSignerArray,
    selectedSsov,
    updateSsovData,
    updateUserSsovData,
    setSelectedSsov,
  };

  return (
    <SsovContext.Provider value={contextValue}>
      {props.children}
    </SsovContext.Provider>
  );
};
