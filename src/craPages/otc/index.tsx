import { useState, useContext, useMemo, useCallback } from 'react';
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
import { SsovContext } from 'contexts/Ssov';

import content from './components/banner/content.json';

const MARKETS_PLACEHOLDER = [
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
  {
    symbol: 'ETH',
    icon: '/assets/eth.svg',
    asset: 'Ethereum',
    pair: 'ETH/USDT',
  },
  // {
  //   symbol: 'BTC',
  //   icon: '/assets/btc.svg',
  //   asset: 'Bitcoin',
  //   pair: 'WBTC/USDT',
  // },
];

const OTC = () => {
  const { users, validateUser } = useContext(OtcContext);
  const { userSsovDataArray } = useContext(SsovContext);

  const [state, setState] = useState({
    trade: true,
    history: false,
  });
  const [selectedToken, setSelectedToken] = useState(MARKETS_PLACEHOLDER[0]);
  const [openChat, setOpenChat] = useState({
    id: 0,
    open: false,
  });

  const filteredUserSsovData = useMemo(() => {
    if (selectedToken.symbol === 'DPX') return userSsovDataArray[0];
    else if (selectedToken.symbol === 'rDPX') return userSsovDataArray[1];
    else return userSsovDataArray[2];
  }, [userSsovDataArray, selectedToken]);

  const handleUpdateState = useCallback((trade, history) => {
    setState({ trade, history });
    return;
  }, []);

  const handleSelection = useCallback((token) => {
    setSelectedToken(token);
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="OTC" />
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
              {MARKETS_PLACEHOLDER.map((token, index) => {
                return (
                  <Box
                    key={index}
                    className={`flex hover:bg-cod-gray p-2 rounded-lg ${
                      token.symbol === selectedToken.symbol
                        ? 'bg-cod-gray'
                        : null
                    }`}
                    onClick={() => handleSelection(token)}
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
          <Box className="flex flex-col col-span-8 space-y-4">
            {state.trade ? (
              <>
                <Typography variant="h5" className="font-bold">
                  Available RFQs
                </Typography>
                <RfqTableData setOpenChat={setOpenChat} />
              </>
            ) : (
              <>
                <Typography variant="h5" className="font-bold">
                  Trade History
                </Typography>
                <TradeHistory />
              </>
            )}
          </Box>
          <Box className="flex flex-col col-span-2 space-y-4">
            <Typography variant="h5" className="font-bold">
              Create RFQ
            </Typography>
            {openChat.open ? (
              <Typography variant="h5">Chat Room Placeholder</Typography>
            ) : (
              <RfqForm
                symbol={selectedToken.symbol}
                icon={selectedToken.icon}
                ssovUserData={filteredUserSsovData}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OTC;
