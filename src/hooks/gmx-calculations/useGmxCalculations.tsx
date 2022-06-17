import React, { useContext, useEffect } from 'react';

import { AssetsContext } from 'contexts/Assets';
import oneEBigNumber from 'utils/math/oneEBigNumber';
import { BigNumber } from 'ethers';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import { WalletContext } from 'contexts/Wallet';

/**
 * GMX related calculations in 30 decimal values
 */

const useGmxCalculations = () => {
  const { tokenPrices, tokens } = useContext(AssetsContext);
  const { chainId } = useContext(WalletContext);

  const THIRTY_DECIMALS = oneEBigNumber(30);

  const to30DecimalsUSDG = (token: string) => {
    const tokenInfo = tokenPrices[tokens.indexOf(token)];
    if (!tokenInfo) return BigNumber.from(0);
    const tokenPrice = BigNumber.from(tokenInfo.price.toFixed(0));
    return tokenPrice.mul(THIRTY_DECIMALS);
  };

  const getCollateralAccess = (
    positionColleral: BigNumber,
    positionSize: BigNumber,
    leverage: BigNumber
  ) => {
    return positionSize.sub(positionColleral);
  };

  const getOptionsAmountToPurchase = () => {};

  const getPurchaseableStrike = () => {};

  const getPositionSize = (
    token: string,
    amount: BigNumber,
    // 1e8 Decimals
    leverage: BigNumber
  ): BigNumber => {
    const tokenDecimals = getTokenDecimals(token, chainId);
    return to30DecimalsUSDG(token)
      .mul(amount)
      .div(oneEBigNumber(tokenDecimals))
      .mul(leverage)
      .div(1e8);
  };

  return {
    getPositionSize,
  };
};

export default useGmxCalculations;
