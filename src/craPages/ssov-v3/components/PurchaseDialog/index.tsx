import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { ERC20__factory, SSOVOptionPricing__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Slide from '@mui/material/Slide';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import format from 'date-fns/format';
import { useDebounce } from 'use-debounce';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import PnlChart from 'components/PnlChart';
import BigCrossIcon from 'components/Icons/BigCrossIcon';
import CircleIcon from 'components/Icons/CircleIcon';
import AlarmIcon from 'components/Icons/AlarmIcon';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';
import { SsovV3Context, SsovV3Data, SsovV3EpochData } from 'contexts/SsovV3';

import { MAX_VALUE } from 'constants/index';

export interface Props {
  open: boolean;
  handleClose: () => {};
  ssovData: SsovV3Data;
  ssovEpochData: SsovV3EpochData;
}

const purchaseTokenName = 'WETH';

const PurchaseDialog = ({
  open,
  handleClose,
  ssovData,
  ssovEpochData,
}: Props) => {
  const { selectedSsovV3, ssovSigner, isPut } = useContext(SsovV3Context);
  const { updateAssetBalances } = useContext(AssetsContext);
  const { accountAddress, provider, signer, contractAddresses } =
    useContext(WalletContext);

  const { tokenPrice, ssovContract } = ssovData;
  const { ssovContractWithSigner } = ssovSigner;

  const { epochStrikes, availableCollateralForStrikes } = ssovEpochData;

  const [state, setState] = useState({
    volatility: 0,
    optionPrice: BigNumber.from(0),
    fees: BigNumber.from(0),
    premium: BigNumber.from(0),
    expiry: 0,
    totalCost: BigNumber.from(0),
  });
  const [strikeIndex, setStrikeIndex] = useState<number | null>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] = useState(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const ssovTokenName = useMemo(() => ssovData.tokenName, [ssovData]);

  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);

  const spender = useMemo(() => {
    return ssovContractWithSigner.address;
  }, [ssovContractWithSigner]);

  const sendTx = useSendTx();

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const [rawOptionsAmount, setRawOptionsAmount] = useState<string>('1');
  const optionsAmount: number = useMemo(() => {
    return parseFloat(rawOptionsAmount) || 0;
  }, [rawOptionsAmount]);

  const debouncedIsChartVisible = useDebounce(isChartVisible, 200);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        ERC20__factory.connect(contractAddresses.WETH, signer).approve(
          spender,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, spender, contractAddresses]);

  const handlePurchase = useCallback(async () => {
    const _amount = getContractReadableAmount(optionsAmount, 18);

    try {
      await sendTx(
        ssovContractWithSigner.purchase(strikeIndex, _amount, accountAddress)
      );
      setRawOptionsAmount('0');
      updateAssetBalances();
    } catch (err) {
      console.log(err);
      setRawOptionsAmount('0');
    }
  }, [
    accountAddress,
    optionsAmount,
    sendTx,
    ssovContractWithSigner,
    strikeIndex,
    updateAssetBalances,
  ]);

  // Calculate the Option Price & Fees
  useEffect(() => {
    if (
      !ssovContract ||
      strikeIndex === null ||
      optionsAmount === 0 ||
      optionsAmount.toString() === ''
    ) {
      setState((prev) => ({
        ...prev,
        volatility: 0,
        optionPrice: BigNumber.from(0),
        fees: BigNumber.from(0),
        premium: BigNumber.from(0),
        expiry: 0,
        totalCost: BigNumber.from(0),
      }));
      return;
    }

    async function updateOptionPrice() {
      const strike = epochStrikes[strikeIndex];
      try {
        const expiry = 1650614400;

        const volatility = (
          await ssovContract.getVolatility(strike)
        ).toNumber();

        const ssovOptionPricingContract = SSOVOptionPricing__factory.connect(
          '0x2b99e3d67dad973c1b9747da742b7e26c8bdd67b',
          provider
        );

        const optionPrice = await ssovOptionPricingContract.getOptionPrice(
          isPut,
          expiry,
          strike,
          tokenPrice,
          volatility
        );

        let premium = optionPrice.mul(optionsAmount);

        let fees = await ssovContract.calculatePurchaseFees(
          strike,
          ethersUtils.parseEther(String(optionsAmount))
        );

        let totalCost = premium
          .mul('1000000000000000000')
          .div(tokenPrice)
          .add(fees);

        setState({
          volatility,
          optionPrice,
          premium,
          fees,
          expiry,
          totalCost,
        });

        setIsPurchaseStatsLoading(false);
      } catch (err) {
        console.log(err);
        setIsPurchaseStatsLoading(false);
      }
    }
    updateOptionPrice();
  }, [
    strikeIndex,
    epochStrikes,
    optionsAmount,
    ssovContract,
    tokenPrice,
    provider,
    isPut,
    ssovData,
    ssovTokenName,
  ]);

  // Updates the approved and user balance state
  useEffect(() => {
    (async function () {
      const finalAmount = state.totalCost;
      const _token = ERC20__factory.connect(contractAddresses.WETH, provider);

      const userAmount = await _token.balanceOf(accountAddress);
      setUserTokenBalance(userAmount);

      const allowance = await _token.allowance(accountAddress, spender);

      if (finalAmount.lte(allowance)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [
    accountAddress,
    state.totalCost,
    isPut,
    provider,
    spender,
    contractAddresses,
  ]);

  const purchaseButtonProps = useMemo(() => {
    const disabled = Boolean(optionsAmount <= 0 || isPurchaseStatsLoading);

    let onClick = () => {};

    if (optionsAmount > 0) {
      if (approved) {
        onClick = handlePurchase;
      } else {
        onClick = handleApprove;
      }
    }

    let children = 'Enter an amount';

    if (isPurchaseStatsLoading) {
      children = 'Loading prices...';
    } else if (optionsAmount > 0) {
      if (state.totalCost.gt(userTokenBalance)) {
        children = 'Insufficient Balance';
      } else if (approved) {
        children = 'Purchase';
      } else {
        children = 'Approve';
      }
    } else {
      children = 'Enter an amount';
    }

    return {
      disabled,
      children,
      color: disabled ? 'mineshaft' : 'primary',
      onClick,
    };
  }, [
    approved,
    handleApprove,
    handlePurchase,
    isPurchaseStatsLoading,
    optionsAmount,
    state.totalCost,
    userTokenBalance,
  ]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{
        paper: 'rounded m-0',
        paperScrollPaper: 'overflow-x-hidden',
      }}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Buy Options</Typography>
        <IconButton
          className={'p-0 pb-1 mr-0 mt-0.5 ml-auto'}
          onClick={handleClose}
          size="large"
        >
          <BigCrossIcon className="" />
        </IconButton>
      </Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-10">
              <img src={'/assets/eth.svg'} alt={ssovTokenName} />
            </Box>
          </Box>
          <Input
            disableUnderline
            id="optionsAmount"
            name="optionsAmount"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawOptionsAmount}
            onChange={(e) => setRawOptionsAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2"
            >
              Available:{' '}
              <span className="text-white">
                {formatAmount(
                  getUserReadableAmount(
                    availableCollateralForStrikes[strikeIndex],
                    18
                  ),
                  3
                )}{' '}
              </span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              Option Size
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box>
        {debouncedIsChartVisible[0] && (
          <Slide direction="left" in={isChartVisible}>
            <Box className="p-3 bg-cod-gray rounded-md border border-neutral-800">
              <PnlChart
                breakEven={
                  isPut
                    ? Number(strikes[strikeIndex]) -
                      getUserReadableAmount(state.optionPrice, 8)
                    : Number(strikes[strikeIndex]) +
                      getUserReadableAmount(state.optionPrice, 8)
                }
                optionPrice={getUserReadableAmount(state.optionPrice, 8)}
                amount={optionsAmount}
                isPut={isPut}
                price={getUserReadableAmount(tokenPrice, 8)}
                symbol={ssovTokenName}
              />
            </Box>
          </Slide>
        )}
        {!debouncedIsChartVisible[0] && (
          <Slide direction="left" in={!isChartVisible}>
            <Box className="h-[12.88rem]">
              <Box className={'flex'}>
                <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
                  <Box className={'w-5/6'}>
                    <Typography variant="h5" className="text-white pb-1 pr-2">
                      ${strikes[strikeIndex]}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-stieglitz pb-1 pr-2"
                    >
                      Strike Price
                    </Typography>
                  </Box>
                  <Box className="bg-mineshaft hover:bg-neutral-700 rounded-md items-center w-1/6 h-fit clickable">
                    <IconButton
                      className="p-0"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      size="large"
                    >
                      {anchorEl ? (
                        <ArrowDropUpIcon
                          className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
                        />
                      ) : (
                        <ArrowDropDownIcon
                          className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
                        />
                      )}
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      classes={{ paper: 'bg-umbra' }}
                      className="mt-12"
                    >
                      {strikes.map((strike, strikeIndex) => (
                        <MenuItem
                          key={strikeIndex}
                          className="capitalize text-white hover:bg-mineshaft cursor-pointer"
                          onClick={() => {
                            setStrikeIndex(strikeIndex);
                            setAnchorEl(null);
                          }}
                        >
                          ${strike}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
                <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
                  <Typography variant="h5" className="text-white pb-1 pr-2">
                    {state.expiry
                      ? format(new Date(state.expiry * 1000), 'd LLL yyyy')
                      : '-'}
                  </Typography>
                  <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                    Expiry
                  </Typography>
                </Box>
              </Box>
              <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-4 p-3 border border-neutral-800 w-full">
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Breakeven
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      $
                      {isPut
                        ? formatAmount(
                            Number(strikes[strikeIndex]) -
                              getUserReadableAmount(state.optionPrice, 8),
                            2
                          )
                        : formatAmount(
                            Number(strikes[strikeIndex]) +
                              getUserReadableAmount(state.optionPrice, 8),
                            2
                          )}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Option Price
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      ${ethers.utils.formatUnits(state.optionPrice, 8)}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Side
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {selectedSsovV3.type}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    IV
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {state.volatility}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Slide>
        )}
      </Box>
      <Box className="flex mt-5 mb-5">
        <CircleIcon
          className={
            isChartVisible
              ? 'ml-auto mr-3 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
              : 'ml-auto mr-3 h-5 w-5 fill-white stroke-white cursor-pointer'
          }
          onClick={() => setIsChartVisible(false)}
        />
        <CircleIcon
          className={
            isChartVisible
              ? 'mr-auto ml-0 h-5 w-5 fill-white stroke-white cursor-pointer'
              : 'mr-auto ml-0 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
          }
          onClick={() => setIsChartVisible(true)}
        />
      </Box>
      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-4 p-4 border border-neutral-800 w-full bg-neutral-800">
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Purchasing with
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {purchaseTokenName}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Option Size
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(optionsAmount, 3)}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Fees
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                ${' '}
                {formatAmount(
                  getUserReadableAmount(state.fees.mul(tokenPrice), 26),
                  5
                )}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Premium
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                $ {formatAmount(getUserReadableAmount(state.premium, 8))}{' '}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              You will pay
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(state.totalCost, 18), 5)}{' '}
                WETH
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="flex">
          <Box className="flex text-center p-2 mr-2 mt-1">
            <AlarmIcon />
          </Box>
          <Typography variant="h6" className="text-stieglitz">
            This option will <span className="text-white">Auto Exercise</span>{' '}
            and can be settled anytime after expiry.
          </Typography>
        </Box>
        <CustomButton
          size="medium"
          className="w-full mt-4 !rounded-md"
          color={purchaseButtonProps.color}
          disabled={purchaseButtonProps.disabled}
          onClick={purchaseButtonProps.onClick}
        >
          {purchaseButtonProps.children}
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default PurchaseDialog;
