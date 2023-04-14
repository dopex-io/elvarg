import Box from '@mui/material/Box';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import SignerButton from 'components/common/SignerButton';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

const SsovV2Deposit = ({ deposit }: any) => {
  const { provider, signer } = useBoundStore();

  const [strike, setStrike] = useState(0);

  const sendTx = useSendTx();

  useEffect(() => {
    async function getDepositData() {
      const v2Abi = [
        'function getEpochStrikes(uint256) view returns (uint256[])',
      ];

      const _contract = new ethers.Contract(
        deposit.ssovAddress,
        v2Abi,
        provider
      );

      const _strike = await _contract['getEpochStrikes'](deposit.epoch);

      setStrike(getUserReadableAmount(_strike[deposit.strikeIndex], 8));
    }

    getDepositData();
  }, [deposit, provider]);

  const handleWithdraw = async () => {
    if (!signer) return;

    const v2Abi = ['function withdraw(uint256, uint256)'];

    const _contract = new ethers.Contract(deposit.ssovAddress, v2Abi, signer);

    await sendTx(_contract, 'withdraw', [deposit.epoch, deposit.strikeIndex]);
  };

  return (
    <Box className="bg-carbon mb-3 rounded-lg max-w-max p-3">
      <Typography variant="h5">{deposit.ssovSymbol}</Typography>
      <Typography variant="h5">Epoch: {deposit.epoch}</Typography>
      <Box>Deposit: {getUserReadableAmount(deposit.amount, 18)}</Box>
      <Box>Strike: {strike}</Box>
      <Box className="mt-2">
        <SignerButton onClick={handleWithdraw}>Withdraw</SignerButton>
      </Box>
    </Box>
  );
};

export default SsovV2Deposit;
