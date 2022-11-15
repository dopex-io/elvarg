import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SouthEastRoundedIcon from '@mui/icons-material/SouthEastRounded';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import { IStrategyDetails } from 'components/atlantics/Dialogs/InsuredPerps/UseStrategy';
import ContentRow from 'components/atlantics/Dialogs/InsuredPerps/UseStrategy/StrategyDetails/ContentRow';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

const StrategyDetails = (props: {
  data: IStrategyDetails;
  selectedCollateral: string;
  selectedToken: string;
  positionCollateral: BigNumber;
  quoteToken: string;
  baseToken: string;
  strategyDetailsLoading: boolean;
}) => {
  const {
    data: {
      putStrike,
      expiry,
      markPrice,
      liquidationPrice,
      positionSize,
      optionsAmount,
      putOptionsPremium,
      putOptionsfees,
      depositUnderlying,
      positionFee,
      swapFees,
      strategyFee,
    },
    selectedToken,
    positionCollateral,
    quoteToken,
    baseToken,
    strategyDetailsLoading,
  } = props;

  const { tokenPrices, tokens, chainId, atlanticPool } = useBoundStore();
  const total = useMemo((): {
    totalQuoteAsset: {
      amount: BigNumber;
      usdValue: number;
    };
    totalBaseAsset: {
      amount: BigNumber;
      usdValue: number;
    };
  } => {
    let totalBaseAsset = { amount: BigNumber.from(0), usdValue: 0 };
    let totalQuoteAsset = { amount: BigNumber.from(0), usdValue: 0 };

    let _total = {
      totalBaseAsset,
      totalQuoteAsset,
    };
    if (!tokenPrices || !tokens || !atlanticPool || strategyDetailsLoading)
      return _total;
    const { underlying, depositToken } = atlanticPool.tokens;

    const baseTokenIndex = tokens.indexOf(baseToken);
    const quoteTokenIndex = tokens.indexOf(quoteToken);

    const baseTokenPrice = tokenPrices[baseTokenIndex]?.price;
    const quoteTokenPrice = tokenPrices[quoteTokenIndex]?.price;

    if (!baseTokenPrice || !quoteTokenPrice) return _total;

    const basetokenDecimals = getTokenDecimals(baseToken, chainId);
    const quoteTokenDecimals = getTokenDecimals(quoteToken, chainId);

    if (depositUnderlying) {
      totalBaseAsset.amount = optionsAmount;
      totalBaseAsset.usdValue =
        (Number(optionsAmount) / 10 ** basetokenDecimals) * baseTokenPrice;
    }

    totalQuoteAsset.amount = totalQuoteAsset.amount.add(
      putOptionsPremium.add(putOptionsfees)
    );
    totalQuoteAsset.usdValue = getUserReadableAmount(totalQuoteAsset.amount, 6);
    if (selectedToken === underlying) {
      totalBaseAsset.amount = totalBaseAsset.amount
        .add(positionCollateral)
        .add(positionFee)
        .add(strategyFee);
      totalBaseAsset.usdValue =
        totalBaseAsset.usdValue +
        getUserReadableAmount(positionCollateral, basetokenDecimals) *
          baseTokenPrice;
    }

    if (selectedToken === depositToken) {
      totalQuoteAsset.amount = totalQuoteAsset.amount
        .add(positionCollateral)
        .add(positionFee)
        .add(swapFees)
        .add(strategyFee);
      totalQuoteAsset.usdValue =
        totalQuoteAsset.usdValue +
        getUserReadableAmount(positionCollateral, quoteTokenDecimals) *
          quoteTokenPrice;
    }

    return {
      totalQuoteAsset,
      totalBaseAsset,
    };
  }, [
    chainId,
    strategyFee,
    swapFees,
    positionFee,
    putOptionsPremium,
    atlanticPool,
    putOptionsfees,
    tokenPrices,
    tokens,
    depositUnderlying,
    optionsAmount,
    positionCollateral,
    selectedToken,
    baseToken,
    quoteToken,
    strategyDetailsLoading,
  ]);

  return (
    <Box className="w-full flex flex-col">
      <Box className="border border-umbra rounded-xl w-full divide-y divide-umbra">
        <Box className="flex flex-row">
          <Tooltip
            title="Put strike that will be purchased for insurance"
            enterTouchDelay={0}
            leaveTouchDelay={1000}
          >
            <Box className="flex-1 p-4 border-r border-umbra">
              <Box className="flex space-y-1 flex-col">
                <Typography variant="h6">
                  {getUserReadableAmount(putStrike, 8)}
                </Typography>
                <Typography variant="h6" color="stieglitz">
                  Put Strike
                </Typography>
              </Box>
            </Box>
          </Tooltip>
          <Tooltip
            title="Expiry of the pool, after which users' long position will be unwinded to closed"
            enterTouchDelay={0}
          >
            <Box className="flex-1 p-4">
              <Box className="flex space-y-1 flex-col">
                <Typography variant="h6">
                  {new Date(expiry.mul(1000).toNumber()).toDateString()}
                </Typography>
                <Typography variant="h6" color="stieglitz">
                  Expiry
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>
        <Box className="flex flex-col p-3">
          <Box className="flex space-x-1">
            <ReceiptIcon className="fill-current text-stieglitz p-1" />
            <Typography variant="h6" color="stieglitz">
              Futures Position
            </Typography>
          </Box>
          <ContentRow title="Index Token" content="WETH" />
          <ContentRow
            title="Mark Price"
            content={
              '$' + formatAmount(getUserReadableAmount(markPrice, 30), 3)
            }
          />
          <ContentRow
            title="Liquidation Price"
            content={
              '$' + formatAmount(getUserReadableAmount(liquidationPrice, 8), 3)
            }
          />
          <ContentRow
            title="Position Size"
            content={
              '$' + formatAmount(getUserReadableAmount(positionSize, 30), 3)
            }
          />
          {!swapFees.isZero() && (
            <ContentRow
              title="Swap Fee"
              content={formatAmount(
                getUserReadableAmount(
                  swapFees,
                  getTokenDecimals(selectedToken, chainId)
                ),
                3
              )}
            />
          )}
        </Box>
        <Box className="flex flex-col p-3">
          <Box className="flex space-x-1">
            <SouthEastRoundedIcon className="fill-current text-down-bad p-1" />
            <Typography variant="h6" color="stieglitz">
              Put Option
            </Typography>
          </Box>
          <ContentRow
            title="Premium"
            content={
              '$' + formatAmount(getUserReadableAmount(putOptionsPremium, 6), 3)
            }
          />
          <ContentRow
            title="Options Fee"
            content={
              '$' + formatAmount(getUserReadableAmount(putOptionsfees, 6), 3)
            }
          />
          <ContentRow
            title="Options"
            content={formatAmount(getUserReadableAmount(optionsAmount, 18), 3)}
          />
        </Box>
      </Box>
      <Box className="bg-umbra border border-umbra rounded-lg p-3 mt-2">
        <Box className="bg-carbon rounded-lg p-3">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
          <ContentRow
            title="Strategy Fee"
            content={
              '$' +
              formatAmount(
                getUserReadableAmount(
                  strategyFee,
                  getTokenDecimals(selectedToken, chainId)
                ),
                3
              )
            }
          />
          <ContentRow
            title="Position Fee"
            content={
              '$' +
              formatAmount(
                getUserReadableAmount(
                  positionFee,
                  getTokenDecimals(selectedToken, chainId)
                ),
                3
              )
            }
          />
          <ContentRow
            title="Total"
            content={
              <Box className="flex justify-center items-center">
                <Box className="flex justify-center items-center">
                  <Typography variant="h6">
                    {formatAmount(
                      getUserReadableAmount(total.totalBaseAsset.amount, 18),
                      5
                    )}
                  </Typography>
                  <img
                    src={`/images/tokens/${baseToken.toLowerCase()}.svg`}
                    alt={baseToken.toLowerCase()}
                    className="h-[1rem] mx-1"
                  />
                </Box>
                <Typography variant="h6">{' + '}</Typography>
                <Box className="ml-2 flex justify-center items-center">
                  <Typography variant="h6">
                    {formatAmount(
                      getUserReadableAmount(total.totalQuoteAsset.amount, 6),
                      5
                    )}
                  </Typography>
                  <img
                    src={`/images/tokens/${quoteToken.toLowerCase()}.svg`}
                    alt={quoteToken.toLowerCase()}
                    className="h-[1rem] ml-1"
                  />
                </Box>
              </Box>
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StrategyDetails;
