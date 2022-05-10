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

export interface Atlantics {
  token?: string;
  type?: 'CALL' | 'PUT';
}

interface MarketsDataInterface {
  tokenId: string;
  stats: {
    tvl: BigNumber;
    volume: BigNumber;
  };
  pools: {
    poolType: string;
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
  marketsData?: MarketsDataInterface[];
}

const initialMarketsData = [];

const initialAtlanticsObjData = {
  tempBool: false,
  tempBN: BigNumber.from(0),
  tempString: '',
  tempNumber: 0,
};

const initialAtlanticsData = {
  marketsData: initialMarketsData,
  atlanticsObject: initialAtlanticsObjData,
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export const AtlanticsProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  // const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);

  // states
  const [tempObj, setTempObj] = useState<TempObjInterface>();
  const [marketsData, setMarketsData] = useState<MarketsDataInterface[]>([]);

  // callbacks

  const updateTempObject = useCallback(() => {
    if (!provider || !accountAddress || !contractAddresses) return;
    console.log(tempObj);
  }, [tempObj, accountAddress, contractAddresses, provider]);

  const updateMarketsData = useCallback(() => {
    if (!provider || !accountAddress || !contractAddresses) return;

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
            isPut: true,
            tvl: getContractReadableAmount(100023, 18),
            epochLength: 'weekly' as const,
          },
          {
            poolType: 'INSURED STABLES',
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
            isPut: true,
            tvl: getContractReadableAmount(123122, 18),
            epochLength: 'weekly' as const,
          },
          {
            poolType: 'INSURED STABLES',
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
            isPut: true,
            tvl: getContractReadableAmount(52123, 18),
            epochLength: 'weekly' as const,
          },
        ],
      },
    ];

    setMarketsData(data);
  }, [accountAddress, contractAddresses, provider]);

  // useEffects

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
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
