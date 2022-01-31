import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Head from 'next/head';
import Box from '@material-ui/core/Box';
import LaunchIcon from '@material-ui/icons/Launch';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import Chart from './components/Chart';
import PageLoader from 'components/PageLoader';

const PreviousUpdatesDialog = ({ data, open, handleClose }) => {
  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h3" className="mb-3">
        Previous Updates
      </Typography>
      <Box className="h-96">
        {data.map((item) => {
          return (
            <Box key={item.timestamp} className="mb-4">
              <Typography variant="h5">
                <span className="text-stieglitz">Price: </span> $ {item.price}
              </Typography>
              <Typography variant="h5">
                <span className="text-stieglitz">Updated At: </span>
                {new Date(item.timestamp * 1000).toUTCString()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Dialog>
  );
};

const PriceCard = ({ data }: { data: any }) => {
  const [dialogState, setDialogState] = useState({ open: false, data: [] });

  return (
    <Box className="border border-umbra rounded p-4 flex flex-col space-y-3">
      <PreviousUpdatesDialog
        data={dialogState.data}
        open={dialogState.open}
        handleClose={() => setDialogState({ data: [], open: false })}
      />
      <Typography variant="h3" className="flex space-x-2 mb-4" component="div">
        <img src={data.imgSrc} alt={data.imgAlt} className="w-8 h-8" />
        <span>{data.tokenSymbol}</span>
      </Typography>
      <Typography variant="h5">
        <span className="text-stieglitz">Current Price: </span>$
        {ethers.utils.formatUnits(data.currentPrice, 8)}
      </Typography>
      {data?.lastUpdated ? (
        <Typography variant="h5">
          <span className="text-stieglitz">Last Updated At: </span>
          {new Date(data.lastUpdated * 1000).toUTCString()}
        </Typography>
      ) : null}
      <a href={data.contractUrl} target="_blank" rel="noopener noreferrer">
        <Typography variant="h5" className="text-stieglitz">
          Contract Explorer Link <LaunchIcon className="w-4 mb-1" />
        </Typography>
      </a>
      {data?.allData ? (
        <>
          <Typography
            variant="h5"
            className="text-wave-blue"
            role="button"
            onClick={() => {
              setDialogState({ open: true, data: data.allData });
            }}
          >
            Previous Updates
          </Typography>
          <Box className="w-100 h-32">
            <Chart data={data.allData} />
          </Box>
        </>
      ) : null}
      <Typography
        variant="h5"
        className="text-stieglitz flex justify-end"
        component="div"
      >
        Powered by <span className="capitalize ml-1">{data.type}</span>
      </Typography>
    </Box>
  );
};

const TOKENS = [
  {
    tokenSymbol: 'DPX',
    type: 'dopex',
    contractUrl:
      'https://arbiscan.io/address/0x252c07e0356d3b1a8ce273e39885b094053137b9',
    imgSrc: '/assets/dpx.svg',
    imgAlt: 'DPX',
  },
  {
    tokenSymbol: 'rDPX',
    type: 'dopex',
    contractUrl:
      'https://arbiscan.io/address/0xC0cdD1176aA1624b89B7476142b41C04414afaa0',
    imgSrc: '/assets/rdpx.svg',
    imgAlt: 'rDPX',
  },
  {
    tokenSymbol: 'BNB',
    type: 'chainlink',
    contractUrl:
      'https://bscscan.com/address/0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
    imgSrc: '/assets/bnb.svg',
    imgAlt: 'BNB',
  },
  {
    tokenSymbol: 'gOHM',
    type: 'chainlink',
    contractUrl:
      'https://arbiscan.io/address/0x6cb7d5bd21664e0201347bd93d66ce18bc48a807',
    imgSrc: '/assets/gohm.svg',
    imgAlt: 'gOHM',
  },
  {
    tokenSymbol: 'GMX',
    type: 'uniswapV3',
    contractUrl:
      'https://arbiscan.io/address/0x60E07B25Ba79bf8D40831cdbDA60CF49571c7Ee0',
    imgSrc: '/assets/gmx.svg',
    imgAlt: 'GMX',
  },
];

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

      const arbProvider = new ethers.providers.InfuraProvider(
        42161,
        process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
      );

      const bscProvider = ethers.getDefaultProvider(
        process.env.NEXT_PUBLIC_BSC_RPC_URL,
        'any'
      );

      const bnbOracle = new ethers.Contract(
        '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
        [
          'function latestRoundData() public view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
        ],
        bscProvider
      );

      const gohmOracle = new ethers.Contract(
        '0x6cb7d5bd21664e0201347bd93d66ce18bc48a807',
        ['function getPriceInUSD() external view returns (uint256)'],
        arbProvider
      );

      const gmxOracle = new ethers.Contract(
        '0x60E07B25Ba79bf8D40831cdbDA60CF49571c7Ee0',
        ['function getPriceInUSD() external view returns (uint256)'],
        arbProvider
      );

      const [bnbData, gohmData, gmxData] = await Promise.all([
        bnbOracle.latestRoundData(),
        gohmOracle.getPriceInUSD(),
        gmxOracle.getPriceInUSD(),
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
        DPX: {
          currentPrice:
            _dopexOraclesData[0][_dopexOraclesData[0].length - 1].twap,
          lastUpdated:
            _dopexOraclesData[0][_dopexOraclesData[0].length - 1].timestamp,
          allData: _dopexOraclesData[0]
            .map((item) => ({
              price: ethers.utils.formatUnits(item.twap, 8),
              timestamp: item.timestamp,
            }))
            .reverse(),
        },
        rDPX: {
          currentPrice:
            _dopexOraclesData[1][_dopexOraclesData[1].length - 1].twap,
          lastUpdated:
            _dopexOraclesData[1][_dopexOraclesData[1].length - 1].timestamp,
          allData: _dopexOraclesData[1]
            .map((item) => ({
              price: Number(ethers.utils.formatUnits(item.twap, 8)),
              timestamp: item.timestamp,
            }))
            .reverse(),
        },
      };

      setState(_state);
    }
    getData();
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Oracles | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        {state ? (
          <>
            <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
              <Typography variant="h1" className="mb-1">
                Oracles
              </Typography>
            </Box>
            <Box className="grid grid-cols-2 gap-20">
              {TOKENS.map((token) => {
                return (
                  <PriceCard
                    key={token.tokenSymbol}
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
