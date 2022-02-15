import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  SSOVOptionPricing__factory,
  VolatilityOracle__factory,
  ERC20__factory,
  ERC20,
  VolatilityOracle,
  SSOVOptionPricing,
} from '@dopex-io/sdk';

import { Curve2PoolSsovPut__factory } from 'contexts/temp-types/factories/Curve2PoolSsovPut__factory';
import { Curve2PoolSsovPut1inchRouter } from './temp-types/Curve2PoolSsovPut1inchRouter';

import { BigNumber } from 'ethers';
import axios from 'axios';

import formatAmount from 'utils/general/formatAmount';

import { WalletContext } from './Wallet';

import { SSOV_PUTS_MAP } from 'constants/index';
import { Curve2PoolSsovPut1inchRouter__factory } from './temp-types/factories/Curve2PoolSsovPut1inchRouter__factory';

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
  token: ERC20[];
  ssovContractWithSigner?: any;
  ssovRouter?: Curve2PoolSsovPut1inchRouter;
}

export interface SsovData {
  epochTimes: {};
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochPutsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  totalEpochDeposits: BigNumber;
  settlementPrice: BigNumber;
  APY: string;
}

export interface UserSsovData {
  userEpochDeposits: string;
  epochStrikeTokens: ERC20[];
  userEpochStrikeDeposits: BigNumber[];
  userEpochPutsPurchased: BigNumber[];
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

const initialUserSsovDataArray = [0, 1, 2, 3, 4].map(() => {
  return {
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochPutsPurchased: [],
    epochStrikeTokens: [],
  };
});

const initialSsovSignerArray = [0, 1, 2, 3, 4].map(() => {
  return { token: null, ssovContractWithSigner: null };
});
// '0x9D973C4C04df928F18081e952B407D718D2dAE4E',
// '0xc8067b488A77D84e85AeDBb2dE5d094A5e1c469A',
// '0x4F06645416a38a020CfFaa97cE4DAD04c1Be9906',
// '0x29d5D552bde776abF45C75Fe4fE01A3B59F26798',
// '0x920063B722d4FA90866f2aA3c150d129a10546ff',
const contractAddresses = {
  CRV2POOL: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
  SSOV: {
    RDPX: {
      Vault: '0x9D973C4C04df928F18081e952B407D718D2dAE4E',
      VolatilityOracle: '0x39801002866657f95cB111bff0f3B7218cB6da1C',
      OptionPricing: '0x2b99e3D67dAD973c1B9747Da742B7E26c8Bdd67B',
      Router: '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564',
      tokens: ['CRV2POOL'],
    },
    ETH: {
      Vault: '0xc8067b488A77D84e85AeDBb2dE5d094A5e1c469A',
      VolatilityOracle: '0x87209686d0f085fD35B084410B99241Dbc03fb4f',
      OptionPricing: '0x2b99e3D67dAD973c1B9747Da742B7E26c8Bdd67B',
      Router: '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564',
      tokens: ['CRV2POOL'],
    },
    GOHM: {
      Vault: '0x4F06645416a38a020CfFaa97cE4DAD04c1Be9906',
      VolatilityOracle: '0x746c3914d3c11139178B1aeDd6f3f7EACF756ABF',
      OptionPricing: '0x2b99e3D67dAD973c1B9747Da742B7E26c8Bdd67B',
      Router: '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564',
      tokens: ['CRV2POOL'],
    },
    GMX: {
      Vault: '0x29d5d552bde776abf45c75fe4fe01a3b59f26798',
      VolatilityOracle: '0x6BC4eF91db2A18cBF557d3339F263872A8F112e4',
      OptionPricing: '0x2b99e3D67dAD973c1B9747Da742B7E26c8Bdd67B',
      Router: '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564',
      tokens: ['CRV2POOL'],
    },
    BTC: {
      Vault: '0x920063B722d4FA90866f2aA3c150d129a10546ff',
      VolatilityOracle: '0x87209686d0f085fD35B084410B99241Dbc03fb4f',
      OptionPricing: '0x2b99e3D67dAD973c1B9747Da742B7E26c8Bdd67B',
      Router: '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564',
      tokens: ['CRV2POOL'],
    },
  },
};
export const SsovContext = createContext<SsovContextInterface>({
  ssovPropertiesArray: [],
  ssovDataArray: [],
  userSsovDataArray: initialUserSsovDataArray,
  ssovSignerArray: initialSsovSignerArray,
  selectedSsov: 0,
});

export const SsovProvider = (props) => {
  const { accountAddress, provider, signer } = useContext(WalletContext);

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
      const ssovContract = Curve2PoolSsovPut__factory.connect(
        SSOVAddresses[asset].Vault,
        provider
      );

      // current epoch
      const [
        userEpochStrikeDeposits,
        userEpochCPutsPurchased,
        epochStrikeTokens,
      ] = await Promise.all([
        ssovContract.getUserEpochDeposits(selectedEpoch, accountAddress),
        ssovContract.getUserEpochPutsPurchased(selectedEpoch, accountAddress),
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
        userEpochPutsPurchased: userEpochCPutsPurchased,
        epochStrikeTokens: epochStrikeTokens.map((token) =>
          ERC20__factory.connect(token, provider)
        ),
        userEpochDeposits: userEpochDeposits,
      });
    }
    setUserSsovDataArray(userSsovData);
  }, [accountAddress, provider, selectedEpoch]);

  const updateSsovData = useCallback(async () => {
    if (!contractAddresses || !selectedEpoch) return;
    const SSOVAddresses = contractAddresses.SSOV;
    const ssovData: SsovData[] = [];
    for (const asset in SSOVAddresses) {
      const ssovContract = Curve2PoolSsovPut__factory.connect(
        SSOVAddresses[asset].Vault,
        provider
      );
      // current epoch
      const [
        epochTimes,
        isEpochExpired,
        isVaultReady,
        epochStrikes,
        totalEpochDeposits,
        totalEpochStrikeDeposits,
        totalEpochPutsPurchased,
        totalEpochPremium,
        settlementPrice,
      ] = await Promise.all([
        ssovContract.getEpochTimes(selectedEpoch),
        ssovContract.isEpochExpired(selectedEpoch),
        ssovContract.isVaultReady(selectedEpoch),
        ssovContract.getEpochStrikes(selectedEpoch),
        ssovContract.totalEpochDeposits(selectedEpoch),
        ssovContract.getTotalEpochStrikeDeposits(selectedEpoch),
        ssovContract.getTotalEpochPutsPurchased(selectedEpoch),
        ssovContract.totalEpochPremium(selectedEpoch),
        ssovContract.settlementPrices(selectedEpoch),
      ]);

      const APY = await axios
        .get(`https://api.dopex.io/api/v1/ssov/apy?asset=${asset}`)
        .then((res) => formatAmount(res.data.apy, 2))
        .catch(() => '0');

      const _totalEpochStrikePremium = await Promise.all(
        epochStrikes.map((strike) =>
          ssovContract.totalEpochStrikePremium(selectedEpoch, strike)
        )
      );
      ssovData.push({
        epochTimes: epochTimes,
        isEpochExpired: isEpochExpired,
        isVaultReady: isVaultReady,
        epochStrikes: epochStrikes,
        totalEpochDeposits: totalEpochDeposits,
        totalEpochStrikeDeposits: totalEpochStrikeDeposits,
        totalEpochPutsPurchased: totalEpochPutsPurchased,
        totalEpochPremium: _totalEpochStrikePremium,
        settlementPrice,
        APY,
      });
    }
    setSsovDataArray(ssovData);
  }, [selectedEpoch, provider]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    async function update() {
      const ssovPropertiesArray: SsovProperties[] = [];
      const SSOVAddresses = contractAddresses.SSOV;

      for (const asset in SSOVAddresses) {
        const _ssovContract = Curve2PoolSsovPut__factory.connect(
          SSOVAddresses[asset].Vault,
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
  }, [provider, selectedEpoch]);

  useEffect(() => {
    if (!contractAddresses || !signer || !contractAddresses.SSOV) return;
    const SSOVAddresses = contractAddresses.SSOV;
    const ssovSignerArray = [];

    for (const asset in SSOVAddresses) {
      const tokens = SSOV_PUTS_MAP[asset].tokens;
      const _tokens = [
        ERC20__factory.connect(
          '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
          signer
        ),
      ];

      const _ssovContractWithSigner = Curve2PoolSsovPut__factory.connect(
        SSOVAddresses[asset].Vault,
        signer
      );
      const _ssovRouterWithSigner =
        Curve2PoolSsovPut1inchRouter__factory.connect(
          SSOVAddresses[asset].Router,
          signer
        );

      ssovSignerArray.push({
        token: _tokens,
        ssovContractWithSigner: _ssovContractWithSigner,
        ssovRouter: _ssovRouterWithSigner,
      });
    }
    setSsovSignerArray(ssovSignerArray);
  }, [signer, accountAddress]);

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
