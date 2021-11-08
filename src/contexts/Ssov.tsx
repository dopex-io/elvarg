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
  updateSsovData?: Function;
  updateUserSsovData?: Function;
  token?: ERC20;
  tokenPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
  APY?: string;
}
interface SsovContextInterface {
  ssovDpx: Ssov;
  ssovRdpx: Ssov;
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
  const [currentEpochRdpx, setCurrentEpochRdpx] = useState<number | null>(1);
  const [selectedEpochRdpx, setSelectedEpochRdpx] = useState<number | null>(1);
  const [rdpxToken, setRdpxToken] = useState<ERC20 | null>(null);

  const updateUserSsovDpxData = useCallback(async () => {
    if (!ssovDpxContract || !accountAddress || !selectedEpochDpx) return;

    // current epoch
    const [
      userEpochStrikeDeposits,
      userEpochCallsPurchased,
      epochStrikeTokens,
    ] = await Promise.all([
      ssovDpxContract.getUserEpochDeposits(selectedEpochDpx, accountAddress),
      ssovDpxContract.getUserEpochCallsPurchased(
        selectedEpochDpx,
        accountAddress
      ),
      ssovDpxContract.getEpochStrikeTokens(selectedEpochDpx),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    setStateDpx((prevState) => {
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
  }, [ssovDpxContract, accountAddress, selectedEpochDpx, signer]);

  const updateSsovDpxData = useCallback(async () => {
    if (!ssovDpxContract || !selectedEpochDpx) return;

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
      ssovDpxContract.getEpochTimes(selectedEpochDpx),
      ssovDpxContract.isEpochExpired(selectedEpochDpx),
      ssovDpxContract.isVaultReady(selectedEpochDpx),
      ssovDpxContract.getEpochStrikes(selectedEpochDpx),
      ssovDpxContract.totalEpochDeposits(selectedEpochDpx),
      ssovDpxContract.getAddress(
        '0x5374616b696e6752657761726473000000000000000000000000000000000000' // StakingRewards
      ),
      ssovDpxContract.getTotalEpochStrikeDeposits(selectedEpochDpx),
      ssovDpxContract.getTotalEpochCallsPurchased(selectedEpochDpx),
      ssovDpxContract.getTotalEpochPremium(selectedEpochDpx),
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

    setStateDpx((prevState) => {
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
  }, [ssovDpxContract, selectedEpochDpx, provider]);

  const updateUserSsovRdpxData = useCallback(async () => {
    if (!ssovRdpxContract || !accountAddress || !selectedEpochRdpx) return;

    // current epoch
    const [
      userEpochStrikeDeposits,
      userEpochCallsPurchased,
      epochStrikeTokens,
    ] = await Promise.all([
      ssovRdpxContract.getUserEpochDeposits(selectedEpochRdpx, accountAddress),
      ssovRdpxContract.getUserEpochCallsPurchased(
        selectedEpochRdpx,
        accountAddress
      ),
      ssovRdpxContract.getEpochStrikeTokens(selectedEpochRdpx),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    setStateRdpx((prevState) => {
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
  }, [ssovRdpxContract, accountAddress, selectedEpochRdpx, signer]);

  const updateSsovRdpxData = useCallback(async () => {
    if (!ssovRdpxContract || !selectedEpochRdpx) return;

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
      ssovRdpxContract.getEpochTimes(selectedEpochRdpx),
      ssovRdpxContract.isEpochExpired(selectedEpochRdpx),
      ssovRdpxContract.isVaultReady(selectedEpochRdpx),
      ssovRdpxContract.getEpochStrikes(selectedEpochRdpx),
      ssovRdpxContract.totalEpochDeposits(selectedEpochRdpx),
      ssovRdpxContract.getAddress(
        '0x5374616b696e6752657761726473000000000000000000000000000000000000' // StakingRewards
      ),
      ssovRdpxContract.getTotalEpochStrikeDeposits(selectedEpochRdpx),
      ssovRdpxContract.getTotalEpochCallsPurchased(selectedEpochRdpx),
      ssovRdpxContract.getTotalEpochPremium(selectedEpochRdpx),
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

    const TVL = totalSupply.mul(Math.round(priceRDPX)).div(oneEBigNumber(18));

    let DPXemitted;
    let RDPXemitted;

    DPXemitted = DPX.mul(BigNumber.from(86400 * 90))
      .mul(Math.round(priceDPX))
      .mul(2)
      .div(oneEBigNumber(18));
    RDPXemitted = RDPX.mul(BigNumber.from(86400 * 90))
      .mul(Math.round(priceRDPX))
      .mul(2)
      .div(oneEBigNumber(18));

    const denominator =
      TVL.toNumber() + DPXemitted.toNumber() + RDPXemitted.toNumber();

    let APR = (denominator / TVL.toNumber() - 1) * 100;

    let APY = Number((((1 + APR / 365 / 100) ** 365 - 1) * 100).toFixed(2));

    setStateRdpx((prevState) => {
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
  }, [ssovRdpxContract, selectedEpochRdpx, provider]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses.SSOV) return;

    const SSOVAddresses = contractAddresses.SSOV;

    if (!SSOVAddresses.DPX.Vault) return;

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
        let currentEpoch = Number(await _ssovDpxContract.currentEpoch());
        setCurrentEpochDpx(currentEpoch);
        setSelectedEpochDpx(currentEpoch);
        // currentEpoch = Number(await _ssovRdpxContract.currentEpoch());
        // setCurrentEpochRdpx(currentEpoch);
        // setSelectedEpochRdpx(currentEpoch);
      } catch (err) {
        console.log(err);
      }

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
      }));
    })();
  }, [contractAddresses, provider]);

  useEffect(() => {
    if (!ssovDpxContract || !contractAddresses) return;

    (async function () {
      const dpxTokenPrice = await ssovDpxContract.callStatic.getUsdPrice(
        contractAddresses.DPX
      );
      const rdpxTokenPrice = await ssovDpxContract.callStatic.getUsdPrice(
        contractAddresses.RDPX
      );
      setStateDpx((prevState) => ({
        ...prevState,
        tokenPrice: dpxTokenPrice,
      }));
      setStateRdpx((prevState) => ({
        ...prevState,
        tokenPrice: rdpxTokenPrice,
      }));
    })();
  }, [ssovDpxContract, contractAddresses]);

  useEffect(() => {
    if (!contractAddresses || !accountAddress || !contractAddresses.SSOV)
      return;

    const dpxToken = ERC20__factory.connect(contractAddresses.DPX, signer);
    const rdpxToken = ERC20__factory.connect(contractAddresses.RDPX, signer);

    const SSOVAddresses = contractAddresses.SSOV;

    if (!SSOVAddresses?.DPX.Vault) return;

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
    updateSsovDpxData();
  }, [updateSsovDpxData]);

  useEffect(() => {
    updateUserSsovDpxData();
  }, [updateUserSsovDpxData]);

  useEffect(() => {
    updateSsovRdpxData();
  }, [updateSsovRdpxData]);

  useEffect(() => {
    updateUserSsovRdpxData();
  }, [updateUserSsovRdpxData]);

  const contextValue = {
    ssovDpx: {
      ...stateDpx,
      ssovContract: ssovDpxContract,
      ssovContractWithSigner: ssovDpxContractWithSigner,
      currentEpoch: currentEpochDpx,
      selectedEpoch: selectedEpochDpx,
      setSelectedEpoch: setSelectedEpochDpx,
      updateSsovData: updateSsovDpxData,
      updateUserSsovData: updateUserSsovDpxData,
      token: dpxToken,
    },
    ssovRdpx: {
      ...stateRdpx,
      ssovContract: ssovRdpxContract,
      ssovContractWithSigner: ssovRdpxContractWithSigner,
      currentEpoch: currentEpochRdpx,
      selectedEpoch: selectedEpochRdpx,
      setSelectedEpoch: setSelectedEpochRdpx,
      updateSsovData: updateSsovRdpxData,
      updateUserSsovData: updateUserSsovRdpxData,
      token: rdpxToken,
    },
  };

  return (
    <SsovContext.Provider value={contextValue}>
      {props.children}
    </SsovContext.Provider>
  );
};
