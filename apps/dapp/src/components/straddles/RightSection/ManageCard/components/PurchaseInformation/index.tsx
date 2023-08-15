import React, { useMemo } from 'react';
import { parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';

import { getStraddleOptionsPrice } from 'components/temp/utils/straddles/getStraddleOptionsPrice';

import { formatAmount } from 'utils/general';

import { InputAmountType } from '../..';
import ErrorMessage from '../ErrorMessage';

// import CardInformationSection from './components/CardInformationSection';
// import PremiumSection from './components/PremiumSection';
// import Strikes from './components/Strikes';

const collateralTokenDecimals = 6;
const userCollateralTokenBalance = {
  userReadable: '200.096',
  contractReadable: BigInt(200000000),
};
const userCollateralTokenAllowance = BigInt(100000000);
export const collateralTokenSymbol = 'USDC';

type PurchaseInformationProps = {
  inputAmount: InputAmountType;
};

const PurchaseInformation = ({ inputAmount }: PurchaseInformationProps) => {
  const straddleInformation = useMemo(() => {
    const currentPrice = 1850;
    const strike = 1850;
    const iv = 0.5;
    const expiry = new Date().getTime() + 86400000 * 3;
    const premium = getStraddleOptionsPrice(strike, currentPrice, iv, expiry);
    const totalPremium = premium * Number(inputAmount.userReadable);
    const funding = 11.23;
    const upperBreakeven = currentPrice + premium;
    const lowerBreakEven = currentPrice - premium;

    return {
      totalCost: {
        userReadable: formatAmount(totalPremium, 2),
        contractReadable: parseUnits(
          totalPremium.toString(),
          collateralTokenDecimals,
        ),
      },
      premium: formatAmount(totalPremium, 4),
      optionsSize: formatAmount(inputAmount.userReadable, 3),
      upperBreakeven: formatAmount(upperBreakeven, 2),
      lowerBreakeven: formatAmount(lowerBreakEven, 2),
      strike: formatAmount(strike, 3),
      funding: formatAmount(funding, 3),
    };
  }, [inputAmount.userReadable]);

  const meta = useMemo(() => {
    let errorMessage = '';
    let approved = false;
    let disabled = false;

    if (inputAmount.contractReadable === 0n) {
      errorMessage = 'Please begin by entering amount of options to buy.';
      disabled = true;
    }

    if (
      errorMessage === '' &&
      userCollateralTokenAllowance <
        straddleInformation.totalCost.contractReadable &&
      userCollateralTokenBalance.contractReadable >=
        straddleInformation.totalCost.contractReadable
    ) {
      errorMessage = `Please approve your ${collateralTokenSymbol}.`;
    } else {
      approved = true;
    }

    if (
      errorMessage === '' &&
      userCollateralTokenBalance.contractReadable <
        straddleInformation.totalCost.contractReadable &&
      straddleInformation.totalCost.contractReadable !== 0n
    ) {
      errorMessage = `Insufficent ${collateralTokenSymbol} balance to pay total cost.`;
      disabled = true;
    }

    return {
      errorMessage: errorMessage,
      approved: approved,
      buttonDisabled: disabled,
      buttonColor: (disabled ? 'mineshaft' : 'primary') as
        | 'mineshaft'
        | 'mineshaft',
      buttonText: approved ? 'Purchase' : 'Approve',
    };
  }, [
    inputAmount.contractReadable,
    straddleInformation.totalCost.contractReadable,
  ]);

  return (
    <div className="w-full flex flex-col space-y-2">
      <ErrorMessage errorMessage={meta.errorMessage} />
      <Strikes
        upperBreakeven={straddleInformation.upperBreakeven}
        loading={false}
        strike={straddleInformation.strike}
        lowerBreakEven={straddleInformation.lowerBreakeven}
      />
      <PremiumSection premium={straddleInformation.premium} />
      <CardInformationSection
        totalCost={straddleInformation.totalCost.userReadable}
        funding={straddleInformation.funding}
        optionsSize={straddleInformation.optionsSize}
      />
      <Button disabled={meta.buttonDisabled} color={meta.buttonColor}>
        {meta.buttonText}
      </Button>
    </div>
  );
};

export default PurchaseInformation;
