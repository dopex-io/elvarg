import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  hexToBigInt,
  maxUint256,
  parseUnits,
} from 'viem';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import DopexV2OptionMarket from 'abis/clamm/DopexV2OptionMarket';
import DopexV2PositionManager from 'abis/clamm/DopexV2PositionManager';
import { VARROCK_V2_bASE_API_URL } from 'pages/clamm-v2/constants';
import { useDebounce } from 'use-debounce';
import { useNetwork } from 'wagmi';

import queryClient from 'queryClient';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useLoadingStates, {
  ASIDE_PANEL_BUTTON_KEY,
} from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore, {
  SelectedStrike,
} from 'hooks/clamm/useStrikesChainStore';

import NumberInput from 'components/common/NumberInput/NumberInput';

import getPriceFromTick from 'utils/clamm/getPriceFromTick';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import getPremium from 'utils/clamm/varrock/getPremium';
import { cn, formatAmount } from 'utils/general';

import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

type Props = {
  key: number;
  strikeKey: string;
  strikeData: SelectedStrike;
  editAllMode: boolean;
  commonInputAmount: string;
  disabledInput: boolean;
  commonSetInputAmount: Dispatch<SetStateAction<string>>;
};
const SelectedStrikeItem = ({
  strikeData,
  strikeKey,
  commonInputAmount,
  commonSetInputAmount,
  editAllMode,
  disabledInput,
}: Props) => {
  const { deselectStrike, getCollateralAvailable } = useStrikesChainStore();
  const {
    isTrade,
    selectedOptionsMarket,
    selectedTTL,
    tokenBalances,
    addresses,
    markPrice,
  } = useClammStore();
  const { setDeposit, unsetDeposit, setPurchase, unsetPurchase } =
    useClammTransactionsStore();
  const [premium, setPremium] = useState(0n);
  const { chain } = useNetwork();
  const [inputAmount, setInputAmount] = useState<string>('');
  const [amountDebounced] = useDebounce(
    editAllMode ? commonInputAmount : inputAmount,
    1500,
  );
  const { setLoading } = useLoadingStates();
  const [error, setError] = useState('');
  const { tickLower, tickUpper, strike } = strikeData;

  const isCall = useMemo(() => {
    return strike > markPrice;
  }, [strike, markPrice]);

  const strikeId = tickLower
    .toString()
    .concat('#')
    .concat(tickUpper.toString())
    .toString();

  const tokenDecimals = useMemo(() => {
    if (!selectedOptionsMarket)
      return {
        callToken: 18,
        putToken: 18,
      };

    return {
      callToken: selectedOptionsMarket.callToken.decimals,
      putToken: selectedOptionsMarket.putToken.decimals,
    };
  }, [selectedOptionsMarket]);

  // const updatePremium = useCallback(async () => {
  //   if (!selectedOptionsMarket || !chain || !isTrade) return;
  //   const { strike, tickLower, tickUpper } = strikeData;
  //   const { callToken, putToken } = selectedOptionsMarket;
  //   if (Number(amountDebounced) === 0) return;
  //   const tick = isCall ? tickLower : tickUpper;
  //   const ttl = selectedTTL;
  //   const {} = queryClient.fetchQuery();
  //   console.log(selectedTTL);
  //   // setLoading(ASIDE_PANEL_BUTTON_KEY, true);
  //   // const { amountInToken } = await getPremium(
  //   //   callToken.address,
  //   //   putToken.address,
  //   //   tick,
  //   //   ttl,
  //   //   amountDebounced,
  //   //   isCall,
  //   //   chain.id,
  //   // );
  //   // setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  //   // if (!amountInToken) return;
  //   // const totalPremium = amountInToken;
  //   // setPremium(BigInt(totalPremium));
  // }, [
  //   isCall,
  //   setLoading,
  //   chain,
  //   isTrade,
  //   selectedOptionsMarket,
  //   strikeData,
  //   selectedTTL,
  //   amountDebounced,
  // ]);

  // const { data, error: error2 } = useQuery({
  //   queryKey: [
  //     'clamm-option-premium',
  //     tickLower,
  //     tickUpper,
  //     selectedOptionsMarket?.address,
  //     chain?.id,
  //   ],
  //   queryFn: async () => {
  //     if (!isTrade || !selectedOptionsMarket) return 0n;
  //     const url = new URL(`${VARROCK_BASE_API_URL}/clamm/purchase/quote`);
  //     url.searchParams.set(
  //       'chainId',
  //       (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
  //     );
  //     url.searchParams.set('optionMarket', selectedOptionsMarket.address);
  //     url.searchParams.set('type', markPrice < strike ? 'put' : 'call');
  //     url.searchParams.set('amount', amountDebounced.toString());
  //     url.searchParams.set('ttl', selectedTTL.toString());
  //     url.searchParams.set('strike', strike.toString());
  //     console.log(url.toString(), amountDebounced.toString());
  //     return fetch(url).then((res) => res.json());
  //   },
  // });

  const updateDeposit = useCallback(async () => {
    if (isTrade || !selectedOptionsMarket) return;

    const { callToken, putToken } = selectedOptionsMarket;
    const depositAmount = parseUnits(
      Number(amountDebounced).toString(),
      isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
    );

    setDeposit(strikeKey, {
      strike: strike,
      tokenAddress: isCall ? callToken.address : putToken.address,
      tokenSymbol: isCall ? callToken.symbol : putToken.symbol,
      tokenDecimals: isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
      amount: depositAmount,
      tickLower: tickLower,
      tickUpper: tickUpper,
    });
  }, [
    tickLower,
    tickUpper,
    strike,
    strikeKey,
    isCall,
    amountDebounced,
    tokenDecimals,
    setDeposit,
    isTrade,
    selectedOptionsMarket,
  ]);

  const updatePurchase = useCallback(() => {
    if (!isTrade || !selectedOptionsMarket) return;
    const { strike } = strikeData;
    const liquidityData = getCollateralAvailable(strike.toString());
    const totalLiquidityAvailable = liquidityData.reduce(
      (prev, { availableTokenLiquidity }) => prev + availableTokenLiquidity,
      0n,
    );

    const decimalsInContext = isCall
      ? selectedOptionsMarket.callToken.decimals
      : selectedOptionsMarket.putToken.decimals;
    const strikeBigInt = parseUnits(strike.toString(), decimalsInContext);
    const liquidtyRequiredInToken = isCall
      ? parseUnits(amountDebounced, decimalsInContext)
      : (parseUnits(amountDebounced, decimalsInContext) *
          parseUnits('1', decimalsInContext)) /
        strikeBigInt;

    if (liquidtyRequiredInToken === 0n) {
      unsetPurchase(strikeKey);
      return;
    }

    if (totalLiquidityAvailable < liquidtyRequiredInToken) {
      setError(
        `Amount exceeds available options (${formatAmount(
          formatUnits(totalLiquidityAvailable, decimalsInContext),
          4,
        )} Available)`,
      );
    } else {
      setError('');
    }

    setPurchase(strikeKey, {
      strike,
      tickLower,
      tickUpper,
      amount: Number(amountDebounced),
      premium: premium,
      collateralRequired: liquidtyRequiredInToken,
      tokenAddress: isCall
        ? selectedOptionsMarket.callToken.address
        : selectedOptionsMarket.putToken.address,
      tokenSymbol: isCall
        ? selectedOptionsMarket.callToken.symbol
        : selectedOptionsMarket.putToken.symbol,
      tokenDecimals: decimalsInContext,
      error: Boolean(error),
    });

    const x = {
      strike,
      tickLower,
      tickUpper,
      liquidtyRequiredInToken,
    };
  }, [
    isCall,
    strikeKey,
    tickLower,
    tickUpper,
    strikeData,
    getCollateralAvailable,
    unsetPurchase,
    error,
    setPurchase,
    amountDebounced,
    isTrade,
    selectedOptionsMarket,
    premium,
  ]);

  const handleMax = useCallback(() => {
    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    const handleInputChange = editAllMode
      ? commonSetInputAmount
      : setInputAmount;
    if (isTrade) {
      // handleInputChange((Number(strikeData.amount1) * 0.993).toString());
    } else {
      const balance = isCall ? tokenBalances.callToken : tokenBalances.putToken;
      handleInputChange(
        formatUnits(
          balance,
          isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
        ),
      );
    }
    setLoading(ASIDE_PANEL_BUTTON_KEY, false);
  }, [
    isCall,
    setLoading,
    commonSetInputAmount,
    editAllMode,
    isTrade,
    // strikeData.amount1,
    tokenBalances.callToken,
    tokenBalances.putToken,
    tokenDecimals.callToken,
    tokenDecimals.putToken,
  ]);

  // useEffect(() => {
  //   updatePremium();
  // }, [updatePremium]);

  useEffect(() => {
    updateDeposit();
  }, [updateDeposit]);

  useEffect(() => {
    updatePurchase();
  }, [updatePurchase]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center h-[30px] space-x-[10px]">
        <XMarkIcon
          onClick={() => {
            deselectStrike(strikeId);
            if (isTrade) {
              // unsetPurchase(strikeId);
            } else {
              unsetDeposit(strikeId);
            }
          }}
          role="button"
          className="text-stieglitz hover:text-white rounded-full w-[18px] h-[18px] flex-[0.075]"
        />
        <div className="w-[34px] h-[30px] flex items-center justify-center bg-carbon rounded-md flex-[0.125]">
          {isCall ? (
            <ArrowUpRightIcon
              className={'h-[18px] w-[18px] p-[2px] text-up-only'}
            />
          ) : (
            <ArrowDownRightIcon
              className={'h-[18px] w-[18px] p-[2px] text-down-bad'}
            />
          )}
        </div>
        <div className="flex items-center justify-center space-x-[4px] bg-mineshaft h-[30px] w-[100px] rounded-md flex-[0.375]">
          <span className="text-stieglitz text-[13px]">$</span>
          <span className="text-[13px]">
            {formatAmount(strikeData.strike, 5)}
          </span>
        </div>
        <div
          className={cn(
            'h-[30px] w-[160px] p-[8px] flex items-center justfiy-center border rounded-md flex-[0.425] border-mineshaft',
            Boolean(error) ? 'border-down-bad' : 'border-mineshaft',
          )}
        >
          {/* <input
            disabled={disabledInput}
            onChange={(event: any) => {
              setLoading(ASIDE_PANEL_BUTTON_KEY, true);
              const handleInputChange = editAllMode
                ? commonSetInputAmount
                : setInputAmount;

              handleInputChange(event.target.value);
            }}
            value={editAllMode ? commonInputAmount : inputAmount}
            type="number"
            min="0"
            placeholder={`0.0 ${
              isTrade
                ? selectedOptionsMarket
                  ? selectedOptionsMarket.callToken.symbol
                  : '-'
                : isCall
                  ? selectedOptionsMarket!.callToken.symbol
                  : selectedOptionsMarket!.putToken.symbol
            }`}
            className={cn(
              'w-full text-[13px] text-left bg-umbra focus:outline-none focus:border-mineshaft rounded-md placeholder-mineshaft',
              disabledInput ? 'text-stieglitz' : 'text-white',
            )}
          /> */}
          <NumberInput
            disabled={disabledInput}
            onValueChange={(event: any) => {
              setLoading(ASIDE_PANEL_BUTTON_KEY, true);
              const handleInputChange = editAllMode
                ? commonSetInputAmount
                : setInputAmount;

              handleInputChange(event.target.value);
            }}
            value={editAllMode ? commonInputAmount : inputAmount}
            placeholder={`0.0 ${
              isTrade
                ? selectedOptionsMarket
                  ? selectedOptionsMarket.callToken.symbol
                  : '-'
                : isCall
                  ? selectedOptionsMarket!.callToken.symbol
                  : selectedOptionsMarket!.putToken.symbol
            }`}
            className={cn(
              'w-full text-[13px] text-left bg-umbra focus:outline-none focus:border-mineshaft rounded-md placeholder-mineshaft',
              disabledInput ? 'text-stieglitz' : 'text-white',
            )}
          />
          <img
            onClick={handleMax}
            role="button"
            src="/images/misc/max.svg"
            className="hover:bg-silver rounded-[4px] h-[14px]"
            alt="max"
          />
        </div>
      </div>
      <span className="w-full text-right text-[11.6px] text-down-bad p-[1px]">
        {error}
      </span>
    </div>
  );
};

export default SelectedStrikeItem;
