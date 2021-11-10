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

interface Ssov {
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
  token?: ERC20;
  tokenPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
  APY?: string;
}
interface SsovContextInterface {
  ssovDpx: Ssov;
  ssovRdpx: Ssov;
  updateSsovData?: Function;
  updateUserSsovData?: Function;
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

export const SsovContext = createContext<SsovContextInterface>({
  ssovDpx: initialState,
  ssovRdpx: initialState,
});

export const SsovProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);
  const [stateDpx, setStateDpx] = useState(initialState);
  const [stateRdpx, setStateRdpx] = useState(initialState);

  const [ssovDpxContract, setSsovDpxContract] = useState<SSOV | null>(null);
  const [ssovDpxContractWithSigner, setSsovDpxContractWithSigner] =
    useState<SSOV | null>(null);
  const [currentEpochDpx, setCurrentEpochDpx] = useState<number | null>(null);
  const [selectedEpochDpx, setSelectedEpochDpx] = useState<number | null>(null);
  const [dpxToken, setDpxToken] = useState<ERC20 | null>(null);

  const [ssovRdpxContract, setSsovRdpxContract] = useState<SSOV | null>(null);
  const [ssovRdpxContractWithSigner, setSsovRdpxContractWithSigner] =
    useState<SSOV | null>(null);
  const [currentEpochRdpx, setCurrentEpochRdpx] = useState<number | null>(null);
  const [selectedEpochRdpx, setSelectedEpochRdpx] = useState<number | null>(
    null
  );
  const [rdpxToken, setRdpxToken] = useState<ERC20 | null>(null);

  const updateUserSsovData = useCallback(
    async (token) => {
      const ssovContract = token === 'dpx' ? ssovDpxContract : ssovRdpxContract;
      const selectedEpoch =
        token === 'dpx' ? selectedEpochDpx : selectedEpochRdpx;
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

      const setState = token === 'dpx' ? setStateDpx : setStateRdpx;

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
    },
    [
      ssovDpxContract,
      ssovRdpxContract,
      selectedEpochDpx,
      selectedEpochRdpx,
      accountAddress,
      signer,
    ]
  );

  const updateSsovData = useCallback(
    async (token) => {
      const ssovContract = token === 'dpx' ? ssovDpxContract : ssovRdpxContract;
      const selectedEpoch =
        token === 'dpx' ? selectedEpochDpx : selectedEpochRdpx;
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

      const TVL = totalSupply
        .mul(Math.round(token === 'dpx' ? priceDPX : priceRDPX))
        .div(oneEBigNumber(18));

      let DPXemitted;
      let RDPXemitted;

      const rewardsDuration =
        token === 'dpx'
          ? BigNumber.from(86400 * 365)
          : BigNumber.from(86400 * 90);
      const boost = token === 'dpx' ? 1 : 2;

      DPXemitted = DPX.mul(rewardsDuration)
        .mul(Math.round(priceDPX))
        .mul(boost)
        .div(oneEBigNumber(18));
      RDPXemitted = RDPX.mul(rewardsDuration)
        .mul(Math.round(priceRDPX))
        .mul(boost)
        .div(oneEBigNumber(18));

      const denominator =
        TVL.toNumber() + DPXemitted.toNumber() + RDPXemitted.toNumber();

      let APR = (denominator / TVL.toNumber() - 1) * 100;

      let APY = Number((((1 + APR / 365 / 100) ** 365 - 1) * 100).toFixed(2));

      const setState = token === 'dpx' ? setStateDpx : setStateRdpx;

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
    },
    [
      ssovDpxContract,
      ssovRdpxContract,
      selectedEpochRdpx,
      selectedEpochDpx,
      provider,
    ]
  );

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    const SSOVAddresses = contractAddresses.SSOV;

    if (!SSOVAddresses?.DPX?.Vault || !SSOVAddresses?.RDPX?.Vault) return;

    const _ssovDpxContract = SSOV__factory.connect(
      SSOVAddresses.DPX.Vault,
      provider
    );

    const _ssovRdpxContract = SSOV__factory.connect(
      SSOVAddresses.RDPX.Vault,
      provider
    );

    setSsovDpxContract(_ssovDpxContract);
    setSsovRdpxContract(_ssovRdpxContract);

    (async function () {
      // Epoch
      try {
        const [
          currentEpochDpx,
          currentEpochRdpx,
          dpxTokenPrice,
          rdpxTokenPrice,
        ] = await Promise.all([
          _ssovDpxContract.currentEpoch(),
          _ssovRdpxContract.currentEpoch(),
          _ssovDpxContract.callStatic.getUsdPrice(contractAddresses.DPX),
          _ssovDpxContract.callStatic.getUsdPrice(contractAddresses.RDPX),
        ]);

        setCurrentEpochDpx(Number(currentEpochDpx));
        setSelectedEpochDpx(Number(currentEpochDpx));
        setCurrentEpochRdpx(Number(currentEpochRdpx));
        setSelectedEpochRdpx(Number(currentEpochRdpx));

        setStateDpx((prevState) => ({
          ...prevState,
          APY: '0.00',
          ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
            SSOVAddresses.DPX.OptionPricing,
            provider
          ),
          volatilityOracleContract: VolatilityOracle__factory.connect(
            SSOVAddresses.DPX.VolatilityOracle,
            provider
          ),
          tokenPrice: dpxTokenPrice,
        }));

        setStateRdpx((prevState) => ({
          ...prevState,
          APY: '0.00',
          ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
            SSOVAddresses.RDPX.OptionPricing,
            provider
          ),
          volatilityOracleContract: VolatilityOracle__factory.connect(
            SSOVAddresses.RDPX.VolatilityOracle,
            provider
          ),
          tokenPrice: rdpxTokenPrice,
        }));
      } catch (err) {
        console.log(err);
      }
    })();
  }, [contractAddresses, provider]);

  useEffect(() => {
    if (!contractAddresses || !accountAddress || !contractAddresses.SSOV)
      return;

    const dpxToken = ERC20__factory.connect(contractAddresses.DPX, signer);
    const rdpxToken = ERC20__factory.connect(contractAddresses.RDPX, signer);

    const SSOVAddresses = contractAddresses.SSOV;

    if (!SSOVAddresses?.DPX?.Vault || !SSOVAddresses?.RDPX?.Vault) return;

    setSsovDpxContractWithSigner(
      SSOV__factory.connect(SSOVAddresses.DPX.Vault, signer)
    );

    setSsovRdpxContractWithSigner(
      SSOV__factory.connect(SSOVAddresses.RDPX.Vault, signer)
    );

    setDpxToken(dpxToken);
    setRdpxToken(rdpxToken);
  }, [contractAddresses, accountAddress, signer]);

  useEffect(() => {
    updateSsovData('dpx');
    updateSsovData('rdpx');
  }, [updateSsovData]);

  useEffect(() => {
    updateUserSsovData('dpx');
    updateUserSsovData('rdpx');
  }, [updateUserSsovData]);

  const contextValue = {
    ssovDpx: {
      ...stateDpx,
      ssovContract: ssovDpxContract,
      ssovContractWithSigner: ssovDpxContractWithSigner,
      currentEpoch: currentEpochDpx,
      selectedEpoch: selectedEpochDpx,
      setSelectedEpoch: setSelectedEpochDpx,
      token: dpxToken,
    },
    ssovRdpx: {
      ...stateRdpx,
      ssovContract: ssovRdpxContract,
      ssovContractWithSigner: ssovRdpxContractWithSigner,
      currentEpoch: currentEpochRdpx,
      selectedEpoch: selectedEpochRdpx,
      setSelectedEpoch: setSelectedEpochRdpx,
      token: rdpxToken,
    },
    updateSsovData,
    updateUserSsovData,
  };

  return (
    <SsovContext.Provider value={contextValue}>
      {props.children}
    </SsovContext.Provider>
  );
};
