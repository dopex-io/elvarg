import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  NativeSSOV,
  NativeSSOV__factory,
  ERC20SSOV,
  ERC20SSOV__factory,
  SSOVOptionPricing__factory,
  VolatilityOracle__factory,
  ERC20__factory,
  ERC20,
  VolatilityOracle,
  SSOVOptionPricing,
  StakingRewards__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import axios from 'axios';

import { WalletContext } from './Wallet';

import oneEBigNumber from 'utils/math/oneEBigNumber';

export interface Ssov {
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
  APY: string;
}

export interface UserSsovData {
  userEpochDeposits: string;
  epochStrikeTokens: ERC20[];
  userEpochStrikeDeposits: BigNumber[];
  userEpochCallsPurchased: BigNumber[];
}

interface SsovContextInterface {
  ssovArray: Ssov[];
  ssovDataArray: SsovData[];
  userSsovDataArray: UserSsovData[];
  ssovSignerArray: SsovSigner[];
  selectedSsov?: number;
  updateSsovData?: Function;
  updateUserSsovData?: Function;
  setSelectedSsov?: Function;
}

const initialUserSsovDataArray = [
  {
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
    epochStrikeTokens: [],
  },
  {
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
    epochStrikeTokens: [],
  },
  {
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
    epochStrikeTokens: [],
  },
];

const initialSsovSignerArray = [
  { token: null, ssovContractWithSigner: null },
  { token: null, ssovContractWithSigner: null },
  { token: null, ssovContractWithSigner: null },
];

export const SsovContext = createContext<SsovContextInterface>({
  ssovArray: [],
  ssovDataArray: [],
  userSsovDataArray: initialUserSsovDataArray,
  ssovSignerArray: initialSsovSignerArray,
  selectedSsov: 0,
});

export const SsovProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [ssovContract, setSsovContract] = useState(null);
  const [currentEpoch, setCurrentEpoch] = useState<number | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [selectedSsov, setSelectedSsov] = useState<number | null>(null);
  const [ssovArray, setSsovArray] = useState<Ssov[]>([]);
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
      ] = await Promise.all([
        ssovContract.getEpochTimes(selectedEpoch),
        ssovContract.isEpochExpired(selectedEpoch),
        ssovContract.isVaultReady(selectedEpoch),
        ssovContract.getEpochStrikes(selectedEpoch),
        ssovContract.totalEpochDeposits(selectedEpoch),
        ssovContract.getTotalEpochStrikeDeposits(selectedEpoch),
        ssovContract.getTotalEpochCallsPurchased(selectedEpoch),
        ssovContract.getTotalEpochPremium(selectedEpoch),
      ]);

      // Add DPX price
      const pricePromises = [];

      pricePromises.push(
        axios
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=dopex&vs_currencies=usd`
          )
          .then((payload) => {
            return payload.data.dopex.usd;
          })
      );

      // Add rDPX price
      pricePromises.push(
        axios
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=dopex-rebate-token&vs_currencies=usd`
          )
          .then((payload) => {
            return payload.data['dopex-rebate-token'].usd;
          })
      );

      // Add eth price
      pricePromises.push(
        axios
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
          )
          .then((payload) => {
            return payload.data.ethereum.usd;
          })
      );

      const prices = await Promise.all(pricePromises);

      let priceDPX = prices[0];
      let priceRDPX = prices[1];
      let priceEth = prices[2];
      let priceAsset;

      if (asset === 'DPX') {
        priceAsset = priceDPX;
      } else if (asset === 'RDPX') {
        priceAsset = priceRDPX;
      } else {
        priceAsset = priceEth;
      }

      let APY;

      if (asset !== 'ETH') {
        const stakingRewardsAddress = await ssovContract.getAddress(
          '0x5374616b696e6752657761726473000000000000000000000000000000000000' // StakingRewards
        );
        const stakingRewardsContract = StakingRewards__factory.connect(
          stakingRewardsAddress,
          provider
        );

        const totalSupply = await stakingRewardsContract.totalSupply();
        let DPXemitted;
        let RDPXemitted;

        const TVL = totalSupply
          .mul(Math.round(priceAsset))
          .div(oneEBigNumber(18));

        let [DPX, RDPX] = await Promise.all([
          stakingRewardsContract.rewardRateDPX(),
          stakingRewardsContract.rewardRateRDPX(),
        ]);

        const rewardsDuration = BigNumber.from(86400 * 365);

        DPXemitted = DPX.mul(rewardsDuration)
          .mul(Math.round(priceDPX))
          .div(oneEBigNumber(18));
        RDPXemitted = RDPX.mul(rewardsDuration)
          .mul(Math.round(priceRDPX))
          .div(oneEBigNumber(18));

        const denominator =
          TVL.toNumber() + DPXemitted.toNumber() + RDPXemitted.toNumber();

        let APR = (denominator / TVL.toNumber() - 1) * 100;

        APY = Number((((1 + APR / 365 / 100) ** 365 - 1) * 100).toFixed(2));
      } else {
        APY = '7';
      }

      ssovData.push({
        epochTimes: epochTimes,
        isEpochExpired: isEpochExpired,
        isVaultReady: isVaultReady,
        epochStrikes: epochStrikes,
        totalEpochDeposits: totalEpochDeposits,
        totalEpochStrikeDeposits: totalEpochStrikeDeposits,
        totalEpochCallsPurchased: totalEpochCallsPurchased,
        totalEpochPremium: totalEpochPremium,
        APY: APY.toString(),
      });
    }
    setSsovDataArray(ssovData);
  }, [contractAddresses, selectedEpoch, provider]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    async function update() {
      const ssovArray: Ssov[] = [];
      const SSOVAddresses = contractAddresses.SSOV;

      for (const asset in SSOVAddresses) {
        const _ssovContract =
          asset === 'ETH'
            ? NativeSSOV__factory.connect(SSOVAddresses[asset].Vault, provider)
            : ERC20SSOV__factory.connect(SSOVAddresses[asset].Vault, provider);

        setSsovContract(_ssovContract);

        // Epoch
        try {
          const [currentEpoch, TokenPrice] = await Promise.all([
            _ssovContract.currentEpoch(),
            _ssovContract.callStatic.getUsdPrice(
              asset === 'ETH'
                ? contractAddresses['WETH']
                : contractAddresses[asset.toUpperCase()]
            ),
          ]);

          setCurrentEpoch(Number(currentEpoch));
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
            tokenPrice: TokenPrice,
            ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
              SSOVAddresses[asset].OptionPricing,
              provider
            ),
            volatilityOracleContract: VolatilityOracle__factory.connect(
              SSOVAddresses[asset].VolatilityOracle,
              provider
            ),
          };
          ssovArray.push({
            ...tempSsov,
          });
        } catch (err) {
          console.log(err);
        }
      }
      setSsovArray(ssovArray);
    }

    update();
  }, [contractAddresses, provider, selectedEpoch]);

  useEffect(() => {
    if (!contractAddresses || !signer || !contractAddresses.SSOV) return;
    const SSOVAddresses = contractAddresses.SSOV;
    const ssovSignerArray = [];

    for (const asset in SSOVAddresses) {
      const tokenAddress =
        asset === 'ETH' ? contractAddresses['WETH'] : contractAddresses[asset];
      const _token = ERC20__factory.connect(tokenAddress, signer);
      const _ssovContractWithSigner =
        asset === 'ETH'
          ? NativeSSOV__factory.connect(SSOVAddresses[asset].Vault, signer)
          : ERC20SSOV__factory.connect(SSOVAddresses[asset].Vault, signer);

      ssovSignerArray.push({
        token: _token,
        ssovContractWithSigner: _ssovContractWithSigner,
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
    ssovArray,
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
