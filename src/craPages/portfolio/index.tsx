import { useState, useLayoutEffect } from 'react';
import { useWindowSize } from 'react-use';
import Box from '@material-ui/core/Box';
import cx from 'classnames';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import AppBar from 'components/AppBar';
import OptionsBalances from './components/OptionBalances';
import AssetBalances from './components/AssetBalances';
import Typography from 'components/UI/Typography';
import TradeHistory from './components/TradeHistory';
import RewardsAndRebates from './components/RewardsAndRebates';

import { PortfolioProvider } from 'contexts/Portfolio';

import styles from './styles.module.scss';

const Portfolio = () => {
  const { width } = useWindowSize();
  const [state, setState] = useState('Assets');
  const [smViewport, setSmViewport] = useState(false);

  const handleClick = (event) => {
    setState(event.target.innerHTML);
  };
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextState: string
  ) => {
    if (nextState !== null) setState(nextState);
  };

  useLayoutEffect(() => {
    width < 768 ? setSmViewport(true) : setSmViewport(false);
  }, [width]);

  return (
    <PortfolioProvider>
      <Box className=" bg-black flex flex-col min-h-screen">
        <AppBar active="portfolio" />
        <Box
          className={cx(
            'mx-auto flex flex-col container py-16 lg:px-0 px-4',
            styles.containerStyle
          )}
        >
          <Box className="mb-5">
            <Typography variant="h1" className="text-4xl text-white">
              Portfolio
            </Typography>
            <Typography variant="h5" className="text-stieglitz py-3">
              Review your assets & purchased options. Check your trade history
              and accrued rewards.
            </Typography>
          </Box>
          {smViewport ? (
            <>
              <ToggleButtonGroup
                exclusive
                className="bg-umbra grid grid-flow-col grid-col-3 p-1 rounded-md mb-3"
                onChange={handleChange}
                value={state}
              >
                <ToggleButton
                  className={`mr-1 rounded-md border-none text-stieglitz`}
                  onClick={handleClick}
                  value="Assets"
                >
                  <Typography variant="h6" onClick={handleClick}>
                    Assets
                  </Typography>
                </ToggleButton>
                <ToggleButton
                  className={`mr-1 rounded-md border-none text-stieglitz`}
                  onClick={handleClick}
                  value="Options"
                >
                  <Typography variant="h6" onClick={handleClick}>
                    Options
                  </Typography>
                </ToggleButton>
                <ToggleButton
                  className={`rounded-md border-none text-stieglitz`}
                  onClick={handleClick}
                  value="History"
                >
                  <Typography variant="h6" onClick={handleClick}>
                    History
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
              {state === 'Assets' ? (
                <>
                  <Box className="flex flex-col tables lg:w-1/4">
                    <AssetBalances />
                    <RewardsAndRebates />
                  </Box>
                </>
              ) : (
                <Box className="flex flex-col tables lg:w-3/4">
                  {state === 'Options' ? (
                    <OptionsBalances />
                  ) : state === 'History' ? (
                    <TradeHistory />
                  ) : (
                    <></>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Box className="text-white flex flex-col lg:flex-row h-100 w-full">
              <Box className="flex flex-col tables lg:w-1/4">
                <AssetBalances />
                <RewardsAndRebates />
              </Box>
              <Box className="flex flex-col tables lg:w-3/4">
                <OptionsBalances />
                <TradeHistory />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </PortfolioProvider>
  );
};

export default Portfolio;
