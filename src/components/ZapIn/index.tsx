import { SsovData, SsovProperties, UserSsovData } from '../../contexts/Ssov';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ASSET_TO_NAME, AssetsContext } from '../../contexts/Assets';
import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Slide from '@material-ui/core/Slide';
import formatAmount from '../../utils/general/formatAmount';
import Tooltip from '@material-ui/core/Tooltip';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import { ERC20, ERC20__factory } from '@dopex-io/sdk';
import { Scrollbars } from 'react-custom-scrollbars';
import { WalletContext } from '../../contexts/Wallet';
import TokenSelector from '../TokenSelector';
import { SSOV_MAP } from '../../constants';
import PnlChart from '../PnlChart';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import format from 'date-fns/format';
import CustomButton from '../UI/CustomButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import noop from 'lodash/noop';
import { BigNumber } from 'ethers';
import Skeleton from '@material-ui/lab/Skeleton';
import { LoaderIcon } from 'react-hot-toast';

export interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<ERC20>>;
  token: ERC20 | any;
  ssovToken: ERC20;
  state: { totalCost: BigNumber };
  userTokenBalance: BigNumber;
  purchasePower: number;
  formik: any;
}

const ZapIn = ({
  open,
  setOpen,
  setToken,
  ssovToken,
  token,
  state,
  userTokenBalance,
  purchasePower,
  formik,
}: Props) => {
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] =
    useState<boolean>(false);
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [ssovTokenSymbol, setSsovTokenSymbol] = useState<string>('');

  const updateTokenSymbol = async () => {
    const symbol = token === 'ETH' ? 'ETH' : await token.symbol();
    setTokenSymbol(symbol);
  };

  const updateSsovTokenSymbol = async () => {
    const symbol = await ssovToken.symbol();
    setSsovTokenSymbol(symbol);
  };

  useEffect(() => {
    updateTokenSymbol();
    updateSsovTokenSymbol();
  }, [token]);

  return (
    <Box>
      {!isTokenSelectorVisible && (
        <Box>
          <Box className="flex flex-row items-center mb-4">
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
                onClick={() => setOpen(false)}
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
          </Box>

          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
            <Box className="flex flex-row justify-between">
              <Box
                className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group"
                onClick={() => setIsTokenSelectorVisible(true)}
              >
                <Box className="flex flex-row h-10 w-10 mr-3">
                  {tokenSymbol !== '' ? (
                    <img
                      src={'/assets/' + tokenSymbol.toLowerCase() + '.svg'}
                      alt={tokenSymbol}
                    />
                  ) : (
                    <LoaderIcon className="mt-3.5 ml-3.5" />
                  )}
                </Box>
                <Typography variant="h5" className="text-white pb-1 pr-2">
                  {tokenSymbol}
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
                value={formik.values.zapInAmount}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.zapInAmount &&
                  Boolean(formik.errors.zapInAmount)
                }
                classes={{ input: 'text-right' }}
              />
            </Box>
            <Box className="flex flex-row justify-between">
              <Box>
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-2"
                >
                  Swap from
                </Typography>
              </Box>
              <Box className="ml-auto mr-0">
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-2 pr-3"
                >
                  Balance:{' '}
                  {formatAmount(getUserReadableAmount(userTokenBalance, 18), 3)}{' '}
                </Typography>
              </Box>
            </Box>
          </Box>

          {tokenSymbol !== '' &&
          ssovTokenSymbol != '' &&
          ssovTokenSymbol !== tokenSymbol ? (
            <Box>
              <Box className="rounded-xl col-flex mb-4 p-3 pb-0 border border-neutral-800 w-full mb-52">
                <Box className="flex w-full">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 mt-0.5"
                  >
                    <path
                      d="M1.72494 14.5001H14.2749C15.5583 14.5001 16.3583 13.1084 15.7166 12.0001L9.4416 1.1584C8.79994 0.0500651 7.19994 0.0500651 6.55827 1.1584L0.283272 12.0001C-0.358395 13.1084 0.441605 14.5001 1.72494 14.5001ZM7.99994 8.66673C7.5416 8.66673 7.1666 8.29173 7.1666 7.8334V6.16673C7.1666 5.7084 7.5416 5.3334 7.99994 5.3334C8.45827 5.3334 8.83327 5.7084 8.83327 6.16673V7.8334C8.83327 8.29173 8.45827 8.66673 7.99994 8.66673ZM8.83327 12.0001H7.1666V10.3334H8.83327V12.0001Z"
                      fill="#F09242"
                    />
                  </svg>
                  <Typography variant="h6" className="text-white font-lg">
                    1 {tokenSymbol} = {ssovTokenSymbol}
                  </Typography>

                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-0 ml-auto mt-1"
                  >
                    <path
                      d="M9.87998 1.28957L5.99998 5.16957L2.11998 1.28957C1.72998 0.89957 1.09998 0.89957 0.70998 1.28957C0.31998 1.67957 0.31998 2.30957 0.70998 2.69957L5.29998 7.28957C5.68998 7.67957 6.31998 7.67957 6.70998 7.28957L11.3 2.69957C11.69 2.30957 11.69 1.67957 11.3 1.28957C10.91 0.90957 10.27 0.89957 9.87998 1.28957Z"
                      fill="white"
                    />
                  </svg>
                </Box>

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
                      0.076
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
                      0.075
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2 mt-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Max Price Slippage
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0 pr-1"
                    >
                      0.3%
                    </Typography>
                  </Box>
                </Box>
                <Box className="rounded-md flex flex-col mb-4 p-3 border border-neutral-800 w-full bg-neutral-800 mt-4">
                  <Typography variant="h6" className="text-gray-300 opacity-80">
                    Router
                  </Typography>
                  <Box className="flex">
                    <Box className="rounded-md flex flex-col mb-1 p-1 border border-neutral-800 bg-neutral-700 mt-3">
                      <img src="/assets/sushi.svg" className="w-6 h-6" />
                    </Box>
                    <svg
                      width="34"
                      height="6"
                      viewBox="0 0 34 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-6 ml-4 mr-4 fill-white opacity-30"
                    >
                      <path d="M0.113249 3L3 5.88675L5.88675 3L3 0.113249L0.113249 3ZM33.5 3L28.5 0.113249V5.88675L33.5 3ZM3 3.5H29V2.5H3V3.5Z" />
                    </svg>
                    <Box className="rounded-md flex flex-col mb-1 p-1 border border-neutral-800 bg-neutral-700 mt-3">
                      <img src="/assets/curve.svg" className="w-6 h-6" />
                    </Box>
                    <svg
                      width="34"
                      height="6"
                      viewBox="0 0 34 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-6 ml-4 mr-4 fill-white opacity-30"
                    >
                      <path d="M0.113249 3L3 5.88675L5.88675 3L3 0.113249L0.113249 3ZM33.5 3L28.5 0.113249V5.88675L33.5 3ZM3 3.5H29V2.5H3V3.5Z" />
                    </svg>
                    <Box className="rounded-md flex flex-col mb-1 p-1 border border-neutral-800 bg-neutral-700 mt-3">
                      <img src="/assets/uniswap.svg" className="w-6 h-6" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box className="h-96" />
          )}

          <Box className="rounded-xl p-4 border border-neutral-800 w-full  bg-umbra">
            <Box className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-800 cursor-pointer">
              <Typography variant="h6" className="text-gray-400 opacity-70">
                Purchase Power
              </Typography>

              <Typography variant="h6" className="text-white mr-0 ml-auto">
                {tokenSymbol === ssovTokenSymbol
                  ? formik.values.zapInAmount
                    ? formik.values.zapInAmount
                    : '0'
                  : purchasePower}{' '}
                {ssovTokenSymbol}
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
              color={
                !(formik.values.zapInAmount > 0) ||
                formik.values.zapInAmount >=
                  getUserReadableAmount(userTokenBalance, 18)
                  ? 'mineshaft'
                  : 'primary'
              }
              disabled={
                !(formik.values.zapInAmount > 0) ||
                formik.values.zapInAmount >=
                  getUserReadableAmount(userTokenBalance, 18)
              }
            >
              {formik.values.zapInAmount > 0
                ? formik.values.zapInAmount <=
                  getUserReadableAmount(userTokenBalance, 18)
                  ? 'Save'
                  : 'Insufficient balance'
                : 'Enter an amount'}
            </CustomButton>
          </Box>
        </Box>
      )}

      {isTokenSelectorVisible && (
        <TokenSelector
          open={isTokenSelectorVisible}
          setOpen={setIsTokenSelectorVisible}
          setToken={setToken}
        />
      )}
    </Box>
  );
};

export default ZapIn;
