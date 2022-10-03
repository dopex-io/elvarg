import { Box } from '@mui/material';
import { BigNumber, ethers } from 'ethers';

import WalletButton from 'components/common/WalletButton';
import Typography from 'components/UI/Typography';

import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';

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

      await sendTx(
        contract['settle'](option.strikeIndex, option.balance, option.epoch)
      );
    } else {
      try {
        const contract = new ethers.Contract(
          option.ssovAddress,
          ['function settle(uint256, uint256, uint256, address)'],
          signer
        );

        await sendTx(
          contract['settle'](
            option.strikeIndex,
            option.balance,
            option.epoch,
            accountAddress
          )
        );
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
      <Typography variant="h5" className="mb-2">
        Type: {option.type}
      </Typography>
      <Typography variant="h5" className="mb-2">
        Amount: {getUserReadableAmount(option.balance, 18)}
      </Typography>
      <WalletButton onClick={handleSettle}>Settle</WalletButton>
    </Box>
  );
};

export default SsovOption;
