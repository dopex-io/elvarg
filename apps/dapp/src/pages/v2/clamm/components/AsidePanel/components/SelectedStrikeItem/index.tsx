import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { Listbox } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import cx from 'classnames';
import { VARROCK_BASE_API_URL } from 'pages/v2/clamm/constants';
import getPremium from 'pages/v2/clamm/utils/varrock/getPremium';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useStrikesChainStore, {
  SelectedStrike,
} from 'hooks/clamm/useStrikesChainStore';

import { formatAmount } from 'utils/general';

import { EXPIRIES } from 'constants/clamm';

type Props = {
  key: number;
  strikeIndex: number;
  strikeData: SelectedStrike;
};
const SelectedStrikeItem = ({ strikeData, strikeIndex }: Props) => {
  const { deselectStrike } = useStrikesChainStore();
  const { isTrade, selectedOptionsPool, tokenBalances } = useClammStore();
  const { setApproval, setDeposit, deposits, unsetApproval, unsetDeposit } =
    useClammTransactionsStore();
  const [ttlKey, setTtlKey] = useState('24h');
  const [approved, setApproved] = useState(true);
  const [premium, setPremium] = useState(0n);
  const { chain } = useNetwork();
  const [inputAmount, setInputAmount] = useState<number | string>('');
  const { address: userAddress } = useAccount();

  console.log(deposits);

  const tokenDecimals = useMemo(() => {
    if (!selectedOptionsPool)
      return {
        callToken: 18,
        putToken: 18,
      };

    return {
      callToken: selectedOptionsPool.callToken.decimals,
      putToken: selectedOptionsPool.putToken.decimals,
    };
  }, [selectedOptionsPool]);

  const updatePremium = useCallback(async () => {
    if (!selectedOptionsPool || !chain || !isTrade) return;
    const { isCall, meta } = strikeData;
    const { callToken, putToken } = selectedOptionsPool;
    const tick = isCall ? meta.tickUpper : meta.tickLower;
    const ttl = EXPIRIES[ttlKey];
    const premium = await getPremium(
      callToken.address,
      putToken.address,
      tick,
      ttl,
      isCall,
      chain.id,
    );
    setPremium(premium ? BigInt(premium.amountInToken) : 0n);
  }, [chain, isTrade, selectedOptionsPool, strikeData, ttlKey]);

  const updateAllowance = useCallback(async () => {
    if (!userAddress || !chain || !selectedOptionsPool) return;
    const { callToken, putToken } = selectedOptionsPool;

    const { isCall } = strikeData;

    const tokenAddressInContext = isCall ? callToken.address : putToken.address;
    let amountInContext = 0n;

    if (isTrade) {
    } else {
      amountInContext = parseUnits(
        Number(inputAmount).toString(),
        isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
      );
    }
    await axios
      .get(`${VARROCK_BASE_API_URL}/token/allowance`, {
        params: {
          chainId: chain.id,
          token: tokenAddressInContext,
          account: userAddress,
          spender: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        },
      })
      .then(async ({ data: { allowance } }) => {
        if (BigInt(allowance) < amountInContext) {
          setApproved(false);
          setApproval(strikeIndex, {
            address: tokenAddressInContext,
            amount: amountInContext,
          });
        } else {
          setApproved(true);
        }
      });
  }, [
    inputAmount,
    strikeIndex,
    setApproval,
    chain,
    selectedOptionsPool,
    userAddress,
    strikeData,
    isTrade,
    tokenDecimals.callToken,
    tokenDecimals.putToken,
  ]);

  const updateDepositTransaction = useCallback(async () => {
    if (isTrade || !chain || !selectedOptionsPool) return;
    const { callToken, putToken } = selectedOptionsPool;
    const { isCall, meta } = strikeData;
    const depositAmount = parseUnits(
      Number(inputAmount).toString(),
      isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
    );
    if (depositAmount === 0n) return;
    axios
      .get(`${VARROCK_BASE_API_URL}/clamm/deposit`, {
        params: {
          chainId: chain.id,
          callToken: callToken.address,
          putToken: putToken.address,
          pool: '0x53b27D62963064134D60D095a526e1E72b74A5C4' as Address,
          handler: '0x0165878A594ca255338adfa4d48449f69242Eb8F' as Address,
          amount: depositAmount,
          tickLower: meta.tickLower,
          tickUpper: meta.tickUpper,
        },
      })
      .then(({ data }) => {
        if (data) {
          setDeposit(strikeIndex, {
            amount: depositAmount,
            symbol: data.tokenSymbol,
            txData: data.txData,
          });
        }
      });
  }, [
    setDeposit,
    strikeIndex,
    chain,
    inputAmount,
    isTrade,
    selectedOptionsPool,
    strikeData,
    tokenDecimals.callToken,
    tokenDecimals.putToken,
  ]);

  useEffect(() => {
    updateDepositTransaction();
  }, [updateDepositTransaction]);

  const statusMessage = useMemo(() => {
    const { isCall } = strikeData;
    let amount = 0n;
    const tokenBalanceInContext = isCall
      ? tokenBalances.callToken
      : tokenBalances.putToken;
    if (!isTrade) {
      amount = parseUnits(
        Number(inputAmount).toString(),
        isCall ? tokenDecimals.callToken : tokenDecimals.putToken,
      );
    } else {
      amount = premium;
    }

    if (isTrade && premium === 0n) {
      return 'Premium is zero. Try a later expiry';
    }
    if (!isTrade && amount >= tokenBalanceInContext) {
      return 'Amount exceeds balance';
    }
    if (amount === 0n) return 'Amount is required';

    if (!approved) {
      return 'Approval required';
    }
    return '';
  }, [
    premium,
    inputAmount,
    approved,
    isTrade,
    strikeData,
    tokenBalances.callToken,
    tokenBalances.putToken,
    tokenDecimals.callToken,
    tokenDecimals.putToken,
  ]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance]);

  useEffect(() => {
    updatePremium();
  }, [updatePremium]);

  return (
    <div className="w-full h-full flex-col items-center justify-center">
      <div className="w-full relative space-y-[6px] p-[12px]">
        <div className="w-full flex items-center justify-between">
          <div className="flex w-full items-center justify-center space-x-[4px]">
            <div className="flex flex-col bg-mineshaft rounded-md p-[4px] flex-1">
              <span className="text-xs text-stieglitz">Strike</span>
              <div className="flex items-center justify-start space-x-[3px]">
                <span className="text-stieglitz text-sm">$</span>
                <span className="text-sm">
                  {Number(strikeData.strike ?? 0).toFixed(4)}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col bg-mineshaft p-[4px] px-[8px] rounded-md flex-1">
              <span className="text-stieglitz text-xs">Side</span>
              <div className="w-full flex flex-row items-start justify-start rounded-md space-x-[6px]">
                {strikeData.isCall ? (
                  <span
                    className={
                      'text-sm flex items-center justify-center space-x-[4px] '
                    }
                  >
                    <span>Call</span>
                    <ArrowUpRightIcon
                      className={cx(
                        'h-[12px] w-[12px]',
                        strikeData.isCall && 'text-up-only',
                      )}
                    />
                  </span>
                ) : (
                  <span
                    className={
                      'text-sm flex items-center justify-center space-x-[4px]'
                    }
                  >
                    <span>Put</span>
                    <ArrowDownRightIcon
                      className={cx(
                        'h-[12px] w-[12px]',
                        !strikeData.isCall && 'text-down-bad',
                      )}
                    />
                  </span>
                )}
              </div>
            </div>
            {isTrade && (
              <Listbox
                onChange={(ttl: any) => {
                  setTtlKey(ttl);
                }}
              >
                <div className="relative flex-1">
                  <Listbox.Button className="bg-mineshaft text-sm font-medium flex items-center justify-center space-x-[8px]  rounded-md p-[4px] px-[6px] w-full">
                    <div className="flex flex-col items-start justify-center w-full">
                      <span className="text-xs text-stieglitz">Expiry</span>
                      <span className="flex items-center justify-center space-x-[2px]">
                        <span>{ttlKey}</span>
                        <ChevronDownIcon className="w-[18px] h-[18px] pt-[3px]" />
                      </span>
                    </div>
                  </Listbox.Button>
                  <Listbox.Options className="absolute w-full rounded-md overflow-auto mt-1 z-10 drop-shadow-md border border-umbra">
                    {Object.keys(EXPIRIES).map((_ttl, index) => (
                      <Listbox.Option
                        className="bg-carbon hover:bg-mineshaft z-10 p-1 hover:cursor-pointer"
                        key={index}
                        value={_ttl}
                      >
                        <div className="flex items-center w-full justify-center">
                          <span className="text-sm text-white">{_ttl}</span>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            )}
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center bg-cod-gray space-x-[4px] border border-umbra rounded-lg">
          <div className="w-full h-full flex items-end justify-center pl-[6px]">
            <div className="flex flex-col items-start w-fit h-fit space-y-[2px]">
              <img
                src={`/images/tokens/${strikeData.tokenSymbol.toLowerCase()}.svg`}
                alt={strikeData.tokenSymbol.toLowerCase()}
                className="w-[30px] h-[30px] border border-umbra rounded-full ring-4 ring-cod-gray ml-[5px]"
              />
              <span className="text-stieglitz text-[10px] text-center pb-[4px]">
                {isTrade ? 'Available' : 'Balance'}
              </span>
            </div>
            <div className="w-full flex flex-col items-end p-[4px]">
              <input
                onChange={(event: any) => {
                  setInputAmount(event.target.value);
                }}
                value={inputAmount}
                type="number"
                min="0"
                placeholder="0.0"
                className="w-full text-right text-white bg-cod-gray focus:outline-none focus:border-mineshaft rounded-md py-[4px] "
              />
              <div className="flex items-center justify-center space-x-[4px] ">
                <span className="text-[10px]">
                  {!isTrade
                    ? formatAmount(
                        formatUnits(
                          strikeData.isCall
                            ? tokenBalances.callToken
                            : tokenBalances.putToken,
                          strikeData.isCall
                            ? tokenDecimals.callToken
                            : tokenDecimals.putToken,
                        ),
                        5,
                      )
                    : 0}
                </span>
                <img
                  onClick={() => {
                    const balance = strikeData.isCall
                      ? tokenBalances.callToken
                      : tokenBalances.putToken;
                    setInputAmount(
                      formatUnits(
                        balance,
                        strikeData.isCall
                          ? tokenDecimals.callToken
                          : tokenDecimals.putToken,
                      ),
                    );
                  }}
                  role="button"
                  src="/assets/max.svg"
                  className="hover:bg-silver rounded-[4px]"
                  alt="max"
                />
              </div>
            </div>
          </div>
        </div>
        {isTrade && (
          <div className="w-full flex items-center justify-between text-xs ">
            <span className="text-stieglitz font-normal">Premium</span>
            <div className="flex space-x-[4px]">
              <span className="font-normal">
                {formatAmount(
                  Number(
                    formatUnits(
                      premium,
                      strikeData.isCall
                        ? tokenDecimals.callToken
                        : tokenDecimals.putToken,
                    ),
                  ) * Number(inputAmount),
                  5,
                )}
              </span>
              <span className="text-stieglitz font-normal">
                {strikeData.tokenSymbol}
              </span>
            </div>
          </div>
        )}
        {isTrade && (
          <div className="w-full flex items-center justify-between text-xs ">
            <span className="text-stieglitz font-normal">Breakeven</span>
            <div className="flex space-x-[4px]">
              <span className="text-stieglitz font-normal">$</span>
              <span className="font-normal">{0}</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex items-center justify-between px-[12px] pb-[6px]">
        <div className="flex items-center justify-center space-x-[4px]">
          {Boolean(statusMessage) ? (
            <ExclamationCircleIcon className="text-jaffa ml-[2px]rounded-full w-[18x] h-[18px]" />
          ) : (
            <CheckCircleIcon className="text-frost ml-[2px]rounded-full w-[18x] h-[18px]" />
          )}
          <span className="text-xs">{statusMessage}</span>
        </div>
        <TrashIcon
          onClick={() => {
            deselectStrike(strikeIndex);
            unsetApproval(strikeIndex);
            unsetDeposit(strikeIndex);
          }}
          role="button"
          className="text-stieglitz ml-[2px]rounded-full w-[18x] h-[18px]"
        />
      </div>
    </div>
  );
};

export default SelectedStrikeItem;
