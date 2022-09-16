import { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import { IStrategyDetails } from 'components/atlantics/Manage/ManageCard/PositionManager/OpenPositionDialog';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import getTokenDecimals from 'utils/general/getTokenDecimals';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

const StrategyDetails = (props: {
  data: IStrategyDetails;
  selectedCollateral: string;
  selectedToken: string;
  positionCollateral: BigNumber;
  quoteToken: string;
  baseToken: string;
}) => {
  const {
    data: {
      putStrike,
      expiry,
      liquidationPrice,
      positionSize,
      optionsAmount,
      putOptionsPremium,
      putOptionsfees,
      depositUnderlying,
    },
    selectedToken,
    positionCollateral,
    quoteToken,
    baseToken,
  } = props;

  const { tokenPrices, tokens } = useContext(AssetsContext);
  const { chainId } = useContext(WalletContext);

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

    if (!tokenPrices || !tokens) return _total;

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

    if (selectedToken === 'WETH') {
      totalBaseAsset.amount = totalBaseAsset.amount.add(positionCollateral);
      totalBaseAsset.usdValue =
        totalBaseAsset.usdValue +
        getUserReadableAmount(positionCollateral, basetokenDecimals) *
          baseTokenPrice;
    }
    if (selectedToken === 'USDC') {
      totalQuoteAsset.amount = totalQuoteAsset.amount.add(positionCollateral);
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
    putOptionsPremium,
    putOptionsfees,
    tokenPrices,
    tokens,
    depositUnderlying,
    optionsAmount,
    positionCollateral,
    selectedToken,
    baseToken,
    quoteToken,
  ]);

  console.log('expiry', expiry);
  return (
    <Box className="w-full flex flex-col">
      <Box className="border border-neutral-800 rounded-xl w-full">
        <Box className="flex flex-row">
          <Tooltip title="Put strike that will be purchased for insurance">
            <Box className="flex-1 p-4 border-r-2 border-neutral-800">
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
          <Tooltip title="Expiry of the pool, After which users' long position will be unwinded to closed">
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
      </Box>
      <Box className="border border-neutral-800 mt-2 bg-umbra w-full p-4 rounded-xl">
        <Box className="flex flex-col w-full bg-neutral-800 rounded-md p-4">
          <Typography variant="h6" className="mb-2">
            Futures Position Details
          </Typography>
          <ContentRow title="Index Token" content="WETH" />
          <ContentRow
            title="Liquidation Price"
            content={
              '$' + formatAmount(getUserReadableAmount(liquidationPrice, 30), 3)
            }
          />
          <ContentRow
            title="Position Size"
            content={
              '$' + formatAmount(getUserReadableAmount(positionSize, 30), 3)
            }
          />
          <Divider className="bg-mineshaft my-2" />
          <Typography variant="h6" className="mt-2 mb-2">
            Put Options Details
          </Typography>
          <ContentRow
            title="Premium + Fees"
            content={
              '$' +
              formatAmount(getUserReadableAmount(putOptionsPremium, 6), 3) +
              ' + ' +
              '$' +
              formatAmount(getUserReadableAmount(putOptionsfees, 6), 3)
            }
          />
          <ContentRow
            title="Amount"
            content={formatAmount(getUserReadableAmount(optionsAmount, 18), 3)}
          />
        </Box>
      </Box>
      <Box className="border border-mineshaft rounded-lg px-2 py-2 mt-2">
        <Box className="flex justify-between px-4">
          <Typography variant="h6" className="mr-2">
            {' '}
            Σ{' '}
          </Typography>
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
                className="h-[1rem]  ml-1"
              />
            </Box>
            <Typography className="text-xs ml-2" variant="caption">
              $(
              {formatAmount(
                total.totalBaseAsset.usdValue + total.totalQuoteAsset.usdValue,
                3
              )}
              )
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface IContentRowProps {
  title: string;
  content: string | number;
}

const ContentRow = ({ title, content }: IContentRowProps) => {
  return (
    <Box className="flex space-y-2 flex-row w-full justify-between items-center">
      <Typography variant="h6" color="stieglitz">
        {title}
      </Typography>
      <Typography variant="h6">{content}</Typography>
    </Box>
  );
};

export default StrategyDetails;
