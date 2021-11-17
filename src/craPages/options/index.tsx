import { useRef } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import OptionChain from './components/OptionChain';
import AssetHeader from './components/AssetHeader';
import PurchasePanel from './components/PurchasePanel';

import { OptionsProvider } from 'contexts/Options';

import styles from './styles.module.scss';

const OptionsPage = () => {
  const purchasePanelRef = useRef<HTMLDivElement>();

  const scrollToPurchasePanel = () => {
    purchasePanelRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  return (
    <OptionsProvider>
      <Box className="min-h-screen bg-black">
        <Head>
          <title>Options | Dopex</title>
        </Head>
        <AppBar active="options" />
        <Box
          className={cx(
            'container mx-auto text-white py-16 lg:px-0 px-4',
            styles.containerStyle
          )}
        >
          <AssetHeader />
          <Box className="lg:flex lg:space-x-4 mt-4">
            <Box className="lg:w-3/4 lg:mb-0 mb-4 flex flex-col space-y-2">
              <OptionChain scrollToPurchasePanel={scrollToPurchasePanel} />
            </Box>
            <Box className="lg:w-1/4">
              <PurchasePanel ref={purchasePanelRef} />
            </Box>
          </Box>
        </Box>
      </Box>
    </OptionsProvider>
  );
};

export default OptionsPage;
