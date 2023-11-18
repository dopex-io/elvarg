import { useEffect, useState } from 'react';

import { Button, Dialog } from '@dopex-io/ui';
import { useContractWrite, useNetwork, usePublicClient } from 'wagmi';

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
    args: [balance, [1n, 1n]],
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
        abi: ReceiptToken,
        address: addresses.receiptToken,
        functionName: 'redeem',
        args: [balance, [100n, 100n]],
      })
        .then((res) => {
          setRtComposition(res.result);
        })
        .catch(() => setRtComposition([0n, 0n, 0n]));
    })();
  }, [balance, simulateContract]);

  return (
    <Dialog isOpen={isOpen} handleClose={handleClose} title="Redeem">
      <div className="flex flex-col space-y-2">
        <PanelInput
          amount={amount}
          iconPath="/images/tokens/rteth.svg"
          symbol="rtETH"
          maxAmount={balance}
          label="rtETH Balance"
          handleChange={onChange}
        />
        <Alert
          severity={AlertSeverity.warning}
          header="Redemption Fee"
          body="A 5% fee is charged for redeeming your rDPX & WETH."
        />
        <div className="p-2 border bg-umbra border-carbon rounded-lg space-y-2">
          <RowItem
            label="Composition"
            content={
              <div className="flex space-x-1">
                <span className="flex space-x-1">
                  <p>{formatBigint(rtComposition[0], DECIMALS_TOKEN)}</p>
                  <p className="pr-1 text-stieglitz">WETH</p>
                </span>
                <span className="flex space-x-1">
                  <p>{formatBigint(rtComposition[1], DECIMALS_TOKEN)}</p>
                  <p className="pr-1 text-stieglitz">RDPX</p>
                </span>
              </div>
            }
          />
          <RowItem
            label="Fee"
            content={
              <span className="flex space-x-1 text-jaffa">
                <p>{formatBigint(rtComposition[2], DECIMALS_TOKEN)}</p>
                <p className="pr-1 text-stieglitz">WETH</p>
              </span>
            }
          />
        </div>
        <Button
          color="primary"
          className="w-full"
          onClick={() => redeem()}
          disabled={Number(amount) === 0}
        >
          Redeem
        </Button>
      </div>
    </Dialog>
  );
};

export default RedeemReceiptTokens;
