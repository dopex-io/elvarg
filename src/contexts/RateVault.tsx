import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  ERC20,
  VolatilityOracle,
  SSOVOptionPricing,
  IRVault__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';

import { WalletContext } from './Wallet';

export interface RateVault {
  token?: string;
}
export interface RateVaultSigner {
  token: ERC20[];
  rateVaultContractWithSigner?: any;
}

export interface RateVaultData {
  tokenName?: string;
  rateVaultContract?: any;
  currentEpoch?: number;
  tokenPrice?: BigNumber;
  lpPrice?: BigNumber;
  rateVaultOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
  isCurrentEpochExpired?: boolean;
}

export interface RateVaultEpochData {
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

export interface RateVaultUserData {
  userEpochDeposits: string;
  epochStrikeTokens: ERC20[];
  userEpochStrikeDeposits: BigNumber[];
  userEpochOptionsPurchased: BigNumber[];
}

interface RateVaultContextInterface {
  CALL: {
    rateVaultData?: RateVaultData;
    rateVaultEpochData?: RateVaultEpochData;
    rateVaultUserData?: RateVaultUserData;
    rateVaultSigner: RateVaultSigner;
    selectedEpoch?: number;
    updateRateVaultEpochData?: Function;
    updateRateVaultUserData?: Function;
    setSelectedEpoch?: Function;
  };
  PUT: {
    rateVaultData?: RateVaultData;
    rateVaultEpochData?: RateVaultEpochData;
    rateVaultUserData?: RateVaultUserData;
    rateVaultSigner: RateVaultSigner;
    selectedEpoch?: number;
    updateRateVaultEpochData?: Function;
    updateRateVaultUserData?: Function;
    setSelectedEpoch?: Function;
  };
}

const initialRateVaultUserData = {
  userEpochStrikeDeposits: [],
  userEpochDeposits: '0',
  userEpochOptionsPurchased: [],
  epochStrikeTokens: [],
};

const initialRateVaultSigner = {
  token: null,
  rateVaultContractWithSigner: null,
};

export const RateVaultContext = createContext<RateVaultContextInterface>({
  CALL: {
    rateVaultUserData: initialRateVaultUserData,
    rateVaultSigner: initialRateVaultSigner,
  },
  PUT: {
    rateVaultUserData: initialRateVaultUserData,
    rateVaultSigner: initialRateVaultSigner,
  },
});

export const RateVaultSide = ({ activeRateVaultContextSide }) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [rateVaultData, setRateVaultData] = useState<RateVaultData>();
  const [rateVaultEpochData, setRateVaultEpochData] =
    useState<RateVaultEpochData>();
  const [rateVaultUserData, setRateVaultUserData] =
    useState<RateVaultUserData>();
  const [rateVaultSigner, setRateVaultSigner] = useState<RateVaultSigner>({
    token: [],
    rateVaultContractWithSigner: null,
  });

  const updateRateVaultUserData = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !selectedEpoch) return;

    if (!contractAddresses['Vaults']['IR']) return;

    const rateVaultAddresses = contractAddresses['Vaults']['IR'];

    if (!rateVaultAddresses) return;

    let _rateVaultUserData;

    const rateVaultContract = IRVault__factory.connect(
      rateVaultAddresses.Vault,
      provider
    );

    // TODO: ADD HERE

    setRateVaultUserData(null);
  }, [accountAddress, contractAddresses, provider, selectedEpoch]);

  const updateRateVaultEpochData = useCallback(async () => {
    if (!contractAddresses || !selectedEpoch) return;

    if (!contractAddresses['Vaults']['IR']) return;

    const rateVaultAddresses = contractAddresses['Vaults']['IR'];

    if (!rateVaultAddresses) return;

    const rateVaultContract = IRVault__factory.connect(
      rateVaultAddresses.Vault,
      provider
    );

    const APY = 15;

    setRateVaultEpochData(null);
  }, [contractAddresses, selectedEpoch, provider]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses?.Vaults?.IR)
      return;

    async function update() {
      let _rateVaultData: RateVaultData;

      if (!contractAddresses['Vaults']['IR']) return;

      const rateVaultAddresses = contractAddresses['Vaults']['IR'];

      if (!rateVaultAddresses) return;

      const _rateVaultContract = IRVault__factory.connect(
        contractAddresses['Vaults']['IR'],
        provider
      );

      console.log(_rateVaultContract);
      console.log(contractAddresses['Vaults']['IR']);

      const currentEpoch = await _rateVaultContract.currentEpoch();

      console.log(currentEpoch);

      _rateVaultData = {
        currentEpoch: currentEpoch.toNumber(),
      };

      setRateVaultData(_rateVaultData);
    }

    update();
  }, [contractAddresses, provider]);

  useEffect(() => {
    if (!contractAddresses || !signer || !contractAddresses?.Vaults?.IR) return;

    let _rateVaultSigner;

    if (!contractAddresses['Vaults']['IR']) return;

    const _rateVaultContractWithSigner = IRVault__factory.connect(
      contractAddresses['Vaults']['IR'],
      signer
    );

    _rateVaultSigner = {
      rateVaultContractWithSigner: _rateVaultContractWithSigner,
    };

    setRateVaultSigner(_rateVaultSigner);
  }, [contractAddresses, signer, accountAddress]);

  useEffect(() => {
    updateRateVaultUserData();
  }, [updateRateVaultUserData]);

  useEffect(() => {
    updateRateVaultEpochData();
  }, [updateRateVaultEpochData]);

  return {
    rateVaultData,
    rateVaultEpochData,
    rateVaultUserData,
    rateVaultSigner,
    selectedEpoch,
    updateRateVaultEpochData,
    updateRateVaultUserData,
    setSelectedEpoch,
  };
};

export const RateVaultProvider = (props) => {
  const contextValue = {
    CALL: RateVaultSide({ activeRateVaultContextSide: 'CALL' }),
    PUT: RateVaultSide({ activeRateVaultContextSide: 'PUT' }),
  };

  return (
    <RateVaultContext.Provider value={contextValue}>
      {props.children}
    </RateVaultContext.Provider>
  );
};
