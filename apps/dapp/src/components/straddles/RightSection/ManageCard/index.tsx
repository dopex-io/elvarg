import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { collateralTokenSymbol } from 'pages/straddles/[market]';

import { getStraddleOptionsPrice } from 'components/temp/utils/straddles/getStraddleOptionsPrice';

import { formatAmount } from 'utils/general';

import DepositInformation from './components/DepositInformation';
import ErrorMessage from './components/ErrorMessage';
import InputSection from './components/Input';
import PurchaseInformation from './components/PurchaseInformation';
import SettingsSection from './components/SettingsSection';
import UserBalanceSection from './components/UserBalanceSection';

export type InputAmountType = {
  contractReadable: bigint;
  userReadable: string;
};

const collateralTokenDecimals = 6;
const userCollateralTokenBalance = {
  userReadable: '200.096',
  contractReadable: BigInt(200000000),
};
const userCollateralTokenAllowance = BigInt(100000000);

const ManageCard = () => {
  const [isPurchase, setIsPurchase] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<InputAmountType>({
    contractReadable: BigInt(0),
    userReadable: '0',
  });

  const handleInputChange = useCallback(
    (e: {
      target: {
        value: any;
      };
    }) => {
      const { value } = e.target;
      if (isNaN(value)) return;
      setInputAmount({
        contractReadable: parseUnits(value, collateralTokenDecimals),
        userReadable: value,
      });
    },
    [],
  );

  return (
    <div className="w-full h-max-content">
      <div className="h-full w-full bg-cod-gray rounded-md flex flex-col px-2 py-3 space-y-2">
        <SettingsSection
          isPurchase={isPurchase}
          setIsPurchase={setIsPurchase}
        />
        <InputSection
          handleChange={handleInputChange}
          value={inputAmount.userReadable}
        />
        <UserBalanceSection
          isPurchase={isPurchase}
          userBalance={userCollateralTokenBalance.userReadable}
        />
        {isPurchase ? (
          <PurchaseInformation inputAmount={inputAmount} />
        ) : (
          <DepositInformation inputAmount={inputAmount} />
        )}
      </div>
    </div>
  );
};

export default ManageCard;
