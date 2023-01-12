import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils as ethersUtils } from 'ethers';
import { ERC20__factory } from '@dopex-io/sdk';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, CircularProgress, Input, Tooltip } from '@mui/material';

import useSendTx from 'hooks/useSendTx';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import NumberDisplay from 'components/UI/NumberDisplay';
import PnlChart from '../PnlChart';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { MAX_VALUE } from 'constants/index';

import oneEBigNumber from 'utils/math/oneEBigNumber';
import formatAmount from 'utils/general/formatAmount';

const POOL_TO_SWAPPER_IDS: { [key: string]: number[] } = {
  ETH: [2, 3],
  DPX: [5, 6],
  RDPX: [5, 6],
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
    <Box className="flex justify-between mb-2">
      <Typography variant="caption" color="stieglitz">
        {info}
      </Typography>
      <Typography variant="caption">
        ~{`${formatAmount(value, precision)} USDC`}
      </Typography>
    </Box>
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

  const [bestSwapperId, setBestSwapperId] = useState<number>(
    POOL_TO_SWAPPER_IDS[selectedPoolName]![0]!
  );

  const { isLoading, error, data } = useQuery(
    ['currentPrice'],
    () => straddlesData?.straddlesContract?.getUnderlyingPrice(),
    { initialData: oneEBigNumber(8) }
  );

  const [finalCost, setFinalCost] = useState(BigNumber.from(0));

  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const maxStraddlesCanBeBought = useMemo(() => {
    if (isLoading || error || !data) return BigNumber.from(0);

    const availableUsdDeposits = straddlesEpochData?.usdDeposits.sub(
      BigNumber.from(straddlesEpochData?.activeUsdDeposits).div(
        '100000000000000000000'
      )
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

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  useEffect(() => {
    async function updateFinalCost() {
      if (!accountAddress || !signer || !straddlesData?.straddlesContract)
        return;

      const promises = [];

      for (let i in POOL_TO_SWAPPER_IDS[selectedPoolName]) {
        const swapperId = POOL_TO_SWAPPER_IDS[selectedPoolName]![Number(i)]!;

        promises.push(
          straddlesData.straddlesContract
            .connect(signer)
            .callStatic.purchase(
              getContractReadableAmount(2 * amount, 18),
              0,
              swapperId,
              accountAddress
            )
        );
      }

      const responses = await Promise.all(promises);

      let bestProtocolFee: BigNumber = BigNumber.from('0');
      let bestStraddleCost: BigNumber = BigNumber.from('0');
      let _bestSwapperId: number = 0;

      for (let i in POOL_TO_SWAPPER_IDS[selectedPoolName]) {
        const swapperId = POOL_TO_SWAPPER_IDS[selectedPoolName]![Number(i)]!;

        const { protocolFee, straddleCost } = responses[Number(i)]!;

        if (bestStraddleCost.eq(0) || straddleCost.lt(bestStraddleCost)) {
          bestProtocolFee = protocolFee;
          bestStraddleCost = straddleCost;
          _bestSwapperId = swapperId;
        }
      }

      setFinalCost(bestProtocolFee.add(bestStraddleCost));
      setBestSwapperId(_bestSwapperId);
    }

    try {
      updateFinalCost();
    } catch (e) {
      console.log(e);
    }
  }, [accountAddress, amount, selectedPoolName, signer, straddlesData]);

  // Handle Purchase
  const handlePurchase = useCallback(async () => {
    if (
      !accountAddress ||
      !signer ||
      !updateStraddlesEpochData ||
      !updateStraddlesUserData ||
      !straddlesData?.straddlesContract
    )
      return;

    try {
      await sendTx(
        straddlesData.straddlesContract.connect(signer),
        'purchase',
        [
          getContractReadableAmount(2 * amount, 18),
          0,
          bestSwapperId,
          accountAddress,
        ]
      );
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
    sendTx,
    amount,
    bestSwapperId,
  ]);

  const handleApprove = useCallback(async () => {
    if (!straddlesData?.straddlesContract || !signer || !contractAddresses)
      return;
    try {
      await sendTx(
        ERC20__factory.connect(straddlesData.usd, signer),
        'approve',
        [straddlesData.straddlesContract.address, MAX_VALUE]
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
    else if (
      getUserReadableAmount(totalCost, 26) >
      getUserReadableAmount(userTokenBalance, 6)
    )
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
        straddlesData?.straddlesContract?.address
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
      <Box className="mt-4">
        <Alert severity="error">
          Error fetching price. Refresh and try again.
        </Alert>
      </Box>
    );

  return (
    <Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-[130px] p-1">
              <img
                src={`/images/tokens/${selectedPoolName.toLowerCase()}.svg`}
                alt={selectedPoolName}
              />
              <Typography
                variant="h6"
                className="text-stieglitz text-md font-medium pl-1 pt-1.5 ml-1.5"
              >
                <span className="text-white">Straddle</span>
              </Typography>
            </Box>
          </Box>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawAmount}
            onChange={(e) => setRawAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <Box className="my-1 w-full border-neutral-800">
          <Typography
            variant="h6"
            className="flex justify-between mx-2 pb-2 text-gray-400"
          >
            <Box>Max amount of straddles available:</Box>
            <Box>
              <NumberDisplay
                n={maxStraddlesCanBeBought || BigNumber.from(0)}
                decimals={18}
                decimalsToShow={4}
              />
            </Box>
          </Typography>
        </Box>
      </Box>
      <Box className="p-3 bg-cod-gray rounded-md border border-neutral-800">
        <PnlChart
          optionPrice={totalCost}
          amount={amount}
          price={BigNumber.from(straddlesEpochData?.currentPrice)
            .div(1e8)
            .toNumber()}
          symbol={selectedPoolName}
        />
      </Box>
      <Box className="mt-4 flex flex-col mb-4 p-2 w-full rounded border border-neutral-800">
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
        <Typography variant="caption" color="down-bad">
          Note that the above cost breakdown is an approximation.
        </Typography>
      </Box>
      <Box className="mt-4 flex mb-4 p-2 w-full rounded border border-neutral-800 justify-between">
        {finalCost.isZero() ? (
          approved ? (
            <Typography variant="caption" color="down-bad">
              Error calculating final cost
            </Typography>
          ) : (
            <Typography variant="caption" color="wave-blue">
              Please approve to see final cost
            </Typography>
          )
        ) : (
          <>
            <Typography variant="caption" color="stieglitz">
              You will spend{' '}
            </Typography>
            <Typography variant="caption">
              {ethersUtils.formatUnits(finalCost, 6)} USDC
            </Typography>
          </>
        )}
      </Box>
      <Box className="mt-4 flex mb-4 p-2 w-full rounded border border-neutral-800 justify-between">
        {bestSwapperId === 0 ? (
          <Box className="flex">
            <CircularProgress className="text-stieglitz mr-2" size={13} />
            <Typography variant="caption" color="stieglitz">
              Calculating best route...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="caption" color="stieglitz">
              You will swap using
            </Typography>

            <Typography variant="caption">
              {SWAPPER_ID_TO_ROUTE[bestSwapperId]}
            </Typography>
          </>
        )}
      </Box>
      <Box className="rounded-lg bg-neutral-800">
        <Box className="p-3">
          <Box className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-mineshaft">
            <EstimatedGasCostButton gas={5000000} chainId={chainId} />
          </Box>
          {isBlackout && (
            <Tooltip title="There is a 4-hour blackout window before expiry when purchasing cannot occur">
              <Box className="bg-mineshaft rounded-md flex justify-center pr-2 pl-3.5 py-3 cursor-pointer mt-3">
                <Typography
                  variant="h6"
                  className="mx-2 pl-1"
                  color="stieglitz"
                >
                  Blackout period
                </Typography>
              </Box>
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
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseCard;
