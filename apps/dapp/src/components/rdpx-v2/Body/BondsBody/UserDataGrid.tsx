import { useEffect, useState } from 'react';

import { useContractWrite, useNetwork, usePublicClient } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';

import Cell from 'components/rdpx-v2/Body/StrategyVault/UserDepositGrid/CustomCell';
import GridButtons from 'components/rdpx-v2/Body/StrategyVault/UserDepositGrid/GridButtons';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

const UserDataGrid = () => {
  const [rtComposition, setRtComposition] = useState<
    readonly [bigint, bigint, bigint]
  >([0n, 0n, 0n]);

  const { balance, updateBalance } = useTokenData({
    token: addresses.receiptToken,
    amount: 0n,
    spender: addresses.receiptToken,
  });

  const { chain } = useNetwork();

  const { simulateContract } = usePublicClient({
    chainId: chain?.id,
  });

  const { write: redeem, isSuccess: redeemSuccess } = useContractWrite({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'redeem',
    args: [balance, [1n, 1n]],
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
  }, [updateBalance, redeemSuccess]);

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
        <GridButtons
          hasLeftoverShares={false}
          buttonStates={[{ label: 'Redeem', handler: () => redeem() }]}
        />
      </div>
    </div>
  ) : null;
};

export default UserDataGrid;
