import { useState, useContext, useMemo } from 'react';
import { isWithinInterval } from 'date-fns';
import { ERC20 } from '@dopex-io/sdk';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';
import { PortfolioContext } from 'contexts/Portfolio';

import { OptionActionTypeEnum, OptionPoolBrokerTransaction } from 'types';

interface Args {
  strike: string;
  userBalance: string;
  expiry: string;
  asset: string;
  assetPrice: string;
  isPut: boolean;
  optionsContract: ERC20;
  optionsContractId: string;
  claimAmount?: string;
}

const useOptionActions = (args: Args) => {
  const {
    strike,
    userBalance,
    expiry,
    asset,
    assetPrice,
    isPut,
    optionsContract,
    optionsContractId,
    claimAmount,
  } = args;

  const { blockTime } = useContext(WalletContext);
  const { selectedBaseAssetDecimals, usdtDecimals } = useContext(AssetsContext);
  const { userTransactions } = useContext(PortfolioContext);

  const premium = useMemo(() => {
    const optionPurchase = userTransactions.filter(
      (txn: OptionPoolBrokerTransaction) => {
        return (
          txn.__typename === 'OptionPurchase' &&
          txn.strike === strike &&
          txn.expiry === expiry &&
          txn.isPut === isPut
        );
      }
    );

    const purchasePremium: any = optionPurchase.reduce(
      (prevTxn: any, txn: any) => {
        return Number(prevTxn.premium) || 0 + Number(txn.premium) || 0;
      },
      0
    );

    return purchasePremium ? getUserReadableAmount(purchasePremium, 6) : 0;
  }, [userTransactions, strike, expiry, isPut]);

  const [modal, setModal] = useState<{
    type: OptionActionTypeEnum;
    open: boolean;
    data?: {
      strike: string;
      userBalance: string;
      expiry: string;
      asset: string;
      isPut: boolean;
      optionsContract: ERC20;
      optionsContractId: string;
      assetPrice: string;
      pnl?: number;
      claimAmount?: string;
      userClaimAmount?: number;
    };
  }>({
    type: OptionActionTypeEnum.Exercise,
    open: false,
    data: null,
  });

  const closeModal = () => setModal((s) => ({ ...s, open: false }));

  const handleTransfer = () =>
    setModal({
      type: OptionActionTypeEnum.Transfer,
      open: true,
      data: {
        strike,
        userBalance,
        expiry,
        asset,
        isPut,
        optionsContract,
        optionsContractId,
        assetPrice,
      },
    });

  const handleExercise = () =>
    setModal({
      type: OptionActionTypeEnum.Exercise,
      open: true,
      data: {
        strike,
        userBalance,
        expiry,
        asset,
        isPut,
        pnl,
        optionsContract,
        optionsContractId,
        assetPrice,
      },
    });

  const handleSwap = () =>
    setModal({
      open: true,
      type: OptionActionTypeEnum.Swap,
      data: {
        strike,
        userBalance,
        optionsContract,
        optionsContractId,
        isPut,
        asset,
        pnl,
        assetPrice,
        expiry,
      },
    });

  const handleDelegate = () =>
    setModal({
      open: true,
      type: OptionActionTypeEnum.AutoExercise,
      data: {
        strike,
        assetPrice,
        pnl,
        expiry,
        userBalance,
        optionsContract,
        optionsContractId,
        isPut,
        asset,
      },
    });

  const handleWithdraw = () =>
    setModal({
      open: true,
      type: OptionActionTypeEnum.Withdraw,
      data: {
        strike,
        assetPrice,
        pnl,
        expiry,
        userBalance,
        optionsContract,
        optionsContractId,
        isPut,
        asset,
      },
    });

  const handleClaim = () =>
    setModal({
      open: true,
      type: OptionActionTypeEnum.Claim,
      data: {
        strike,
        assetPrice,
        pnl,
        expiry,
        userBalance,
        optionsContract,
        optionsContractId,
        isPut,
        asset,
        claimAmount,
        userClaimAmount,
      },
    });

  const expiryDate = new Date(Number(expiry) * 1000);

  const isExpired = useMemo(
    () => !(blockTime * 1000 < parseInt(expiry) * 1000),
    [blockTime, expiry]
  );

  const canExercise = isWithinInterval(new Date(blockTime * 1000), {
    start: new Date(Number(expiry) * 1000).setUTCHours(7, 0, 0, 0),
    end: new Date(Number(expiry) * 1000).setUTCHours(8, 0, 0, 0),
  });

  const fStrike = getUserReadableAmount(strike, 8);

  const balance = getUserReadableAmount(userBalance, selectedBaseAssetDecimals);

  const currentPrice = getUserReadableAmount(assetPrice, 8);

  let currentValue = isPut
    ? (fStrike - currentPrice) * balance
    : (currentPrice - fStrike) * balance;

  currentValue = currentValue < 0 ? 0 : currentValue;

  const pnl = !isExpired ? currentValue - premium : 0;

  const userClaimAmount =
    (isPut
      ? getUserReadableAmount(Number(claimAmount ?? 0), usdtDecimals)
      : getUserReadableAmount(
          Number(claimAmount ?? 0),
          selectedBaseAssetDecimals
        )) * currentPrice;

  return {
    modal,
    expiryDate,
    isExpired,
    canExercise,
    closeModal,
    handleTransfer,
    handleExercise,
    handleSwap,
    handleDelegate,
    handleWithdraw,
    handleClaim,
    userClaimAmount,
    premium,
    currentValue: currentValue < 0 ? 0 : currentValue,
    pnl,
  };
};

export default useOptionActions;
