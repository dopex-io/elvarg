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

interface SsovContextInterface {
  ssovData: {
    epochTimes: {};
    isEpochExpired: boolean;
    isVaultReady: boolean;
    epochStrikes: BigNumber[];
    totalEpochStrikeDeposits: BigNumber[];
    totalEpochCallsPurchased: BigNumber[];
    totalEpochPremium: BigNumber[];
    totalEpochDeposits: BigNumber;
  };
  userSsovData: {
    userEpochDeposits: string;
    epochStrikeTokens: ERC20[];
    userEpochStrikeDeposits: BigNumber[];
    userEpochCallsPurchased: BigNumber[];
  };
  ssovContract?: SSOV;
  ssovContractWithSigner?: SSOV;
  currentEpoch?: number;
  selectedEpoch?: number;
  setSelectedEpoch?: Function;
  updateSsovData?: Function;
  updateUserSsovData?: Function;
  dpxToken?: ERC20;
  dpxTokenPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
  APY?: string;
}

const initialState = {
  ssovData: {
    epochTimes: {},
    isEpochExpired: false,
    isVaultReady: false,
    epochStrikes: [],
    totalEpochStrikeDeposits: [],
    totalEpochDeposits: BigNumber.from(0),
    totalEpochCallsPurchased: [],
    totalEpochPremium: [],
  },
  userSsovData: {
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochCallsPurchased: [],
    epochStrikeTokens: [],
  },
};

export const SsovContext = createContext<SsovContextInterface>(initialState);

export const SsovProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);
  const [state, setState] = useState(initialState);

  const [ssovContract, setSsovContract] = useState<SSOV | null>(null);
  const [ssovContractWithSigner, setSsovContractWithSigner] =
    useState<SSOV | null>(null);
  const [currentEpoch, setCurrentEpoch] = useState<number | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [dpxToken, setDpxToken] = useState<ERC20 | null>(null);

  const updateUserSsovData = useCallback(async () => {
    if (!ssovContract || !accountAddress || !selectedEpoch) return;

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

    setState((prevState) => {
      return {
        ...prevState,
        userSsovData: {
          userEpochDeposits,
          userEpochStrikeDeposits,
          userEpochCallsPurchased,
          epochStrikeTokens: epochStrikeTokens.map((token) =>
            ERC20__factory.connect(token, signer)
          ),
        },
      };
    });
  }, [ssovContract, accountAddress, selectedEpoch, signer]);

  const updateSsovData = useCallback(async () => {
    if (!ssovContract || !selectedEpoch) return;

    // current epoch
    const [
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      totalEpochDeposits,
      stakingRewardsAddress,
      totalEpochStrikeDeposits,
      totalEpochCallsPurchased,
      totalEpochPremium,
    ] = await Promise.all([
      ssovContract.getEpochTimes(selectedEpoch),
      ssovContract.isEpochExpired(selectedEpoch),
      ssovContract.isVaultReady(selectedEpoch),
      ssovContract.getEpochStrikes(selectedEpoch),
      ssovContract.totalEpochDeposits(selectedEpoch),
      ssovContract.getAddress(
        '0x5374616b696e6752657761726473000000000000000000000000000000000000' // StakingRewards
      ),
      ssovContract.getTotalEpochStrikeDeposits(selectedEpoch),
      ssovContract.getTotalEpochCallsPurchased(selectedEpoch),
      ssovContract.getTotalEpochPremium(selectedEpoch),
    ]);

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

    let APY = Number((((1 + APR / 365 / 100) ** 365 - 1) * 100).toFixed(2));

    setState((prevState) => {
      return {
        ...prevState,
        ssovData: {
          epochTimes,
          isEpochExpired,
          isVaultReady,
          epochStrikes,
          totalEpochStrikeDeposits,
          totalEpochDeposits,
          totalEpochCallsPurchased,
          totalEpochPremium,
        },
        APY,
      };
    });
  }, [ssovContract, selectedEpoch, provider]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    const SSOVAddresses = contractAddresses.SSOV;

    if (!SSOVAddresses.Vault) return;

    const _ssovContract = SSOV__factory.connect(SSOVAddresses.Vault, provider);

    setSsovContract(_ssovContract);

    (async function () {
      // Epoch
      try {
        const currentEpoch = Number(await _ssovContract.currentEpoch());
        setCurrentEpoch(currentEpoch);
        setSelectedEpoch(currentEpoch);
      } catch (err) {
        console.log(err);
      }

      setState((prevState) => ({
        ...prevState,
        APY: '0.00',
        ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
          SSOVAddresses.OptionPricing,
          provider
        ),
        volatilityOracleContract: VolatilityOracle__factory.connect(
          SSOVAddresses.VolatilityOracle,
          provider
        ),
      }));
    })();
  }, [contractAddresses, provider]);

  useEffect(() => {
    if (!ssovContract || !contractAddresses) return;

    (async function () {
      const dpxTokenPrice = await ssovContract.callStatic.getUsdPrice(
        contractAddresses.DPX
      );
      setState((prevState) => ({
        ...prevState,
        dpxTokenPrice,
      }));
    })();
  }, [ssovContract, contractAddresses]);

  useEffect(() => {
    if (!contractAddresses || !accountAddress || !contractAddresses.SSOV)
      return;

    const dpxToken = ERC20__factory.connect(contractAddresses.DPX, signer);

    const SSOVAddresses = contractAddresses.SSOV;

    if (!SSOVAddresses.Vault) return;

    setSsovContractWithSigner(
      SSOV__factory.connect(SSOVAddresses.Vault, signer)
    );

    setDpxToken(dpxToken);
  }, [contractAddresses, accountAddress, signer]);

  useEffect(() => {
    updateSsovData();
  }, [updateSsovData]);

  useEffect(() => {
    updateUserSsovData();
  }, [updateUserSsovData]);

  const contextValue = {
    ...state,
    ssovContract,
    ssovContractWithSigner,
    currentEpoch,
    selectedEpoch,
    setSelectedEpoch,
    updateSsovData,
    updateUserSsovData,
    dpxToken,
  };

  return (
    <SsovContext.Provider value={contextValue}>
      {props.children}
    </SsovContext.Provider>
  );
};
