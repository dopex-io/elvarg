import { useCallback, useContext } from 'react';
import { BigNumber } from 'ethers';
import Box from '@material-ui/core/Box';
import { Escrow__factory } from '@dopex-io/sdk';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

import { OtcContext } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';

import useSendTx from 'hooks/useSendTx';
import CustomButton from 'components/UI/CustomButton';
import smartTrim from 'utils/general/smartTrim';

interface WithdrawProps {
  open: boolean;
  handleClose: () => void;
  data: {
    isBuy: boolean;
    quote: {
      address: string;
      symbol: string;
    };
    base: {
      address: string;
      symbol: string;
    };
    price: BigNumber;
    amount: BigNumber;
    dealer: string;
  };
}

const Withdraw = ({ open, handleClose, data }: WithdrawProps) => {
  const sendTx = useSendTx();

  const { selectedEscrowData } = useContext(OtcContext);
  const { provider, signer } = useContext(WalletContext);

  const handleWithdraw = useCallback(async () => {
    const escrow = Escrow__factory.connect(
      selectedEscrowData.selectedEscrow,
      provider
    );

    await sendTx(
      escrow
        .connect(signer)
        .withdraw(data.quote.address, data.base.address, data.price)
    );
  }, [selectedEscrowData.selectedEscrow, provider, data, signer, sendTx]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col space-y-4">
        <Typography variant="h5">Withdraw</Typography>
        <Box className="flex flex-col space-y-2 my-2 bg-umbra border border-mineshaft rounded-2xl p-3">
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Quote Asset
            </Typography>
            <Typography variant="h6">
              {smartTrim(data.quote.symbol, 18)}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Base Asset
            </Typography>
            <Typography variant="h6">
              {smartTrim(data.base.symbol, 18)}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Withdrawable
            </Typography>
            <Typography variant="h6">
              {getUserReadableAmount(
                data.isBuy ? data.price : data.amount,
                18
              ).toString()}
            </Typography>
          </Box>
        </Box>
        <Box className="bg-down-bad bg-opacity-20 rounded-xl border border-down-bad border-opacity-30 p-3 flex-col text-center">
          <Typography variant="h5" className="text-down-bad font-bold">
            Warning
          </Typography>
          <Typography variant="h6" className="text-down-bad">
            You are cancelling an open trade with this user. If you want to
            initiate another trade, you will have to pay additional gas to
            deposit again into the escrow.
          </Typography>
        </Box>
        <CustomButton
          size="medium"
          className="rounded-xl"
          onClick={handleWithdraw}
        >
          Withdraw
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default Withdraw;
