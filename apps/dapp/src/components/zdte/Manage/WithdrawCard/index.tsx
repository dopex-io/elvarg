import { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { Input as MuiInput } from '@mui/material';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { ZdteLP__factory } from 'mocks/factories/ZdteLP__factory';
import { useBoundStore } from 'store';

import { IStaticZdteData, IZdteData, IZdteUserData } from 'store/Vault/zdte';

import { CustomButton, Typography } from 'components/UI';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import Loading from 'components/zdte/Loading';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

class QuoteOrBaseAsset {
  private isQuote: boolean;
  private zdteData: IZdteData;
  private userZdteLpData: IZdteUserData;
  private staticZdteData: IStaticZdteData;

  constructor(
    isQuote: boolean,
    zdteData: IZdteData,
    userZdteLpData: IZdteUserData,
    staticZdteData: IStaticZdteData
  ) {
    this.isQuote = isQuote;
    this.zdteData = zdteData;
    this.userZdteLpData = userZdteLpData;
    this.staticZdteData = staticZdteData;
  }

  get getUserAssetBalance() {
    return this.isQuote
      ? getUserReadableAmount(
          this.userZdteLpData?.userQuoteLpBalance!,
          DECIMALS_USD
        )
      : getUserReadableAmount(
          this.userZdteLpData?.userBaseLpBalance!,
          DECIMALS_TOKEN
        );
  }

  get getRawUserAssetBalance() {
    return this.isQuote
      ? this.userZdteLpData?.userQuoteLpBalance
      : this.userZdteLpData?.userBaseLpBalance;
  }

  get getAssetSymbol() {
    return this.isQuote
      ? this.staticZdteData?.quoteLpSymbol
      : this.staticZdteData?.baseLpSymbol;
  }

  get getAssetAddress() {
    return this.isQuote
      ? this.staticZdteData?.quoteLpContractAddress
      : this.staticZdteData?.baseLpContractAddress;
  }

  get getActualLpBalance() {
    return this.isQuote
      ? getUserReadableAmount(this.zdteData.quoteLpAssetBalance!, DECIMALS_USD)
      : getUserReadableAmount(
          this.zdteData.baseLpAssetBalance!,
          DECIMALS_TOKEN
        );
  }

  get getTotalAsset() {
    return this.isQuote
      ? getUserReadableAmount(this.zdteData.quoteLpTotalAsset, DECIMALS_USD)
      : getUserReadableAmount(this.zdteData.baseLpTotalAsset, DECIMALS_TOKEN);
  }

  get coolingPeriodOver() {
    return this.isQuote
      ? this.userZdteLpData.canWithdrawQuote
      : this.userZdteLpData.canWithdrawBase;
  }
}

const Withdraw = () => {
  const sendTx = useSendTx();

  const {
    signer,
    provider,
    getZdteContract,
    zdteData,
    updateZdteData,
    userZdteLpData,
    accountAddress,
    staticZdteData,
  } = useBoundStore();

  const [tokenWithdrawAmount, setTokenWithdrawAmount] = useState<
    string | number
  >('');
  const [tokenApproved, setTokenApproved] = useState<boolean>(false);
  const [isQuote, setisQuote] = useState(true);
  const asset = useMemo(() => {
    if (!zdteData || !userZdteLpData || !staticZdteData) {
      return null;
    }
    return new QuoteOrBaseAsset(
      isQuote,
      zdteData,
      userZdteLpData,
      staticZdteData
    );
  }, [isQuote, userZdteLpData, zdteData, staticZdteData]);

  const handleApprove = useCallback(async () => {
    if (!signer || !asset || !staticZdteData || !accountAddress) return;

    try {
      await sendTx(
        ZdteLP__factory.connect(asset.getAssetAddress, signer),
        'approve',
        [
          staticZdteData?.zdteAddress,
          getContractReadableAmount(
            tokenWithdrawAmount,
            isQuote ? DECIMALS_USD : DECIMALS_TOKEN
          ),
        ]
      );
      const tokenContract = await ZdteLP__factory.connect(
        asset.getAssetAddress,
        signer
      );
      const allowance: BigNumber = await tokenContract.allowance(
        accountAddress,
        staticZdteData?.zdteAddress
      );
      const withdrawAmount = getContractReadableAmount(
        tokenWithdrawAmount,
        isQuote ? DECIMALS_USD : DECIMALS_TOKEN
      );
      setTokenApproved(
        allowance.gt(BigNumber.from(0)) && allowance.gte(withdrawAmount)
      );
    } catch (err) {
      console.log('handle approval: ', err);
    }
  }, [
    staticZdteData,
    signer,
    sendTx,
    asset,
    tokenWithdrawAmount,
    accountAddress,
    isQuote,
  ]);

  const checkApproved = useCallback(async () => {
    if (!accountAddress || !signer || !staticZdteData || !asset) return;
    try {
      const tokenContract = await ZdteLP__factory.connect(
        asset.getAssetAddress,
        signer
      );
      const allowance: BigNumber = await tokenContract.allowance(
        accountAddress,
        staticZdteData?.zdteAddress
      );
      const withdrawAmount = getContractReadableAmount(
        tokenWithdrawAmount,
        isQuote ? DECIMALS_USD : DECIMALS_TOKEN
      );
      setTokenApproved(
        allowance.gt(BigNumber.from(0)) && allowance.gte(withdrawAmount)
      );
    } catch (err) {
      console.log('check approved: ', err);
    }
  }, [accountAddress, signer, staticZdteData, asset, tokenWithdrawAmount]);

  // Updates approved state and user balance
  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  const handleWithdrawAmount = (e: {
    target: { value: React.SetStateAction<string | number> };
  }) => setTokenWithdrawAmount(e.target.value);

  const handleWithdraw = useCallback(async () => {
    if (!signer || !provider || !getZdteContract) return;

    try {
      const zdteContract = await getZdteContract();
      await sendTx(zdteContract.connect(signer), 'withdraw', [
        isQuote,
        getContractReadableAmount(
          tokenWithdrawAmount,
          isQuote ? DECIMALS_USD : DECIMALS_TOKEN
        ),
      ]).then(() => {
        setTokenWithdrawAmount('0');
        updateZdteData();
      });
    } catch (e) {
      console.log('fail to withdraw', e);
    }
  }, [
    signer,
    provider,
    sendTx,
    updateZdteData,
    tokenWithdrawAmount,
    getZdteContract,
    isQuote,
  ]);

  const canWithdraw =
    asset &&
    Number(tokenWithdrawAmount) > 0 &&
    Number(tokenWithdrawAmount) <= asset.getUserAssetBalance &&
    Number(tokenWithdrawAmount) <= asset.getActualLpBalance &&
    asset.coolingPeriodOver;

  if (!staticZdteData) {
    return <Loading />;
  }

  return (
    <div className="rounded-xl space-y-2 p-2">
      <div className="rounded-xl">
        <div className="flex flex-row justify-between">
          <div className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
            <div className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  !isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(true)}
              >
                {staticZdteData.quoteLpSymbol}
              </Typography>
            </div>
            <div className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(false)}
              >
                {staticZdteData.baseLpSymbol}
              </Typography>
            </div>
          </div>
          <MuiInput
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-md text-white font-mono mr-2"
            value={tokenWithdrawAmount}
            onChange={handleWithdrawAmount}
            classes={{ input: 'text-right' }}
          />
        </div>
      </div>
      <div className="p-2 space-y-2">
        <ContentRow
          title="Balance"
          content={`${formatAmount(
            !asset ? 0 : asset.getUserAssetBalance,
            2
          )} ${!asset ? '' : asset.getAssetSymbol}`}
        />
        <ContentRow
          title="Available Liquidity"
          content={`${formatAmount(!asset ? 0 : asset.getTotalAsset, 2)} ${
            !asset ? '' : asset.getAssetSymbol
          }`}
        />
        <ContentRow
          title="Total Liquidity"
          content={`${formatAmount(!asset ? 0 : asset.getActualLpBalance, 2)} ${
            !asset ? '' : asset.getAssetSymbol
          }`}
        />
        <div>
          <span className="text-sm text-white">
            You can only withdraw after 24 hours of your last deposit.
          </span>
        </div>
      </div>
      <CustomButton
        size="medium"
        className="w-full mt-4 !rounded-md"
        color={!tokenApproved || canWithdraw ? 'primary' : 'mineshaft'}
        disabled={tokenApproved && !canWithdraw}
        onClick={!tokenApproved ? handleApprove : handleWithdraw}
      >
        {tokenApproved
          ? asset && asset.coolingPeriodOver
            ? tokenWithdrawAmount == 0
              ? 'Insert an amount'
              : Number(tokenWithdrawAmount) >
                (!asset ? 0 : asset.getUserAssetBalance)
              ? 'Insufficient balance'
              : Number(tokenWithdrawAmount) >
                (!asset ? 0 : asset.getActualLpBalance)
              ? 'Insufficient liquidity to withdraw'
              : 'Withdraw'
            : 'Cooling period not over'
          : 'Approve'}
      </CustomButton>
    </div>
  );
};

export default Withdraw;
