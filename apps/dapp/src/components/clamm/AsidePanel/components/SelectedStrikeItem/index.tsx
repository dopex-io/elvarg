import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useLoadingStates, {
  ASIDE_PANEL_BUTTON_KEY,
} from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore, {
  SelectedStrike,
} from 'hooks/clamm/useStrikesChainStore';

import NumberInput from 'components/common/NumberInput/NumberInput';

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
    markPrice,
  } = useClammStore();
  const { setDeposit, unsetDeposit, setPurchase, unsetPurchase } =
    useClammTransactionsStore();
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

  const {
    data: optionsCost,
    isError: isOptionsCostError,
    isLoading: isPremiumLoading,
  } = useQuery<{
    fees: string;
    premium: string;
  }>({
    queryKey: [
      'clamm-option-premium',
      tickLower,
      tickUpper,
      selectedOptionsMarket?.address ?? zeroAddress,
      chain?.id ?? DEFAULT_CHAIN_ID,
      amountDebounced.toString(),
      markPrice,
    ],
    queryFn: async () => {
      if (!isTrade || !selectedOptionsMarket || !Boolean(amountDebounced)) {
        return {
          fees: '0',
          premium: '0',
        };
      }
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/purchase/quote`);
      url.searchParams.set(
        'chainId',
        (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      );
      url.searchParams.set('optionMarket', selectedOptionsMarket.address);
      url.searchParams.set('type', markPrice < strike ? 'call' : 'put');
      url.searchParams.set('amount', amountDebounced.toString());
      url.searchParams.set('ttl', selectedTTL.toString());
      url.searchParams.set('strike', strike.toString());
      url.searchParams.set('markPrice', markPrice.toString());
      return fetch(url).then((res) => {
        if (!res.ok) {
          throw Error('Failed to fetch premium');
        }
        return res.json();
      });
    },
  });

  useEffect(() => {
    if (isTrade) {
      setLoading(ASIDE_PANEL_BUTTON_KEY, isPremiumLoading);
    }
  }, [isPremiumLoading, setLoading, isTrade]);

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
      : (parseUnits(amountDebounced, decimalsInContext) * strikeBigInt) /
        parseUnits('1', decimalsInContext);

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
    } else if (isOptionsCostError) {
      setError('Premium calculation error. Please retry.');
    } else {
      setError('');
    }
    if (!optionsCost) return;

    setPurchase(strikeKey, {
      strike,
      tickLower,
      tickUpper,
      amount: Number(amountDebounced),
      premium: BigInt(optionsCost['premium'] ?? 0n),
      fees: BigInt(optionsCost['fees'] ?? 0n),
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
  }, [
    optionsCost,
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
    isOptionsCostError,
  ]);

  const handleMax = useCallback(() => {
    setLoading(ASIDE_PANEL_BUTTON_KEY, true);
    const handleInputChange = editAllMode
      ? commonSetInputAmount
      : setInputAmount;
    if (isTrade) {
      if (!selectedOptionsMarket) return;
      const liquidityData = getCollateralAvailable(strike.toString());
      const totalLiquidityAvailable = liquidityData.reduce(
        (prev, { availableTokenLiquidity }) => prev + availableTokenLiquidity,
        0n,
      );

      const decimalsInContext = isCall
        ? selectedOptionsMarket.callToken.decimals
        : selectedOptionsMarket.putToken.decimals;

      const strikeBigInt = parseUnits(strike.toString(), decimalsInContext);
      const optionsAvailable = isCall
        ? totalLiquidityAvailable
        : (totalLiquidityAvailable * parseUnits('1', decimalsInContext)) /
          strikeBigInt;

      handleInputChange(formatUnits(optionsAvailable, decimalsInContext));
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
    getCollateralAvailable,
    selectedOptionsMarket,
    strike,
    isCall,
    setLoading,
    commonSetInputAmount,
    editAllMode,
    isTrade,
    tokenBalances.callToken,
    tokenBalances.putToken,
    tokenDecimals.callToken,
    tokenDecimals.putToken,
  ]);

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
              unsetPurchase(strikeId);
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
          <NumberInput
            disabled={disabledInput}
            onValueChange={(event: any) => {
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
