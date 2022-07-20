import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react';
import { VolatilityOracle, SSOVOptionPricing } from '@dopex-io/sdk';

import { BigNumber, ethers } from 'ethers';

import { WalletContext } from './Wallet';

const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usd',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_priceOracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_volatilityOracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_optionPricing',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_straddlePositionMinter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_writePositionMinter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_assetSwapper',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'Bootstrap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'NewDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'straddleId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    name: 'Purchase',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'pnl',
        type: 'int256',
      },
    ],
    name: 'Settle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
    ],
    name: 'ToggleRollover',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'pnl',
        type: 'int256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'apFundingPercent',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'assetSwapper',
    outputs: [
      {
        internalType: 'contract AssetSwapper',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
    ],
    name: 'bootstrap',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_isPut',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_expiry',
        type: 'uint256',
      },
    ],
    name: 'calculatePremium',
    outputs: [
      {
        internalType: 'uint256',
        name: 'premium',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'callOtmPercent',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentEpoch',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'epochCollectionsData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'usdPremiums',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'usdFunding',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'epochData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'usdDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'activeUsdDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'settlementPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'underlyingPurchased',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'expireDelayTolerance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'expireEpoch',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnderlyingPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_strike',
        type: 'uint256',
      },
    ],
    name: 'getVolatility',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isEpochExpired',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isVaultReady',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minStraddlePurchase',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'optionPricing',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'percentagePrecision',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceOracle',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'purchase',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'rollover',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'settle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'straddlePositionMinter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'straddlePositions',
    outputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'apStrike',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'exercised',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'toggleRollover',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'underlying',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usd',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'volatilityOracle',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'writePositionMinter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'writePositions',
    outputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'usdDeposit',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
      {
        internalType: 'int256',
        name: 'pnl',
        type: 'int256',
      },
      {
        internalType: 'bool',
        name: 'withdrawn',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface Straddles {
  token?: string;
}

export interface StraddlesData {
  straddlesContract: any;
  currentEpoch: number;
  straddlesOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
}

export interface StraddlesEpochData {
  startTime: number;
  expiry: number;
  usdDeposits: number;
  activeUsdDeposits: number;
  strikes: number[];
  settlementPrice: number;
  underlyingPurchased: number;
}

export interface WritePosition {
  epoch: number;
  usdDeposit: number;
  roolover: boolean;
  pnl: number;
  withdrawn: boolean;
}

export interface StraddlePosition {
  epoch: number;
  amount: number;
  apStrike: number;
  exercised: boolean;
}

export interface StraddlesUserData {
  writePositions?: WritePosition[];
  straddlePositions?: StraddlePosition[];
}

interface StraddlesContextInterface {
  straddlesData?: StraddlesData;
  straddlesEpochData?: StraddlesEpochData;
  straddlesUserData?: StraddlesUserData;
  selectedPoolName?: string;
  selectedEpoch?: number;
  updateStraddlesEpochData?: Function;
  updateStraddlesUserData?: Function;
  setSelectedEpoch?: Function;
  setSelectedPoolName?: Function;
}

const initialStraddlesUserData = {};
const initialStraddlesEpochData = {
  startTime: new Date().getTime(),
  expiry: 0,
  usdDeposits: 0,
  activeUsdDeposits: 0,
  strikes: [],
  settlementPrice: 0,
  underlyingPurchased: 0,
};

export const StraddlesContext = createContext<StraddlesContextInterface>({
  straddlesUserData: initialStraddlesUserData,
  straddlesEpochData: initialStraddlesEpochData,
});

export const Straddles = () => {
  const { accountAddress, contractAddresses, provider } =
    useContext(WalletContext);

  const [selectedPoolName, setSelectedPoolName] = useState<string | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(1);
  const [straddlesData, setStraddlesData] = useState<StraddlesData>();
  const [straddlesEpochData, setStraddlesEpochData] =
    useState<StraddlesEpochData>();
  const [straddlesUserData, setStraddlesUserData] =
    useState<StraddlesUserData>();

  const straddlesContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else
      return new ethers.Contract(
        '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
        ABI,
        provider
      );
  }, [provider, selectedPoolName]);

  const updateStraddlesUserData = useCallback(async () => {
    if (selectedEpoch === null || !selectedPoolName || !accountAddress) return;

    const straddlePositions: StraddlePosition[] = [];
    const writePositions: WritePosition[] = [];

    setStraddlesUserData({
      straddlePositions: straddlePositions,
      writePositions: writePositions,
    });
  }, [
    straddlesContract,
    contractAddresses,
    selectedEpoch,
    provider,
    accountAddress,
  ]);

  const updateStraddlesEpochData = useCallback(async () => {
    if (selectedEpoch === null || !selectedPoolName) return;

    let epochData;

    try {
      epochData = await straddlesContract!['epochData'](
        Math.max(selectedEpoch || 0, 1)
      );
    } catch (err) {
      epochData = initialStraddlesEpochData;
    }

    setStraddlesEpochData(epochData);
  }, [straddlesContract, contractAddresses, selectedEpoch, provider]);

  useEffect(() => {
    async function update() {
      let currentEpoch = 0;

      try {
        currentEpoch = await straddlesContract!['currentEpoch']();

        const isEpochExpired = await straddlesContract!['isEpochExpired']();
        if (isEpochExpired) currentEpoch += 1;
      } catch (err) {
        console.log(err);
        return;
      }

      setSelectedEpoch(currentEpoch);

      setStraddlesData({
        currentEpoch: Number(currentEpoch),
        straddlesContract: straddlesContract,
      });
    }

    if (straddlesContract) update();
  }, [contractAddresses, provider, selectedPoolName, straddlesContract]);

  useEffect(() => {
    updateStraddlesUserData();
  }, [updateStraddlesUserData]);

  useEffect(() => {
    updateStraddlesEpochData();
  }, [updateStraddlesEpochData]);

  return {
    straddlesData,
    straddlesEpochData,
    straddlesUserData,
    selectedEpoch,
    updateStraddlesEpochData,
    updateStraddlesUserData,
    setSelectedEpoch,
    setSelectedPoolName,
    selectedPoolName,
  };
};

export const StraddlesProvider = (props: {
  children:
    | string
    | number
    | boolean
    | ReactElement
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  const contextValue = Straddles();

  return (
    // @ts-ignore TODO: FIX
    <StraddlesContext.Provider value={contextValue}>
      {props.children}
    </StraddlesContext.Provider>
  );
};
