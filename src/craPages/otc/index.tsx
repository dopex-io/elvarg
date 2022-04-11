import { useState, useContext, useCallback } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';
import Typography from '@mui/material/Typography';

import AppBar from 'components/AppBar';
import OtcBanner from './components/OtcBanner';
import RfqForm from './components/RfqForm';
import Register from './components/Dialogs/Register';
import CustomButton from 'components/UI/CustomButton';
import content from './components/OtcBanner/content.json';

import { OtcContext } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';
import Orders from './body/Orders';
import TradeHistory from './body/TradeHistory';

const MARKETS_PLACEHOLDER = [
  {
    symbol: 'USDT',
    icon: '/assets/usdt.svg',
    asset: 'USD Tether',
    pair: 'USDT/USDT',
  },
];

const OTC = () => {
  const { user, escrowData, setSelectedQuote } = useContext(OtcContext);
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

  const toggleLiveRfq = useCallback((e) => {
    setIsLive(e.target.checked);
  }, []);

  const handleUpdateState = useCallback((trade, history) => {
    setState({ trade, history });
  }, []);

  const handleSelection = useCallback(
    (token) => {
      setSelectedToken(token);
      setSelectedQuote({
        address: '',
        symbol: token,
      });
    },
    [setSelectedQuote]
  );

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  return (
    <Box className="bg-black h-screen">
      <Head>
        <title>OTC | Dopex</title>
      </Head>
      <AppBar active="OTC" />
      {accountAddress ? (
        <Register open={dialogState.open} handleClose={handleClose} />
      ) : null}
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-full">
        <Box className="grid grid-cols-10 gap-4">
          <Box className="flex flex-col col-span-2 mt-10">
            <OtcBanner
              title={content.banner.title}
              body={content.banner.body}
              bottomElement={
                <CustomButton
                  variant="contained"
                  size="small"
                  color="white"
                  className="bg-white hover:bg-white p-0"
                >
                  <a
                    href="https://chat.blockscan.com/start"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    <Typography variant="body2" className="text-primary">
                      {content.banner.bottomElementText} &rarr;
                    </Typography>
                  </a>
                </CustomButton>
              }
            />
            <Typography variant="body2" className="text-stieglitz py-3">
              Views
            </Typography>
            <Box className="flex flex-col justify-between space-y-4">
              <Box className="flex flex-col">
                <Box
                  role="button"
                  className={`flex space-x-4 p-2 rounded-xl ${
                    state.trade ? 'bg-cod-gray' : null
                  }`}
                  onClick={() => handleUpdateState(true, false)}
                >
                  <SwapHorizIcon className="my-auto" />
                  <Typography
                    variant="body2"
                    className={`hover:bg-cod-gray rounded-lg py-4`}
                  >
                    Trade
                  </Typography>
                </Box>

                <Box
                  role="button"
                  className={`flex space-x-4 p-2 rounded-xl ${
                    state.history ? 'bg-cod-gray' : null
                  }`}
                  onClick={() => handleUpdateState(false, true)}
                >
                  <HistoryIcon className="my-auto" />
                  <Box className="flex space-x-2">
                    <Typography
                      variant="body2"
                      role="button"
                      className="rounded-lg py-4"
                    >
                      History
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" className="text-stieglitz py-3">
                  Markets
                </Typography>
                {escrowData.quotes?.map((asset, index) => {
                  return (
                    <Box
                      key={index}
                      className={`flex hover:bg-cod-gray p-2 rounded-lg ${
                        asset.symbol === selectedToken.symbol
                          ? 'bg-cod-gray'
                          : null
                      }`}
                      onClick={() => handleSelection(asset)}
                    >
                      <img
                        src={`/assets/${asset.symbol.toLowerCase()}.svg`}
                        alt={`${asset.symbol}`}
                        className="p-2 h-12"
                      />
                      <Typography
                        variant="body2"
                        className="self-center"
                      >{`${asset.symbol}`}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col col-span-6 space-y-4">
            {state.trade ? (
              <Orders isLive={isLive} toggleLiveRfq={toggleLiveRfq} />
            ) : (
              <TradeHistory />
            )}
          </Box>
          <RfqForm isLive={isLive} />
        </Box>
      </Box>
    </Box>
  );
};

export default OTC;
