import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import { ZdteLP__factory } from '@dopex-io/sdk';
import { Button, Input } from '@dopex-io/ui';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import { IStaticZdteData, IZdteData, IZdteUserData } from 'store/Vault/zdte';

import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import Loading from 'components/zdte/Loading';
import MigrationStepper from 'components/zdte/Manage/MigrationStepper';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

const DEPRECATED_ZDTE_ADDRS = [
  { asset: 'eth', address: '0xbc70a8625680ec90292e1cef045a5509e123fa9f' },
  { asset: 'eth', address: '0xc0b0f0b281f5a2b5d8b75193c12fe6433e3929cc' },
  { asset: 'arb', address: '0x7fdb659838C0594a91E4FD75F698C1A32BB52f8c' },
];

class QuoteOrBaseAsset {
  private isQuote: boolean;
  private zdteData: IZdteData;
  private userZdteLpData: IZdteUserData | undefined;
  private staticZdteData: IStaticZdteData;

  constructor(
    isQuote: boolean,
    zdteData: IZdteData,
    userZdteLpData: IZdteUserData | undefined,
    staticZdteData: IStaticZdteData
  ) {
    this.isQuote = isQuote;
    this.zdteData = zdteData;
    this.userZdteLpData = userZdteLpData;
    this.staticZdteData = staticZdteData;
  }

  get getUserAssetBalance() {
    return !this.userZdteLpData
      ? 0
      : this.isQuote
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
    return !this.userZdteLpData
      ? 0
      : this.isQuote
      ? this.userZdteLpData?.userQuoteLpBalance
      : this.userZdteLpData?.userBaseLpBalance;
  }

  get getAssetSymbol() {
    return this.isQuote ? 'USDC.e-LP' : this.staticZdteData?.baseLpSymbol;
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
    return !this.userZdteLpData
      ? 0
      : this.isQuote
      ? this.userZdteLpData?.canWithdrawQuote
      : this.userZdteLpData?.canWithdrawBase;
  }

  get getLpValue() {
    return this.isQuote
      ? this.zdteData.quoteLpValue === undefined
        ? 0
        : formatAmount(
            getUserReadableAmount(this.zdteData.quoteLpValue, DECIMALS_USD),
            2
          )
      : this.zdteData.baseLpValue === undefined
      ? 0
      : formatAmount(
          getUserReadableAmount(this.zdteData.baseLpValue, DECIMALS_TOKEN),
          3
        );
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
    isLoading,
  } = useBoundStore();

  const [tokenWithdrawAmount, setTokenWithdrawAmount] = useState<
    string | number
  >('');
  const [tokenApproved, setTokenApproved] = useState<boolean>(false);
  const [isQuote, setisQuote] = useState(true);
  const asset = useMemo(() => {
    if (!zdteData || !staticZdteData) {
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
      console.error('handle approval: ', err);
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
      console.error('check approved: ', err);
    }
  }, [
    accountAddress,
    signer,
    staticZdteData,
    asset,
    tokenWithdrawAmount,
    isQuote,
  ]);

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
      console.error('fail to withdraw', e);
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

  if (isLoading || !staticZdteData || !asset) {
    return <Loading />;
  }

  return (
    <div className="rounded-xl space-y-2 p-2">
      <div className="rounded-xl">
        <div className="flex flex-row justify-between">
          <div className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
            <div className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <h6
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  !isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(true)}
              >
                <span>{`USDC.e-LP`}</span>
              </h6>
            </div>
            <div className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <h6
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(false)}
              >
                <span>{staticZdteData.baseLpSymbol}</span>
              </h6>
            </div>
          </div>
          <Input
            variant="small"
            color="cod-gray"
            handleChange={handleWithdrawAmount}
            value={tokenWithdrawAmount}
            placeholder="0"
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
          title={`1 ${asset?.getAssetSymbol}`}
          content={`${asset.getLpValue} USDC.e-LP`}
        />
        <ContentRow
          title="Available Liquidity"
          content={`${formatAmount(!asset ? 0 : asset.getActualLpBalance, 2)} ${
            !asset ? '' : asset.getAssetSymbol
          }`}
        />
        <ContentRow
          title="Total Liquidity"
          content={`${formatAmount(!asset ? 0 : asset.getTotalAsset, 2)} ${
            !asset ? '' : asset.getAssetSymbol
          }`}
        />
        <div>
          <span className="text-sm text-white">
            You can only withdraw after 24 hours of your last deposit.
          </span>
        </div>
      </div>
      <Button
        variant="contained"
        onClick={!tokenApproved ? handleApprove : handleWithdraw}
        disabled={tokenApproved && !canWithdraw}
        color={!tokenApproved || canWithdraw ? 'primary' : 'mineshaft'}
        className="w-full"
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
      </Button>
      {DEPRECATED_ZDTE_ADDRS.map((addr, idx) => {
        return (
          <MigrationStepper
            key={idx}
            isQuote={isQuote}
            symbol={asset ? asset?.getAssetSymbol : ''}
            deprecatedAddress={addr}
          />
        );
      })}
    </div>
  );
};

export default Withdraw;
