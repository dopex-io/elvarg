import { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import HistoryIcon from '@material-ui/icons/History';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import OtcBanner from './components/banner';
import IndicativeRfqTable from './components/body/IndicativeRfqTable';
import RfqForm from './components/aside/RfqForm';
import TradeHistory from './components/body/TradeHistory';
import LiveRfqTable from './components/body/LiveRfqTable';
import Switch from 'components/UI/Switch';
import Accordion from 'components/UI/Accordion';
import RecentTrades from './components/body/RecentTrades';

import { SsovContext } from 'contexts/Ssov';
import { OtcContext } from 'contexts/Otc';

import content from './components/banner/content.json';
import Register from './components/dialog/Register';

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
];

const OTC = () => {
  const { userSsovDataArray } = useContext(SsovContext);
  const { user } = useContext(OtcContext);

  const [state, setState] = useState({
    trade: true,
    history: false,
  });
  const [selectedToken, setSelectedToken] = useState(MARKETS_PLACEHOLDER[0]);

  const [dialogState, setDialogState] = useState({
    open: true,
    handleClose: () => {},
  });

  const [displayLive, setDisplayLive] = useState(false);

  const filteredUserSsovData = useMemo(() => {
    if (selectedToken.symbol === 'DPX') return userSsovDataArray[0];
    else if (selectedToken.symbol === 'rDPX') return userSsovDataArray[1];
    else return userSsovDataArray[2];
  }, [userSsovDataArray, selectedToken]);

  const handleUpdateState = useCallback((trade, history) => {
    setState({ trade, history });
  }, []);

  const handleSelection = useCallback((token) => {
    setSelectedToken(token);
  }, []);

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, [user]);

  const toggleLiveRfq = useCallback((e) => {
    setDisplayLive(e.target.checked);
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="OTC" />
      <Register open={dialogState.open} handleClose={handleClose} />
      <Box className="container pt-24 mx-auto px-4 lg:px-0">
        <Box className="grid grid-cols-12 gap-4">
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
            <Accordion
              summary="How does OTC options work?"
              details="OTC markets consist of dealer-brokers and counter-parties. Dealer-brokers place orders to sell/buy a certain option, while counter-parties fulfill these orders via a p2p trade with these brokers via an ongoing open-trade. Settlement prices may be made via an agreement made through negotiations taken place in chatrooms."
              footer={<Link to="/portfolio">Read More</Link>}
            />
          </Box>
          <Box className="flex flex-col col-span-8 space-y-4">
            {state.trade ? (
              <>
                <Box className="flex justify-between">
                  <Typography variant="h5" className="font-bold">
                    Available RFQs
                  </Typography>
                  <Box className="flex space-x-2 my-auto">
                    <Typography
                      variant="caption"
                      className={`${
                        displayLive ? 'text-stieglitz' : 'text-white'
                      }`}
                    >
                      Indicative
                    </Typography>
                    <Switch
                      aria-label="rfq-toggle"
                      color="default"
                      onClick={toggleLiveRfq}
                    />
                    <Typography
                      variant="caption"
                      className={`${
                        !displayLive ? 'text-stieglitz' : 'text-white'
                      }`}
                    >
                      Live
                    </Typography>
                  </Box>
                </Box>
                {displayLive ? <LiveRfqTable /> : <IndicativeRfqTable />}
                <Typography variant="h5" className="font-bold">
                  Recent Trades
                </Typography>
                <RecentTrades />
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
            <RfqForm
              symbol={selectedToken.symbol}
              icon={selectedToken.icon}
              ssovUserData={filteredUserSsovData}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OTC;
