import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import PageLoader from 'components/common/PageLoader';
import OracleCard from 'components/oracles/OracleCard';

import { CHAIN_ID_TO_RPC } from 'constants/index';
import { TOKENS } from 'constants/tokens';

const Oracles = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    async function getData() {
      const payload = await Promise.all([
        axios.get(
          'https://8iiu5p3f28.execute-api.us-east-2.amazonaws.com/default/fetchPriceUpdates?tokenSymbol=DPX'
        ),
        axios.get(
          'https://8iiu5p3f28.execute-api.us-east-2.amazonaws.com/default/fetchPriceUpdates?tokenSymbol=rDPX'
        ),
      ]);

      const _dopexOraclesData = payload.map((item) => {
        return item.data.data;
      });

      const arbProvider = new ethers.providers.StaticJsonRpcProvider(
        CHAIN_ID_TO_RPC[42161]
      );

      const bscProvider = new ethers.providers.StaticJsonRpcProvider(
        CHAIN_ID_TO_RPC[56]
      );

      const avaxProvider = new ethers.providers.StaticJsonRpcProvider(
        CHAIN_ID_TO_RPC[43114]
      );

      const chainlinkAbi = [
        'function latestRoundData() public view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
      ];

      const avaxOracle = new ethers.Contract(
        '0x0A77230d17318075983913bC2145DB16C7366156',
        chainlinkAbi,
        avaxProvider
      );

      const bnbOracle = new ethers.Contract(
        '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
        chainlinkAbi,
        bscProvider
      );

      const oracleAbi = [
        'function getPriceInUSD() external view returns (uint256)',
      ];

      const gohmOracle = new ethers.Contract(
        '0x6cb7d5bd21664e0201347bd93d66ce18bc48a807',
        oracleAbi,
        arbProvider
      );

      const gmxOracle = new ethers.Contract(
        '0x60E07B25Ba79bf8D40831cdbDA60CF49571c7Ee0',
        oracleAbi,
        arbProvider
      );

      const [bnbData, gohmData, gmxData, avaxData] = await Promise.all([
        bnbOracle['latestRoundData'](),
        gohmOracle['getPriceInUSD'](),
        gmxOracle['getPriceInUSD'](),
        avaxOracle['latestRoundData'](),
      ]);

      const _state = {
        BNB: {
          currentPrice: bnbData.answer,
          lastUpdated: bnbData.updatedAt.toNumber(),
        },
        gOHM: {
          currentPrice: gohmData,
        },
        GMX: {
          currentPrice: gmxData,
        },
        AVAX: {
          currentPrice: avaxData.answer,
          lastUpdated: avaxData.updatedAt.toNumber(),
        },
        DPX: {
          currentPrice:
            _dopexOraclesData[0][_dopexOraclesData[0].length - 1].twap,
          lastUpdated:
            _dopexOraclesData[0][_dopexOraclesData[0].length - 1].timestamp,
          allData: _dopexOraclesData[0].map(
            (item: { twap: ethers.BigNumberish; timestamp: any }) => ({
              price: ethers.utils.formatUnits(item.twap, 8),
              timestamp: item.timestamp,
            })
          ),
        },
        rDPX: {
          currentPrice:
            _dopexOraclesData[1][_dopexOraclesData[1].length - 1].twap,
          lastUpdated:
            _dopexOraclesData[1][_dopexOraclesData[1].length - 1].timestamp,
          allData: _dopexOraclesData[1].map(
            (item: { twap: ethers.BigNumberish; timestamp: any }) => ({
              price: Number(ethers.utils.formatUnits(item.twap, 8)),
              timestamp: item.timestamp,
            })
          ),
        },
      };

      // @ts-ignore TODO: FIX
      setState(_state);
    }
    getData();
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        {state ? (
          <>
            <Box className="text-center mx-auto max-w-xl mb-8">
              <Typography variant="h1" className="mb-1">
                Oracles
              </Typography>
            </Box>
            <Box className="grid md:grid-cols-2 gap-20">
              {TOKENS.map((token) => {
                return (
                  <OracleCard
                    key={token.tokenSymbol}
                    // @ts-ignore TODO: FIX
                    data={{ ...token, ...state[token.tokenSymbol] }}
                  />
                );
              })}
            </Box>
          </>
        ) : (
          <PageLoader />
        )}
      </Box>
    </Box>
  );
};

export default Oracles;
