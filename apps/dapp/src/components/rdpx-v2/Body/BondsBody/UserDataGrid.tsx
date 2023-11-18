import { useEffect, useState } from 'react';

import { Button } from '@dopex-io/ui';
import { useNetwork, usePublicClient } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';

import Cell from 'components/rdpx-v2/Body/StrategyVault/UserDepositGrid/CustomCell';
import RedeemReceiptTokens from 'components/rdpx-v2/Dialogs/RedeemReceiptTokens';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

const UserDataGrid = () => {
  const [rtComposition, setRtComposition] = useState<
    readonly [bigint, bigint, bigint]
  >([0n, 0n, 0n]);
  const [open, setOpen] = useState<boolean>(false);

  const { balance, updateBalance } = useTokenData({
    token: addresses.receiptToken,
    amount: 0n,
    spender: addresses.receiptToken,
  });

  const { chain } = useNetwork();

  const { simulateContract } = usePublicClient({
    chainId: chain?.id,
  });

  useEffect(() => {
    (async () => {
      await simulateContract({
        abi: ReceiptToken,
        address: addresses.receiptToken,
        functionName: 'redeem',
        args: [balance, [100n, 1000n]],
      })
        .then((res) => {
          setRtComposition(res.result);
        })
        .catch(() => setRtComposition([0n, 0n, 0n]));
    })();
  }, [balance, simulateContract]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  const handleClose = () => {
    setOpen(false);
  };

  return balance > 0n ? (
    <div className="space-y-2">
      <Typography2 variant="subtitle2" className="p-2">
        Redeem
      </Typography2>
      <div className=" bg-umbra rounded-xl divide-y-2 divide-cod-gray">
        <div className="flex w-full divide-x-2 divide-cod-gray">
          <Cell
            label="Balance"
            data={[[formatBigint(balance, DECIMALS_TOKEN), 'rtETH']]}
          />
          <Cell
            label="Composition"
            tooltipInfo="Composition of rDPX & WETH received at the time of redemption."
            data={[
              [formatBigint(rtComposition[0], DECIMALS_TOKEN), 'WETH'],
              [formatBigint(rtComposition[1], DECIMALS_TOKEN), 'RDPX'],
            ]}
          />
          <Cell
            label="Redemption Fee"
            data={[[formatBigint(rtComposition[2], DECIMALS_TOKEN), 'WETH']]}
          />
        </div>
        <Button
          color="primary"
          className="w-full"
          onClick={() => setOpen(true)}
        >
          Redeem
        </Button>
      </div>
    </div>
  ) : (
    <RedeemReceiptTokens isOpen={open} handleClose={handleClose} />
  );
};

export default UserDataGrid;
