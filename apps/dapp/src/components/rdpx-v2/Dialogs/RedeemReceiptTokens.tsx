import { useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { Button, Dialog } from '@dopex-io/ui';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePublicClient,
} from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';

import Alert, { AlertSeverity } from 'components/common/Alert';
import PanelInput from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/PanelInput';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

const RedeemReceiptTokens = (props: Props) => {
  const { isOpen, handleClose } = props;

  const [rtComposition, setRtComposition] = useState<
    readonly [bigint, bigint, bigint]
  >([0n, 0n, 0n]);
  const [amount, setAmount] = useState<string>('');

  const { chain } = useNetwork();
  const { address: account = '0x' } = useAccount();

  const { simulateContract } = usePublicClient({
    chainId: chain?.id ?? 42161,
  });
  const { balance, updateBalance } = useTokenData({
    token: addresses.receiptToken,
    amount: 0n,
    spender: addresses.receiptToken,
  });

  const { writeAsync: redeem, isSuccess: redeemSuccess } = useContractWrite({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'redeem',
    args: [parseUnits(amount, DECIMALS_TOKEN), [0n, 0n]],
  });

  const onChange = (e: any) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    updateBalance();
  }, [updateBalance, redeemSuccess]);

  useEffect(() => {
    (async () => {
      await simulateContract({
        account,
        abi: ReceiptToken,
        address: addresses.receiptToken,
        functionName: 'redeem',
        args: [balance, [0n, 0n]],
      })
        .then((res) => {
          setRtComposition(res.result);
        })
        .catch(() => setRtComposition([0n, 0n, 0n]));
    })();
  }, [account, balance, simulateContract]);

  const panelState = useMemo(() => {
    if (Number(amount) === 0) {
      return {
        label: 'Redeem',
        disabled: true,
        title: 'Enter a valid amount',
        severity: AlertSeverity.info,
      };
    } else if (parseUnits(amount, DECIMALS_TOKEN) > balance) {
      return {
        label: 'Redeem',
        disabled: true,
        title: 'You have insufficient balance',
      };
    } else
      return {
        label: 'Redeem',
        disabled: false,
        title: 'A 0.1% fee is charged for redeeming your rDPX & WETH!',
      };
  }, [amount, balance]);

  return (
    <Dialog isOpen={isOpen} handleClose={handleClose} title="Redeem">
      <div className="flex flex-col space-y-2">
        <PanelInput
          amount={amount}
          iconPath="/images/tokens/rteth.svg"
          symbol="rtETH"
          maxAmount={balance}
          handleMax={() => setAmount(formatUnits(balance, DECIMALS_TOKEN))}
          label="rtETH Balance"
          handleChange={onChange}
        />
        <Alert
          severity={AlertSeverity.warning}
          header={panelState.title || 'Redemption Fee'}
          body=""
        />
        <div className="p-2 border bg-umbra border-carbon rounded-lg space-y-2">
          <RowItem
            label="Composition"
            content={
              <div className="flex space-x-1">
                <span className="flex space-x-1">
                  <p>{`${
                    rtComposition[0] < parseUnits('1', 16) ? '<' : ''
                  }${formatBigint(rtComposition[0], DECIMALS_TOKEN)}`}</p>
                  <p className="pr-1 text-stieglitz">WETH</p>
                </span>
                <span className="flex space-x-1">
                  <p>{`${
                    rtComposition[1] < parseUnits('1', 16) ? '<' : ''
                  }${formatBigint(rtComposition[1], DECIMALS_TOKEN)}`}</p>
                  <p className="pr-1 text-stieglitz">RDPX</p>
                </span>
              </div>
            }
          />
          <RowItem
            label="Fee"
            content={
              <span className="flex space-x-1 text-jaffa">
                <p>{`${
                  rtComposition[2] < parseUnits('1', 16) ? '<' : ''
                }${formatBigint(rtComposition[2], DECIMALS_TOKEN, 5)}`}</p>
                <p className="pr-1 text-stieglitz">WETH</p>
              </span>
            }
          />
        </div>
        <Button
          color="primary"
          className="w-full"
          onClick={() => redeem()}
          disabled={panelState.disabled}
        >
          {panelState.label}
        </Button>
      </div>
    </Dialog>
  );
};

export default RedeemReceiptTokens;
