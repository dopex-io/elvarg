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
import UserDeposits from './components/body/UserDeposits';

import { OtcContext } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';

import content from './components/banner/content.json';
import Register from './components/dialogs/Register';

const MARKETS_PLACEHOLDER = [
  // {
  //   symbol: 'DPX',
  //   icon: '/assets/dpx.svg',
  //   asset: 'Dopex Governance Token',
  //   pair: 'DPX/USDT',
  // },
  {
    symbol: 'USDT',
    icon: '/assets/usdt.svg',
    asset: 'USD Tether',
    pair: 'USDT/USDT',
  },
  // {
  //   symbol: 'rDPX',
  //   icon: '/assets/rdpx.svg',
  //   asset: 'Dopex Rebate Token',
  //   pair: 'rDPX/USDT',
  // },
  // {
  //   symbol: 'ETH',
  //   icon: '/assets/eth.svg',
  //   asset: 'Ethereum',
  //   pair: 'ETH/USDT',
  // },
];

const OTC = () => {
  const { user } = useContext(OtcContext);
  const { accountAddress } = useContext(WalletContext);

  const [state, setState] = useState({
    trade: true,
    history: false,
  });
  const [selectedToken, setSelectedToken] = useState(MARKETS_PLACEHOLDER[0]);

  const [dialogState, setDialogState] = useState({
    open: true,
    handleClose: () => {},
  });

  const [isLive, setIsLive] = useState(false);

  const handleUpdateState = useCallback((trade, history) => {
    setState({ trade, history });
  }, []);

  const handleSelection = useCallback((token) => {
    setSelectedToken(token);
  }, []);

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleLiveRfq = useCallback((e) => {
    setIsLive(e.target.checked);
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="OTC" />
      {accountAddress ? (
        <Register open={dialogState.open} handleClose={handleClose} />
      ) : null}
      <Box className="container pt-32 mx-auto px-4 lg:px-0">
        <Box className="grid grid-cols-12 gap-4">
          <Box className="flex flex-col col-span-2">
            <OtcBanner bannerContent={content.banner} />
            <Typography variant="h5" className="text-stieglitz py-3">
              Views
            </Typography>
            <Box className="flex flex-col justify-between space-y-4">
              <Box>
                <Typography
                  variant="h6"
                  role="button"
                  className={`bg-black hover:bg-cod-gray rounded-lg py-4 ${
                    state.trade ? 'bg-cod-gray' : null
                  }`}
                  onClick={() => handleUpdateState(true, false)}
                >
                  <SwapHorizIcon className="mx-2" />
                  Trade
                </Typography>
                <Typography
                  variant="h6"
                  role="button"
                  className={`bg-black rounded-lg py-4 text-stieglitz ${
                    state.history ? 'bg-cod-gray' : null
                  }`}
                  onClick={() => {}}
                  // handleUpdateState(false, true)
                >
                  <HistoryIcon className="mx-2" />
                  History
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
                details={`OTC markets consist of dealer-brokers and counter-parties. 
                Dealer-brokers place orders to sell/buy a certain asset, while counter-parties 
                fulfill these orders via a p2p trade with these brokers via an ongoing open-trade. 
                Settlement prices may be made via an agreement made through negotiations taken place in chatrooms.`}
                footer={<Link to="/portfolio">Read More</Link>}
              />
            </Box>
          </Box>
          <Box className="flex flex-col col-span-8 space-y-4">
            {state.trade ? (
              <>
                <Box className="flex justify-between">
                  <Typography variant="h5" className="font-bold">
                    {isLive ? 'Live Orders' : 'RFQs'}
                  </Typography>
                  <Box className="flex space-x-2 my-auto">
                    <Typography
                      variant="h6"
                      className={`${isLive ? 'text-stieglitz' : 'text-white'}`}
                    >
                      RFQ
                    </Typography>
                    <Switch
                      aria-label="rfq-toggle"
                      color="default"
                      onClick={toggleLiveRfq}
                    />
                    <Typography
                      variant="h6"
                      className={`${!isLive ? 'text-stieglitz' : 'text-white'}`}
                    >
                      Trade
                    </Typography>
                  </Box>
                </Box>
                {isLive ? <LiveRfqTable /> : <IndicativeRfqTable />}
                <Typography variant="h5" className="font-bold">
                  Your Orders
                </Typography>
                <UserDeposits />
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
            <Box className="flex justify-between">
              <Typography variant="h5" className="font-bold">
                {isLive ? 'Trade' : 'Create RFQ'}
              </Typography>
              <Typography
                variant="h6"
                className={`py-0 px-3 rounded-r-2xl rounded-l-2xl border ${
                  isLive
                    ? 'text-down-bad bg-down-bad/[0.3] border-down-bad'
                    : 'text-primary bg-primary/[0.3] border-primary'
                }`}
              >
                {isLive ? 'Trade' : 'RFQ'}
              </Typography>
            </Box>
            <RfqForm isLive={isLive} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OTC;
