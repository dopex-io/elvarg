import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { BigNumber } from 'ethers';
// import axios from 'axios';

import { WalletContext } from './Wallet';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
// import { ERC20__factory } from '@dopex-io/sdk';

export interface Atlantics {
  token?: string;
  type?: 'CALL' | 'PUT';
}

interface AtlanticPoolData {
  tickSize: BigNumber;
  unwindFeePercentage: BigNumber;
  fundingRate: BigNumber;
  gracePeriod: BigNumber;
  collateral: string;
  quoteAsset: string;
}

interface AtlanticPoolEpochDataInterface {
  epoch: number;
  pool: string;
  isBootstrapped: boolean;
  isEpochExpired: boolean;
  startTime: number;
  expiryTime: number;
  epochStrikeToken: string;
  totalEpochStrikeDeposits: BigNumber;
}

interface UserPositionInterface {
  maxStrike: BigNumber;
  userDeposit: BigNumber;
  epoch: number;
}

interface UserAtlanticsDataInterface {
  userPositions: UserPositionInterface[];
}

interface MarketsDataInterface {
  tokenId: string;
  stats?: { [key: string]: BigNumber };
  pools: {
    poolType: string;
    underlying: string;
    isPut: boolean;
    tvl: BigNumber;
    epochLength: 'daily' | 'weekly' | 'monthly';
  }[];
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
  atlanticPoolEpochData?: AtlanticPoolEpochDataInterface;
  userAtlanticsData?: UserAtlanticsDataInterface;
  selectedMarket: string;
  setSelectedMarket: (tokenId: string) => void;
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
  startTime: 0,
  expiryTime: 0,
  epochStrikeToken: '',
  totalEpochStrikeDeposits: BigNumber.from(0),
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
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export const AtlanticsProvider = (props: any) => {
  const { accountAddress, contractAddresses, chainId, provider /*, signer */ } =
    useContext(WalletContext);

  // const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);

  // states
  // @ts-ignore todo: FIX
  const [tempObj, setTempObj] = useState<TempObjInterface>();
  const [marketsData, setMarketsData] = useState<MarketsDataInterface[]>([]);
  const [atlanticPoolEpochData, setAtlanticPoolEpochData] =
    useState<AtlanticPoolEpochDataInterface>({
      ...initialAtlanticPoolEpochData,
    });
  // const [userAtlanticsData, setUserAtlanticsData] =
  //   useState<UserAtlanticsDataInterface>();
  const [selectedMarket, setSelectedMarket] = useState('');

  // callbacks

  const updateTempObject = useCallback(() => {
    if (!provider || !accountAddress || !contractAddresses) return;
    console.log(tempObj);
  }, [tempObj, accountAddress, contractAddresses, provider]);

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
            tvl: getContractReadableAmount(100023, 18),
            epochLength: 'weekly' as const,
          },
          {
            poolType: 'INSURED STABLES',
            underlying: 'USDC',
            isPut: true,
            tvl: getContractReadableAmount(2223, 18),
            epochLength: 'daily' as const,
          },
        ],
      },
      {
        tokenId: 'DPX',
        stats: {
          tvl: getContractReadableAmount(324341, 18), // redundant, get total tvl from sum via pools
          volume: getContractReadableAmount(3, 18),
        },
        pools: [
          {
            poolType: 'PERPETUALS',
            underlying: 'USDC',
            isPut: true,
            tvl: getContractReadableAmount(123122, 18),
            epochLength: 'weekly' as const,
          },
          {
            poolType: 'INSURED STABLES',
            underlying: 'ETH',
            isPut: false,
            tvl: getContractReadableAmount(201219, 18),
            epochLength: 'monthly' as const,
          },
        ],
      },
      {
        tokenId: 'RDPX',
        stats: {
          tvl: getContractReadableAmount(52123, 18),
          volume: getContractReadableAmount(2132, 18),
        },
        pools: [
          {
            poolType: 'PERPETUALS',
            underlying: 'USDC',
            isPut: true,
            tvl: getContractReadableAmount(52123, 18),
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

      // const contractAddress =
      //   contractAddresses[chainId]['AtlanticPools'][tokenId];

      const currentEpoch = 1; // fetch from contract or pass from frontend selector

      setAtlanticPoolEpochData({
        pool: '0x0000000000000000000000000000000000000000', // contractAddress,
        epoch: currentEpoch,
        isBootstrapped: true,
        isEpochExpired: false,
        startTime: 1652370455, // epochStartTimes[currentEpoch]
        expiryTime: 1654962455, // epochExpiryTimes[currentEpoch],
        epochStrikeToken: '0x0000000000000000000000000000000000000000', // epochStrikeTokens[currentEpoch],
        totalEpochStrikeDeposits: BigNumber.from(0),
        // fundingRate: BigNumber.from(0),
      });
    },
    [accountAddress, contractAddresses, provider, chainId]
  );

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

  const contextValue = {
    atlanticsBool: true,
    marketsData,
    atlanticsObj: {},
    atlanticPoolEpochData,
    selectedMarket,
    setSelectedMarket,
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
