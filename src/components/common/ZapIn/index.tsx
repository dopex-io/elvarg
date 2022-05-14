// @ts-nocheck TODO: FIX
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { BigNumber } from 'ethers';
import { LoaderIcon } from 'react-hot-toast';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import TokenSelector from '../TokenSelector';
import CustomButton from '../../UI/CustomButton';
import Typography from '../../UI/Typography';

import getSymbolFromAddress from 'utils/general/getSymbolFromAddress';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

import ArrowLeftIcon from 'svgs/icons/ArrowLeftIcon';
import SettingsIcon from 'svgs/icons/SettingsIcon';
import CrossIcon from 'svgs/icons/CrossIcon';
import ZapIcon from 'svgs/icons/ZapIcon';
import AlarmIcon from 'svgs/icons/AlarmIcon';
import SwapSymbol from './components/SwapSymbol';
import SwapStep from './components/SwapStep';

export interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setFromTokenSymbol: Function;
  userTokenBalance: BigNumber;
  quote: object;
  slippageTolerance: number;
  setSlippageTolerance: Dispatch<SetStateAction<number>>;
  fromTokenSymbol: string;
  toTokenSymbol: string;
  purchasePower: number;
  selectedTokenPrice: number;
  isInDialog: boolean;
  isPut?: Boolean;
  tokensToExclude?: string[];
  lpPrice?: number;
}

const ZapIn = ({
  setOpen,
  setFromTokenSymbol,
  toTokenSymbol,
  fromTokenSymbol,
  quote,
  slippageTolerance,
  setSlippageTolerance,
  purchasePower,
  selectedTokenPrice,
  isInDialog,
  isPut = false,
  tokensToExclude = [],
  lpPrice = 1,
}: Props) => {
  const { userAssetBalances } = useContext(AssetsContext);
  const { chainId } = useContext(WalletContext);

  const [isTokenSelectorVisible, setIsTokenSelectorVisible] =
    useState<boolean>(false);
  const [swapSymbols, setSwapSymbols] = useState<string[]>([]);
  const [swapSteps, setSwapSteps] = useState<object[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const extractPath = useCallback(() => {
    if (!quote['protocols']) return;
    const symbols = [];
    const steps = [];
    quote['protocols'][0].map((route) => {
      const fromTokenAddress = route[0]['fromTokenAddress'];
      const toTokenAddress = route[0]['toTokenAddress'];
      const fromTokenSymbol = getSymbolFromAddress(fromTokenAddress, chainId);
      let toTokenSymbol = getSymbolFromAddress(toTokenAddress, chainId);
      const step = {
        pair: fromTokenSymbol + ' to ' + toTokenSymbol,
        dexes: [],
      };
      route.map((record) => {
        step['dexes'].push({
          name: record['name'],
          percentage: record['part'],
        });
      });
      steps.push(step);
      if (!symbols.includes(fromTokenSymbol) && fromTokenSymbol)
        symbols.push(fromTokenSymbol);
      if (!symbols.includes(toTokenSymbol) && toTokenSymbol)
        symbols.push(toTokenSymbol);
    });
    setSwapSteps(steps);
    setSwapSymbols(symbols);
  }, [chainId, quote]);

  const handleSave = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    extractPath();
  }, [extractPath, quote]);

  const handleBack = useCallback(() => setOpen(false), [setOpen]);

  const handleOpenSettings = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseSettings = useCallback(() => setAnchorEl(null), []);

  const handleSlippageSlider = useCallback(
    (_e, value: number) => setSlippageTolerance(value),
    [setSlippageTolerance]
  );

  const handleOpenTokenSelector = useCallback(
    () => setIsTokenSelectorVisible(true),
    []
  );

  return (
    <Box>
      {!isTokenSelectorVisible && (
        <Box>
          <Box className="flex flex-row items-center mb-4 pt-1">
            <ArrowLeftIcon
              className={'mr-2 cursor-pointer'}
              onClick={handleBack}
            />
            <Typography variant="h5">Zap In</Typography>
            <Tooltip
              title="Go to advanced mode"
              aria-label="add"
              placement="top"
            >
              <IconButton
                className="p-0 pb-1 mr-0 ml-auto"
                onClick={handleOpenSettings}
                size="large"
              >
                <SettingsIcon
                  className="group"
                  subClassName="group-hover:fill-gray-400"
                />
              </IconButton>
            </Tooltip>
            <Popover
              anchorEl={anchorEl}
              open={!!anchorEl}
              classes={{ paper: 'bg-umbra rounded-md' }}
              onClose={handleCloseSettings}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box className="w-52 p-3">
                <Box className="flex">
                  <Typography
                    variant="h5"
                    className="text-white text-xs pt-1 pb-1"
                  >
                    Max. slippage: {slippageTolerance}%
                  </Typography>
                  <IconButton
                    className="p-0 pb-1 mr-0 ml-auto"
                    onClick={handleCloseSettings}
                    size="large"
                  >
                    <CrossIcon
                      className="group"
                      subClassName="group-hover:fill-white opacity-70"
                    />
                  </IconButton>
                </Box>
                <Slider
                  value={slippageTolerance}
                  min={0.1}
                  max={1}
                  step={0.1}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  onChange={handleSlippageSlider}
                />
              </Box>
            </Popover>
          </Box>
          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-1">
            <Box className="flex flex-row justify-between">
              <Box
                className="h-11 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group"
                onClick={handleOpenTokenSelector}
              >
                <Box className="flex flex-row h-9 w-9 mr-1.5">
                  {fromTokenSymbol !== '' ? (
                    <img
                      src={
                        '/assets/' +
                        fromTokenSymbol.toLowerCase().split('.e')[0] +
                        '.svg'
                      }
                      alt={fromTokenSymbol}
                    />
                  ) : (
                    <LoaderIcon className="mt-3.5 ml-3.5" />
                  )}
                </Box>
                <Typography variant="h5" className="text-white pb-1 pr-1.5">
                  {fromTokenSymbol}
                </Typography>
                <IconButton
                  className="opacity-40 p-0 group-hover:opacity-70"
                  size="large"
                >
                  <ArrowDropDownIcon className={'fill-gray-100 mr-2'} />
                </IconButton>
              </Box>
              <Input
                disableUnderline
                id="zapInAmount"
                name="zapInAmount"
                placeholder="0"
                type="number"
                className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                value={getUserReadableAmount(
                  userAssetBalances[fromTokenSymbol.toLocaleUpperCase()],
                  getTokenDecimals(fromTokenSymbol, chainId)
                ).toFixed(6)}
                readOnly={true}
                classes={{ input: 'text-right' }}
              />
            </Box>
            <Box className="flex flex-row justify-between">
              <Box>
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-1"
                >
                  Swap from
                </Typography>
              </Box>
              <Box className="ml-auto mr-0">
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-1 pr-3"
                >
                  Balance
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className={isInDialog ? 'h-[30.2rem]' : 'h-[20.2rem]'}>
            {fromTokenSymbol !== '' &&
              toTokenSymbol != '' &&
              toTokenSymbol !== fromTokenSymbol && (
                <Box className="rounded-xl col-flex mb-4 p-3 pb-0 border border-neutral-800 w-full">
                  <Box className="flex w-full">
                    <ZapIcon className="mt-1 mr-2" id="3" />
                    <Typography variant="h6" className="text-white font-lg">
                      1 {fromTokenSymbol} ={' '}
                      {quote['toToken']
                        ? formatAmount(
                            getUserReadableAmount(
                              quote['toTokenAmount'],
                              quote['toToken']['decimals']
                            ) /
                              getUserReadableAmount(
                                quote['fromTokenAmount'],
                                quote['fromToken']['decimals']
                              ) /
                              lpPrice,
                            8
                          )
                        : ''}{' '}
                      {isPut ? '2CRV' : toTokenSymbol}{' '}
                      <span className="opacity-70">
                        (~$
                        {formatAmount(selectedTokenPrice, 2)})
                      </span>
                    </Typography>
                  </Box>
                  <Box>
                    <Box className={'flex mb-2 mt-4'}>
                      <Typography
                        variant="h6"
                        className="text-stieglitz ml-0 mr-auto"
                      >
                        Expected Rate
                      </Typography>
                      <Box className={'text-right'}>
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0 pr-1"
                        >
                          {quote['toToken']
                            ? formatAmount(
                                getUserReadableAmount(
                                  quote['toTokenAmount'],
                                  quote['toToken']['decimals']
                                ) /
                                  getUserReadableAmount(
                                    quote['fromTokenAmount'],
                                    quote['fromToken']['decimals']
                                  ) /
                                  lpPrice,
                                18
                              )
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={'flex mb-2 mt-2'}>
                      <Typography
                        variant="h6"
                        className="text-stieglitz ml-0 mr-auto"
                      >
                        Minimum Rate
                      </Typography>
                      <Box className={'text-right'}>
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0 pr-1"
                        >
                          {quote['toToken']
                            ? formatAmount(
                                getUserReadableAmount(
                                  quote['toTokenAmount'],
                                  quote['toToken']['decimals']
                                ) /
                                  getUserReadableAmount(
                                    quote['fromTokenAmount'],
                                    quote['fromToken']['decimals']
                                  ) /
                                  lpPrice /
                                  (1 + slippageTolerance / 100),
                                18
                              )
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={'flex mb-2 mt-2'}>
                      <Typography
                        variant="h6"
                        className="text-stieglitz ml-0 mr-auto"
                      >
                        Max. Slippage Tolerance
                      </Typography>
                      <Box className={'text-right'}>
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0 pr-1"
                        >
                          {formatAmount(slippageTolerance, 2)}%
                        </Typography>
                      </Box>
                    </Box>
                    {quote['toTokenAmount'] ? (
                      <Box className="rounded-md flex flex-col mb-4 p-3 border border-neutral-800 w-full bg-neutral-800 mt-4">
                        <Typography
                          variant="h6"
                          className="text-gray-300 opacity-80"
                        >
                          Router
                        </Typography>
                        <Tooltip
                          classes={{ touch: '!bg-umbra' }}
                          title={
                            <Box className="w-64 pb-3 pt-0 p-2">
                              {swapSteps.map((step) => (
                                <SwapStep
                                  key={step['pair']}
                                  pair={step['pair']}
                                  dexes={step['dexes']}
                                />
                              ))}
                              {isPut ? (
                                <SwapStep
                                  pair="USDC to 2CRV"
                                  dexes={[
                                    {
                                      name: 'ARBITRUM_CURVE',
                                      percentage: '100',
                                    },
                                  ]}
                                />
                              ) : null}
                            </Box>
                          }
                        >
                          <Box className="grid grid-cols-3 gap-3 mt-3">
                            {swapSymbols.map((symbol) => (
                              <SwapSymbol
                                key={symbol}
                                imgSrc={`/assets/${
                                  symbol.toLowerCase().split('.e')[0]
                                }.svg`}
                                imgAlt={symbol}
                                symbol={symbol}
                                isInDialog={isInDialog}
                              />
                            ))}
                            {isPut ? (
                              <SwapSymbol
                                imgSrc="/assets/2crv.svg"
                                imgAlt={'2CRV'}
                                symbol={'2CRV'}
                                isInDialog={isInDialog}
                              />
                            ) : null}
                          </Box>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box className={'mt-4'} />
                    )}
                  </Box>
                </Box>
              )}
          </Box>
          <Box className="rounded-xl p-4 border border-neutral-800 w-full  bg-umbra">
            <Box className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-800 cursor-pointer">
              <Typography variant="h6" className="text-gray-400 opacity-70">
                Purchase Power
              </Typography>
              <Typography variant="h6" className="text-white mr-0 ml-auto">
                {formatAmount(purchasePower, 8)}{' '}
                {quote['toToken'] ? quote['toToken']['symbol'] : toTokenSymbol}
              </Typography>
            </Box>
            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <AlarmIcon />
              </Box>
              <Typography variant="h6" className="text-stieglitz">
                This option will{' '}
                <span className="text-white">Auto Exercise</span> and can be
                settled anytime after expiry.
              </Typography>
            </Box>
            <CustomButton
              size="medium"
              className="w-full mt-4 !rounded-md"
              onClick={handleSave}
              color={'primary'}
            >
              Save
            </CustomButton>
          </Box>
        </Box>
      )}
      {isTokenSelectorVisible && (
        <Box className={isInDialog ? 'h-[52.8rem]' : 'h-[38.8rem]'}>
          <TokenSelector
            open={isTokenSelectorVisible}
            setOpen={setIsTokenSelectorVisible}
            setFromTokenSymbol={setFromTokenSymbol}
            isInDialog={isInDialog}
            tokensToExclude={[toTokenSymbol].concat(tokensToExclude)}
          />
        </Box>
      )}
    </Box>
  );
};

export default ZapIn;
