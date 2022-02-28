import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { BigNumber } from 'ethers';
import { LoaderIcon } from 'react-hot-toast';
import { ERC20 } from '@dopex-io/sdk';
import { WalletContext } from '../../contexts/Wallet';
import { AssetsContext, IS_NATIVE } from '../../contexts/Assets';
import TokenSelector from '../TokenSelector';
import CustomButton from '../UI/CustomButton';
import Typography from '../UI/Typography';
import getSymbolFromAddress from '../../utils/general/getSymbolFromAddress';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import getDecimalsFromSymbol from '../../utils/general/getDecimalsFromSymbol';
import formatAmount from '../../utils/general/formatAmount';
import ArrowLeftIcon from '../Icons/ArrowLeftIcon';
import SettingsIcon from '../Icons/SettingsIcon';
import CrossIcon from '../Icons/CrossIcon';
import ZapIcon from '../Icons/ZapIcon';
import SmallArrowDownIcon from '../Icons/SmallArrowDownIcon';
import SmallArrowUpIcon from '../Icons/SmallArrowUpIcon';
import AlarmIcon from '../Icons/AlarmIcon';

export interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<ERC20 | string>>;
  token: ERC20 | any;
  userTokenBalance: BigNumber;
  quote: object;
  slippageTolerance: number;
  setSlippageTolerance: Dispatch<SetStateAction<number>>;
  tokenName: string;
  ssovTokenName: string;
  purchasePower: number;
  selectedTokenPrice: number;
  isInDialog: boolean;
  ssovToken: ERC20;
}

const ZapIn = ({
  setOpen,
  setToken,
  ssovTokenName,
  tokenName,
  quote,
  slippageTolerance,
  setSlippageTolerance,
  purchasePower,
  selectedTokenPrice,
  isInDialog,
  ssovToken,
}: Props) => {
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] =
    useState<boolean>(false);
  const [swapSymbols, setSwapSymbols] = useState<string[]>([]);
  const [swapSteps, setSwapSteps] = useState<object[]>([]);
  const { chainId } = useContext(WalletContext);
  const { userAssetBalances } = useContext(AssetsContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSwapSteps, setShowSwapSteps] = useState<boolean>(true);

  const getDEXfrom1InchName = (name) => {
    const parser = {
      ARBITRUM_UNISWAP_V3: {
        name: 'Uniswap V3',
        picture: 'uniswap.svg',
      },
      ARBITRUM_BALANCER_V2: {
        name: 'Balancer V2',
        picture: 'balancer.svg',
      },
      ARBITRUM_SUSHISWAP: {
        name: 'Sushiswap',
        picture: 'sushiswap.svg',
      },
      ARBITRUM_CURVE: {
        name: 'Curve',
        picture: 'curve.svg',
      },
      ARBITRUM_DODO: {
        name: 'DODO',
        picture: 'dodo.svg',
      },
      TRADERJOE: {
        name: 'Trader JOE',
        picture: 'traderjoe.svg',
      },
      PANGOLIN: {
        name: 'Pangolin',
        picture: 'pangolin.svg',
      },
      WAULTSWAP: {
        name: 'Wault Swap',
        picture: 'wault.svg',
      },
    };
    return parser[name] || { name: name, picture: 'unknown.svg' };
  };

  const extractPath = useCallback(() => {
    if (!quote['protocols']) return;
    const symbols = [];
    const steps = [];
    quote['protocols'][0].map((route) => {
      const fromTokenAddress = route[0]['fromTokenAddress'];
      const toTokenAddress = route[0]['toTokenAddress'];
      const fromTokenSymbol = getSymbolFromAddress(fromTokenAddress, chainId);
      let toTokenSymbol = getSymbolFromAddress(toTokenAddress, chainId);
      const step = { pair: fromTokenSymbol + ' - ' + toTokenSymbol, dexes: [] };
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

  useEffect(() => {
    extractPath();
  }, [extractPath, quote]);

  return (
    <Box>
      {!isTokenSelectorVisible && (
        <Box>
          <Box className="flex flex-row items-center mb-4 pt-1">
            <ArrowLeftIcon
              className={'mr-2 cursor-pointer'}
              onClick={() => {
                setOpen(false);
                if (IS_NATIVE(ssovTokenName)) setToken(ssovTokenName);
                else setToken(ssovToken);
              }}
            />
            <Typography variant="h5">Zap In</Typography>
            <Tooltip
              title="Go to advanced mode"
              aria-label="add"
              placement="top"
            >
              <IconButton
                className="p-0 pb-1 mr-0 ml-auto"
                onClick={(event) => setAnchorEl(event.currentTarget)}
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
              onClose={() => setAnchorEl(null)}
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
                    onClick={() => setAnchorEl(null)}
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
                  onChange={(e, value: number) => setSlippageTolerance(value)}
                />
              </Box>
            </Popover>
          </Box>
          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-1">
            <Box className="flex flex-row justify-between">
              <Box
                className="h-11 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group"
                onClick={() => setIsTokenSelectorVisible(true)}
              >
                <Box className="flex flex-row h-9 w-9 mr-1.5">
                  {tokenName !== '' ? (
                    <img
                      src={
                        '/assets/' +
                        tokenName.toLowerCase().split('.e')[0] +
                        '.svg'
                      }
                      alt={tokenName}
                    />
                  ) : (
                    <LoaderIcon className="mt-3.5 ml-3.5" />
                  )}
                </Box>
                <Typography variant="h5" className="text-white pb-1 pr-1.5">
                  {tokenName}
                </Typography>
                <IconButton className="opacity-40 p-0 group-hover:opacity-70">
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
                  userAssetBalances[tokenName],
                  getDecimalsFromSymbol(tokenName, chainId)
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
            {tokenName !== '' &&
              ssovTokenName != '' &&
              ssovTokenName !== tokenName && (
                <Box className="rounded-xl col-flex mb-4 p-3 pb-0 border border-neutral-800 w-full">
                  <Box
                    className={
                      showSwapSteps
                        ? 'flex w-full cursor-pointer'
                        : 'flex w-full pb-4 cursor-pointer'
                    }
                    onClick={() => setShowSwapSteps(!showSwapSteps)}
                  >
                    <ZapIcon className="mt-1 mr-2" id="3" />
                    <Typography variant="h6" className="text-white font-lg">
                      1 {tokenName} ={' '}
                      {quote['toToken']
                        ? formatAmount(
                            getUserReadableAmount(
                              quote['toTokenAmount'],
                              quote['toToken']['decimals']
                            ) /
                              getUserReadableAmount(
                                quote['fromTokenAmount'],
                                quote['fromToken']['decimals']
                              ),
                            8
                          )
                        : '-'}{' '}
                      {ssovTokenName}{' '}
                      <span className="opacity-70">
                        (~$
                        {formatAmount(selectedTokenPrice, 2)})
                      </span>
                    </Typography>

                    {!showSwapSteps ? (
                      <SmallArrowDownIcon
                        className="mr-0 ml-auto mt-2 group"
                        onClick={() => setShowSwapSteps(!showSwapSteps)}
                        subClassName="group-hover:fill-gray-400"
                      />
                    ) : (
                      <SmallArrowUpIcon
                        className="mr-0 ml-auto mt-2 group"
                        onClick={() => setShowSwapSteps(!showSwapSteps)}
                        subClassName="group-hover:fill-gray-400"
                      />
                    )}
                  </Box>
                  {showSwapSteps && (
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
                                    ),
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
                                <Box key={step['pair']}>
                                  <Typography
                                    variant="h6"
                                    className="text-white mb-2 mt-3"
                                  >
                                    {step['pair']}
                                  </Typography>
                                  <Box className="rounded-md flex flex-col p-3 border border-neutral-800 bg-neutral-800">
                                    {step['dexes'].map((dex) => (
                                      <Box className="flex" key={dex['name']}>
                                        <img
                                          alt={dex['name']}
                                          src={
                                            '/assets/' +
                                            getDEXfrom1InchName(dex['name'])
                                              ?.picture
                                          }
                                          className="w-4 h-4 mt-1 mr-3 rounded-sm"
                                        />

                                        <Typography
                                          variant="h6"
                                          className="text-white opacity-60 mb-1"
                                        >
                                          {' '}
                                          {
                                            getDEXfrom1InchName(dex['name'])
                                              ?.name
                                          }
                                        </Typography>

                                        <Typography
                                          variant="h6"
                                          className="text-white ml-auto mr-0"
                                        >
                                          {' '}
                                          {dex['percentage']}%
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          }
                        >
                          <Box className="flex">
                            {swapSymbols.slice(0, 3).map((symbol, index) => (
                              <Box key={symbol} className="flex mr-2">
                                <Box className="rounded-md flex p-1 border border-neutral-800 bg-neutral-700 mt-3">
                                  <Box className="rounded-md flex flex-col mb-0 p-1 bg-neutral-600">
                                    <img
                                      src={`/assets/${symbol.toLowerCase()}.svg`}
                                      className={
                                        isInDialog
                                          ? 'w-4 h-4 mt-0.5'
                                          : 'w-[1.2rem] mt-[0.05rem]'
                                      }
                                      alt={symbol}
                                    />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    className="text-white  pl-2 pr-2 pt-0.5 text-sm"
                                  >
                                    {symbol}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
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
                {quote['toToken'] ? quote['toToken']['symbol'] : ssovTokenName}
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
              onClick={async () => {
                setOpen(false);
              }}
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
            setToken={setToken}
            isInDialog={isInDialog}
            tokensToExclude={[ssovTokenName]}
          />
        </Box>
      )}
    </Box>
  );
};

export default ZapIn;
