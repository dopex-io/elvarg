import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  SSOV,
  SSOV__factory,
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

interface SsovExtra {
  ssovSdk?: SsovSdkStateInterface;
  currentEpoch?: number;
  nextEpoch?: number;
  selectedEpoch?: number;
  setSelectedEpoch?: Function;
  updateCurrentEpochSsovData?: Function;
  updateNextEpochSsovData?: Function;
  updateSelectedEpochSsovData?: Function;
  dpxToken?: ERC20;
  dpxTokenPrice?: BigNumber;
  ssovOptionPricingSdk?: ssovOptionPricingSdkStateInterface;
  volatilityOracleContracts?: volatilityOracleStateInterface;
  APY?: string;
}

interface SsovData {
  epochTimes: {};
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochStrikes: BigNumber[];
  epochStrikeTokens: ERC20[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochCallsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  totalEpochDeposits: BigNumber;
  userEpochStrikeDeposits: BigNumber[];
  userEpochDeposits: string;
  userEpochCallsPurchased: BigNumber[];
}

interface SsovContextInterface extends SsovExtra {
  currentEpochSsovData: SsovData;
  nextEpochSsovData: SsovData;
  selectedEpochSsovData: SsovData;
}

interface SsovSdkStateInterface {
  call: SSOV;
  send: SSOV;
}

interface ssovOptionPricingSdkStateInterface {
  call: SSOVOptionPricing;
  send: SSOVOptionPricing;
}
interface volatilityOracleStateInterface {
  call: VolatilityOracle;
  send: VolatilityOracle;
}

const initialState = {
  currentEpochSsovData: {
    epochTimes: {},
    isEpochExpired: false,
    isVaultReady: false,
    epochStrikes: [],
    epochStrikeTokens: [],
    totalEpochStrikeDeposits: [],
    totalEpochDeposits: BigNumber.from(0),
    totalEpochCallsPurchased: [],
    totalEpochPremium: [],
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
  },
  nextEpochSsovData: {
    epochTimes: {},
    isEpochExpired: false,
    isVaultReady: false,
    epochStrikes: [],
    epochStrikeTokens: [],
    totalEpochStrikeDeposits: [],
    totalEpochDeposits: BigNumber.from(0),
    totalEpochCallsPurchased: [],
    totalEpochPremium: [],
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
  },
  selectedEpochSsovData: {
    epochTimes: {},
    isEpochExpired: false,
    isVaultReady: false,
    epochStrikes: [],
    epochStrikeTokens: [],
    totalEpochStrikeDeposits: [],
    totalEpochDeposits: BigNumber.from(0),
    totalEpochCallsPurchased: [],
    totalEpochPremium: [],
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
  },
};

export const SsovContext = createContext<SsovContextInterface>(initialState);

export const SsovProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);
  const [state, setState] = useState(initialState);
  const [ssovSdk, setSsovSdk] = useState<SsovSdkStateInterface | null>(null);
  const [currentEpoch, setCurrentEpoch] = useState<number>(1);
  const [selectedEpoch, setSelectedEpoch] = useState<number>(1);
  const [dpxToken, setDpxToken] = useState<ERC20 | null>(null);

  const updateCurrentEpochSsovData = useCallback(async () => {
    if (!ssovSdk || !accountAddress || !currentEpoch) return;

    // current epoch
    const [
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      epochStrikeTokens,
      totalEpochDeposits,
      stakingRewardsAddress,
      [
        totalEpochStrikeDeposits,
        totalEpochCallsPurchased,
        totalEpochPremium,
        userEpochStrikeDeposits,
        userEpochCallsPurchased,
      ],
    ] = await Promise.all([
      ssovSdk.call.getEpochTimes(currentEpoch),
      ssovSdk.call.isEpochExpired(currentEpoch),
      ssovSdk.call.isVaultReady(currentEpoch),
      ssovSdk.call.getEpochStrikes(currentEpoch),
      ssovSdk.call.getEpochStrikeTokens(currentEpoch),
      ssovSdk.call.totalEpochDeposits(currentEpoch),
      ssovSdk.call.getAddress(
        '0x5374616b696e6752657761726473000000000000000000000000000000000000' // StakingRewards
      ),
      Promise.all([
        ssovSdk.call.getTotalEpochStrikeDeposits(selectedEpoch),
        ssovSdk.call.getTotalEpochCallsPurchased(selectedEpoch),
        ssovSdk.call.getTotalEpochPremium(selectedEpoch),
        ssovSdk.call.getUserEpochDeposits(selectedEpoch, accountAddress),
        ssovSdk.call.getUserEpochCallsPurchased(selectedEpoch, accountAddress),
      ]),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    const stakingRewardsContract = StakingRewards__factory.connect(
      stakingRewardsAddress,
      provider
    );

    let [DPX, RDPX] = await Promise.all([
      stakingRewardsContract.rewardRateDPX(),
      stakingRewardsContract.rewardRateRDPX(),
    ]);

    const totalSupply = await stakingRewardsContract.totalSupply();

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

    const prices = await Promise.all(pricePromises);

    let priceDPX = prices[0];
    let priceRDPX = prices[1];

    const TVL = totalSupply.mul(Math.round(priceDPX)).div(oneEBigNumber(18));

    let DPXemitted;
    let RDPXemitted;

    DPXemitted = DPX.mul(BigNumber.from(86400 * 365))
      .mul(Math.round(priceDPX))
      .div(oneEBigNumber(18));
    RDPXemitted = RDPX.mul(BigNumber.from(86400 * 365))
      .mul(Math.round(priceRDPX))
      .div(oneEBigNumber(18));

    const denominator =
      TVL.toNumber() + DPXemitted.toNumber() + RDPXemitted.toNumber();

    let APR = (denominator / TVL.toNumber() - 1) * 100;

    let APY: string | number = APR;
    if (currentEpoch > 1) {
      // const pastEpochs = Array.from(
      //   { length: Number(currentEpoch - 1) },
      //   (_, i) => i + 1
      // ).slice(-12);
      // const totalDeposits = (
      //   await Promise.all(
      //     pastEpochs.map((epoch) => ssovSdk.call.totalEpochDeposits(epoch))
      //   )
      // )
      //   .map((deposit) => deposit)
      //   .reduce(
      //     (accumulator, currentValue) => accumulator.add(currentValue),
      //     BigNumber.from(0)
      //   );
      // const totalExercises = (
      //   await Promise.all(
      //     pastEpochs.map((epoch) =>
      //       ssovSdk.call.totalTokenVaultExercises(epoch)
      //     )
      //   )
      // )
      //   .map((exercise) => exercise)
      //   .reduce(
      //     (accumulator, currentValue) => accumulator.add(currentValue),
      //     BigNumber.from(0)
      //   );
      // if (totalDeposits.gt(0) && totalExercises.gt(0)) {
      //   APY += totalExercises.mul(100).div(totalDeposits).toNumber();
      // }
    }

    APY = APY.toFixed(2);

    setState((prevState) => {
      const epochSsovData = {
        epochTimes,
        isEpochExpired,
        isVaultReady,
        epochStrikes,
        epochStrikeTokens: epochStrikeTokens.map((token) =>
          ERC20__factory.connect(token, signer)
        ),
        totalEpochStrikeDeposits,
        totalEpochDeposits,
        userEpochStrikeDeposits,
        userEpochDeposits,
        userEpochCallsPurchased,
        totalEpochCallsPurchased,
        totalEpochPremium,
      };
      if (currentEpoch === selectedEpoch) {
        return {
          ...prevState,
          currentEpochSsovData: epochSsovData,
          selectedEpochSsovData: epochSsovData,
          APY,
        };
      } else {
        return {
          ...prevState,
          currentEpochSsovData: epochSsovData,
          APY,
        };
      }
    });
  }, [ssovSdk, accountAddress, currentEpoch, selectedEpoch, signer, provider]);

  const updateNextEpochSsovData = useCallback(async () => {
    if (!ssovSdk || !accountAddress) return;

    // next epoch
    let nextEpoch = 1;
    let epochTimes = await ssovSdk.call.getEpochTimes(nextEpoch);

    if (!Number(epochTimes[0])) {
      nextEpoch = currentEpoch;
      epochTimes = await ssovSdk.call.getEpochTimes(nextEpoch);
    }

    const [
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochDeposits,
      totalEpochCallsPurchased,
      totalEpochPremium,
      userEpochStrikeDeposits,
    ] = await Promise.all([
      ssovSdk.call.isEpochExpired(nextEpoch),
      ssovSdk.call.isVaultReady(nextEpoch),
      ssovSdk.call.getEpochStrikes(nextEpoch),
      ssovSdk.call.getTotalEpochStrikeDeposits(nextEpoch),
      ssovSdk.call.totalEpochDeposits(nextEpoch),
      ssovSdk.call.getTotalEpochCallsPurchased(nextEpoch),
      ssovSdk.call.getTotalEpochPremium(nextEpoch),
      ssovSdk.call.getUserEpochDeposits(nextEpoch, accountAddress),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    setState((prevState) => ({
      ...prevState,
      nextEpoch,
      nextEpochSsovData: {
        epochTimes,
        isEpochExpired,
        isVaultReady,
        epochStrikes,
        epochStrikeTokens: [],
        totalEpochStrikeDeposits,
        totalEpochDeposits,
        totalEpochCallsPurchased,
        totalEpochPremium,
        userEpochStrikeDeposits,
        userEpochDeposits,
        userEpochCallsPurchased: [],
      },
    }));
  }, [ssovSdk, accountAddress, currentEpoch]);

  const updateSelectedEpochSsovData = useCallback(async () => {
    if (!ssovSdk || !accountAddress || !selectedEpoch) return;

    // selected epoch
    const [
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      epochStrikeTokens,
      totalEpochDeposits,
      [
        totalEpochStrikeDeposits,
        totalEpochCallsPurchased,
        totalEpochPremium,
        userEpochStrikeDeposits,
        userEpochCallsPurchased,
      ],
    ] = await Promise.all([
      ssovSdk.call.getEpochTimes(selectedEpoch),
      ssovSdk.call.isEpochExpired(selectedEpoch),
      ssovSdk.call.isVaultReady(selectedEpoch),
      ssovSdk.call.getEpochStrikes(selectedEpoch),
      ssovSdk.call.getEpochStrikeTokens(selectedEpoch),
      ssovSdk.call.totalEpochDeposits(selectedEpoch),
      Promise.all([
        ssovSdk.call.getTotalEpochStrikeDeposits(selectedEpoch),
        ssovSdk.call.getTotalEpochCallsPurchased(selectedEpoch),
        ssovSdk.call.getTotalEpochPremium(selectedEpoch),
        ssovSdk.call.getUserEpochDeposits(selectedEpoch, accountAddress),
        ssovSdk.call.getUserEpochCallsPurchased(selectedEpoch, accountAddress),
      ]),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .map((deposit) => deposit)
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    setState((prevState) => ({
      ...prevState,
      selectedEpochSsovData: {
        epochTimes,
        isEpochExpired,
        isVaultReady,
        epochStrikes,
        epochStrikeTokens: epochStrikeTokens.map((token) =>
          ERC20__factory.connect(token, signer)
        ),
        totalEpochStrikeDeposits,
        totalEpochDeposits,
        totalEpochCallsPurchased,
        totalEpochPremium,
        userEpochStrikeDeposits,
        userEpochDeposits,
        userEpochCallsPurchased,
      },
    }));
  }, [ssovSdk, accountAddress, selectedEpoch, signer]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    const SSOVAddresses = contractAddresses.SSOV as unknown as {
      [key: string]: string;
    };

    if (!SSOVAddresses.Vault) return;
    const ssovSdk = {
      call: SSOV__factory.connect(SSOVAddresses.Vault, provider),
      send: SSOV__factory.connect(SSOVAddresses.Vault, signer),
    };

    setSsovSdk(ssovSdk);

    (async function () {
      // Epoch
      try {
        // const currentEpoch = Number(await ssovSdk.call.currentEpoch());
        // setCurrentEpoch(currentEpoch);
        // setSelectedEpoch(currentEpoch);
      } catch (err) {
        console.log(err);
      }

      // OptionPricing
      const ssovOptionPricingSdk = {
        call: SSOVOptionPricing__factory.connect(
          SSOVAddresses.OptionPricing,
          provider
        ),
        send: SSOVOptionPricing__factory.connect(
          SSOVAddresses.OptionPricing,
          signer
        ),
      };

      const volatilityOracleContracts = {
        call: VolatilityOracle__factory.connect(
          SSOVAddresses.VolatilityOracle,
          provider
        ),
        send: VolatilityOracle__factory.connect(
          SSOVAddresses.VolatilityOracle,
          signer
        ),
      };

      setState((prevState) => ({
        ...prevState,
        APY: '0.00',
        ssovOptionPricingSdk,
        volatilityOracleContracts,
      }));
    })();
  }, [contractAddresses, provider, signer]);

  useEffect(() => {
    if (!ssovSdk || !contractAddresses) return;

    (async function () {
      const dpxTokenPrice = await ssovSdk.call.viewUsdPrice(
        contractAddresses.DPX
      );
      setState((prevState) => ({
        ...prevState,
        dpxTokenPrice,
      }));
    })();
  }, [ssovSdk, contractAddresses]);

  useEffect(() => {
    if (!contractAddresses || !accountAddress) return;

    const dpxToken = ERC20__factory.connect(contractAddresses.DPX, signer);

    setDpxToken(dpxToken);
  }, [contractAddresses, accountAddress, signer]);

  useEffect(() => {
    updateCurrentEpochSsovData();
  }, [updateCurrentEpochSsovData]);

  useEffect(() => {
    updateNextEpochSsovData();
  }, [updateNextEpochSsovData]);

  useEffect(() => {
    updateSelectedEpochSsovData();
  }, [updateSelectedEpochSsovData]);

  const contextValue = {
    ...state,
    ssovSdk,
    currentEpoch,
    selectedEpoch,
    setSelectedEpoch,
    updateCurrentEpochSsovData,
    updateNextEpochSsovData,
    updateSelectedEpochSsovData,
    dpxToken,
  };

  return (
    <SsovContext.Provider value={contextValue}>
      {props.children}
    </SsovContext.Provider>
  );
};
