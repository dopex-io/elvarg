import { Box } from '@mui/material';
import { ethers } from 'ethers';

import WalletButton from 'components/common/WalletButton';
import Typography from 'components/UI/Typography';

import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const SsovOption = (props: any) => {
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
    }
  };

  return (
    <Box className="bg-carbon mb-3 rounded-lg max-w-max p-3">
      <Typography variant="h5">Underlying: {option.underlying}</Typography>
      <Typography variant="h5">
        Strike: {getUserReadableAmount(option.strike, 8)}
      </Typography>
      <Typography variant="h5">Type: {option.type}</Typography>
      <WalletButton onClick={handleSettle}>Settle</WalletButton>
    </Box>
  );
};

export default SsovOption;
