import { BigNumber, ethers } from 'ethers';

import Box from '@mui/material/Box';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import SignerButton from 'components/common/SignerButton';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const SsovOption = (props: {
  option: {
    version: number;
    ssovAddress: string;
    strikeIndex: number;
    balance: BigNumber;
    epoch: number;
    underlying: string;
    type: string;
    strike: BigNumber;
    token: string;
  };
}) => {
  const { option } = props;

  const { signer, accountAddress } = useBoundStore();

  const sendTx = useSendTx();

  const handleSettle = async () => {
    if (!signer) return;

    if (option.version === 2) {
      const contract = new ethers.Contract(
        option.ssovAddress,
        ['function settle(uint256, uint256, uint256)'],
        signer
      );

      await sendTx(contract, 'settle', [
        option.strikeIndex,
        option.balance,
        option.epoch,
      ]);
    } else {
      try {
        const optionTokenContract = new ethers.Contract(
          option.token,
          ['function approve(address, uint256)'],
          signer
        );

        await sendTx(optionTokenContract, 'approve', [
          option.ssovAddress,
          option.balance,
        ]);

        const contract = new ethers.Contract(
          option.ssovAddress,
          [
            'function settle(uint256, uint256, uint256, address)',
            'function settle(uint256, uint256, uint256)',
          ],
          signer
        );

        // @ts-ignore
        const success = await contract.callStatic[
          'settle(uint256,uint256,uint256,address)'
        ](option.strikeIndex, option.balance, option.epoch, accountAddress)
          .then(() => true)
          .catch(() => false);

        if (success) {
          await sendTx(contract, 'settle(uint256,uint256,uint256,address)', [
            option.strikeIndex,
            option.balance,
            option.epoch,
            accountAddress,
          ]);
        } else {
          await sendTx(contract, 'settle(uint256,uint256,uint256)', [
            option.strikeIndex,
            option.balance,
            option.epoch,
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box className="bg-carbon mb-3 rounded-lg max-w-max p-3">
      <Typography variant="h5">Underlying: {option.underlying}</Typography>
      <Typography variant="h5">
        Strike: {getUserReadableAmount(option.strike, 8)}
      </Typography>
      <Typography variant="h5">Type: {option.type}</Typography>
      <Typography variant="h5" className="mb-3">
        Amount: {getUserReadableAmount(option.balance, 18)}
      </Typography>
      <SignerButton onClick={handleSettle}>Settle</SignerButton>
    </Box>
  );
};

export default SsovOption;
