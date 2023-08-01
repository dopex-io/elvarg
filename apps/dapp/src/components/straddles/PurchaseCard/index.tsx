import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, ethers, utils as ethersUtils } from 'ethers';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

import {
  Addresses,
  AtlanticStraddle,
  AtlanticStraddleV2__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';
import NumberDisplay from 'components/UI/NumberDisplay';

import { get1inchParams, get1inchSwap } from 'utils/1inch';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { MAX_VALUE } from 'constants/index';

import PnlChart from '../PnlChart';

const POOL_TO_SWAPPER_IDS: { [key: string]: number } = {
  ETH: 1, // Uniswap V3
  DPX: 6, // Uniswap V3 and Sushiswap
  RDPX: 6, // Uniswap V3 and Sushiswap
};

const SWAPPER_ID_TO_ROUTE: { [key: string]: string } = {
  0: 'Sushiswap',
  1: 'Uniswap V3',
  2: 'GMX',
  3: 'Sushiswap and GMX',
  4: 'Sushiswap and Uniswap V3',
  5: 'GMX and Sushiswap',
  6: 'Uniswap V3 and Sushiswap',
};

function InfoBox({
  info,
  value,
  precision,
}: {
  info: string;
  value: any;
  precision: number;
}) {
  return (
    <div className="flex justify-between mb-2">
      <p className="text-sm text-stieglitz">{info}</p>
      <p className="text-sm">~{`${formatAmount(value, precision)} USDC.e`}</p>
    </div>
  );
}

const PurchaseCard = () => {
  const {
    // Wallet
    chainId,
    accountAddress,
    signer,
    contractAddresses,
    // Straddles
    selectedPoolName,
    straddlesEpochData,
    straddlesData,
    updateStraddlesEpochData,
    updateStraddlesUserData,
  } = useBoundStore();

  const { isLoading, error, data } = useQuery(
    ['currentPrice'],
    () => straddlesData?.straddlesContract?.getUnderlyingPrice(),
    { initialData: oneEBigNumber(8) },
  );

  const [finalCost, setFinalCost] = useState(BigNumber.from(0));

  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0'),
  );

  const maxStraddlesCanBeBought = useMemo(() => {
    if (isLoading || error || !data) return BigNumber.from(0);

    const availableUsdDeposits = straddlesEpochData?.usdDeposits.sub(
      BigNumber.from(straddlesEpochData?.activeUsdDeposits).div(
        '100000000000000000000',
      ),
    );

    if (!availableUsdDeposits) return BigNumber.from(0);

    return availableUsdDeposits!
      .mul(BigNumber.from('100000000000000000000'))
      .div(data)
      .div(2);
  }, [straddlesEpochData, isLoading, data, error]);

  const sendTx = useSendTx();

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('1');

  const [debouncedRawAmount] = useDebounce(rawAmount, 1000);

  const amount: number = useMemo(() => {
    return parseFloat(debouncedRawAmount) || 0;
  }, [debouncedRawAmount]);

  useEffect(() => {
    async function updateFinalCostV1() {
      if (!accountAddress || !signer || !straddlesData?.straddlesContract)
        return;

      const data = await (straddlesData.straddlesContract as AtlanticStraddle)
        .connect(signer)
        .callStatic.purchase(
          getContractReadableAmount(2 * amount, 18),
          0,
          POOL_TO_SWAPPER_IDS[selectedPoolName]!,
          accountAddress,
        );

      setFinalCost(data.protocolFee.add(data.straddleCost));
    }
    async function updateFinalCostV2() {
      if (
        !accountAddress ||
        !signer ||
        !straddlesData ||
        !straddlesEpochData ||
        amount === 0
      )
        return;

      const straddlesContract = AtlanticStraddleV2__factory.connect(
        Addresses[137]['STRADDLES'].Vault['MATIC'],
        signer,
      );

      const currentPrice = await straddlesContract.getUnderlyingPrice();

      const amountOfUsdToSwap = currentPrice
        .mul(ethers.utils.parseUnits(String(amount), 8))
        .div(BigNumber.from('10000000000'));

      const swap = await get1inchSwap({
        chainId: 137,
        src: straddlesData.usd,
        dst: straddlesData.underlying,
        amount: amountOfUsdToSwap.toString(),
        from: straddlesContract.address,
      });

      try {
        const { purchaseParams } = get1inchParams(swap['tx']['data']);
        const results = await straddlesContract.callStatic.purchase(
          getContractReadableAmount(amount * 2, 18),
          0,
          accountAddress,
          //@ts-ignore
          purchaseParams,
        );

        const protocolFee = results[1];
        const straddleCost = results[2];

        setFinalCost(protocolFee.add(straddleCost));
      } catch {
        console.error(
          'Error calculating final cost, defaults to simple estimation',
        );
      }
    }

    try {
      if (chainId === 137) updateFinalCostV2();
      else updateFinalCostV1();
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    amount,
    selectedPoolName,
    signer,
    straddlesData,
    chainId,
    straddlesEpochData,
  ]);

  // Handle Purchase
  const handlePurchase = useCallback(async () => {
    if (
      !accountAddress ||
      !signer ||
      !updateStraddlesEpochData ||
      !updateStraddlesUserData ||
      !straddlesData?.straddlesContract ||
      !straddlesEpochData
    )
      return;

    try {
      if (chainId === 137) {
        const straddlesContract = AtlanticStraddleV2__factory.connect(
          Addresses[137]['STRADDLES'].Vault['MATIC'],
          signer,
        );

        const currentPrice = await straddlesContract.getUnderlyingPrice();

        const amountOfUsdToSwap = currentPrice
          .mul(ethers.utils.parseUnits(String(amount), 8))
          .div(BigNumber.from('10000000000'));

        const swap = await get1inchSwap({
          chainId: 137,
          src: straddlesData.usd,
          dst: straddlesData.underlying,
          amount: amountOfUsdToSwap.toString(),
          from: straddlesData.straddlesContract.address,
        });

        const { purchaseParams } = get1inchParams(swap['tx']['data']);

        const { data } = await axios.get(
          `https://gasstation.polygon.technology/v2`,
        );

        const maxFeePerGas = ethers.utils.parseUnits(
          data['fast']['maxFee'].toFixed(9),
          9,
        );

        const maxPriorityFeePerGas = ethers.utils.parseUnits(
          data['fast']['maxPriorityFee'].toFixed(9),
          9,
        );

        const minAmount = BigNumber.from(swap['toAmount']).sub(
          BigNumber.from(swap['toAmount']).div(100),
        );

        await sendTx(straddlesContract, 'purchase', [
          getContractReadableAmount(amount * 2, 18),
          minAmount,
          accountAddress,
          //@ts-ignore
          purchaseParams,
          {
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit: 9000000,
          },
        ]);
      } else {
        await sendTx(
          straddlesData.straddlesContract.connect(signer),
          'purchase',
          [
            getContractReadableAmount(2 * amount, 18),
            0,
            POOL_TO_SWAPPER_IDS[selectedPoolName]!,
            accountAddress,
          ],
        );
      }
      await updateStraddlesUserData();
      await updateStraddlesEpochData();
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    signer,
    updateStraddlesEpochData,
    updateStraddlesUserData,
    straddlesData,
    straddlesEpochData,
    chainId,
    amount,
    sendTx,
    selectedPoolName,
  ]);

  const handleApprove = useCallback(async () => {
    if (!straddlesData?.straddlesContract || !signer || !contractAddresses)
      return;
    try {
      await sendTx(
        ERC20__factory.connect(straddlesData.usd, signer),
        'approve',
        [straddlesData.straddlesContract.address, MAX_VALUE],
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, straddlesData, contractAddresses]);

  const totalCost: number = useMemo(() => {
    if (!straddlesEpochData?.straddlePrice) return 0;

    return (
      getUserReadableAmount(straddlesEpochData?.straddlePrice!, 26) * amount
    );
  }, [amount, straddlesEpochData]);

  const purchaseButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (amount == 0) return 'Insert an amount';
    else if (totalCost > getUserReadableAmount(userTokenBalance, 6))
      return 'Insufficient balance';
    else if (!(straddlesData?.isVaultReady! && !straddlesData?.isEpochExpired!))
      return 'Vault not ready';
    else if (amount > getUserReadableAmount(maxStraddlesCanBeBought, 18))
      return 'Insufficient liquidity';
    return 'Purchase';
  }, [
    approved,
    amount,
    totalCost,
    userTokenBalance,
    straddlesData,
    maxStraddlesCanBeBought,
  ]);

  const isBlackout: boolean = useMemo(() => {
    if (!straddlesEpochData || !straddlesData) return false;
    const expiry = straddlesEpochData.expiry;
    const blackout = straddlesData.blackoutPeriodBeforeExpiry;
    const currentTime = Date.now() / 1000;
    return currentTime + blackout.toNumber() >= expiry.toNumber();
  }, [straddlesEpochData, straddlesData]);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !straddlesData?.straddlesContract)
        return;

      const finalAmount: BigNumber = getContractReadableAmount(amount, 6);
      const token = ERC20__factory.connect(straddlesData.usd, signer);
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        straddlesData?.straddlesContract?.address,
      );
      const balance: BigNumber = await token.balanceOf(accountAddress);
      setApproved(allowance.gte(finalAmount));
      setUserTokenBalance(balance);
    })();
  }, [
    contractAddresses,
    accountAddress,
    approved,
    amount,
    signer,
    chainId,
    straddlesData,
  ]);

  if (isLoading) return <CircularProgress />;
  else if (error === undefined || error)
    return (
      <div className="mt-4">
        <Alert severity="error">
          Error fetching price. Refresh and try again.
        </Alert>
      </div>
    );

  return (
    <div>
      <div className="bg-umbra rounded-2xl flex flex-col mb-4 px-3 pt-3 pr-2">
        <div className="flex flex-row justify-between">
          <div className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <div className="flex flex-row h-10 w-[130px] p-1">
              <img
                src={`/images/tokens/${selectedPoolName.toLowerCase()}.svg`}
                alt={selectedPoolName}
              />
              <p className="text-sm text-white text-md font-medium pl-1 pt-1.5 ml-1.5">
                Straddle
              </p>
            </div>
          </div>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            value={rawAmount}
            onChange={(e) => setRawAmount(e.target.value)}
            variant="straddles"
          />
        </div>
        <div className="my-1 w-full border-neutral-800">
          <div className="flex justify-between mx-2 pb-2 text-stieglitz text-sm">
            <div>Straddles Available:</div>
            <div>
              <NumberDisplay
                n={maxStraddlesCanBeBought || BigNumber.from(0)}
                decimals={18}
                decimalsToShow={4}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 bg-cod-gray rounded-md border border-neutral-800">
        <PnlChart
          optionPrice={totalCost}
          amount={amount}
          price={
            BigNumber.from(straddlesEpochData?.currentPrice).toNumber() / 1e8
          }
          symbol={selectedPoolName}
        />
      </div>
      <div className="mt-4 flex flex-col mb-4 p-2 w-full rounded border border-neutral-800">
        <InfoBox
          info={'Premium:'}
          value={
            getUserReadableAmount(straddlesEpochData?.straddlePremium!, 26) *
            amount
          }
          precision={2}
        />
        <InfoBox
          info={'Funding:'}
          value={
            getUserReadableAmount(straddlesEpochData?.straddleFunding!, 26) *
            amount
          }
          precision={4}
        />
        <InfoBox
          info={'Fees:'}
          value={
            getUserReadableAmount(straddlesEpochData?.purchaseFee!, 26) * amount
          }
          precision={4}
        />
        <span className="text-down-bad text-sm">
          Note that the above cost breakdown is an approximation.
        </span>
      </div>
      <div className="mt-4 flex mb-4 p-2 w-full rounded border border-neutral-800 justify-between">
        {finalCost.isZero() ? (
          approved ? (
            <span className="text-down-bad text-sm">
              Error calculating final cost
            </span>
          ) : (
            <span className="text-wave-blue text-sm">
              Please approve to see final cost
            </span>
          )
        ) : (
          <>
            <span className="text-stieglitz text-sm">You will spend </span>
            <span className="text-sm">
              {ethersUtils.formatUnits(
                finalCost.isZero()
                  ? straddlesEpochData
                      ?.straddlePremium!.add(
                        straddlesEpochData?.straddleFunding!,
                      )
                      .add(straddlesEpochData?.purchaseFee!)!
                  : finalCost,
                6,
              )}{' '}
              USDC.e
            </span>
          </>
        )}
      </div>
      <div className="mt-4 flex mb-4 p-2 w-full rounded border border-neutral-800 justify-between">
        <>
          <p className="text-xs text-stieglitz">You will swap using</p>
          <p className="text-xs">
            {chainId === 137 ? '1inch' : SWAPPER_ID_TO_ROUTE[6]}
          </p>
        </>
      </div>
      <div className="rounded-lg bg-neutral-800">
        <div className="p-3">
          <div className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-mineshaft">
            <EstimatedGasCostButton gas={5000000} chainId={chainId} />
          </div>
          {isBlackout && (
            <Tooltip title="There is a 4-hour blackout window before expiry when purchasing cannot occur">
              <div className="bg-mineshaft rounded-md flex justify-center pr-2 pl-3.5 py-3 cursor-pointer mt-3">
                <span className="mx-2 pl-1 text-stieglitz text-sm">
                  Blackout period
                </span>
              </div>
            </Tooltip>
          )}
          {!isBlackout && (
            <CustomButton
              size="medium"
              className="w-full !rounded-md mt-3"
              color={
                !approved ||
                (amount > 0 &&
                  amount <= getUserReadableAmount(maxStraddlesCanBeBought, 18))
                  ? 'primary'
                  : 'mineshaft'
              }
              disabled={
                !(
                  straddlesData?.isVaultReady! &&
                  !straddlesData?.isEpochExpired! &&
                  amount <= getUserReadableAmount(maxStraddlesCanBeBought, 18)
                )
              }
              onClick={approved ? handlePurchase : handleApprove}
            >
              {purchaseButtonMessage}
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;
