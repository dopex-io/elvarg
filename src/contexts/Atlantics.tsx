import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { BigNumber } from 'ethers';

import { WalletContext } from './Wallet';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

// export interface Atlantics {
//   token?: string;
//   type?: 'CALL' | 'PUT';
// }

// All relevant getter functions in AtlanticPutsPool contract
// getLiquidityForStrike(strike, epoch)
// getCumulativeLiquidity(epoch)
// getUserMaxStrikeDeposits(user, maxStrike)
// getMaxStrike(maxStrike, epoch) // getter for maxStrikesData array in AtlanticPoolEpochData interface below
// getFundingRate()
// getUtilizationRate()
// getUserMaxStrikesCollaterals(user, epoch)
// function getMaxStrikesCollateral(user, index, epoch)
// getMaxStrikeDeposits(epoch, maxStrike)

interface AtlanticPoolData {
  tickSize: BigNumber;
  unwindFeePercentage: BigNumber;
  fundingRate: BigNumber;
  gracePeriod: BigNumber;
  collateral: string; // base
  quoteAsset: string; // quote
}

interface AtlanticPoolEpochData {
  epoch: number;
  pool: string;
  isBootstrapped: boolean;
  isEpochExpired: boolean;
  epochTimes: { [key: string]: BigNumber };
  // epochStrikeToken: string;
  // totalEpochMaxStrikeDeposits: BigNumber[]; // req. totalEpochDeposits
  // totalEpochMaxStrikeActiveCollaterals: BigNumber[];
  maxStrikesData: {
    [key: string]: BigNumber; // Max strike -> max strike data
  }[];
}

interface UserPositionInterface {
  maxStrike: BigNumber;
  userDeposit: BigNumber;
  epoch: number;
  feeCollected: BigNumber;
}

interface UserAtlanticsData {
  userPositions: UserPositionInterface[];
}

interface MarketsDataInterface {
  tokenId: string;
  stats: { [key: string]: BigNumber };
  pools: {
    poolType: string; // Strategy
    underlying: string;
    isPut: boolean; // PUT / CALL
    epoch: BigNumber; //
    tvl: BigNumber;
    epochLength: 'daily' | 'weekly' | 'monthly'; // AP expiryType
  }[];
  // pools: AtlanticPoolData[];
}

interface TempObjInterface {
  tempBool: boolean;
  tempBN: BigNumber;
  tempString: string;
  tempNumber: number;
}

interface AtlanticsContextInterface {
  atlanticsObject?: TempObjInterface;
  marketsData: MarketsDataInterface[];
  atlanticPoolData?: AtlanticPoolData;
  atlanticPoolEpochData?: AtlanticPoolEpochData;
  userAtlanticsData?: UserAtlanticsData;
  selectedMarket: string;
  setSelectedMarket: (tokenId: string) => void;
  selectedEpoch: number;
  setSelectedEpoch: (epoch: number) => void;
}

const initialMarketsData: MarketsDataInterface[] = [];

const initialAtlanticPoolData = {
  tickSize: BigNumber.from(0),
  unwindFeePercentage: BigNumber.from(0),
  fundingRate: BigNumber.from(0),
  gracePeriod: BigNumber.from(0),
  collateral: '',
  quoteAsset: '',
};

const initialAtlanticPoolEpochData = {
  epoch: 0,
  pool: '',
  isBootstrapped: false,
  isEpochExpired: false,
  epochTimes: { startTime: BigNumber.from(0), expiryTime: BigNumber.from(0) },
  // epochStrikeToken: '',
  totalEpochMaxStrikeDeposits: [BigNumber.from(0)],
  maxStrikesData: [
    {
      strikePrice: BigNumber.from(0),
      liquidity: BigNumber.from(0),
      liquidityBalance: BigNumber.from(0),
      premiumCollected: BigNumber.from(0),
      fundingCollected: BigNumber.from(0),
      unwindFeesCollected: BigNumber.from(0),
      underlyingCollected: BigNumber.from(0),
    },
  ],
};

const initialUserAtlanticsData = {
  userPositions: [],
};

const initialAtlanticsObjData = {
  tempBool: false,
  tempBN: BigNumber.from(0),
  tempString: '',
  tempNumber: 0,
};

const initialAtlanticsData = {
  atlanticsObject: initialAtlanticsObjData,
  marketsData: initialMarketsData,
  atlanticPoolData: initialAtlanticPoolData,
  atlanticPoolEpochData: initialAtlanticPoolEpochData,
  userAtlanticsData: initialUserAtlanticsData,
  selectedMarket: '',
  setSelectedMarket: () => {},
  selectedEpoch: 0,
  setSelectedEpoch: () => {},
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export const AtlanticsProvider = (props: any) => {
  const { accountAddress, contractAddresses, chainId, provider /*, signer */ } =
    useContext(WalletContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number>(0);

  // states
  // @ts-ignore todo: FIX
  const [tempObj, setTempObj] = useState<TempObjInterface>();
  const [marketsData, setMarketsData] = useState<MarketsDataInterface[]>([]);
  const [atlanticPoolData, setAtlanticPoolData] = useState<AtlanticPoolData>(
    initialAtlanticPoolData
  );
  const [atlanticPoolEpochData, setAtlanticPoolEpochData] =
    useState<AtlanticPoolEpochData>(initialAtlanticPoolEpochData);
  const [userAtlanticsData, setUserAtlanticsData] = useState<UserAtlanticsData>(
    initialUserAtlanticsData
  );
  const [selectedMarket, setSelectedMarket] = useState('');

  // callbacks

  const updateTempObject = useCallback(() => {
    if (!provider || !accountAddress || !contractAddresses) return;
    console.log(tempObj);
  }, [tempObj, accountAddress, contractAddresses, provider]);

  // Fetch from Dopex API (?)
  const updateMarketsData = useCallback(async () => {
    if (!provider || !accountAddress || !contractAddresses) return;

    // Mock Data
    const data = [
      {
        tokenId: 'ETH',
        stats: {
          tvl: getContractReadableAmount(102246, 18),
          volume: getContractReadableAmount(5453, 18),
        },
        pools: [
          {
            poolType: 'PERPETUALS',
            underlying: 'USDC',
            isPut: true,
            epoch: BigNumber.from(1),
            tvl: getContractReadableAmount(100023, 18),
            epochLength: 'weekly' as const,
          },
        ],
      },
    ];

    setMarketsData(data);
  }, [accountAddress, contractAddresses, provider]);

  const updateAtlanticPoolData = useCallback(
    async (tokenId: string) => {
      if (!accountAddress || !contractAddresses || !provider || !chainId)
        return;

      console.log(tokenId);

      setAtlanticPoolData({
        tickSize: BigNumber.from(0),
        unwindFeePercentage: BigNumber.from(0),
        fundingRate: BigNumber.from(0),
        gracePeriod: BigNumber.from(0),
        collateral: 'ETH', // base
        quoteAsset: 'USDC',
      });
    },
    [accountAddress, contractAddresses, provider, chainId]
  );

  const updateAtlanticPoolEpochData = useCallback(
    (epoch: number) => {
      if (!provider || !contractAddresses || epoch === 0) return;

      // const contractAddress =
      //   contractAddresses[chainId]['AtlanticPools'][tokenId];

      // const currentEpoch = 1; // fetch from contract or pass from frontend selector

      setAtlanticPoolEpochData({
        pool: '0x0000000000000000000000000000000000000000', // contractAddress,
        epoch,
        isBootstrapped: true,
        isEpochExpired: false,
        epochTimes: {
          startTime: BigNumber.from(1652370455), // epochStartTimes[currentEpoch]
          expiryTime: BigNumber.from(1654962455), // epochExpiryTimes[currentEpoch]
        },
        maxStrikesData: [
          {
            strikePrice: BigNumber.from(2000),
            liquidity: BigNumber.from(10000),
            liquidityBalance: BigNumber.from(1000),
            premiumCollected: BigNumber.from(60),
            fundingCollected: BigNumber.from(2),
            unwindFeesCollected: BigNumber.from(2),
            underlyingCollected: BigNumber.from(4),
          },
          {
            strikePrice: BigNumber.from(1750),
            liquidity: BigNumber.from(7000),
            liquidityBalance: BigNumber.from(1000),
            premiumCollected: BigNumber.from(30),
            fundingCollected: BigNumber.from(1),
            unwindFeesCollected: BigNumber.from(1),
            underlyingCollected: BigNumber.from(3),
          },
          {
            strikePrice: BigNumber.from(1500),
            liquidity: BigNumber.from(5000),
            liquidityBalance: BigNumber.from(1000),
            premiumCollected: BigNumber.from(1),
            fundingCollected: BigNumber.from(1),
            unwindFeesCollected: BigNumber.from(1),
            underlyingCollected: BigNumber.from(2),
          },
        ],
      });
    },
    [contractAddresses, provider]
  );

  // User positions across all pools
  // @ts-ignore todo: fix unused declaration
  const updateUserAtlanticsData = useCallback(async () => {
    if (!accountAddress || !contractAddresses || !provider || !chainId) return;

    setUserAtlanticsData({
      userPositions: [
        {
          maxStrike: BigNumber.from(2000),
          userDeposit: BigNumber.from(1200),
          feeCollected: BigNumber.from(1),
          epoch: 1,
        },
        {
          maxStrike: BigNumber.from(1750),
          userDeposit: BigNumber.from(100),
          feeCollected: BigNumber.from(0),
          epoch: 1,
        },
      ],
    });
  }, [accountAddress, chainId, contractAddresses, provider]);

  // useEffects

  useEffect(() => {
    if (!selectedMarket) return;
    updateAtlanticPoolData(selectedMarket);
  }, [updateAtlanticPoolData, selectedMarket]);

  useEffect(() => {
    updateTempObject();
  }, [updateTempObject]);

  useEffect(() => {
    updateMarketsData();
  }, [updateMarketsData]);

  useEffect(() => {
    updateAtlanticPoolEpochData(selectedEpoch);
  }, [selectedEpoch, updateAtlanticPoolEpochData]);

  const contextValue = {
    atlanticsBool: true,
    marketsData,
    atlanticsObj: {},
    userAtlanticsData,
    atlanticPoolData,
    atlanticPoolEpochData,
    selectedMarket,
    setSelectedMarket,
    selectedEpoch,
    setSelectedEpoch,
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
