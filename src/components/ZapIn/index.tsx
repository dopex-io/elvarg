import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import Popover from '@material-ui/core/Popover';
import Typography from '../UI/Typography';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import formatAmount from '../../utils/general/formatAmount';
import Tooltip from '@material-ui/core/Tooltip';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import { ERC20 } from '@dopex-io/sdk';
import { WalletContext } from '../../contexts/Wallet';
import TokenSelector from '../TokenSelector';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CustomButton from '../UI/CustomButton';
import { BigNumber } from 'ethers';
import { LoaderIcon } from 'react-hot-toast';
import getSymbolFromAddress from '../../utils/general/getSymbolFromAddress';
import { AssetsContext } from '../../contexts/Assets';

export interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<ERC20>>;
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
    };
    return parser[name];
  };

  const extractPath = () => {
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
  };

  useEffect(() => {
    extractPath();
  }, [quote]);

  return (
    <Box>
      {!isTokenSelectorVisible && (
        <Box>
          <Box className="flex flex-row items-center mb-4 pt-1">
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <path
                d="M15 6.99973H3.82998L8.70998 2.11973C9.09998 1.72973 9.09998 1.08973 8.70998 0.699727C8.31998 0.309727 7.68998 0.309727 7.29998 0.699727L0.70998 7.28973C0.31998 7.67973 0.31998 8.30973 0.70998 8.69973L7.29998 15.2897C7.68998 15.6797 8.31998 15.6797 8.70998 15.2897C9.09998 14.8997 9.09998 14.2697 8.70998 13.8797L3.82998 8.99973H15C15.55 8.99973 16 8.54973 16 7.99973C16 7.44973 15.55 6.99973 15 6.99973Z"
                fill="white"
              />
            </svg>

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
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="group"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 15C0 15.55 0.45 16 1 16H6V14H1C0.45 14 0 14.45 0 15ZM0 3C0 3.55 0.45 4 1 4H10V2H1C0.45 2 0 2.45 0 3ZM10 17V16H17C17.55 16 18 15.55 18 15C18 14.45 17.55 14 17 14H10V13C10 12.45 9.55 12 9 12C8.45 12 8 12.45 8 13V17C8 17.55 8.45 18 9 18C9.55 18 10 17.55 10 17ZM4 7V8H1C0.45 8 0 8.45 0 9C0 9.55 0.45 10 1 10H4V11C4 11.55 4.45 12 5 12C5.55 12 6 11.55 6 11V7C6 6.45 5.55 6 5 6C4.45 6 4 6.45 4 7ZM18 9C18 8.45 17.55 8 17 8H8V10H17C17.55 10 18 9.55 18 9ZM13 6C13.55 6 14 5.55 14 5V4H17C17.55 4 18 3.55 18 3C18 2.45 17.55 2 17 2H14V1C14 0.45 13.55 0 13 0C12.45 0 12 0.45 12 1V5C12 5.55 12.45 6 13 6Z"
                    fill="#3E3E3E"
                    className="group-hover:fill-gray-400"
                  />
                </svg>
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
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="group"
                    >
                      <path
                        d="M13.3002 0.709727C12.9102 0.319727 12.2802 0.319727 11.8902 0.709727L7.00022 5.58973L2.11022 0.699727C1.72022 0.309727 1.09021 0.309727 0.700215 0.699727C0.310215 1.08973 0.310215 1.71973 0.700215 2.10973L5.59022 6.99973L0.700215 11.8897C0.310215 12.2797 0.310215 12.9097 0.700215 13.2997C1.09021 13.6897 1.72022 13.6897 2.11022 13.2997L7.00022 8.40973L11.8902 13.2997C12.2802 13.6897 12.9102 13.6897 13.3002 13.2997C13.6902 12.9097 13.6902 12.2797 13.3002 11.8897L8.41021 6.99973L13.3002 2.10973C13.6802 1.72973 13.6802 1.08973 13.3002 0.709727Z"
                        fill="#3E3E3E"
                        className="group-hover:fill-white opacity-70"
                      />
                    </svg>
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
                      src={'/assets/' + tokenName.toLowerCase() + '.svg'}
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
                  18
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
                <Box className="rounded-xl col-flex mb-4 p-3 pb-0 border border-neutral-800 w-full mb-52">
                  <Box
                    className={
                      showSwapSteps
                        ? 'flex w-full cursor-pointer'
                        : 'flex w-full pb-4 cursor-pointer'
                    }
                    onClick={() => setShowSwapSteps(!showSwapSteps)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-1 mr-2"
                    >
                      <path
                        d="M7.99989 0.515015C3.86739 0.515015 0.514893 3.86751 0.514893 8.00001C0.514893 12.1325 3.86739 15.485 7.99989 15.485C12.1324 15.485 15.4849 12.1325 15.4849 8.00001C15.4849 3.86751 12.1324 0.515015 7.99989 0.515015Z"
                        fill="url(#paint0_linear_1600_23889)"
                      />
                      <path
                        d="M5.46553 11.5539L7.01803 8.8649L5.29031 7.8674C5.04999 7.72865 5.03761 7.3751 5.27827 7.22826L10.3573 3.95121C10.6829 3.73218 11.0803 4.10885 10.8816 4.45309L9.3103 7.17458L10.9601 8.12708C11.2004 8.26583 11.21 8.60914 10.9824 8.76348L6.00008 12.0531C5.66419 12.2748 5.26678 11.8982 5.46553 11.5539Z"
                        fill="white"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_1600_23889"
                          x1="15.4849"
                          y1="17.6236"
                          x2="0.399917"
                          y2="0.616998"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#002EFF" />
                          <stop offset="1" stopColor="#22E1FF" />
                        </linearGradient>
                      </defs>
                    </svg>

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
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-0 ml-auto mt-2 group"
                        onClick={() => setShowSwapSteps(!showSwapSteps)}
                      >
                        true
                        <path
                          d="M9.87998 1.28957L5.99998 5.16957L2.11998 1.28957C1.72998 0.89957 1.09998 0.89957 0.70998 1.28957C0.31998 1.67957 0.31998 2.30957 0.70998 2.69957L5.29998 7.28957C5.68998 7.67957 6.31998 7.67957 6.70998 7.28957L11.3 2.69957C11.69 2.30957 11.69 1.67957 11.3 1.28957C10.91 0.90957 10.27 0.89957 9.87998 1.28957Z"
                          fill="white"
                          className="group-hover:fill-gray-400"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-0 ml-auto mt-2 group"
                        onClick={() => setShowSwapSteps(!showSwapSteps)}
                      >
                        <path
                          d="M5.28973 0.70998L0.699727 5.29998C0.309727 5.68998 0.309727 6.31998 0.699727 6.70998C1.08973 7.09998 1.71973 7.09998 2.10973 6.70998L5.99973 2.82998L9.87973 6.70998C10.2697 7.09998 10.8997 7.09998 11.2897 6.70998C11.6797 6.31998 11.6797 5.68998 11.2897 5.29998L6.69973 0.70998C6.31973 0.31998 5.67973 0.31998 5.28973 0.70998Z"
                          fill="white"
                          className="group-hover:fill-gray-400"
                        />
                      </svg>
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
                {tokenName === ssovTokenName
                  ? '-'
                  : formatAmount(purchasePower, 8)}{' '}
                {ssovTokenName}
              </Typography>
            </Box>

            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.16667 8.0833H9.5775L6.1675 12.0708C5.66333 12.6666 6.085 13.5833 6.86417 13.5833H10.8333C11.3375 13.5833 11.75 13.1708 11.75 12.6666C11.75 12.1625 11.3375 11.75 10.8333 11.75H8.4225L11.8325 7.76247C12.3367 7.16663 11.915 6.24997 11.1358 6.24997H7.16667C6.6625 6.24997 6.25 6.66247 6.25 7.16663C6.25 7.6708 6.6625 8.0833 7.16667 8.0833ZM17.525 3.88497C17.2042 4.26997 16.6267 4.32497 16.2325 4.00413L13.4183 1.65747C13.0333 1.32747 12.9783 0.749966 13.3083 0.364966C13.6292 -0.0200341 14.2067 -0.075034 14.6008 0.245799L17.415 2.59247C17.8 2.92247 17.855 3.49997 17.525 3.88497ZM0.475 3.88497C0.795834 4.27913 1.37333 4.32497 1.75833 4.00413L4.5725 1.65747C4.96667 1.32747 5.02167 0.749966 4.69167 0.364966C4.37083 -0.0292008 3.79333 -0.075034 3.40833 0.245799L0.585 2.59247C0.2 2.92247 0.145 3.49997 0.475 3.88497ZM9 3.49997C12.5383 3.49997 15.4167 6.3783 15.4167 9.91663C15.4167 13.455 12.5383 16.3333 9 16.3333C5.46167 16.3333 2.58333 13.455 2.58333 9.91663C2.58333 6.3783 5.46167 3.49997 9 3.49997ZM9 1.66663C4.44417 1.66663 0.75 5.3608 0.75 9.91663C0.75 14.4725 4.44417 18.1666 9 18.1666C13.5558 18.1666 17.25 14.4725 17.25 9.91663C17.25 5.3608 13.5558 1.66663 9 1.66663Z"
                    fill="#6DFFB9"
                  />
                </svg>
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
          />
        </Box>
      )}
    </Box>
  );
};

export default ZapIn;
