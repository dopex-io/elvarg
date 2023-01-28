import Box from '@mui/material/Box';
import { BigNumber, ethers } from 'ethers';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/common/WalletButton';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

const SsovV3Deposit = ({
  ssovSymbol,
  ssovAddress,
  id,
}: {
  ssovSymbol: string;
  ssovAddress: string;
  id: BigNumber;
}) => {
  const { signer, accountAddress } = useBoundStore();

  const sendTx = useSendTx();

  const handleWithdraw = async () => {
    if (!signer) return;

    const v2Abi = ['function withdraw(uint256, address)'];

    const _contract = new ethers.Contract(ssovAddress, v2Abi, signer);

    await sendTx(_contract, 'withdraw', [id, accountAddress]);
  };

  return (
    <Box className="bg-carbon mb-3 rounded-lg max-w-max p-3">
      <Typography variant="h5">{ssovSymbol}</Typography>
      <Typography variant="h5">Id: {getUserReadableAmount(id, 18)}</Typography>
      <Box className="mt-2">
        <WalletButton onClick={handleWithdraw}>Withdraw</WalletButton>
      </Box>
    </Box>
  );
};

export default SsovV3Deposit;
