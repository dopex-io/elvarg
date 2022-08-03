// @ts-nocheck TODO: FIX
import { useState, useContext, useCallback, useLayoutEffect } from 'react';
import { useWindowSize } from 'react-use';
import Head from 'next/head';
import Box from '@mui/material/Box';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AppBar from 'components/common/AppBar';
import OtcBanner from 'components/otc/OtcBanner';
import RfqForm from 'components/otc/RfqForm';
import Register from 'components/otc/Dialogs/Register';
import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Orders from 'components/otc/body/Orders';
import TradeHistory from 'components/otc/body/TradeHistory';
import content from 'components/otc/OtcBanner/content.json';

import { OtcContext, OtcProvider } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';
import { otcGraphClient } from 'graphql/apollo';
import { ApolloProvider } from '@apollo/client';

const MARKETS_PLACEHOLDER = [
  {
    symbol: 'USDC',
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    icon: '/assets/USDC.svg',
  },
];

const OTC = () => {
  const { user, escrowData, setSelectedQuote } = useContext(OtcContext);
  const { accountAddress } = useContext(WalletContext);
  const { width } = useWindowSize();

  const [state, setState] = useState({
    trade: true,
    history: false,
  });
  const [smViewport, setSmViewport] = useState(false);

  const [selectedQuoteAsset, setSelectedQuoteAsset] = useState(
    MARKETS_PLACEHOLDER[0]
  );

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
      setSelectedQuoteAsset(token);
      setSelectedQuote({
        address: token.address,
        symbol: token.symbol,
      });
    },
    [setSelectedQuote]
  );

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  useLayoutEffect(() => {
    setSmViewport(width < 1024);
  }, [width]);

  return (
    <Box className="bg-black h-screen">
      <Head>
        <title>OTC | Dopex</title>
      </Head>
      <AppBar active="OTC" />
      {!user && accountAddress ? (
        <Register open={dialogState.open} handleClose={handleClose} />
      ) : null}
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-full">
        {!smViewport ? (
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
                      <Typography variant="h6" className="text-primary">
                        {content.banner.bottomElementText} &rarr;
                      </Typography>
                    </a>
                  </CustomButton>
                }
              />
              <Typography variant="h6" className="text-stieglitz py-3">
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
                      variant="h6"
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
                        variant="h6"
                        role="button"
                        className="rounded-lg py-4"
                      >
                        History
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" className="text-stieglitz py-3">
                    Markets
                  </Typography>
                  {escrowData.quotes?.map((asset, index) => {
                    return (
                      <Box
                        key={index}
                        className={`flex hover:bg-cod-gray p-2 rounded-lg ${
                          asset.symbol === selectedQuoteAsset.symbol
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
                          variant="h6"
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
                <Orders
                  smViewport={smViewport}
                  isLive={isLive}
                  toggleLiveRfq={toggleLiveRfq}
                />
              ) : (
                <TradeHistory smViewport={smViewport} />
              )}
            </Box>
            <RfqForm isLive={isLive} selectedQuote={selectedQuoteAsset} />
          </Box>
        ) : (
          <Box className="space-y-6">
            <Box className="mx-auto text-center space-y-2">
              <Typography variant="h2">Dopex OTC</Typography>
              <Typography variant="h5" className="text-stieglitz">
                Trade Dopex Options over-the-counter with other users.
              </Typography>
            </Box>
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
                    <Typography variant="h6" className="text-primary">
                      {content.banner.bottomElementText} &rarr;
                    </Typography>
                  </a>
                </CustomButton>
              }
            />
            <Accordion
              TransitionProps={{ unmountOnExit: true }}
              className="bg-cod-gray shadow-none border border-umbra rounded-xl"
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon className="fill-current text-white" />
                }
              >
                <Typography variant="h5" className="text-white">
                  {isLive ? 'Place Live Order' : 'Create RFQ'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RfqForm isLive={isLive} selectedQuote={selectedQuoteAsset} />
              </AccordionDetails>
            </Accordion>
            <Orders
              smViewport={smViewport}
              isLive={isLive}
              toggleLiveRfq={toggleLiveRfq}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

const OTCPage = () => {
  // return (
  //   <ApolloProvider client={otcGraphClient}>
  //     <OtcProvider>
  //       <OTC />
  //     </OtcProvider>
  //   </ApolloProvider>
  // );

  return <></>;
};

export default OTCPage;
