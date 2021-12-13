import { useState, useCallback, useContext } from 'react';
import Box from '@material-ui/core/Box';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import HistoryIcon from '@material-ui/icons/History';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import OtcBanner from './components/banner';
import RfqTableData from './components/body/RfqTableData';
import RfqForm from './components/aside/RfqForm';
import TradeHistory from './components/body/TradeHistory';

import { OtcContext } from 'contexts/Otc';

import content from './components/banner/content.json';

const MARKETS_PLACEHOLDER = [
  {
    symbol: 'ETH',
    icon: '/assets/eth.svg',
    asset: 'Ethereum',
    pair: 'ETH/USDT',
  },
  {
    symbol: 'BTC',
    icon: '/assets/btc.svg',
    asset: 'Bitcoin',
    pair: 'WBTC/USDT',
  },
  {
    symbol: 'DPX',
    icon: '/assets/dpx.svg',
    asset: 'Dopex Governance Token',
    pair: 'DPX/USDT',
  },
  {
    symbol: 'rDPX',
    icon: '/assets/rdpx.svg',
    asset: 'Dopex Rebate Token',
    pair: 'rDPX/USDT',
  },
];

const OTC = () => {
  const { users, validateUser } = useContext(OtcContext);

  const [state, setState] = useState({
    trade: true,
    history: false,
  });

  const handleUpdateState = useCallback((trade, history) => {
    setState({ trade, history });
    return;
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="otc" />
      <Box className="container pt-24 mx-auto px-4 lg:px-0">
        <Box className="grid grid-cols-12 h-full gap-4">
          <Box className="flex flex-col col-span-2">
            <OtcBanner bannerContent={content.OTCIntro} />
            <Typography variant="h5" className="text-stieglitz py-3">
              Views
            </Typography>
            <Box className="grid grid-rows-2">
              <Typography
                variant="h6"
                role="button"
                className={`bg-black hover:bg-cod-gray rounded-lg py-4 ${
                  state.trade ? 'bg-cod-gray' : null
                }`}
                onClick={() => handleUpdateState(true, false)}
              >
                <SwapHorizIcon className="mx-2" />
                {'Trade'}
              </Typography>
              <Typography
                variant="h6"
                role="button"
                className={`bg-black hover:bg-cod-gray rounded-lg py-4 ${
                  state.history ? 'bg-cod-gray' : null
                }`}
                onClick={() => handleUpdateState(false, true)}
              >
                <HistoryIcon className="mx-2" />
                {'History'}
              </Typography>
              <Typography variant="h5" className="text-stieglitz py-3">
                Markets
              </Typography>
              {/* <Typography
                variant="h6"
                role="button"
                className="bg-black hover:bg-cod-gray rounded-lg py-4 flex"
              >
                <img src="/assets/eth.svg" alt="Ethereum" />
                <Typography variant="h6" className="flex-col">
                  {'ETH'}
                </Typography>
              </Typography> */}
              {MARKETS_PLACEHOLDER.map((token, index) => {
                return (
                  <Box
                    key={index}
                    className="flex hover:bg-cod-gray p-2 rounded-lg"
                    onClick={() => {}}
                  >
                    <img
                      src={`${token.icon}`}
                      alt={`${token.asset}`}
                      className="p-2 h-12"
                    />
                    <Box className="flex flex-col" role="button">
                      <Typography variant="h5">{`${token.symbol}`}</Typography>
                      <Typography
                        variant="h6"
                        className="text-stieglitz"
                      >{`${token.asset}`}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box className="flex flex-col col-span-8">
            {state.trade ? <RfqTableData /> : <TradeHistory />}
          </Box>
          <Box className="flex flex-col col-span-2">
            <RfqForm selectedAsset={'DPX'} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OTC;
