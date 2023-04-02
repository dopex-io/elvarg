import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { Box, Input as MuiInput } from '@mui/material';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { ZdteLP__factory } from 'mocks/factories/ZdteLP__factory';
import { useBoundStore } from 'store';

import { IStaticZdteData, IZdteData, IZdteUserData } from 'store/Vault/zdte';

import { CustomButton, Typography } from 'components/UI';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

class Asset {
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

  get getIsQuote() {
    return this.isQuote;
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

  get getContractLpBalance() {
    return this.isQuote
      ? getUserReadableAmount(this.zdteData.quoteLpAssetBalance!, DECIMALS_USD)
      : getUserReadableAmount(
          this.zdteData.baseLpAssetBalance!,
          DECIMALS_TOKEN
        );
  }
}

interface WithdrawProps {}

const Withdraw: FC<WithdrawProps> = ({}) => {
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
  >(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [isQuote, setisQuote] = useState(true);
  const asset = useMemo(
    () => new Asset(isQuote, zdteData!, userZdteLpData!, staticZdteData!),
    [isQuote, userZdteLpData, zdteData, staticZdteData]
  );

  const handleApprove = useCallback(async () => {
    if (!signer || !asset || !staticZdteData) return;

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
    } catch (err) {
      console.log('handle approval: ', err);
    }
  }, [staticZdteData, signer, sendTx, asset, tokenWithdrawAmount, isQuote]);

  useEffect(() => {
    (async () => {
      if (!signer || !accountAddress || !staticZdteData || !asset) return;
      try {
        const lpContract = await ZdteLP__factory.connect(
          asset.getAssetAddress,
          signer
        );
        const allowance: BigNumber = await lpContract.allowance(
          accountAddress,
          staticZdteData?.zdteAddress
        );
        setApproved(allowance.gte(asset.getRawUserAssetBalance));
      } catch (err) {
        console.log('update allowance: ', err);
      }
    })();
  }, [
    signer,
    accountAddress,
    isQuote,
    tokenWithdrawAmount,
    staticZdteData,
    asset,
  ]);

  const handleWithdrawAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setTokenWithdrawAmount(e.target.value),
    []
  );

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
      });
      await updateZdteData();
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
    tokenWithdrawAmount > 0 &&
    tokenWithdrawAmount <= asset.getUserAssetBalance &&
    tokenWithdrawAmount <= asset.getContractLpBalance;

  return (
    <Box className="rounded-xl space-y-2 p-2">
      <Box className="rounded-xl">
        <Box className="flex flex-row justify-between">
          <Box className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  !isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(true)}
              >
                {staticZdteData?.quoteLpSymbol}
              </Typography>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(false)}
              >
                {staticZdteData?.baseLpSymbol}
              </Typography>
            </Box>
          </Box>
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
        </Box>
      </Box>
      <Box className="p-2 space-y-2">
        <ContentRow
          title="Balance"
          content={`${formatAmount(asset.getUserAssetBalance, 2)} ${
            asset.getAssetSymbol
          }`}
        />
        <ContentRow
          title="Available to withdraw"
          content={`${formatAmount(asset.getContractLpBalance, 2)} ${
            asset.getAssetSymbol
          }`}
        />
      </Box>
      <CustomButton
        size="medium"
        className="w-full mt-4 !rounded-md"
        color={!approved || canWithdraw ? 'primary' : 'mineshaft'}
        disabled={approved && !canWithdraw}
        onClick={!approved ? handleApprove : handleWithdraw}
      >
        {approved
          ? tokenWithdrawAmount == 0
            ? 'Insert an amount'
            : tokenWithdrawAmount > asset.getUserAssetBalance
            ? 'Insufficient balance'
            : tokenWithdrawAmount > asset.getContractLpBalance
            ? 'Insufficient liquidity to withdraw'
            : 'Withdraw'
          : 'Approve'}
      </CustomButton>
    </Box>
  );
};

export default Withdraw;
